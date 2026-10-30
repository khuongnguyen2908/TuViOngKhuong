"""Cắt tờ icon nền trắng (design/*.webp) thành từng icon tròn nền trong suốt, 192px webp. Cần Pillow.
Dùng: python scripts/cat-icon.py design/can-sheet.webp assets/can giap,at,binh,dinh,mau,ky,canh,tan,nham,quy [preview.png]"""
import sys
from PIL import Image, ImageDraw

SIZE = 192


def segments(profile, min_count, min_gap):
    segs, start = [], None
    for i, v in enumerate(profile + [0]):
        if v > min_count and start is None:
            start = i
        elif v <= min_count and start is not None:
            segs.append([start, i])
            start = None
    merged = []
    for s in segs:
        if merged and s[0] - merged[-1][1] < min_gap:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    return [s for s in merged if s[1] - s[0] > 40]


def boxes(img):
    w, h = img.size
    px = img.load()
    content = [[min(px[x, y]) < 240 for x in range(w)] for y in range(h)]
    rows = segments([sum(r) for r in content], 4, 10)
    out = []
    for y0, y1 in rows:
        cols = segments([sum(content[y][x] for y in range(y0, y1)) for x in range(w)], 3, 1)
        out += [(x0, y0, x1, y1) for x0, x1 in cols]
    return out


def cut(img, box):
    x0, y0, x1, y1 = box
    # Hình tròn: bán kính theo chiều cao; tâm cách mép trái một bán kính (phần thò ra như râu rồng nằm bên phải)
    r = (y1 - y0) / 2
    cx, cy = x0 + r, (y0 + y1) / 2
    tho_ra = (x1 - x0) > (y1 - y0) + 10
    side = 2 * r + 16 if not tho_ra else max(x1 - x0, y1 - y0) + 12
    if tho_ra:
        cx = (x0 + x1) / 2
    # Đệm trắng quanh tờ để ô cắt ra ngoài mép không bị tô đen
    pad = 200
    big = Image.new('RGB', (img.size[0] + 2 * pad, img.size[1] + 2 * pad), (255, 255, 255))
    big.paste(img, (pad, pad))
    crop = big.crop((int(cx - side / 2) + pad, int(cy - side / 2) + pad, int(cx + side / 2) + pad, int(cy + side / 2) + pad))
    w, h = crop.size
    px = crop.load()
    # Chỉ giữ hình nối liền với tâm ô (bỏ mép hình tròn bên cạnh); nền trắng thành trong suốt.
    # Ngà #FFF8F2 có kênh B ~242 nên vẫn tính là hình, không bị ăn vào.
    mask = Image.new('L', crop.size, 0)
    mp = mask.load()
    for y in range(h):
        for x in range(w):
            if min(px[x, y]) < 247:
                mp[x, y] = 255
    sx, sy = w // 2, h // 2
    while mp[sx, sy] != 255:
        sy += 1
    ImageDraw.floodfill(mask, (sx, sy), 128)
    # Đĩa tròn khử răng cưa (vẽ to gấp 4 rồi thu nhỏ)
    k = 4
    disc = Image.new('L', (w * k, h * k), 0)
    ccx, ccy = (x0 + r - (cx - side / 2)) * k, (cy - (cy - side / 2)) * k
    ImageDraw.Draw(disc).ellipse((ccx - (r - 2) * k, ccy - (r - 2) * k, ccx + (r - 2) * k, ccy + (r - 2) * k), fill=255)
    alpha = disc.resize((w, h), Image.LANCZOS)
    ap = alpha.load()
    # Phần thò ra ngoài đĩa (râu rồng): giữ các điểm có nét, nối liền với hình ở tâm
    if tho_ra:
        for y in range(h):
            for x in range(w):
                if mp[x, y] == 128 and min(px[x, y]) < 240:
                    ap[x, y] = 255
    rgba = crop.convert('RGBA')
    rgba.putalpha(alpha)
    return rgba.resize((SIZE, SIZE), Image.LANCZOS)


def main():
    sheet, out_dir, names = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
    img = Image.open(sheet).convert('RGB')
    if img.size[0] == img.size[1] and len(names) == 1:
        found = [boxes(img)[0]] if boxes(img) else [(0, 0) + img.size]
    else:
        found = boxes(img)
    print(len(found), 'icon tìm thấy:', found)
    assert len(found) == len(names), f'cần {len(names)} icon, thấy {len(found)}'
    icons = []
    for name, box in zip(names, found):
        ic = cut(img, box)
        ic.save(f'{out_dir}/{name}.webp', 'WEBP', quality=88, method=6)
        icons.append(ic)
    if len(sys.argv) > 4:
        prev = Image.new('RGBA', (SIZE * len(icons), SIZE * 2), (0, 0, 0, 255))
        light = Image.new('RGBA', (SIZE * len(icons), SIZE), (236, 235, 230, 255))
        prev.paste(light, (0, 0))
        dark = Image.new('RGBA', (SIZE * len(icons), SIZE), (21, 16, 13, 255))
        prev.paste(dark, (0, SIZE))
        for i, ic in enumerate(icons):
            prev.alpha_composite(ic, (i * SIZE, 0))
            prev.alpha_composite(ic, (i * SIZE, SIZE))
        prev.convert('RGB').save(sys.argv[4])


main()
