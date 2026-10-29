// Giao diện lá số (sơn mài)
(() => {
  const E = TuViEngine, C = TuViContent, K = TuViCachCuc;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const mod = (n) => ((n % 12) + 12) % 12;
  const pad = (n) => String(n).padStart(2, '0');
  const CAN_TAT = ['G', 'Ấ', 'B', 'Đ', 'M', 'K', 'C', 'T', 'N', 'Q'];
  const HANH_CLASS = { Kim: 'h-kim', 'Mộc': 'h-moc', 'Thủy': 'h-thuy', 'Hỏa': 'h-hoa', 'Thổ': 'h-tho' };
  // Hình bát quái (Tiên thiên): Càn trên, Khôn dưới; vạch trong cùng là hào dưới
  const BAGUA = (() => {
    const tri = [['111', 0], ['011', 45], ['010', 90], ['001', 135], ['000', 180], ['100', 225], ['101', 270], ['110', 315]];
    const lines = tri.map(([bits, a]) => `<g transform="rotate(${a} 32 32)">${[...bits].map((b, i) => {
      const y = 32 - (17.5 + i * 4.2);
      return b === '1' ? `<line x1="25.5" y1="${y}" x2="38.5" y2="${y}"/>` : `<line x1="25.5" y1="${y}" x2="30.4" y2="${y}"/><line x1="33.6" y1="${y}" x2="38.5" y2="${y}"/>`;
    }).join('')}</g>`).join('');
    return `<svg class="bagua" viewBox="0 0 64 64" aria-hidden="true"><g stroke="currentColor" stroke-width="2.3" stroke-linecap="butt" fill="none">${lines}</g>`
      + '<circle cx="32" cy="32" r="10" fill="none" stroke="currentColor" stroke-width="1.4"/>'
      + '<path d="M32 22a10 10 0 0 1 0 20a5 5 0 0 1 0-10a5 5 0 0 0 0-10z" fill="currentColor"/>'
      + '<circle cx="32" cy="27" r="1.7" fill="currentColor"/><circle cx="32" cy="37" r="1.7" class="bagua-hole"/></svg>';
  })();
  const BRIGHT_WORD = { M: 'Miếu', V: 'Vượng', 'Đ': 'Đắc', B: 'Bình hòa', H: 'Hãm' };
  // Vị trí 12 cung trên lưới 4×4 (hàng, cột), theo chi Tý..Hợi
  const GRID = [[3, 2], [3, 1], [3, 0], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 3]];
  const GIO = [
    ['ty0', 'Tý', '00–01', 0, 30], ['suu', 'Sửu', '01–03', 2, 0], ['dan', 'Dần', '03–05', 4, 0], ['mao', 'Mão', '05–07', 6, 0],
    ['thin', 'Thìn', '07–09', 8, 0], ['ti', 'Tỵ', '09–11', 10, 0], ['ngo', 'Ngọ', '11–13', 12, 0], ['mui', 'Mùi', '13–15', 14, 0],
    ['than', 'Thân', '15–17', 16, 0], ['dau', 'Dậu', '17–19', 18, 0], ['tuat', 'Tuất', '19–21', 20, 0], ['hoi', 'Hợi', '21–23', 22, 0],
  ];
  const ALL_GIO = [...GIO, ['ty1', 'Tý muộn', '23–24', 23, 30]];
  const OPTION_LABELS = {
    menhChu: ['Mệnh chủ tính theo', { chiNam: 'Chi năm sinh', cungMenh: 'Chi cung Mệnh' }],
    hoaLinhTyDauSuu: ['Hỏa, Linh với tuổi Tỵ Dậu Sửu', { 'mao-tuat': 'Hỏa khởi Mão, Linh khởi Tuất', 'tuat-mao': 'Hỏa khởi Tuất, Linh khởi Mão' }],
    khoiVietCanh: ['Khôi, Việt năm Canh', { 'suu-mui': 'Khôi Sửu, Việt Mùi', 'ngo-dan': 'Khôi Ngọ, Việt Dần' }],
    trangSinhTho: ['Tràng Sinh của Thổ cục', { than: 'Khởi ở Thân', dan: 'Khởi ở Dần' }],
    tuHoaCanh: ['Tứ hóa năm Canh', { 'am-dong': 'Nhật Vũ Âm Đồng', 'dong-am': 'Nhật Vũ Đồng Âm' }],
    tuHoaNham: ['Hóa Khoa năm Nhâm', { phu: 'Thiên Phủ', 'ta-phu': 'Tả Phù' }],
    thienGiai: ['Thiên Giải', { thuong: 'Từ Thân đếm thuận theo tháng', nhay: 'Từ Thân đếm nhảy cung' }],
    thangNhuan: ['Sinh tháng nhuận', { thangChinh: 'An như tháng chính', chiaDoi: 'Từ ngày 16 tính sang tháng sau' }],
    gioTy: ['Giờ Tý muộn (23 đến 24 giờ)', { ngaySau: 'Tính sang ngày hôm sau', ngayHienTai: 'Giữ ngày hiện tại' }],
  };
  const TOPICS = [
    ['tongquan', 'Tổng quan', 'Tính cách, điểm mạnh, điểm cần lưu ý', 'Tổng quan lá số: tính cách, điểm mạnh, điểm cần lưu ý'],
    ['sunghiep', 'Sự nghiệp, tài lộc', 'Quan Lộc, Tài Bạch, Thiên Di', 'Sự nghiệp và tài lộc (cung Quan Lộc, Tài Bạch, Thiên Di, Mệnh)'],
    ['tinhduyen', 'Tình duyên, gia đạo', 'Phu Thê, Tử Tức, Điền Trạch', 'Tình duyên, hôn nhân và gia đạo (cung Phu Thê, Tử Tức, Điền Trạch, Phúc Đức)'],
    ['suckhoe', 'Sức khỏe', 'Tật Ách, Mệnh, Phúc Đức', 'Sức khỏe nên giữ gìn (cung Tật Ách, Mệnh, Phúc Đức); không chẩn đoán bệnh'],
    ['namxem', 'Vận năm đang xem', 'Tiểu hạn và sao lưu niên', 'Vận hạn năm đang xem: tiểu hạn, đại hạn, sao lưu niên'],
    ['daihan', 'Đại hạn hiện tại', '10 năm đang chạy và 10 năm tới', 'Đại hạn hiện tại và đại hạn kế tiếp'],
  ];

  const SAMPLE = { name: '', gender: 'nam', calendar: 'duong', day: 29, month: 8, year: 1998, leap: false, gio: 'than', exact: false, hour: 16, minute: 0, clockTz: 7, namXem: new Date().getFullYear(), options: {} };
  const state = { input: null, chart: null, selected: null, found: null, showLuu: true, showLines: true, sample: null, downloads: null, topic: 'tongquan', isSample: true, formSample: true, ai: { turns: [], ctl: null, lastAnswer: '' } };
  const IN_CLAUDE = !!(window.claude && window.claude.use);
  const CFG = (typeof TUVI_CONFIG !== 'undefined' && TUVI_CONFIG) || {};
  const OPT_KEYS = Object.keys(OPTION_LABELS);

  // ---------- Link riêng cho từng lá số (#la-so-...) ----------
  // Chỉ chứa ngày giờ và tùy chọn, không chứa họ tên.
  function toHash(inp) {
    const cal = inp.calendar === 'am' ? (inp.leap ? 'aln' : 'al') : 'dl';
    const codes = OPT_KEYS.map((k) => Object.keys(OPTION_LABELS[k][1]).indexOf((inp.options || {})[k] || E.DEFAULT_OPTIONS[k])).join('');
    const isDefault = /^0+$/.test(codes);
    return `la-so-${inp.year}-${inp.month}-${inp.day}-${pad(inp.hour)}${pad(inp.minute)}-${inp.gender === 'nu' ? 'nu' : 'nam'}-${cal}-tz${inp.clockTz || 7}-x${inp.namXem}${isDefault ? '' : '-o' + codes}`;
  }
  function fromHash(h) {
    const m = /^la-so-(\d{3,4})-(\d{1,2})-(\d{1,2})-(\d{2})(\d{2})-(nam|nu)-(dl|al|aln)-tz(7|8)-x(\d{4})(?:-o(\d{9}))?$/.exec(h);
    if (!m) return null;
    const hour = +m[4], minute = +m[5];
    if (hour > 23 || minute > 59) return null;
    const gio = hour === 23 ? ALL_GIO[12] : GIO[Math.floor((hour * 60 + minute + 60) / 120) % 12];
    const options = {};
    OPT_KEYS.forEach((k, i) => { const vals = Object.keys(OPTION_LABELS[k][1]); options[k] = vals[m[10] ? +m[10][i] : 0] || vals[0]; });
    return { name: '', gender: m[6], calendar: m[7] === 'dl' ? 'duong' : 'am', leap: m[7] === 'aln', year: +m[1], month: +m[2], day: +m[3],
      gio: gio[0], exact: !(gio[3] === hour && gio[4] === minute), hour, minute, clockTz: +m[8], namXem: +m[9], options };
  }


  // ---------- Form ----------
  function buildForm() {
    $('#hours').innerHTML = ALL_GIO.map(([v, n, r]) => `<input type="radio" name="gio" id="h-${v}" value="${v}"><label for="h-${v}"><b>${n}</b><span>${r} giờ</span></label>`).join('');
    $('#f-options').innerHTML = Object.entries(OPTION_LABELS).map(([k, [label, choices]]) => `
      <label class="field"><span class="lbl">${label}</span>
        <select id="o-${k}">${Object.entries(choices).map(([v, t]) => `<option value="${v}">${t}${E.DEFAULT_OPTIONS[k] === v ? ' (mặc định)' : ''}</option>`).join('')}</select>
      </label>`).join('');
    $('#topics').innerHTML = TOPICS.map(([k, t, d]) => `<button type="button" class="topic" data-topic="${k}" aria-pressed="${k === state.topic}"><b>${t}</b><span>${d}</span></button>`).join('');
    const names = [...E.CHINH_TINH, ...Object.keys(C.PHU)];
    $('#star-list').innerHTML = [...new Set(names)].map((n) => `<option value="${n}"></option>`).join('');
  }
  function writeForm(inp) {
    $('#f-name').value = inp.name || '';
    $(`#f-g-${inp.gender}`).checked = true;
    $(`#f-c-${inp.calendar}`).checked = true;
    $('#f-day').value = inp.day; $('#f-month').value = inp.month; $('#f-year').value = inp.year;
    $('#f-leap').checked = !!inp.leap;
    const h = $(`#h-${inp.gio || 'than'}`); if (h) h.checked = true;
    $('#f-exact').checked = !!inp.exact;
    $('#f-time').value = pad(inp.hour) + ':' + pad(inp.minute);
    $('#f-tz').value = String(inp.clockTz || 7);
    $('#f-xem').value = inp.namXem;
    Object.keys(OPTION_LABELS).forEach((k) => { $(`#o-${k}`).value = (inp.options && inp.options[k]) || E.DEFAULT_OPTIONS[k]; });
    syncForm();
  }
  function readForm() {
    const picked = $$('#hours input').find((x) => x.checked);
    const gio = ALL_GIO.find((x) => x[0] === (picked && picked.value)) || GIO[8];
    const exact = $('#f-exact').checked;
    let hour = gio[3], minute = gio[4];
    if (exact && $('#f-time').value) { const [hh, mm] = $('#f-time').value.split(':').map(Number); hour = hh; minute = mm; }
    const options = {};
    Object.keys(OPTION_LABELS).forEach((k) => { options[k] = $(`#o-${k}`).value; });
    return {
      name: $('#f-name').value.trim(), gender: $('#f-g-nu').checked ? 'nu' : 'nam',
      calendar: $('#f-c-am').checked ? 'am' : 'duong',
      day: +$('#f-day').value, month: +$('#f-month').value, year: +$('#f-year').value,
      leap: $('#f-c-am').checked && $('#f-leap').checked, gio: gio[0], exact, hour, minute,
      clockTz: +$('#f-tz').value, namXem: +$('#f-xem').value || new Date().getFullYear(), options,
    };
  }
  function syncForm() {
    $('#leap-row').hidden = !$('#f-c-am').checked;
    $('#time-row').hidden = !$('#f-exact').checked;
    const y = +$('#f-year').value;
    $('#tz-hint').hidden = !(y && y < 1976 && $('#f-tz').value === '7');
  }

  // ---------- Hai màn: lập lá số / lá số ----------
  function showView(name) {
    const home = name === 'home';
    $('#view-home').hidden = !home; $('#view-chart').hidden = home;
    $('#btn-back').hidden = home; $('#chart-actions').hidden = home;
    $('.bar').classList.toggle('in-chart', !home);
    window.scrollTo(0, 0);
    const h = home ? $('#home-title') : $('#who-name');
    if (h && h.focus) h.focus({ preventScroll: true });
  }
  function route() {
    const h = (location.hash || '').slice(1);
    const inp = h.startsWith('la-so-') ? fromHash(h) : null;
    if (inp) {
      const last = state.input;
      if (last && toHash(last) === h) inp.name = last.name;
      if (compute(inp, false)) { showView('chart'); return; }
      toast('Link lá số không hợp lệ. Hãy lập lại lá số.');
    } else if (h.startsWith('la-so-')) toast('Link lá số không hợp lệ. Hãy lập lại lá số.');
    writeForm(state.input || SAMPLE);
    setSampleNote(!state.input);
    renderRecent();
    showView('home');
  }
  function setSampleNote(on) { state.formSample = on; $('#sample-note').hidden = !on; }

  // ---------- Lá số ----------
  const SIGN = (v) => (v > 0 ? '+' : '–');
  const CUNG_TAT = ['Mệnh', 'Phụ', 'Phúc', 'Điền', 'Quan', 'Nô', 'Di', 'Tật', 'Tài', 'Tử', 'Phối', 'Huynh'];
  const info = (key) => C.INFO[key] ? `<button type="button" class="info" data-info="${key}" aria-label="Giải thích: ${esc(C.INFO[key][0])}" aria-expanded="false">i</button>` : '';
  const starHtml = (s, cls = '') => `<span class="star ${HANH_CLASS[s.hanh] || ''} ${cls}${state.found === s.name ? ' hit' : ''}" data-star="${esc(s.name)}" title="${esc(s.name)}${s.amDuong ? (s.amDuong > 0 ? ', dương' : ', âm') : ''}${s.hanh ? ' ' + s.hanh : ''}${s.bright ? ', ' + BRIGHT_WORD[s.bright].toLowerCase() : ''}">${s.amDuong ? `<span class="sg">${SIGN(s.amDuong)}</span>` : ''}${esc(s.name)}${s.bright ? `<span class="br">(${s.bright})</span>` : ''}</span>`;
  // Tháng âm lịch hôm nay (để đánh dấu nguyệt vận)
  function thangNay() {
    const t = new Date(Date.now() + 7 * 3600 * 1000);
    return LunarVN.makeCalendar(7).solarToLunar(t.getUTCDate(), t.getUTCMonth() + 1, t.getUTCFullYear());
  }
  const relations = (p) => ({ xung: mod(p + 6), tamHop: [mod(p + 4), mod(p - 4)] });

  // Nhãn Tuần/Triệt nằm trên vạch giữa hai cung; hai cung đó chừa chỗ để chữ không bị đè
  function ttPlacement(pair) {
    const [r1, c1] = GRID[pair[0]], [r2, c2] = GRID[pair[1]];
    if (r1 === r2) {
      const top = r1 === 3; // hàng dưới: nhãn ở mép trên của cung; hàng trên: mép dưới
      return { x: Math.max(c1, c2) * 25, y: top ? 75 : 25, pad: { [pair[0]]: top ? 'pt' : 'pb', [pair[1]]: top ? 'pt' : 'pb' } };
    }
    const upper = r1 < r2 ? pair[0] : pair[1], lower = r1 < r2 ? pair[1] : pair[0];
    return { x: c1 === 0 ? 12.5 : 87.5, y: Math.max(r1, r2) * 25, pad: { [upper]: 'pb', [lower]: 'pt' } };
  }

  function renderChart(animate) {
    const ch = state.chart, tb = ch.thienBan, sel = state.selected, rel = relations(sel);
    const same = tb.tuan[0] === tb.triet[0] && tb.tuan[1] === tb.triet[1];
    const tts = same ? [[tb.tuan, 'Tuần – Triệt']] : [[tb.tuan, 'Tuần'], [tb.triet, 'Triệt']];
    const placed = tts.map(([pair, label]) => ({ label, ...ttPlacement(pair) }));
    const padOf = (chi) => placed.map((p) => p.pad[chi]).filter(Boolean).join(' ');
    const now = state.thangNay;
    const cells = ch.palaces.map((pl, i) => {
      const [r, c] = GRID[pl.chi];
      const chinh = pl.stars.filter((s) => s.kind === 'chinh');
      const cat = pl.stars.filter((s) => s.kind === 'cat');
      const hung = pl.stars.filter((s) => s.kind === 'hung');
      const isDh = pl.chi === tb.daiHanCung, isTh = pl.chi === tb.tieuHanCung;
      const found = state.found && pl.stars.some((s) => s.name === state.found);
      const ccOn = ccCung(state.ccPin).includes(pl.chi);
      const isMonth = now && now.year === tb.namXem && !now.leap && pl.luuNguyet === now.month;
      const marks = [isDh ? '<span class="mark mk-dh">Đại hạn</span>' : '', isTh ? `<span class="mark mk-th">Tiểu hạn ${tb.namXem}</span>` : '', isMonth ? `<span class="mark mk-th">Tháng ${now.month} này</span>` : ''].join('');
      const dv = tb.daiHanCung !== null ? 'ĐV.' + CUNG_TAT[mod(pl.chi - tb.daiHanCung)] : '';
      const ln = 'LN.' + CUNG_TAT[mod(pl.chi - tb.tieuHanCung)];
      const cls = ['cell', padOf(pl.chi), pl.chi === sel ? 'is-sel' : '', (rel.xung === pl.chi || rel.tamHop.includes(pl.chi)) ? 'is-rel' : '', found ? 'is-found' : '', ccOn ? 'is-cc' : ''].join(' ');
      return `<button type="button" class="${cls}" data-chi="${pl.chi}" style="grid-row:${r + 1};grid-column:${c + 1};--i:${i}" aria-pressed="${pl.chi === sel}" aria-label="Cung ${pl.cung}, ${pl.canTen} ${pl.chiTen}${chinh.length ? ', ' + chinh.map((s) => s.name).join(', ') : ', vô chính diệu'}">
        <div class="c-head">
          <span class="c-cc"><span class="sg ${HANH_CLASS[pl.hanh]}" title="Cung ${pl.amDuong > 0 ? 'dương' : 'âm'}, hành ${pl.hanh}">${SIGN(pl.amDuong)}</span>${CAN_TAT[pl.can]}.${pl.chiTen}</span>
          <span class="c-name ${HANH_CLASS[pl.hanh]}">${pl.cung}${pl.isThan ? '<span class="than">Thân</span>' : ''}</span>
          <span class="c-dh"><b class="num" title="Đại hạn ${pl.daiHan}–${pl.daiHanEnd} tuổi">${pl.daiHan}</b><small class="num" title="Tháng ${pl.luuNguyet} âm lịch năm ${tb.namXem}">T.${pl.luuNguyet}</small></span>
        </div>
        <div class="c-main">${chinh.length ? chinh.map((s) => starHtml(s, 'main')).join('') : '<span class="vcd">Vô chính diệu</span>'}</div>
        <div class="c-compact"><span class="num ${isDh ? 'dh-now' : ''}">${pl.daiHan}</span><span>${pl.chiTen}</span></div>
        <div class="c-minor"><div class="col-cat">${cat.map((s) => starHtml(s)).join('')}</div><div class="col-hung">${hung.map((s) => starHtml(s)).join('')}</div></div>
        ${state.showLuu && pl.luuNien.length ? `<div class="c-luu">${pl.luuNien.map((n) => `<span>${esc(n)}</span>`).join('')}</div>` : ''}
        ${marks ? `<div class="c-marks">${marks}</div>` : ''}
        <div class="c-foot"><span title="Tên cung khi lấy đại hạn đang chạy làm Mệnh">${dv}</span><span class="ts">${pl.trangSinh}</span><span title="Tên cung khi lấy tiểu hạn năm ${tb.namXem} làm Mệnh">${ln}</span></div>
      </button>`;
    }).join('');

    const a = tb.amLich, dl = tb.duongLich;
    const plaque = `<div class="plaque">
      <p class="phan">${BAGUA}Ông Khương phán rằng</p>
      <h2>${esc(tb.name || 'Lá số')}</h2>
      <p class="sub">${tb.amDuong}, ${tb.amDuongLy.toLowerCase()} ${info('amDuongLy')}</p>
      <dl class="tb">
        <dt>Năm</dt><dd class="num">${dl.year}</dd><dd>${tb.canChi.nam}</dd>
        <dt>Tháng</dt><dd class="num opt">${dl.month} <span class="muted">(âm ${a.month}${a.leap ? ' nhuận' : ''})</span></dd><dd>${tb.canChi.thang}</dd>
        <dt>Ngày</dt><dd class="num opt">${dl.day} <span class="muted">(âm ${a.day})</span></dd><dd>${tb.canChi.ngay}</dd>
        <dt>Giờ</dt><dd class="num opt">${pad(dl.hour)}:${pad(dl.minute)}</dd><dd>${tb.canChi.gio}</dd>
        <dt>Năm xem</dt><dd class="num opt">${tb.namXem}</dd><dd>${tb.namXemCanChi}, ${tb.tuoi} tuổi</dd>
        <dt>Mệnh ${info('menh')}</dt><dd class="wide">${tb.banMenh}<span class="opt muted"> (${tb.banMenhNghia.toLowerCase()})</span></dd>
        <dt>Cục ${info('cuc')}</dt><dd class="wide">${tb.cucTen}<span class="opt muted"> (Mệnh ${tb.hanhMenh} ${{ 'Bản Mệnh sinh Cục': 'sinh', 'Cục sinh Bản Mệnh': 'được sinh bởi', 'Bản Mệnh khắc Cục': 'khắc', 'Cục khắc Bản Mệnh': 'bị khắc bởi', 'Mệnh Cục bình hòa': 'hòa' }[tb.quanHeMenhCuc]} Cục ${tb.hanhCuc})</span></dd>
        <dt class="opt">Mệnh chủ ${info('menhChu')}</dt><dd class="wide opt">${tb.menhChu}</dd>
        <dt class="opt">Thân chủ ${info('thanChu')}</dt><dd class="wide opt">${tb.thanChu}</dd>
        <dt class="opt">Cân lượng ${info('canLuong')}</dt><dd class="wide opt">${tb.canXuongTen}</dd>
        <dt class="opt">Lai nhân ${info('laiNhan')}</dt><dd class="wide opt">${tb.laiNhan ? 'Cung ' + tb.laiNhan : 'Không có'}</dd>
      </dl>
      <p class="mini">${tb.canChi.nam}<br>${tb.banMenh}<br>${tb.cucTen}</p>
    </div>`;

    // Điểm neo trên viền thiên bàn cho từng cung
    const anchor = (chi) => { const [r, c] = GRID[chi]; const cl = (v) => Math.min(75, Math.max(25, v)); return [cl(c * 25 + 12.5), cl(r * 25 + 12.5)]; };
    const [sx, sy] = anchor(sel), [x1, y1] = anchor(rel.tamHop[0]), [x2, y2] = anchor(rel.tamHop[1]), [xx, xy] = anchor(rel.xung);
    const lines = state.showLines ? `<svg class="lines draw" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon class="ln-tam" points="${sx},${sy} ${x1},${y1} ${x2},${y2}"/><line class="ln-xung" x1="${sx}" y1="${sy}" x2="${xx}" y2="${xy}"/></svg>` : '';
    // Chi tiểu hạn ghi ở viền trong của thiên bàn, sát cung tương ứng
    const ring = ch.palaces.map((pl) => {
      const [r, c] = GRID[pl.chi];
      const [x, y] = anchor(pl.chi);
      const v = r === 0 ? 'top' : r === 3 ? 'bottom' : 'mid';
      const h = c === 0 ? 'left' : c === 3 ? 'right' : 'center';
      return `<span class="ring ring-${v} ring-${h}${pl.chi === tb.tieuHanCung ? ' now' : ''}" style="left:${x}%;top:${y}%" title="Năm ${pl.tieuHanTen}: tiểu hạn ở cung ${pl.cung}">${pl.tieuHanTen}</span>`;
    }).join('');
    const tt = placed.map((p) => `<span class="tt" style="left:${p.x}%;top:${p.y}%">${p.label}</span>`).join('');

    $('#chart').innerHTML = `<div class="grid${animate ? ' enter' : ''}">${cells}${plaque}${lines}${ring}${tt}</div>
      <div class="legend">
        <span class="lg"><b>M</b> Miếu <b>V</b> Vượng <b>Đ</b> Đắc <b>B</b> Bình hòa <b>H</b> Hãm ${info('doSang')}</span>
        <span class="lg"><span class="sw h-kim">Kim</span><span class="sw h-moc">Mộc</span><span class="sw h-thuy">Thủy</span><span class="sw h-hoa">Hỏa</span><span class="sw h-tho">Thổ</span>${info('nguHanh')}</span>
        <span class="lg"><b>+ –</b> âm dương ${info('amDuongDau')}</span>
        <span class="lg"><i class="ln-key tam"></i>Tam hợp <i class="ln-key xung"></i>Xung chiếu ${info('tamPhuong')}</span>
        <span class="lg">Tuần, Triệt ${info('tuanTriet')}</span>
        <span class="lg">Chữ nhỏ trong cung ${info('oCung')}</span>
      </div>`;
  }

  function renderWho() {
    const tb = state.chart.thienBan, P = state.chart.palaces, dl = tb.duongLich, a = tb.amLich;
    const menh = P[tb.menhCung];
    const chinh = menh.stars.filter((s) => s.kind === 'chinh').map((s) => s.name).join(', ') || 'Vô chính diệu';
    const dh = tb.daiHanCung !== null ? P[tb.daiHanCung] : null;
    $('#who-name').textContent = tb.name || 'Lá số chưa đặt tên';
    $('#who-facts').innerHTML = `<span><strong>${tb.amDuong}</strong></span>
      <span>Dương lịch <strong class="num">${pad(dl.day)}/${pad(dl.month)}/${dl.year}</strong>, ${pad(dl.hour)}:${pad(dl.minute)}</span>
      <span>Âm lịch <strong class="num">${a.day}/${a.month}${a.leap ? ' nhuận' : ''}</strong> năm ${tb.canChi.nam}, giờ ${tb.gioChi}</span>`;
    $('#who-keys').innerHTML = `
      <div class="key accent"><span>Mệnh tại ${menh.chiTen}</span><b>${chinh}</b></div>
      <div class="key"><span>Thân cư ${info('thanCu')}</span><b>${tb.thanCu}</b></div>
      <div class="key"><span>${tb.cucTen} ${info('cuc')}</span><b>${tb.banMenh}</b></div>
      <div class="key"><span>Đại hạn năm ${tb.namXem} ${info('daiHan')}</span><b>${dh ? dh.cung + ' ' + dh.daiHan + '–' + dh.daiHanEnd : 'Chưa vào'}</b></div>`;
  }

  // ---------- Bảng chi tiết cung ----------
  function starLine(s) {
    const inf = C.CHINH[s.name];
    if (!inf) return '';
    const sang = s.bright && ['M', 'V', 'Đ'].includes(s.bright);
    const tail = sang ? `Ở thế ${C.BRIGHT_TEN[s.bright]}: ${inf[1]}.` : s.bright === 'H' ? `Ở thế hãm: ${inf[2]}.` : 'Ở thế bình hòa: tốt xấu tùy sao đi kèm.';
    return `${inf[0]} ${tail}`;
  }
  function starMeaning(name) {
    const base = name.replace(/^L\./, '');
    const isLuu = base !== name;
    const txt = C.CHINH[base] ? C.CHINH[base][0] : (C.PHU[base] || 'Chưa có diễn giải cho sao này.');
    return { title: (isLuu ? 'Lưu ' : '') + base, text: (isLuu ? `Sao lưu của năm ${state.chart.thienBan.namXem}. ` : '') + txt };
  }
  function showStarNote(name) {
    const m = starMeaning(name);
    const box = $('#star-note');
    box.hidden = false;
    box.innerHTML = `<b>${esc(m.title)}</b><span>${esc(m.text)}</span>`;
    $$('#inspector .chip').forEach((c) => c.setAttribute('aria-pressed', String(c.getAttribute('data-star') === name)));
  }
  function renderInspector() {
    const ch = state.chart, p = ch.palaces[state.selected], P = ch.palaces, tb = ch.thienBan;
    const rel = relations(p.chi);
    const chinh = p.stars.filter((s) => s.kind === 'chinh');
    const chip = (name, s) => `<button type="button" class="chip" data-star="${esc(name)}" aria-pressed="false"><span class="dot ${s && HANH_CLASS[s.hanh] || ''}"></span>${esc(name.replace(/^L\./, ''))}${s && s.bright ? `<i>${s.bright}</i>` : ''}</button>`;
    const chips = (k) => p.stars.filter((s) => s.kind === k).map((s) => chip(s.name, s)).join('');
    const opp = P[rel.xung];
    const relBtn = (c) => `<button type="button" data-goto="${c}">${P[c].cung}</button>`;
    $('#inspector').innerHTML = `
      <div class="ins-head">
        <h2><span class="${HANH_CLASS[p.hanh]}">${p.cung}</span><small>${p.canTen} ${p.chiTen}, cung ${p.amDuong > 0 ? 'dương' : 'âm'} ${p.hanh}${p.isThan ? ', Thân cư' : ''}${p.chi === tb.laiNhanChi ? ', lai nhân' : ''}</small></h2>
        <div class="meta">
          <span class="pill ${p.chi === tb.daiHanCung ? 'hot' : ''}">Đại hạn ${p.daiHan}–${p.daiHanEnd}</span>
          <span class="pill ${p.chi === tb.tieuHanCung ? 'hot' : ''}">Tiểu hạn năm ${p.tieuHanTen}</span>
          <span class="pill">${p.trangSinh}</span>
          ${p.tuan ? '<span class="pill">Tuần</span>' : ''}${p.triet ? '<span class="pill">Triệt</span>' : ''}
          ${info('oCung')}
        </div>
      </div>
      <p class="ins-desc">${C.CUNG_Y[p.cung]}</p>
      <div class="majors">${chinh.length ? chinh.map((s) => `<div class="major">
          <h3><span class="${HANH_CLASS[s.hanh] || ''}">${s.amDuong ? SIGN(s.amDuong) + ' ' : ''}${s.name}</span><span class="badge ${['M', 'V', 'Đ'].includes(s.bright) ? 'good' : s.bright === 'H' ? 'bad' : ''}">${s.bright ? BRIGHT_WORD[s.bright] : 'Không xét'}${s.hoa ? ', ' + s.hoa : ''}</span></h3>
          <p>${starLine(s)}</p></div>`).join('')
        : `<div class="major"><h3>Vô chính diệu ${info('vcd')}</h3><p>Cung không có chính tinh, theo lệ mượn chính tinh cung xung chiếu ${opp.cung}: ${opp.stars.filter((s) => s.kind === 'chinh').map((s) => s.name).join(', ') || 'cũng vô chính diệu'}.</p></div>`}</div>
      ${p.tuan || p.triet ? `<p class="ins-desc">Cung gặp ${[p.tuan ? 'Tuần' : '', p.triet ? 'Triệt' : ''].filter(Boolean).join(' và ')}: sao tốt giảm lực, sao xấu cũng bớt hại.</p>` : ''}
      <p class="tap-hint">Bấm vào một sao để xem nghĩa</p>
      <div class="group"><h4>Cát tinh ${info('catTinh')}</h4><div class="chips">${chips('cat') || '<span class="muted">Không có</span>'}</div></div>
      <div class="group"><h4>Hung tinh ${info('hungTinh')}</h4><div class="chips">${chips('hung') || '<span class="muted">Không có</span>'}</div></div>
      ${p.luuNien.length ? `<div class="group"><h4>Sao lưu năm ${tb.namXem} ${info('luuNien')}</h4><div class="chips">${p.luuNien.map((n) => chip(n, null)).join('')}</div></div>` : ''}
      <div class="star-note" id="star-note" hidden></div>
      <div class="rel"><span>Tam hợp</span>${relBtn(rel.tamHop[0])}${relBtn(rel.tamHop[1])}<span>Xung chiếu</span>${relBtn(rel.xung)}${info('tamPhuong')}</div>`;
  }

  // ---------- Dải đại hạn ----------
  function renderTrack() {
    const ch = state.chart, tb = ch.thienBan;
    const list = [...ch.palaces].sort((a, b) => a.daiHan - b.daiHan);
    $('#track').innerHTML = list.map((p) => {
      const now = p.chi === tb.daiHanCung;
      const pos = now ? `--pos:${Math.round(((tb.tuoi - p.daiHan + 0.5) / 10) * 100)}%` : '';
      const chinh = p.stars.filter((s) => s.kind === 'chinh').map((s) => s.name).join(', ') || 'Vô chính diệu';
      return `<button type="button" class="seg${now ? ' now' : ''}${p.chi === state.selected ? ' sel' : ''}" data-goto="${p.chi}" style="${pos}" title="${esc(chinh)}"><span class="age">${p.daiHan}–${p.daiHanEnd} tuổi</span><b>${p.cung}</b><span>${esc(chinh)}</span></button>`;
    }).join('');
    $('#dec-note').textContent = tb.daiHanCung !== null ? `Năm ${tb.namXem}, ${tb.tuoi} tuổi âm, đang ở đại hạn cung ${ch.palaces[tb.daiHanCung].cung}. Đại hạn đi chiều ${tb.thuanNghich}.` : `Đại hạn đầu tiên bắt đầu từ ${tb.cuc} tuổi.`;
  }

  // ---------- Tổng quan ----------
  // ---------- Cách cục ----------
  const CC_TAG = { khung: 'Khung', cat: 'Cát', hung: 'Hung', bien: 'Biến' };
  const ccAll = () => (state.cc ? [...state.cc.khung, ...state.cc.cach] : []);
  const ccCung = (id) => { const h = id && ccAll().find((x) => x.id === id); return h ? h.cung : []; };
  function ccSection() {
    const items = ccAll().map((h) => `<li><button type="button" class="cc-item" data-cc="${h.id}" aria-pressed="${state.ccPin === h.id}">
        <span class="cc-tag t-${h.nhom}">${CC_TAG[h.nhom]}</span><b>${esc(h.ten)}</b>${h.chuaChac ? '<span class="cc-q" title="Các sách còn nói khác nhau">?</span>' : ''}
        <span class="cc-nghia">${esc(h.nghia)}</span>
        ${h.pha.length ? `<span class="cc-pha">Bị phá bởi ${esc(h.pha.join(', '))} ở Mệnh: sức tốt của cách giảm đi.</span>` : ''}
        <small>Căn cứ: ${esc(h.canCu)}</small>
        ${h.chuaChac ? `<small>Còn tranh cãi: ${esc(h.chuaChac)}</small>` : ''}
      </button></li>`).join('');
    const none = state.cc && !state.cc.cach.length ? '<p>Lá số không rơi vào cách cục đặc biệt nào trong danh sách. Chuyện này bình thường: khoảng một phần năm lá số như vậy.</p>' : '';
    return `<section><h3>Cách cục</h3>
      <p class="muted">Bấm vào một cách để tô các cung liên quan trên lá số.</p>
      <ul class="cc-list">${items}</ul>${none}
    </section>`;
  }
  // Tô các cung của một cách (không vẽ lại cả lá số)
  const paintCc = (id) => $$('#chart .cell').forEach((x) => x.classList.toggle('is-cc', ccCung(id).includes(+x.getAttribute('data-chi'))));

  function renderSummary() {
    const ch = state.chart, tb = ch.thienBan, P = ch.palaces;
    const menh = P[tb.menhCung], than = P[tb.thanCung];
    const tam = [P[mod(tb.menhCung + 4)], P[mod(tb.menhCung + 8)], P[mod(tb.menhCung + 6)]];
    const four = [menh, ...tam];
    const count = (list) => four.flatMap((p) => p.stars.map((s) => s.name)).filter((n) => list.includes(n));
    const cat = count(C.LUC_CAT), sat = count(C.LUC_SAT);
    const chinhOf = (p) => p.stars.filter((s) => s.kind === 'chinh');
    const nameList = (p) => (chinhOf(p).map((s) => s.name + (s.bright ? ` (${s.bright})` : '')).join(', ') || 'vô chính diệu');
    let menhStars = chinhOf(menh), borrow = '';
    if (!menhStars.length) {
      const opp = P[mod(tb.menhCung + 6)];
      menhStars = chinhOf(opp);
      borrow = `<p>Cung Mệnh vô chính diệu, theo lệ mượn chính tinh của cung xung chiếu ${opp.cung} (${opp.chiTen}). Người Mệnh vô chính diệu thường linh hoạt và chịu ảnh hưởng nhiều từ hoàn cảnh.</p>`;
    }
    const dh = tb.daiHanCung !== null ? P[tb.daiHanCung] : null, th = P[tb.tieuHanCung];
    const hungIn = (p) => p.stars.filter((s) => C.LUC_SAT.includes(s.name) || s.name === 'Hóa Kỵ').map((s) => s.name);
    const catIn = (p) => p.stars.filter((s) => [...C.LUC_CAT, 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Lộc Tồn'].includes(s.name)).map((s) => s.name);
    const tt = (p) => [p.tuan ? 'Tuần' : '', p.triet ? 'Triệt' : ''].filter(Boolean).join(' và ');
    $('#summary').innerHTML = `
      <section><h3>Thiên bàn</h3>
        <p>${tb.gender} sinh giờ ${tb.gioChi} ngày ${tb.amLich.day} tháng ${tb.amLich.month}${tb.amLich.leap ? ' nhuận' : ''} năm ${tb.canChi.nam}, ${tb.amDuong}, mệnh ${tb.banMenh}, ${tb.cucTen}.</p>
        <p>${C.AM_DUONG_Y[tb.amDuongLy]} ${C.MENH_CUC_Y[tb.quanHeMenhCuc]}</p>
        <p>Mệnh đóng ở ${menh.chiTen}, Thân cư ${tb.thanCu} (${than.chiTen}): từ khoảng 30 tuổi trở đi, đời sống xoay quanh ${C.THAN_CU[tb.thanCu] || 'cung này'}.</p>
      </section>
      <section><h3>Cung Mệnh</h3>${borrow}
        <ul>${menhStars.map((s) => `<li><b>${s.name}</b>${s.hoa ? ` (${s.hoa})` : ''}: ${starLine(s)}</li>`).join('')}</ul>
        ${catIn(menh).length ? `<p>Cát tinh tại Mệnh: ${catIn(menh).join(', ')}.</p>` : ''}
        ${hungIn(menh).length ? `<p>Sát tinh tại Mệnh: ${hungIn(menh).join(', ')}. Nên giữ bình tĩnh, tránh quyết định vội.</p>` : ''}
        ${tt(menh) ? `<p>Mệnh gặp ${tt(menh)}: thời trẻ thường chậm hoặc trắc trở, càng về sau càng nhẹ.</p>` : ''}
      </section>
      ${ccSection()}
      <section><h3>Tam phương tứ chính</h3>
        <p>${tam.map((p) => `${p.cung} (${p.chiTen}): ${nameList(p)}`).join('; ')}.</p>
        <p>Bốn cung Mệnh, Tài, Quan, Di có ${cat.length} sao lục cát${cat.length ? ` (${cat.join(', ')})` : ''} và ${sat.length} sao lục sát${sat.length ? ` (${sat.join(', ')})` : ''}. ${cat.length > sat.length ? 'Cát nhiều hơn sát: thuận lợi, dễ được nâng đỡ.' : cat.length < sat.length ? 'Sát nhiều hơn cát: đời nhiều thử thách, thành công nhờ bản lĩnh.' : 'Cát và sát cân bằng.'}</p>
      </section>
      <section><h3>Vận hạn</h3>
        ${dh ? `<p>Năm ${tb.namXem} (${tb.tuoi} tuổi) đang ở đại hạn ${dh.daiHan}–${dh.daiHanEnd} tại cung ${dh.cung} (${dh.chiTen}): ${nameList(dh)}. ${C.CUNG_Y[dh.cung]}</p>` : `<p>Năm ${tb.namXem} chưa vào đại hạn đầu tiên (bắt đầu từ ${tb.cuc} tuổi).</p>`}
        <p>Tiểu hạn năm ${tb.namXemCanChi} ở cung ${th.cung} (${th.chiTen}): ${nameList(th)}${catIn(th).length ? `, có ${catIn(th).join(', ')}` : ''}${hungIn(th).length ? `, gặp ${hungIn(th).join(', ')}` : ''}.</p>
      </section>
      <p class="note">Phần này ghép từ nghĩa cơ bản của từng sao và mang tính tham khảo. Muốn luận sâu hơn, dùng tab Luận giải AI.</p>`;
  }

  // ---------- Dữ liệu cho AI và JSON ----------
  function chartText() {
    const ch = state.chart, tb = ch.thienBan;
    const lines = [
      `Giới tính: ${tb.gender} (${tb.amDuong}); sinh ${tb.duongLich.day}/${tb.duongLich.month}/${tb.duongLich.year} ${pad(tb.duongLich.hour)}:${pad(tb.duongLich.minute)} giờ Việt Nam`,
      `Âm lịch: ngày ${tb.amLich.day} tháng ${tb.amLich.month}${tb.amLich.leap ? ' nhuận' : ''} năm ${tb.canChi.nam}; tháng ${tb.canChi.thang}, ngày ${tb.canChi.ngay}, giờ ${tb.canChi.gio}`,
      `Bản mệnh: ${tb.banMenh}; ${tb.cucTen}; ${tb.quanHeMenhCuc}; ${tb.amDuongLy}; Mệnh chủ ${tb.menhChu}, Thân chủ ${tb.thanChu}; Thân cư ${tb.thanCu}`,
      `Năm xem: ${tb.namXem} (${tb.namXemCanChi}), ${tb.tuoi} tuổi âm; đại hạn hiện tại: ${tb.daiHanCung !== null ? ch.palaces[tb.daiHanCung].cung : 'chưa vào'}; tiểu hạn: cung ${ch.palaces[tb.tieuHanCung].cung}`,
      'Mười hai cung (tên cung, can chi, đại hạn, chính tinh, cát tinh, hung tinh, Tràng Sinh, sao lưu năm xem):',
    ];
    Array.from({ length: 12 }, (_, i) => mod(tb.menhCung + i)).forEach((chi) => {
      const p = ch.palaces[chi];
      const f = (k) => p.stars.filter((s) => s.kind === k).map((s) => s.name + (s.bright ? `(${s.bright})` : '')).join(', ') || '—';
      lines.push(`- ${p.cung}${p.isThan ? ' [Thân]' : ''} | ${p.canTen} ${p.chiTen} | ĐH ${p.daiHan}-${p.daiHanEnd} | Chính: ${f('chinh')} | Cát: ${f('cat')} | Hung: ${f('hung')} | ${p.trangSinh}${p.tuan ? ' | Tuần' : ''}${p.triet ? ' | Triệt' : ''}${p.luuNien.length ? ' | Lưu: ' + p.luuNien.join(', ') : ''}`);
    });
    if (state.cc) lines.push('Cách cục (máy nhận diện theo cung Mệnh): ' + (ccAll().map((h) => `${h.ten} [${CC_TAG[h.nhom]}${h.pha.length ? ', bị phá bởi ' + h.pha.join(', ') : ''}] (${h.canCu})`).join('; ') || 'không có'));
    return lines.join('\n');
  }
  const chartJson = () => JSON.stringify({ version: 1, school: 'vn', input: state.chart.input, thien_ban: state.chart.thienBan, dia_ban: state.chart.palaces, cach_cuc: state.cc }, null, 2);

  // ---------- AI ----------
  const rules = () => 'Bạn là người luận giải Tử Vi Đẩu Số theo phái Việt Nam. Lá số dưới đây đã được an sẵn bằng phần mềm; dùng đúng dữ liệu này, không tự an lại.\n'
    + 'Viết tiếng Việt, giọng điềm đạm và cụ thể. Mỗi nhận định nêu rõ sao hoặc cung làm căn cứ. Không phán định tuyệt đối, không dọa, không chẩn đoán y tế hay khuyên đầu tư cụ thể. '
    + 'Định dạng: các mục có tiêu đề dạng "## Tiêu đề", gạch đầu dòng bằng "- ", in đậm bằng **...**.\n\nLÁ SỐ:\n' + chartText();
  function md(text) {
    const out = []; let list = false;
    esc(text).split('\n').forEach((raw) => {
      const t = raw.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').trim();
      if (/^[-*] /.test(t)) { if (!list) { out.push('<ul>'); list = true; } out.push(`<li>${t.slice(2)}</li>`); return; }
      if (list) { out.push('</ul>'); list = false; }
      if (t.startsWith('### ')) out.push(`<h5>${t.slice(4)}</h5>`);
      else if (/^#{1,2} /.test(t)) out.push(`<h4>${t.replace(/^#+ /, '')}</h4>`);
      else if (t) out.push(`<p>${t}</p>`);
    });
    if (list) out.push('</ul>');
    return out.join('');
  }
  const AI_ERR = {
    not_granted: 'Trang chưa được phép dùng Claude, nên tính năng này tạm tắt.',
    sampling_disabled: 'Tài khoản này chưa dùng được Claude cho trang.',
    rate_limited: 'Đang gửi quá nhiều yêu cầu hoặc đã chạm giới hạn sử dụng. Thử lại sau ít phút.',
    session_expired: 'Phiên đăng nhập đã hết hạn. Đăng nhập lại rồi thử lại.',
    refused: 'Claude không trả lời yêu cầu này. Thử chủ đề khác.',
  };
  async function runAi(question) {
    const s = state.sample; if (!s) return;
    const out = $('#ai-out'), btn = $('#ai-run'), stop = $('#ai-stop'), ask = $('#ai-ask-btn');
    state.ai.ctl?.abort();
    const ctl = new AbortController(); state.ai.ctl = ctl;
    let input; const opts = { signal: ctl.signal, onText: ({ text }) => { out.innerHTML = md(text); } };
    if (question) {
      state.ai.turns.push({ role: 'user', content: question });
      input = [{ role: 'user', content: rules() + '\n\nPhần luận giải trước đó:\n' + state.ai.lastAnswer }, ...state.ai.turns.slice(-6)];
      opts.cache = false;
      out.insertAdjacentHTML('beforeend', `<div class="q">${esc(question)}</div>`);
      const holder = document.createElement('div'); holder.textContent = 'Đang suy nghĩ…'; out.appendChild(holder);
      opts.onText = ({ text }) => { holder.innerHTML = md(text); };
    } else {
      const t = TOPICS.find((x) => x[0] === state.topic) || TOPICS[0];
      input = rules() + `\n\nCHỦ ĐỀ CẦN LUẬN: ${t[3]}.\nĐộ dài 350–550 từ, 3–5 mục, cuối cùng là 2–3 gợi ý thực tế.`;
      out.innerHTML = '<p class="muted">Đang suy nghĩ…</p>';
      state.ai.turns = [];
    }
    btn.disabled = true; ask.disabled = true; stop.hidden = false; $('#ai-note').textContent = '';
    try {
      const { text, truncated } = await s(input, opts);
      if (question) state.ai.turns.push({ role: 'assistant', content: text }); else state.ai.lastAnswer = text;
      $('#ai-ask').hidden = false;
      if (truncated) $('#ai-note').textContent = 'Câu trả lời bị cắt ngắn; thử hỏi hẹp hơn.';
    } catch (e) {
      if (question) state.ai.turns.pop();
      if (e && e.code === 'cancelled') $('#ai-note').textContent = 'Đã dừng.';
      else if (e && (e.code === 'not_granted' || e.code === 'sampling_disabled')) { $('#ai-panel').hidden = true; $('#ai-off').hidden = false; $('#ai-off').textContent = AI_ERR[e.code]; }
      else { if (!e?.text && !question) out.innerHTML = ''; $('#ai-note').textContent = AI_ERR[e?.code] || 'Kết nối bị gián đoạn. Bấm Luận giải để thử lại.'; }
    } finally { btn.disabled = false; ask.disabled = false; stop.hidden = true; }
  }

  // ---------- Xuất file ----------
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 3200); }
  const fileBase = () => {
    const tb = state.chart.thienBan;
    const n = (tb.name || 'la-so').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
    return `${n || 'la-so'}-${tb.duongLich.year}${pad(tb.duongLich.month)}${pad(tb.duongLich.day)}`;
  };
  async function saveFile(filename, data) {
    if (!IN_CLAUDE) {
      const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast('Đã tải ' + filename);
      return true;
    }
    if (!state.downloads) return false;
    try { await state.downloads.save({ filename, data }); toast('Đã lưu ' + filename); }
    catch (e) { if (e?.code !== 'declined') toast('Không lưu được tệp ở đây.'); }
    return true;
  }
  async function exportPng() {
    const node = $('#chart');
    if (!window.htmlToImage) { toast('Chưa tải được công cụ xuất ảnh.'); return; }
    const btn = $('#btn-png'); btn.disabled = true;
    try {
      const bg = getComputedStyle(node).backgroundColor;
      const blob = await window.htmlToImage.toBlob(node, { pixelRatio: 2, backgroundColor: bg, skipFonts: true });
      if (!(await saveFile(fileBase() + '.png', blob))) { $('#png-preview').src = URL.createObjectURL(blob); $('#png-dialog').hidden = false; }
    } catch (e) { toast('Xuất ảnh không thành công.'); }
    finally { btn.disabled = false; }
  }

  // ---------- Lá số gần đây (chỉ trong trình duyệt này) ----------
  const RECENT_KEY = 'tuvi.recent.v1';
  function loadRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; } }
  function saveRecent(inp) {
    try {
      const key = (i) => [i.name, i.gender, i.calendar, i.day, i.month, i.year, i.gio, i.hour, i.minute].join('|');
      localStorage.setItem(RECENT_KEY, JSON.stringify([inp, ...loadRecent().filter((x) => key(x) !== key(inp))].slice(0, 6)));
    } catch { /* trình duyệt chặn lưu */ }
  }
  function forgetRecent() { try { localStorage.removeItem(RECENT_KEY); } catch { /* bỏ qua */ } renderRecent(); toast('Đã xóa danh sách trên máy này'); }
  function renderRecent() {
    const list = loadRecent();
    $('#recent-wrap').hidden = !list.length;
    $('#recent').innerHTML = list.map((x, i) => `<button type="button" data-recent="${i}">${esc(x.name || 'Không tên')}, ${x.day}/${x.month}/${x.year}${x.calendar === 'am' ? ' âm lịch' : ''}</button>`).join('');
  }

  // ---------- Điều phối ----------
  function select(chi) {
    state.selected = chi;
    renderChart(false); renderInspector(); renderTrack();
  }
  function compute(inp, isSample) {
    try {
      const chart = E.compute(inp);
      state.input = inp; state.chart = chart; state.thangNay = thangNay(); state.isSample = !!isSample; state.found = null;
      state.cc = K.detect(chart); state.ccPin = null;
      state.selected = chart.thienBan.menhCung;
      $('#form-error').hidden = true;
      renderWho(); renderChart(true); renderInspector(); renderTrack(); renderSummary();
      $('#json-out').textContent = chartJson();
      $('#ai-out').innerHTML = ''; $('#ai-ask').hidden = true; $('#ai-note').textContent = '';
      $('#find').value = '';
      return true;
    } catch (e) {
      $('#form-error').textContent = e.message || 'Không an được lá số với dữ liệu này.';
      $('#form-error').hidden = false;
      return false;
    }
  }
  function setTab(name) {
    $$('[role=tab]').forEach((t) => t.setAttribute('aria-selected', String(t.getAttribute('data-tab') === name)));
    $$('[role=tabpanel]').forEach((p) => { p.hidden = p.id !== 'tab-' + name; });
  }
  function findStar(name) {
    const n = name.trim().toLowerCase();
    const hit = n && state.chart.palaces.find((p) => p.stars.some((s) => s.name.toLowerCase() === n));
    if (!hit) { state.found = null; renderChart(false); if (n) toast('Không thấy sao này trên lá số.'); return; }
    state.found = hit.stars.find((s) => s.name.toLowerCase() === n).name;
    select(hit.chi);
  }

  function init() {
    buildForm();

    $('#form').addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = readForm();
      if (!inp.day || !inp.month || !inp.year) { $('#form-error').textContent = 'Nhập đủ ngày, tháng và năm sinh.'; $('#form-error').hidden = false; return; }
      if (inp.year < 1800 || inp.year > 2199) { $('#form-error').textContent = 'Năm sinh cần trong khoảng 1800 đến 2199.'; $('#form-error').hidden = false; return; }
      if (!compute(inp, false)) return;
      saveRecent(inp);
      const h = toHash(inp);
      if (location.hash.slice(1) === h) showView('chart'); else location.hash = h;
    });
    $('#form').addEventListener('change', syncForm);
    $('#form').addEventListener('input', () => { if (state.formSample) setSampleNote(false); $('#form-error').hidden = true; });
    $('#f-year').addEventListener('input', syncForm);
    $('#btn-clear').addEventListener('click', () => {
      ['#f-name', '#f-day', '#f-month', '#f-year'].forEach((id) => { $(id).value = ''; });
      setSampleNote(false); $('#f-day').focus();
    });
    $('#recent').addEventListener('click', (e) => {
      const b = e.target.closest('[data-recent]'); if (!b) return;
      const inp = loadRecent()[+b.getAttribute('data-recent')];
      if (inp && compute(inp, false)) { const h = toHash(inp); if (location.hash.slice(1) === h) showView('chart'); else location.hash = h; }
    });
    $('#btn-forget').addEventListener('click', forgetRecent);
    $('#btn-back').addEventListener('click', () => { location.hash = 'lap-la-so'; });
    initTheme();
    $$('.logo-mark, .hub-mark').forEach((el) => { el.innerHTML = BAGUA; });
    initInfo();
    window.addEventListener('hashchange', route);

    $('#chart').addEventListener('click', (e) => {
      if (e.target.closest('.info')) return;
      const c = e.target.closest('.cell'); if (!c) return;
      const st = e.target.closest('.star[data-star]');
      select(+c.getAttribute('data-chi'));
      if (st) showStarNote(st.getAttribute('data-star'));
      // Màn hẹp: bảng chi tiết nằm dưới lá số, cuộn tới nếu đang khuất
      const ins = $('#inspector'), r = ins.getBoundingClientRect();
      if (window.innerWidth <= 1180 && r.top > window.innerHeight - 80) {
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        ins.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    });
    $('#chart').addEventListener('mouseover', (e) => {
      const c = e.target.closest('.cell'); if (!c) return;
      const r = relations(+c.getAttribute('data-chi'));
      $$('.cell', $('#chart')).forEach((x) => { const k = +x.getAttribute('data-chi'); x.classList.toggle('is-hover', k === r.xung || r.tamHop.includes(k)); });
    });
    $('#chart').addEventListener('mouseleave', () => $$('.cell.is-hover').forEach((x) => x.classList.remove('is-hover')));
    $('#inspector').addEventListener('click', (e) => {
      const g = e.target.closest('[data-goto]'); if (g) { select(+g.getAttribute('data-goto')); return; }
      const chip = e.target.closest('[data-star]'); if (!chip) return;
      showStarNote(chip.getAttribute('data-star'));
    });
    $('#track').addEventListener('click', (e) => { const b = e.target.closest('[data-goto]'); if (b) select(+b.getAttribute('data-goto')); });
    $('#t-luu').addEventListener('change', (e) => { state.showLuu = e.target.checked; renderChart(false); });
    $('#t-lines').addEventListener('change', (e) => { state.showLines = e.target.checked; renderChart(false); });
    $('#find').addEventListener('change', (e) => findStar(e.target.value));
    $('#find').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); findStar(e.target.value); } });

    $$('[role=tab]').forEach((t) => t.addEventListener('click', () => setTab(t.getAttribute('data-tab'))));
    // Cách cục: rê chuột để xem tạm, bấm để giữ; lá số đang khuất thì cuộn lên cho thấy
    $('#summary').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cc]'); if (!b) return;
      const id = b.getAttribute('data-cc');
      state.ccPin = state.ccPin === id ? null : id;
      $$('#summary [data-cc]').forEach((x) => x.setAttribute('aria-pressed', String(x.getAttribute('data-cc') === state.ccPin)));
      paintCc(state.ccPin);
      const g = $('#chart').getBoundingClientRect();
      if (state.ccPin && (g.bottom < 120 || g.top > innerHeight - 120)) {
        $('#chart').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      }
    });
    $('#summary').addEventListener('mouseover', (e) => { const b = e.target.closest('[data-cc]'); paintCc(b ? b.getAttribute('data-cc') : state.ccPin); });
    $('#summary').addEventListener('mouseleave', () => paintCc(state.ccPin));
    $('#topics').addEventListener('click', (e) => {
      const b = e.target.closest('[data-topic]'); if (!b) return;
      state.topic = b.getAttribute('data-topic');
      $$('.topic').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    });
    $('#ai-run').addEventListener('click', () => runAi());
    $('#ai-stop').addEventListener('click', () => state.ai.ctl?.abort());
    $('#ai-ask').addEventListener('submit', (e) => { e.preventDefault(); const q = $('#ai-q').value.trim(); if (!q) return; $('#ai-q').value = ''; runAi(q); });

    $('#btn-png').addEventListener('click', exportPng);
    $('#btn-json').addEventListener('click', async () => { if (!(await saveFile(fileBase() + '.json', chartJson()))) { setTab('json'); toast('Mở tab Dữ liệu JSON để sao chép.'); } });
    $('#btn-copy').addEventListener('click', () => copyText(chartJson(), 'Đã chép JSON', $('#json-out')));
    $('#png-close').addEventListener('click', () => { $('#png-dialog').hidden = true; });
    // Ngoài Claude, địa chỉ trang chính là link của lá số
    if (!IN_CLAUDE) { $('#btn-link').hidden = false; $('#btn-link').addEventListener('click', () => copyText(location.href, 'Đã chép link lá số')); }

    const setAi = (fn) => { state.sample = fn; $('#ai-panel').hidden = !fn; $('#ai-off').hidden = !!fn; };
    if (IN_CLAUDE) {
      $('#ai-off').textContent = 'Luận giải AI cần quyền dùng Claude của người xem. Mỗi lần luận giải dùng lượt Claude của chính bạn.';
      window.claude.use('sample').then((fn) => setAi(fn)).catch(() => {});
      window.claude.use('downloads').then((d) => { state.downloads = d; }).catch(() => {});
    } else if (CFG.aiEndpoint) setAi(TuViAI.proxySample(CFG.aiEndpoint));

    route();
  }
  // ---------- Nút (i) giải thích ----------
  function initInfo() {
    const pop = $('#pop');
    let owner = null;
    const close = () => { if (!owner) return; owner.setAttribute('aria-expanded', 'false'); owner = null; pop.hidden = true; };
    const open = (btn) => {
      const item = C.INFO[btn.getAttribute('data-info')]; if (!item) return;
      if (owner === btn) { close(); return; }
      close();
      owner = btn; btn.setAttribute('aria-expanded', 'true');
      pop.innerHTML = `<b>${esc(item[0])}</b><span>${esc(item[1])}</span>`;
      pop.hidden = false;
      const r = btn.getBoundingClientRect ? btn.getBoundingClientRect() : { left: 0, right: 0, bottom: 0, top: 0 };
      const w = Math.min(320, (window.innerWidth || 360) - 24);
      pop.style.width = w + 'px';
      let left = r.left + (r.right - r.left) / 2 - w / 2;
      left = Math.max(12, Math.min(left, (window.innerWidth || 360) - w - 12));
      const below = r.bottom + 8, h = pop.offsetHeight || 120;
      const top = below + h > (window.innerHeight || 800) - 8 ? Math.max(8, r.top - h - 8) : below;
      pop.style.left = left + 'px'; pop.style.top = top + 'px';
    };
    document.addEventListener('click', (e) => {
      const btn = e.target.closest && e.target.closest('.info');
      if (btn) { e.preventDefault(); e.stopPropagation(); open(btn); return; }
      if (!e.target.closest || !e.target.closest('#pop')) close();
    }, true);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && owner) { const b = owner; close(); b.focus(); } });
    // Cuộn hoặc đổi cỡ: giữ popover bám theo nút thay vì đóng
    const follow = () => { if (owner) { const b = owner; owner = null; open(b); } };
    window.addEventListener('scroll', follow, { passive: true });
    window.addEventListener('resize', follow);
  }

  // ---------- Chế độ sáng / tối ----------
  const THEME_KEY = 'tuvi.theme';
  function effectiveDark() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark') return true; if (t === 'light') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function paintThemeButton() {
    const dark = effectiveDark(), b = $('#btn-theme');
    b.setAttribute('aria-pressed', String(dark));
    b.setAttribute('aria-label', dark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối');
    b.title = b.getAttribute('aria-label');
    $('#theme-sun').hidden = !dark; $('#theme-moon').hidden = dark;
  }
  function initTheme() {
    let saved = null; try { saved = localStorage.getItem(THEME_KEY); } catch { /* bỏ qua */ }
    if (saved === 'dark' || saved === 'light') document.documentElement.setAttribute('data-theme', saved);
    paintThemeButton();
    $('#btn-theme').addEventListener('click', () => {
      const next = effectiveDark() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch { /* bỏ qua */ }
      paintThemeButton();
    });
    if (window.matchMedia) { const mq = window.matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change', paintThemeButton); }
  }
  async function copyText(text, okMsg, selectEl) {
    try { await navigator.clipboard.writeText(text); toast(okMsg); }
    catch {
      if (selectEl) { const r = document.createRange(); r.selectNodeContents(selectEl); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); toast('Đã chọn sẵn, nhấn Ctrl+C để chép.'); }
      else toast('Không chép được. Hãy sao chép địa chỉ trên thanh trình duyệt.');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
