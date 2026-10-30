// Giao diện lá số (sơn mài)
(() => {
  const E = TuViEngine, C = TuViContent, K = TuViCachCuc, N = TuViNghiaSao, LK = TuViLoiKhuyen, SS = TuViSoSanh, BT = TuViBatTu;
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
  // Lọc màn 12 giờ theo buổi trong ngày
  const BUOI = [['all', 'Tất cả', 'Cả 13 khung giờ'], ['khuya', 'Khuya', '23 đến 5 giờ'], ['sang', 'Sáng', '5 đến 11 giờ'], ['chieu', 'Chiều', '11 đến 17 giờ'], ['toi', 'Tối', '17 đến 23 giờ']];
  const buoiOf = (h) => (h >= 23 || h < 5 ? 'khuya' : h < 11 ? 'sang' : h < 17 ? 'chieu' : 'toi');
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
  const state = { mode: 'tuvi', bt: null, btInput: null, btDv: null, input: null, chart: null, selected: null, found: null, showLuu: true, showDv: true, showLines: true, yearsOf: null, sample: null, downloads: null, topic: 'tongquan', isSample: true, formSample: true, ai: { turns: [], ctl: null, lastAnswer: '' } };
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
  // Link màn không rõ giờ (#12-gio-...): như link lá số nhưng không có giờ phút
  const toHoursHash = (inp) => '12-gio-' + toHash({ ...inp, hour: 0, minute: 0 }).slice(6).replace(/^(\d+-\d+-\d+)-\d{4}-/, '$1-');
  function fromHoursHash(h) {
    const inp = fromHash('la-so-' + h.slice(7).replace(/^(\d+-\d+-\d+)-/, '$1-0000-'));
    return inp && { ...inp, noHour: true };
  }
  // Link Bát Tự (#bat-tu-...): cùng cách ghi như link lá số; không rõ giờ thì thêm -kg
  const toBtHash = (inp) => 'bat-tu-' + toHash(inp.noHour ? { ...inp, hour: 0, minute: 0 } : inp).slice(6) + (inp.noHour ? '-kg' : '');
  function fromBtHash(h) {
    const kg = h.endsWith('-kg');
    const inp = fromHash('la-so-' + h.slice(7, kg ? -3 : undefined));
    return inp && { ...inp, noHour: kg };
  }
  // Cùng ngày sinh, giới tính, tùy chọn (không tính giờ và năm xem): để biết lá số đang xem có phải giờ thử từ màn 12 giờ
  const dayKey = (inp) => toHoursHash({ ...inp, namXem: 0 });


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
    $('#hv-filter').innerHTML = BUOI.map(([v, t, r], i) => `<input type="radio" name="buoi" id="b-${v}" value="${v}"${i ? '' : ' checked'}><label for="b-${v}" title="${r}">${t}</label>`).join('');
    $('#c-qh').innerHTML = Object.entries(SS.QUAN_HE).map(([k, v]) => `<option value="${k}">${v.ten}</option>`).join('');
    $('#c-gio').innerHTML = '<option value="">Không rõ giờ</option>' + ALL_GIO.map(([v, n, r]) => `<option value="${v}">${n} (${r} giờ)</option>`).join('');
  }
  function writeForm(inp) {
    $('#f-name').value = inp.name || '';
    $(`#f-g-${inp.gender}`).checked = true;
    $(`#f-c-${inp.calendar}`).checked = true;
    $('#f-day').value = inp.day; $('#f-month').value = inp.month; $('#f-year').value = inp.year;
    $('#f-leap').checked = !!inp.leap;
    const h = $(`#h-${inp.gio || 'than'}`); if (h) h.checked = true;
    $('#f-exact').checked = !!inp.exact;
    $('#f-nohour').checked = !!inp.noHour;
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
      noHour: $('#f-nohour').checked,
    };
  }
  function syncForm() {
    const noHour = $('#f-nohour').checked;
    $('#leap-row').hidden = !$('#f-c-am').checked;
    $('#hours').classList.toggle('is-off', noHour);
    $$('#hours input').forEach((x) => { x.disabled = noHour; });
    $('#exact-row').hidden = noHour;
    $('#time-row').hidden = noHour || !$('#f-exact').checked;
    const y = +$('#f-year').value;
    $('#tz-hint').hidden = !(y && y < 1976 && $('#f-tz').value === '7');
  }

  // ---------- Hai màn: lập lá số / lá số ----------
  // Trang chủ: chọn lập lá số Tử Vi hay Bát Tự (dùng chung một form)
  const MODE_TXT = {
    tuvi: ['Lập lá số Tử Vi', 'Nhập ngày giờ sinh để an lá số 12 cung theo Tử Vi Đẩu Số phái Việt Nam, xem đại hạn, tiểu hạn và luận giải từng cung.', 'An lá số', 'Không rõ giờ sinh (xem nhanh cả 12 giờ)'],
    battu: ['Lập lá số Bát Tự', 'Nhập ngày giờ sinh để lập Tứ Trụ: trụ năm đổi ở Lập Xuân, trụ tháng theo tiết khí; xem thập thần, ngũ hành, đại vận và lưu niên.', 'Lập Bát Tự', 'Không rõ giờ sinh (lập ba trụ năm, tháng, ngày)'],
  };
  function setMode(m) {
    const t = MODE_TXT[m];
    state.mode = m; $(`#m-${m}`).checked = true;
    $('#home-title').textContent = t[0]; $('#home-lede').textContent = t[1]; $('#f-submit').textContent = t[2]; $('#nohour-text').textContent = t[3];
    $('#opts').hidden = m === 'battu';
  }
  function showView(name) {
    $('#view-home').hidden = name !== 'home'; $('#view-chart').hidden = name !== 'chart'; $('#view-hours').hidden = name !== 'hours'; $('#view-battu').hidden = name !== 'battu';
    state.view = name;
    $('#btn-back').hidden = name === 'home'; $('#chart-actions').hidden = name !== 'chart' && name !== 'battu';
    $('.bar').classList.toggle('in-chart', name !== 'home');
    window.scrollTo(0, 0);
    const h = $({ home: '#home-title', chart: '#who-name', hours: '#hours-title', battu: '#bt-name' }[name]);
    if (h && h.focus) h.focus({ preventScroll: true });
  }
  function route() {
    const h = (location.hash || '').slice(1);
    if (h.startsWith('bat-tu-')) {
      const inp = fromBtHash(h);
      if (inp) {
        if (state.btInput && toBtHash(state.btInput) === h) inp.name = state.btInput.name;
        if (computeBt(inp)) { setMode('battu'); showView('battu'); return; }
      }
      toast('Link Bát Tự không hợp lệ. Hãy lập lại.');
    }
    if (h.startsWith('12-gio-')) {
      const inp = fromHoursHash(h);
      if (inp) {
        if (state.hoursInput && toHoursHash(state.hoursInput) === h) inp.name = state.hoursInput.name;
        if (showHours(inp)) { showView('hours'); return; }
      }
      toast('Link không hợp lệ. Hãy lập lại lá số.');
    }
    const inp = h.startsWith('la-so-') ? fromHash(h) : null;
    if (inp) {
      const last = state.input;
      if (last && toHash(last) === h) inp.name = last.name;
      if (compute(inp, false)) { showView('chart'); return; }
      toast('Link lá số không hợp lệ. Hãy lập lại lá số.');
    } else if (h.startsWith('la-so-')) toast('Link lá số không hợp lệ. Hãy lập lại lá số.');
    setMode(state.mode);
    writeForm(state.input || SAMPLE);
    setSampleNote(!state.input);
    renderRecent();
    showView('home');
  }
  function setSampleNote(on) { state.formSample = on; $('#sample-note').hidden = !on; }

  // ---------- Lá số ----------
  const SIGN = (v) => (v > 0 ? '+' : '–');
  const CUNG_TAT = ['Mệnh', 'Phụ', 'Phúc', 'Điền', 'Quan', 'Nô', 'Di', 'Tật', 'Tài', 'Tử', 'Phối', 'Huynh'];
  // Lời khuyên cho điểm xấu: một câu, hoặc danh sách theo từng sao
  const advice = (t) => (t ? `<span class="advice"><b>Lời khuyên:</b> ${esc(t)}</span>` : '');
  const adviceStars = (names) => {
    const list = [...new Set(names)].filter((n) => LK.SAO[n]);
    return list.length ? `<div class="advice"><b>Lời khuyên</b><ul>${list.map((n) => `<li><i>${esc(n)}:</i> ${esc(LK.SAO[n])}</li>`).join('')}</ul></div>` : '';
  };
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
        ${state.showDv && pl.daiVan.length ? `<div class="c-luu c-dv">${pl.daiVan.map((n) => `<span>${esc(n)}</span>`).join('')}</div>` : ''}
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
      <span>Âm lịch <strong class="num">${a.day}/${a.month}${a.leap ? ' nhuận' : ''}</strong> năm ${tb.canChi.nam}, giờ ${tb.gioChi}</span>
      <button type="button" class="linkish" id="tv-to-bt">Xem Bát Tự</button>`;
    $('#who-keys').innerHTML = `
      <div class="key accent"><span>Mệnh tại ${menh.chiTen}</span><b>${chinh}</b></div>
      <div class="key"><span>Thân cư ${info('thanCu')}</span><b>${tb.thanCu}</b></div>
      <div class="key"><span>${tb.cucTen} ${info('cuc')}</span><b>${tb.banMenh}</b></div>
      <div class="key"><span>Đại hạn năm ${tb.namXem} ${info('daiHan')}</span><b>${dh ? dh.cung + ' ' + dh.daiHan + '–' + dh.daiHanEnd : 'Chưa vào'}</b></div>`;
  }

  // ---------- Bảng chi tiết cung ----------
  // Câu theo thế sáng / hãm của chính tinh
  function brightLine(s) {
    const inf = C.CHINH[s.name];
    if (!inf) return '';
    const sang = s.bright && ['M', 'V', 'Đ'].includes(s.bright);
    return sang ? `Ở thế ${C.BRIGHT_TEN[s.bright]}: ${inf[1]}.` : s.bright === 'H' ? `Ở thế hãm: ${inf[2]}.` : 'Ở thế bình hòa: tốt xấu tùy sao đi kèm.';
  }
  // Nghĩa chính tinh: có cung thì lấy nghĩa theo cung (kho nghĩa sao), không thì lấy tính chất chung
  function starLine(s, cung) {
    const inf = C.CHINH[s.name];
    if (!inf) return '';
    return `${(cung && N.cungOf(s.name, cung)) || inf[0]} ${brightLine(s)}`;
  }
  // Thẻ chính tinh trong bảng chi tiết cung; muon = cung xung chiếu khi cung đang xem vô chính diệu
  function majorCard(s, cung, muon) {
    const inf = C.CHINH[s.name];
    const o = N.cungOf(s.name, cung);
    return `<div class="major">
      <h3><span class="${HANH_CLASS[s.hanh] || ''}">${s.amDuong ? SIGN(s.amDuong) + ' ' : ''}${s.name}<small class="o-cung"> ở ${cung}${muon ? ` (mượn từ ${muon})` : ''}</small></span><span class="badge ${['M', 'V', 'Đ'].includes(s.bright) ? 'good' : s.bright === 'H' ? 'bad' : ''}">${s.bright ? BRIGHT_WORD[s.bright] : 'Không xét'}${s.hoa ? ', ' + s.hoa : ''}</span></h3>
      <p>${o || inf[0]}</p>
      <p class="bright-line">${brightLine(s)}</p>
      ${s.bright === 'H' ? advice(LK.CHINH_HAM[s.name]) : ''}
      ${o ? `<p class="gen">Tính chất chung: ${inf[0]}</p>` : ''}
    </div>`;
  }
  function starMeaning(name) {
    const base = name.replace(/^(L|ĐV)\./, '');
    const isLuu = name.startsWith('L.'), isDv = name.startsWith('ĐV.');
    // Chung: chính tinh lấy tính chất chung; phụ tinh lấy bản viết dài nếu có, không thì dòng ngắn
    const txt = C.CHINH[base] ? C.CHINH[base][0] : (N.PHU_DAI[base] || C.PHU[base] || 'Chưa có diễn giải cho sao này.');
    const tb = state.chart.thienBan, dh = tb.daiHanCung !== null ? state.chart.palaces[tb.daiHanCung] : null;
    const pre = isLuu ? `Sao lưu của năm ${tb.namXem}. ` : isDv && dh ? `Sao lưu của đại hạn ${dh.daiHan}–${dh.daiHanEnd} (cung ${dh.cung}, ${tb.daiVanCanChi}). ` : '';
    // Theo cung đang chọn: chính tinh theo từng cung, phụ tinh chủ chốt theo nhóm cung
    const cung = state.chart.palaces[state.selected].cung;
    const oCung = N.cungOf(base, cung), oNhom = N.phuCungOf(base, cung);
    const where = oCung ? { head: `Ở ${cung}`, text: oCung } : oNhom ? { head: `Ở ${cung} (nhóm ${N.nhomOf(cung).toLowerCase()})`, text: oNhom } : null;
    // Lời khuyên: hung tinh luôn có; chính tinh chỉ khi đang hãm ở cung này
    const ham = state.chart.palaces[state.selected].stars.some((s) => s.name === base && s.bright === 'H');
    const tip = LK.SAO[base] || (ham ? LK.CHINH_HAM[base] : null);
    return { title: (isLuu ? 'Lưu ' : isDv ? 'Lưu đại hạn ' : '') + base, text: pre + txt, where, tip };
  }
  function showStarNote(name) {
    const m = starMeaning(name);
    const box = $('#star-note');
    box.hidden = false;
    box.innerHTML = `<b>${esc(m.title)}</b><span>${esc(m.text)}</span>${m.where ? `<span class="sn-cung"><i>${esc(m.where.head)}:</i> ${esc(m.where.text)}</span>` : ''}${advice(m.tip)}`;
    $$('#inspector .chip').forEach((c) => c.setAttribute('aria-pressed', String(c.getAttribute('data-star') === name)));
  }
  function renderInspector() {
    const ch = state.chart, p = ch.palaces[state.selected], P = ch.palaces, tb = ch.thienBan;
    const rel = relations(p.chi);
    const chinh = p.stars.filter((s) => s.kind === 'chinh');
    const chip = (name, s) => `<button type="button" class="chip" data-star="${esc(name)}" aria-pressed="false"><span class="dot ${s && HANH_CLASS[s.hanh] || ''}"></span>${esc(name.replace(/^(L|ĐV)\./, ''))}${s && s.bright ? `<i>${s.bright}</i>` : ''}</button>`;
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
      <div class="majors">${chinh.length ? chinh.map((s) => majorCard(s, p.cung)).join('')
        : `<div class="major"><h3>Vô chính diệu ${info('vcd')}</h3><p>Cung không có chính tinh, theo lệ mượn chính tinh cung xung chiếu ${opp.cung}: ${opp.stars.filter((s) => s.kind === 'chinh').map((s) => s.name).join(', ') || 'cũng vô chính diệu'}. Nghĩa mượn nhẹ hơn sao đóng thẳng trong cung.</p></div>`
          + opp.stars.filter((s) => s.kind === 'chinh').map((s) => majorCard(s, p.cung, opp.cung)).join('')}</div>
      ${p.tuan || p.triet ? `<p class="ins-desc">Cung gặp ${[p.tuan ? 'Tuần' : '', p.triet ? 'Triệt' : ''].filter(Boolean).join(' và ')}: sao tốt giảm lực, sao xấu cũng bớt hại.</p>` : ''}
      <p class="tap-hint">Bấm vào một sao để xem nghĩa</p>
      <div class="group"><h4>Cát tinh ${info('catTinh')}</h4><div class="chips">${chips('cat') || '<span class="muted">Không có</span>'}</div></div>
      <div class="group"><h4>Hung tinh ${info('hungTinh')}</h4><div class="chips">${chips('hung') || '<span class="muted">Không có</span>'}</div></div>
      ${p.luuNien.length ? `<div class="group"><h4>Sao lưu năm ${tb.namXem} ${info('luuNien')}</h4><div class="chips">${p.luuNien.map((n) => chip(n, null)).join('')}</div></div>` : ''}
      ${p.daiVan.length ? `<div class="group"><h4>Sao lưu đại hạn ${info('daiVan')}</h4><div class="chips">${p.daiVan.map((n) => chip(n, null)).join('')}</div></div>` : ''}
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
    // Dải 10 năm của đại hạn đang mở (bấm một đại hạn để mở; mặc định là đại hạn đang chạy, chưa vào thì đại hạn đầu tiên)
    const open = ch.palaces[state.yearsOf ?? tb.daiHanCung ?? list[0].chi];
    const years = Array.from({ length: 10 }, (_, i) => {
      const age = open.daiHan + i, y = yearOfAge(age);
      if (y > MAX_YEAR) return '';
      return `<button type="button" class="yr${y === tb.namXem ? ' now' : ''}" data-year="${y}" aria-pressed="${y === tb.namXem}" title="Năm ${canChiNam(y)}, ${age} tuổi"><b class="num">${y}</b><span>${age} tuổi</span></button>`;
    }).join('');
    $('#years').innerHTML = `<span class="yr-lbl">Các năm của đại hạn ${open.cung} (${open.daiHan}–${open.daiHanEnd} tuổi)</span><div class="yr-row">${years}</div>`;
  }

  // ---------- Năm xem hạn ----------
  // Đổi năm = an lại lá số với năm mới (lá số gốc giữ nguyên, chỉ phần hạn và sao lưu đổi). Link cập nhật theo năm, không thêm bước lịch sử.
  const MAX_YEAR = 2199;
  const yearOfAge = (age) => state.chart.thienBan.amLich.year + age - 1;
  const canChiNam = (y) => `${E.CAN[(y + 6) % 10]} ${E.CHI[(y + 8) % 12]}`;
  function renderYearbar() {
    const tb = state.chart.thienBan, now = new Date().getFullYear();
    $('#y-num').textContent = tb.namXem;
    $('#y-sub').textContent = `${tb.namXemCanChi} · ${tb.tuoi} tuổi`;
    $('#y-prev').disabled = tb.namXem <= yearOfAge(1);
    $('#y-next').disabled = tb.namXem >= MAX_YEAR;
    $('#y-today').hidden = tb.namXem === now || now < yearOfAge(1);
  }
  function setYear(y) {
    y = Math.min(MAX_YEAR, Math.max(yearOfAge(1), y));
    if (!state.input || y === state.input.namXem) return;
    const inp = { ...state.input, namXem: y };
    state.input = inp; state.chart = E.compute(inp); state.yearsOf = null;
    renderWho(); renderYearbar(); renderChart(false); renderInspector(); renderTrack(); renderSummary();
    $('#json-out').textContent = chartJson();
    $('#ai-out').innerHTML = ''; $('#ai-ask').hidden = true; $('#ai-note').textContent = '';
    history.replaceState(null, '', '#' + toHash(inp));
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
        ${advice(LK.CACH[h.id] || (h.pha.length ? LK.PHA : ''))}
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
        ${advice([LK.TONG[tb.amDuongLy], LK.TONG[tb.quanHeMenhCuc]].filter(Boolean).join(' '))}
        <p>Mệnh đóng ở ${menh.chiTen}, Thân cư ${tb.thanCu} (${than.chiTen}): từ khoảng 30 tuổi trở đi, đời sống xoay quanh ${C.THAN_CU[tb.thanCu] || 'cung này'}.</p>
      </section>
      <section><h3>Cung Mệnh</h3>${borrow}
        <ul>${menhStars.map((s) => `<li><b>${s.name}</b>${s.hoa ? ` (${s.hoa})` : ''}: ${starLine(s, 'Mệnh')}${s.bright === 'H' ? advice(LK.CHINH_HAM[s.name]) : ''}</li>`).join('')}</ul>
        ${catIn(menh).length ? `<p>Cát tinh tại Mệnh: ${catIn(menh).join(', ')}.</p>` : ''}
        ${hungIn(menh).length ? `<p>Sát tinh tại Mệnh: ${hungIn(menh).join(', ')}.</p>${adviceStars(hungIn(menh))}` : ''}
        ${tt(menh) ? `<p>Mệnh gặp ${tt(menh)}: thời trẻ thường chậm hoặc trắc trở, càng về sau càng nhẹ.</p>${advice(LK.TONG.tuanTrietMenh)}` : ''}
      </section>
      ${ccSection()}
      <section><h3>Tam phương tứ chính</h3>
        <p>${tam.map((p) => `${p.cung} (${p.chiTen}): ${nameList(p)}`).join('; ')}.</p>
        <p>Bốn cung Mệnh, Tài, Quan, Di có ${cat.length} sao lục cát${cat.length ? ` (${cat.join(', ')})` : ''} và ${sat.length} sao lục sát${sat.length ? ` (${sat.join(', ')})` : ''}. ${cat.length > sat.length ? 'Cát nhiều hơn sát: thuận lợi, dễ được nâng đỡ.' : cat.length < sat.length ? 'Sát nhiều hơn cát: đời nhiều thử thách, thành công nhờ bản lĩnh.' : 'Cát và sát cân bằng.'}</p>
        ${cat.length < sat.length ? advice(LK.TONG.satNhieu) : ''}
      </section>
      <section><h3>Vận hạn</h3>
        ${dh ? `<p>Năm ${tb.namXem} (${tb.tuoi} tuổi) đang ở đại hạn ${dh.daiHan}–${dh.daiHanEnd} tại cung ${dh.cung} (${dh.chiTen}): ${nameList(dh)}. ${C.CUNG_Y[dh.cung]}</p>` : `<p>Năm ${tb.namXem} chưa vào đại hạn đầu tiên (bắt đầu từ ${tb.cuc} tuổi).</p>`}
        <p>Tiểu hạn năm ${tb.namXemCanChi} ở cung ${th.cung} (${th.chiTen}): ${nameList(th)}${catIn(th).length ? `, có ${catIn(th).join(', ')}` : ''}${hungIn(th).length ? `, gặp ${hungIn(th).join(', ')}` : ''}.</p>
        ${adviceStars(hungIn(th))}
      </section>
      <p class="note">Phần này ghép từ nghĩa cơ bản của từng sao theo sách truyền thống. Tử Vi chưa được khoa học chứng minh: hãy đọc như một góc nhìn để suy ngẫm, không dùng để quyết định việc lớn. ${info('docDung')} Muốn luận sâu hơn, dùng tab Luận giải AI.</p>`;
  }

  // ---------- Không rõ giờ sinh: xem nhanh 12 giờ ----------
  const firstSentence = (t) => (t.match(/^.*?[.!?](?=\s|$)/) || [t])[0];
  function showHours(inp) {
    let list;
    try { list = ALL_GIO.map((g) => ({ g, ch: E.compute({ ...inp, gio: g[0], hour: g[3], minute: g[4], exact: false }) })); }
    catch (e) { $('#form-error').textContent = e.message || 'Không an được lá số với dữ liệu này.'; $('#form-error').hidden = false; return false; }
    state.hoursInput = inp;
    const t0 = list[6].ch.thienBan, dl = t0.duongLich, a = t0.amLich; // giờ Ngọ: phần không phụ thuộc giờ
    $('#hv-facts').textContent = `${inp.name ? inp.name + ', ' + t0.gender.toLowerCase() : t0.gender}, sinh ngày ${pad(dl.day)}/${pad(dl.month)}/${dl.year} (âm lịch ${a.day}/${a.month}${a.leap ? ' nhuận' : ''} năm ${t0.canChi.nam}), mệnh ${t0.banMenh}. Dưới đây là cung Mệnh theo từng giờ sinh.`;
    $('#hv-grid').innerHTML = list.map(({ g, ch }) => {
      const t = ch.thienBan, P = ch.palaces, menh = P[t.menhCung];
      let chinh = menh.stars.filter((s) => s.kind === 'chinh'), muon = '';
      if (!chinh.length) { const opp = P[mod(t.menhCung + 6)]; chinh = opp.stars.filter((s) => s.kind === 'chinh'); muon = opp.cung; }
      const names = chinh.map((s) => s.name + (s.bright ? ` (${s.bright})` : '')).join(', ');
      const trait = chinh.length ? firstSentence(N.cungOf(chinh[0].name, 'Mệnh') || C.CHINH[chinh[0].name][0]) : '';
      return `<article class="hcard" data-buoi="${buoiOf(g[3])}">
        <h2><b>Giờ ${g[1]}</b><span>${g[2]} giờ</span></h2>
        <p class="hc-menh">Mệnh tại ${menh.chiTen}: <strong>${muon ? 'Vô chính diệu' : esc(names)}</strong>${muon ? `<span class="muted">, mượn ${esc(names) || 'chính tinh'} từ ${muon}</span>` : ''}</p>
        <p class="hc-meta">Thân cư ${t.thanCu} · ${t.cucTen}</p>
        ${trait ? `<p class="hc-trait">${esc(trait)}</p>` : ''}
        <button type="button" class="btn btn-sm" data-pick="${g[0]}">Xem lá số giờ ${g[1]}</button>
      </article>`;
    }).join('');
    filterHours();
    return true;
  }
  function filterHours() {
    const v = ($$('#hv-filter input').find((x) => x.checked) || {}).value || 'all';
    $$('#hv-grid .hcard').forEach((c) => { c.hidden = v !== 'all' && c.getAttribute('data-buoi') !== v; });
  }
  // Lá số đang xem là một giờ thử từ màn 12 giờ
  const tryingHour = () => !!state.fromHours && !!state.input && dayKey(state.input) === state.fromHours;
  function paintHourNote() {
    const on = tryingHour();
    $('#hour-note').hidden = !on;
    if (on) $('#hour-note-text').textContent = `Chưa rõ giờ sinh: đang xem thử giờ ${state.chart.thienBan.gioChi}.`;
  }

  // ---------- So sánh hai lá số ----------
  const MUC_TAG = { hop: ['Hợp', 't-hop'], binh: ['Bình', 't-binh'], ky: ['Kỵ', 't-ky'], tt: ['Tham khảo', 't-tt'] };
  function readCmp() {
    const g = ALL_GIO.find((x) => x[0] === $('#c-gio').value), am = $('#c-c-am').checked;
    return { name: $('#c-name').value.trim(), gender: $('#c-g-nu').checked ? 'nu' : 'nam', calendar: am ? 'am' : 'duong',
      day: +$('#c-day').value, month: +$('#c-month').value, year: +$('#c-year').value, leap: am && $('#c-leap').checked,
      gio: g ? g[0] : 'ngo', hour: g ? g[3] : 12, minute: g ? g[4] : 0, exact: false, noHour: !g,
      clockTz: 7, namXem: state.input.namXem, options: state.input.options };
  }
  function writeCmp(inp) {
    $('#c-name').value = inp.name || '';
    $(`#c-g-${inp.gender === 'nu' ? 'nu' : 'nam'}`).checked = true;
    $(`#c-c-${inp.calendar === 'am' ? 'am' : 'duong'}`).checked = true;
    $('#c-day').value = inp.day; $('#c-month').value = inp.month; $('#c-year').value = inp.year;
    $('#c-leap').checked = !!inp.leap; $('#c-leap-row').hidden = inp.calendar !== 'am';
    $('#c-gio').value = inp.noHour ? '' : (inp.gio || '');
  }
  function renderCmpRecent() {
    const list = loadRecent();
    $('#c-recent-wrap').hidden = !list.length;
    $('#c-recent').innerHTML = list.map((x, i) => `<button type="button" data-recent="${i}">${esc(x.name || 'Không tên')}, ${x.day}/${x.month}/${x.year}${x.calendar === 'am' ? ' âm lịch' : ''}</button>`).join('');
  }
  function runCompare(e) {
    if (e) e.preventDefault();
    const inp = readCmp(), err = $('#c-error');
    const fail = (msg) => { err.textContent = msg; err.hidden = false; };
    if (!inp.day || !inp.month || !inp.year) return fail('Nhập đủ ngày, tháng và năm sinh của người thứ hai.');
    if (inp.year < 1800 || inp.year > 2199) return fail('Năm sinh cần trong khoảng 1800 đến 2199.');
    let chB;
    try { chB = E.compute(inp); } catch (x) { return fail(x.message || 'Không an được lá số với dữ liệu này.'); }
    err.hidden = true;
    const tenA = state.chart.thienBan.name || 'Người thứ nhất';
    let tenB = inp.name || 'Người thứ hai';
    if (tenB === tenA) tenB += ' (2)';
    const gioA = !tryingHour(), gioB = !inp.noHour, qh = $('#c-qh').value;
    state.cmp = { inp, chart: chB, tenA, tenB, gioA, gioB, qh, res: SS.compare(state.chart, chB, { tenA, tenB, gioA, gioB, quanHe: qh }) };
    renderCompare();
  }
  function renderCompare() {
    const { res, chart: chB, tenA, tenB, gioA, gioB, qh } = state.cmp;
    const who = (t, ten, gio) => `<li><b>${esc(ten)}</b>: ${t.gender.toLowerCase()}, sinh ${pad(t.duongLich.day)}/${pad(t.duongLich.month)}/${t.duongLich.year}${gio ? `, giờ ${t.gioChi}` : ', chưa rõ giờ'}; tuổi ${t.canChi.nam}, mệnh ${t.banMenh}</li>`;
    const items = res.muc.map((m) => `<li class="cmp-item"><span class="cc-tag ${MUC_TAG[m.muc][1]}">${MUC_TAG[m.muc][0]}</span><b>${esc(m.ten)}</b><span class="cmp-text">${esc(m.text)}</span>${m.khuyen ? advice(LK.SO_SANH[m.khuyen]) : ''}</li>`).join('');
    const sat = (names) => names.filter((n) => C.LUC_SAT.includes(n) || n === 'Hóa Kỵ');
    const lq = res.lienQuan.map((x) => {
      const ten = (list) => list.map((s) => s.name + (s.bright ? ` (${s.bright})` : '')).join(', ');
      const goc = x.chinh.length ? x.chinh : (x.muon ? x.muon.chinh : []);
      const chinh = x.chinh.length ? ten(x.chinh) : `vô chính diệu${x.muon && x.muon.chinh.length ? `, mượn ${ten(x.muon.chinh)} từ ${x.muon.cung}` : ''}`;
      const y = goc.length ? N.cungOf(goc[0].name, x.cung) : '';
      const tt = [x.tuan ? 'Tuần' : '', x.triet ? 'Triệt' : ''].filter(Boolean).join(', ');
      return `<li><b>${esc(x.nguoi)}</b>, cung ${x.cung} tại ${x.chiTen}: ${chinh}${sat(x.hung).length ? `; gặp ${sat(x.hung).join(', ')}` : ''}${tt ? `; có ${tt}` : ''}.${y ? ` ${esc(y)}` : ''}${adviceStars(sat(x.hung))}</li>`;
    }).join('');
    const thieu = [gioA ? '' : tenA, gioB ? '' : tenB].filter(Boolean);
    $('#cmp-out').innerHTML = `
      <section><h3>${esc(tenA)} và ${esc(tenB)}</h3>
        <p class="muted">Mối quan hệ: ${res.quanHe.toLowerCase()}.</p>
        <ul class="cmp-who">${who(state.chart.thienBan, tenA, gioA)}${who(chB.thienBan, tenB, gioB)}</ul>
        <div class="cmp-score"><span class="t-hop">${res.dem.hop} hợp</span><span class="t-binh">${res.dem.binh} bình</span><span class="t-ky">${res.dem.ky} kỵ</span></div>
        <p><strong>${res.ketLuan}</strong></p>
        <ul class="cmp-list">${items}</ul>
      </section>
      ${lq ? `<section><h3>Cung ${SS.QUAN_HE[qh].cung.join(' và ')}</h3><ul>${lq}</ul></section>` : ''}
      ${thieu.length ? `<p class="note">Chưa rõ giờ sinh của ${esc(thieu.join(' và '))} nên bỏ qua phần cần cung Mệnh của người đó.</p>` : ''}
      <p class="note">Xem tuổi là cách nhìn truyền thống, chưa được khoa học chứng minh. Hợp hay không phụ thuộc nhiều nhất vào cách hai người đối xử với nhau; đừng dùng kết quả này để quyết định hôn nhân hay hợp tác. ${info('docDung')}</p>
      <p class="ai-bar"><button type="button" class="btn" id="btn-copy-cmp">Sao chép thông tin so sánh</button></p>`;
  }
  function compareText() {
    const { res, chart: chB, tenA, tenB, gioA, gioB } = state.cmp;
    const brief = (ch) => { const t = ch.thienBan; return `Giới tính: ${t.gender}; sinh ${t.duongLich.day}/${t.duongLich.month}/${t.duongLich.year}, chưa rõ giờ; âm lịch năm ${t.canChi.nam}; bản mệnh ${t.banMenh}`; };
    return 'Bạn là người xem tuổi và luận giải Tử Vi Đẩu Số theo phái Việt Nam. Hai lá số dưới đây đã được an sẵn bằng phần mềm; dùng đúng dữ liệu này, không tự an lại.\n'
      + `Hãy so sánh hai người cho mối quan hệ: ${res.quanHe.toLowerCase()}. Viết tiếng Việt, thẳng thắn và cụ thể; nêu cả điểm hợp lẫn điểm vênh, mỗi điểm vênh kèm một lời khuyên thực tế. `
      + 'Không phán định tuyệt đối, không khuyên cưới hay chia tay. Cuối bài nhắc một câu rằng xem tuổi là diễn giải truyền thống, chưa được khoa học chứng minh.\n\n'
      + `NGƯỜI THỨ NHẤT (${tenA}):\n${gioA ? chartText(state.chart, false) : brief(state.chart)}\n\n`
      + `NGƯỜI THỨ HAI (${tenB}):\n${gioB ? chartText(chB, false) : brief(chB)}\n\n`
      + 'KẾT QUẢ XEM TUỔI (phần mềm tính):\n' + res.muc.map((m) => `- ${m.ten} [${MUC_TAG[m.muc][0]}]: ${m.text}`).join('\n')
      + `\nTổng: ${res.dem.hop} hợp, ${res.dem.binh} bình, ${res.dem.ky} kỵ.`;
  }

  // ---------- Bát Tự ----------
  // Ảnh con giáp và thiên can (assets/con-giap, assets/can; cắt bằng scripts/cat-icon.py)
  const CHI_FILE = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi'];
  const CAN_FILE = ['giap', 'at', 'binh', 'dinh', 'mau', 'ky', 'canh', 'tan', 'nham', 'quy'];
  const icoChi = (i, cls = '') => `<img class="ico ${cls}" src="assets/con-giap/${CHI_FILE[i]}.webp" alt="${BT.CON_GIAP[i]}" title="${E.CHI[i]}: ${BT.CON_GIAP[i]}" width="48" height="48" loading="lazy">`;
  const icoCan = (i, cls = '') => `<img class="ico ${cls}" src="assets/can/${CAN_FILE[i]}.webp" alt="${E.CAN[i]}: ${BT.HO_SO[i].hinh}" title="${E.CAN[i]}: ${BT.HO_SO[i].hinh}" width="48" height="48" loading="lazy">`;
  const TT_TAT = { 'Tỷ Kiên': 'Tỷ', 'Kiếp Tài': 'Kiếp', 'Thực Thần': 'Thực', 'Thương Quan': 'Thương', 'Thiên Tài': 'T.Tài', 'Chính Tài': 'C.Tài', 'Thất Sát': 'Sát', 'Chính Quan': 'Quan', 'Thiên Ấn': 'Kiêu', 'Chính Ấn': 'Ấn' };
  const MANH_TEN = { vuong: 'thiên mạnh', hoa: 'tương đối cân bằng', nhuoc: 'thiên yếu' };
  const ngayGioTxt = (d) => `${pad(d.hour)}:${pad(d.minute)} ngày ${pad(d.day)}/${pad(d.month)}/${d.year}`;
  function computeBt(inp) {
    try { state.bt = BT.compute(inp); }
    catch (e) { $('#form-error').textContent = e.message || 'Không lập được Bát Tự với dữ liệu này.'; $('#form-error').hidden = false; return false; }
    state.btInput = inp; state.btDv = null;
    $('#form-error').hidden = true;
    renderBt();
    return true;
  }
  function renderBt() {
    const r = state.bt, dl = r.duongLich, a = r.amLich, nc = r.nhatChu, nh = r.nguHanh;
    const nam = r.tru[0];
    $('#bt-name').textContent = r.ten || 'Bát Tự chưa đặt tên';
    $('#bt-facts').innerHTML = `<span><strong>${r.gioiTinh}</strong></span>
      <span>Dương lịch <strong class="num">${pad(dl.day)}/${pad(dl.month)}/${dl.year}</strong>${r.noHour ? ', không rõ giờ' : `, ${pad(dl.hour)}:${pad(dl.minute)}`}</span>
      <span>Âm lịch <strong class="num">${a.day}/${a.month}${a.leap ? ' nhuận' : ''}</strong> năm ${LunarVN.name(LunarVN.yearCanChi(a.year))}</span>
      <button type="button" class="linkish" id="bt-to-tv">Xem lá số Tử Vi</button>`;
    $('#bt-keys').innerHTML = `
      <div class="key accent"><span>Nhật chủ ${info('btNhatChu')}</span><b class="${HANH_CLASS[nc.hanh]}">${icoCan(nc.can, 'ico-sm')} ${nc.ten} ${nc.hanh}</b></div>
      <div class="key"><span>Tuổi (theo Lập Xuân) ${info('btTiet')}</span><b>${icoChi(nam.chi, 'ico-sm')} ${r.tuoi}</b></div>
      <div class="key"><span>Nạp âm năm ${info('btNapAm')}</span><b>${r.napAmNam.ten}</b></div>
      <div class="key"><span>Khởi đại vận ${info('btDaiVan')}</span><b>${r.khoiVan.tuoi} tuổi, năm ${r.khoiVan.year}</b></div>`;
    const sat = [r.tiet.luc, r.tiet.keLuc].some((t) => t.day === dl.day && t.month === dl.month && t.year === dl.year);
    $('#bt-tiet').textContent = `Sinh sau tiết ${r.tiet.ten} (${ngayGioTxt(r.tiet.luc)}), trước tiết ${r.tiet.ke} (${ngayGioTxt(r.tiet.keLuc)}).${sat ? ' Sinh đúng ngày giao tiết: giờ sinh lệch vài chục phút có thể đổi trụ tháng.' : ''}`;

    // Bảng tứ trụ: Giờ, Ngày, Tháng, Năm (thứ tự truyền thống, năm ở bên phải). Bấm thập thần, Trường Sinh, thần sát để xem nghĩa.
    const cols = [r.tru[3], r.tru[2], r.tru[1], r.tru[0]];
    const sao = (p) => r.thanSat.filter((t) => t.tru.includes(p.ten)).map((t) => t.ten);
    const tap = (attr, val, html) => `<button type="button" class="bt-tap" data-${attr}="${esc(val)}">${html}</button>`;
    const rows = [
      [`Thập thần ${info('btThapThan')}`, (p) => (p.ten === 'Ngày' ? tap('nc', '1', '<b>Nhật chủ</b>') : tap('tt', p.thapThan, p.thapThan))],
      ['Thiên can', (p) => `${icoCan(p.can, 'bt-ico')}<span class="bt-big ${HANH_CLASS[p.canHanh]}">${p.canAD}${CAN_NAME(p.can)}</span><small class="${HANH_CLASS[p.canHanh]}">${p.canHanh}</small>`],
      ['Địa chi', (p) => `${icoChi(p.chi, 'bt-ico')}<span class="bt-big ${HANH_CLASS[p.chiHanh]}">${p.chiAD}${E.CHI[p.chi]}</span><small class="${HANH_CLASS[p.chiHanh]}">${p.chiHanh}</small>`],
      [`Tàng can ${info('btTangCan')}`, (p) => p.tangCan.map((t) => tap('tt', t.thapThan, `<span class="${HANH_CLASS[t.hanh]}">${t.ten}</span> <i>${TT_TAT[t.thapThan]}</i>`)).join('')],
      [`Trường sinh ${info('btTruongSinh')}`, (p) => tap('tsi', p.truongSinh, p.truongSinh)],
      [`Nạp âm ${info('btNapAm')}`, (p) => p.napAm],
      [`Thần sát ${info('btThanSat')}`, (p) => sao(p).map((t) => tap('ts', t, t)).join('') || '<span class="muted">–</span>'],
    ];
    const head = ['Giờ', 'Ngày', 'Tháng', 'Năm'].map((t, i) => `<div class="bt-c bt-head${i === 1 ? ' is-day' : ''}">${t}${cols[i] ? `<small>${cols[i].canChi}</small>` : '<small>không rõ</small>'}</div>`).join('');
    $('#bt-pillars').innerHTML = `<div class="bt-grid"><div class="bt-lbl"></div>${head}${rows.map(([lbl, f]) => `<div class="bt-lbl">${lbl}</div>${cols.map((p, i) => `<div class="bt-c${i === 1 ? ' is-day' : ''}">${p ? f(p) : '<span class="muted">?</span>'}</div>`).join('')}`).join('')}</div>
      <div class="star-note" id="bt-note" hidden></div>`;
    $('#bt-extra').innerHTML = [r.thaiNguyen, r.menhCung].filter(Boolean).map((p) => `<span><b>${p.ten}</b> ${p.canChi} <span class="muted">(${p.napAm})</span></span>`).join('') + info('btThai')
      + (r.noHour ? '<span class="muted">Không rõ giờ nên chưa có trụ Giờ và Mệnh cung; phần ngũ hành chỉ tính sáu chữ.</span>' : '');

    // Đại vận
    $('#bt-dv-note').textContent = `${r.thuan ? 'Đi thuận' : 'Đi nghịch'}; ${r.khoiVan.ngayToiTiet} ngày tới tiết, chia 3 ra số năm khởi vận (khoảng tháng ${r.khoiVan.month}/${r.khoiVan.year}).`;
    $('#bt-dv').innerHTML = r.daiVan.map((v, i) => `<button type="button" class="seg${v === r.dvNay ? ' now' : ''}" data-dv="${i}" aria-pressed="false" title="${v.canChi}: ${v.thapThan}, ${v.truongSinh}">
      <span class="age">${v.namBatDau} · ${v.tuoi} tuổi</span><b><span class="${HANH_CLASS[v.canHanh]}">${CAN_NAME(v.can)}</span> <span class="${HANH_CLASS[v.chiHanh]}">${E.CHI[v.chi]}</span></b><span>${v.thapThan}</span><span>${v.truongSinh}</span></button>`).join('');
    renderBtYears();

    // Phần luận
    const hs = BT.HO_SO[nc.can];
    const max = Math.max(...Object.values(nh.diem), 0.1);
    const bars = BT.HANH.map((x) => `<div class="bt-bar"><span class="${HANH_CLASS[x]}">${x}</span><span class="bt-meter"><i class="${HANH_CLASS[x]}" style="width:${Math.round((nh.diem[x] / max) * 100)}%"></i></span><b class="num">${nh.diem[x]}</b><small>${nh.dem[x]} chữ</small></div>`).join('');
    const tt = {};
    r.tru.filter(Boolean).forEach((p) => { if (p.ten !== 'Ngày') tt[p.thapThan] = (tt[p.thapThan] || 0) + 1; tt[p.tangCan[0].thapThan] = (tt[p.tangCan[0].thapThan] || 0) + 1; });
    const ttList = Object.entries(tt).sort((x, y) => y[1] - x[1]).map(([t, n]) => `<li><b>${t}</b> ×${n}: ${BT.THAP_THAN[t][0]}${n >= 2 ? ` <span class="muted">Khi nhiều: ${BT.THAP_THAN[t][1]}</span>${advice(BT.THAP_THAN[t][2])}` : ''}</li>`).join('');
    const ln = r.luuNien(r.namXem), dv = r.dvNay, qh = SS.chiQuanHe(ln.chi, r.tru[2].chi).loai;
    const lnQh = {
      xung: ['Chi năm xung chi ngày: năm nhiều thay đổi, dễ xáo trộn chỗ ở, công việc hoặc chuyện tình cảm.', 'Có kế hoạch dự phòng, tránh quyết định lớn vội vàng; giữ hòa khí trong nhà.'],
      hai: ['Chi năm hại chi ngày: dễ phật ý, hiểu lầm vì chuyện nhỏ.', 'Nói rõ điều mình cần, đừng để bực bội tích lại; cẩn thận giấy tờ.'],
      tamHop: ['Chi năm tam hợp chi ngày: năm dễ có người giúp, quan hệ thuận.', ''],
      lucHop: ['Chi năm lục hợp chi ngày: năm dễ gắn kết, có tin vui về quan hệ.', ''],
      trung: ['Chi năm trùng chi ngày: chuyện cũ dễ lặp lại, nên rút kinh nghiệm từ lần trước.', ''],
    }[qh];
    const theHien = { vuong: 'Nhật chủ thiên mạnh nên các nét trên thường thể hiện rõ.', hoa: 'Nhật chủ tương đối cân bằng nên các nét trên thể hiện ở mức vừa.', nhuoc: 'Nhật chủ thiên yếu nên các nét trên thường thể hiện nhẹ hơn, pha thêm tính chất của các hành khác.' }[nh.manh];
    $('#bt-body').innerHTML = `
      <section class="bt-hero">
        <div class="bt-badge ${HANH_CLASS[nc.hanh]}">${icoCan(nc.can, 'bt-badge-img')}<b aria-hidden="true"><i>${BT.HAN_HANH[nc.hanh]}</i></b></div>
        <div><h3>Nhật chủ ${nc.ten} ${nc.hanh} ${info('btNhatChu')}</h3>
          <p class="muted">${nc.ad === '+' ? 'Dương' : 'Âm'} ${nc.hanh}, hình ảnh ${hs.hinh}</p>
          <p>${hs.moTa}</p></div>
      </section>
      <section><h3>Những nét tính cách nổi bật</h3>
        <div class="bt-two">
          <div><h4 class="t-hop">Điểm mạnh</h4><ul>${hs.tot.map((x) => `<li>${x}</li>`).join('')}</ul></div>
          <div><h4 class="t-ky">Điểm cần lưu ý</h4><ul>${hs.xau.map((x) => `<li>${x}</li>`).join('')}</ul></div>
        </div>
        <p class="muted">${theHien} Phần này chỉ dựa trên nhật chủ, là một phần nhỏ của cả lá số.</p>
      </section>
      <section><h3>Ngũ hành ${info('btNguHanh')}</h3>
        <div class="bt-hanh">${radarSvg(r)}<div class="bt-bars">${bars}</div></div>
        <p>${nh.thieu.length ? `Không có hành ${nh.thieu.join(', ')} trong ${r.noHour ? 'sáu' : 'tám'} chữ.` : `Đủ cả năm hành trong ${r.noHour ? 'sáu' : 'tám'} chữ.`} Nhật chủ ${nc.ten} ${nc.hanh} ${nh.duocLenh ? 'được' : 'không được'} lệnh tháng; phe trợ giúp (cùng hành và hành sinh ra nhật chủ) chiếm khoảng ${nh.tyLe}%: nhật chủ ${MANH_TEN[nh.manh]}. ${info('btManh')}</p>
        <p>${BT.MANH_Y[nh.manh]}</p>
        <p><b>Hành nên bổ sung (ước lượng):</b> ${nh.hy.join(', ')}. Theo quan niệm truyền thống có thể bổ khuyết bằng:</p>
        <ul>${nh.hy.map((x) => `<li><b class="${HANH_CLASS[x]}">${BT.HAN_HANH[x]} ${x}</b>: ${BT.HANH_BO[x]}</li>`).join('')}</ul>
        <p class="note">Cách ước lượng mạnh yếu ở đây đơn giản (đếm điểm ngũ hành và lệnh tháng). Xác định dụng thần thật sự còn cần xét cách cục, điều hậu, hợp hóa; nên hỏi thêm người có chuyên môn.</p>
      </section>
      <section><h3>Thập thần trên lá số ${info('btThapThan')}</h3><p class="muted">Đếm thiên can các trụ (trừ nhật chủ) và bản khí của địa chi.</p><ul>${ttList}</ul></section>
      <section><h3>Năm ${r.namXem} ${info('btLuuNien')}</h3>
        <p>Năm ${ln.canChi} (${icoChi(ln.chi, 'ico-sm')} ${BT.CON_GIAP[ln.chi]}): can ${CAN_NAME(ln.can)} là ${ln.thapThan}, chi ${E.CHI[ln.chi]} (bản khí ${ln.tangCan[0].ten}) là ${ln.tangCan[0].thapThan} với nhật chủ. ${dv ? `Đang ở đại vận ${dv.canChi} (${dv.namBatDau}–${dv.namBatDau + 9}), can vận là ${dv.thapThan}.` : 'Chưa vào đại vận đầu tiên.'}${nh.hy.includes(ln.canHanh) ? ` Can năm hành ${ln.canHanh}, thuộc nhóm hành nên bổ sung: thường được xem là năm thuận.` : ''}</p>
        ${lnQh ? `<p>${lnQh[0]}</p>${advice(lnQh[1])}` : ''}
      </section>
      <section><h3>Thần sát chính ${info('btThanSat')}</h3>
        <p class="muted">Quý Nhân, Văn Xương, Lộc, Dương Nhận tra theo can ngày; Đào Hoa, Dịch Mã, Hoa Cái theo chi ngày; Không Vong theo trụ ngày.</p>
        <ul>${r.thanSat.map((t) => `<li><b>${t.ten}</b> (${t.chi.join(', ')}): ${t.tru.length ? `có ở trụ ${t.tru.join(', ')}` : '<span class="muted">không có trong tứ trụ</span>'}. ${BT.THAN_SAT_Y[t.ten]}${t.tru.length ? advice(BT.THAN_SAT_KHUYEN[t.ten]) : ''}</li>`).join('')}</ul>
      </section>
      <p class="note">Bát Tự là một cách diễn giải truyền thống, chưa được khoa học chứng minh: hãy đọc như một góc nhìn để suy ngẫm, không dùng để quyết định việc lớn. ${info('docDung')}</p>
      <p class="ai-bar"><button type="button" class="btn" id="bt-copy">Sao chép thông tin</button></p>`;
  }
  // Biểu đồ ngũ giác ngũ hành: Hỏa trên cùng, đi theo vòng tương sinh Hỏa → Thổ → Kim → Thủy → Mộc
  function radarSvg(r) {
    const nh = r.nguHanh, H = r.nhatChu.hanh, order = ['Hỏa', 'Thổ', 'Kim', 'Thủy', 'Mộc'];
    const tong = BT.HANH.reduce((s, x) => s + nh.diem[x], 0) || 1;
    const pct = Object.fromEntries(order.map((x) => [x, Math.round((nh.diem[x] / tong) * 100)]));
    const scale = Math.max(40, Math.ceil(Math.max(...Object.values(pct)) / 10) * 10);
    const cx = 170, cy = 182, R = 92;
    const pt = (i, f) => { const g = ((-90 + i * 72) * Math.PI) / 180; return [cx + Math.cos(g) * R * f, cy + Math.sin(g) * R * f]; };
    const xy = (p) => p.map((v) => v.toFixed(1)).join(',');
    const poly = (f) => order.map((_, i) => xy(pt(i, f))).join(' ');
    const grid = [0.25, 0.5, 0.75, 1].map((f) => `<polygon points="${poly(f)}" class="rd-grid"/>`).join('')
      + order.map((_, i) => { const [x, y] = pt(i, 1); return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="rd-grid"/>`; }).join('');
    const f = (x) => Math.max(pct[x], 2) / scale;
    const dots = order.map((x, i) => { const [px, py] = pt(i, f(x)); return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.5" class="${HANH_CLASS[x]}" fill="currentColor"/>`; }).join('');
    const labels = order.map((x, i) => {
      const [lx, ly] = pt(i, 1.36), top = i === 0;
      return `<g class="${HANH_CLASS[x]}" transform="translate(${lx.toFixed(1)} ${ly.toFixed(1)})">
        ${x === H ? '<circle r="20" class="rd-ring"/>' : ''}<circle r="15" fill="currentColor"/><text class="rd-han" dy="5.5">${BT.HAN_HANH[x]}</text>
        <text class="rd-name" y="${top ? -36 : 33}">${x} ${pct[x]}%</text><text class="rd-sub" y="${top ? -23 : 47}">${BT.nhomTT(H, x)}</text></g>`;
    }).join('');
    return `<svg class="bt-radar" viewBox="0 0 340 352" role="img" aria-label="Biểu đồ ngũ hành: ${order.map((x) => `${x} ${pct[x]}%`).join(', ')}">${grid}
      <polygon points="${order.map((x, i) => xy(pt(i, f(x)))).join(' ')}" class="rd-area"/>${dots}${labels}</svg>`;
  }
  function showBtNote(title, text, tip) {
    const box = $('#bt-note');
    box.hidden = false;
    box.innerHTML = `<b>${esc(title)}</b><span>${esc(text)}</span>${advice(tip)}`;
  }
  const CAN_NAME = (i) => E.CAN[i];
  // Dải 10 năm của đại vận đang mở (mặc định đại vận hiện tại)
  function renderBtYears() {
    const r = state.bt, i = state.btDv ?? Math.max(0, r.daiVan.indexOf(r.dvNay));
    const v = r.daiVan[i];
    $$('#bt-dv .seg').forEach((b, k) => { b.classList.toggle('sel', k === i); b.setAttribute('aria-pressed', String(k === i)); });
    $('#bt-years').innerHTML = `<span class="yr-lbl">Các năm của đại vận ${v.canChi} (${v.namBatDau}–${v.namBatDau + 9})</span><div class="yr-row">${Array.from({ length: 10 }, (_, j) => {
      const y = v.namBatDau + j; if (y > 2199) return '';
      const p = r.luuNien(y);
      return `<button type="button" class="yr${y === r.namXem ? ' now' : ''}" data-year="${y}" aria-pressed="${y === r.namXem}" title="${p.canChi}: ${p.thapThan}"><b class="num">${y}</b><span>${p.canChi}</span><span>${TT_TAT[p.thapThan]}</span></button>`;
    }).join('')}</div>`;
  }
  function setBtYear(y) {
    if (y < 1800 || y > 2199 || y === state.btInput.namXem) return;
    const keep = state.btDv;
    state.btInput = { ...state.btInput, namXem: y }; state.bt = BT.compute(state.btInput); state.btDv = keep;
    renderBt();
    history.replaceState(null, '', '#' + toBtHash(state.btInput));
  }
  function btText() {
    const r = state.bt, dl = r.duongLich;
    const tru = r.tru.map((p) => (p ? `- Trụ ${p.ten}: ${p.canChi} (${p.canHanh}, ${p.chiHanh}); can là ${p.thapThan}; tàng can ${p.tangCan.map((t) => `${t.ten} ${t.thapThan}`).join(', ')}; ${p.truongSinh}; nạp âm ${p.napAm}` : '- Trụ Giờ: không rõ')).join('\n');
    return 'Bạn là người luận Bát Tự (Tứ Trụ). Lá số dưới đây đã được lập sẵn bằng phần mềm (trụ năm đổi ở Lập Xuân, trụ tháng theo tiết khí); dùng đúng dữ liệu này, không tự lập lại.\n'
      + 'Viết tiếng Việt, thẳng thắn và cụ thể: tính cách theo nhật chủ, mạnh yếu và dụng thần, sự nghiệp, tài lộc, tình cảm, sức khỏe nên giữ gìn, đại vận hiện tại và năm đang xem. Mỗi điểm xấu kèm một lời khuyên thực tế. '
      + 'Không phán định tuyệt đối, không chẩn đoán bệnh hay khuyên đầu tư cụ thể. Cuối bài nhắc một câu rằng Bát Tự là diễn giải truyền thống, chưa được khoa học chứng minh.\n\n'
      + `LÁ SỐ BÁT TỰ:\nGiới tính: ${r.gioiTinh}; sinh ${dl.day}/${dl.month}/${dl.year}${r.noHour ? ', không rõ giờ' : ` ${pad(dl.hour)}:${pad(dl.minute)} giờ Việt Nam`}; sinh sau tiết ${r.tiet.ten}\n`
      + `Nhật chủ: ${r.nhatChu.ten} ${r.nhatChu.hanh}\n${tru}\n`
      + `Thai nguyên: ${r.thaiNguyen.canChi}${r.menhCung ? `; Mệnh cung: ${r.menhCung.canChi}` : ''}\n`
      + `Ngũ hành (điểm, có tính tàng can): ${BT.HANH.map((x) => `${x} ${r.nguHanh.diem[x]}`).join(', ')}; phần mềm ước lượng nhật chủ ${MANH_TEN[r.nguHanh.manh]}\n`
      + `Đại vận (${r.thuan ? 'thuận' : 'nghịch'}, khởi ${r.khoiVan.tuoi} tuổi năm ${r.khoiVan.year}): ${r.daiVan.map((v) => `${v.namBatDau} ${v.canChi}`).join('; ')}\n`
      + `Năm xem: ${r.namXem} (${r.luuNien(r.namXem).canChi})${r.dvNay ? `, đang ở đại vận ${r.dvNay.canChi}` : ''}\n`
      + `Thần sát trong tứ trụ: ${r.thanSat.filter((t) => t.tru.length).map((t) => `${t.ten} ở trụ ${t.tru.join(', ')}`).join('; ') || 'không có'}\n\nHãy luận giải lá số Bát Tự này.`;
  }

  // ---------- Góp ý (worker/gop-y.mjs) ----------
  const GY = { items: [], conNua: false, sao: 0, daTai: false, ban: false, moi: new Set(), timer: null };
  const GY_TEN_KEY = 'tuvi.gopy.ten';
  const GY_CHU_KY = 20000; // tự cập nhật mỗi 20 giây khi bảng góp ý đang mở
  const saoTxt = (n) => `<span class="gy-st" role="img" aria-label="${n} trên 5 sao">${'★'.repeat(n)}<i>${'★'.repeat(5 - n)}</i></span>`;
  const gyUrl = (truoc) => { const u = new URL(CFG.feedbackEndpoint, location.href); if (truoc) u.searchParams.set('truoc', truoc); return u.href; };
  // kieu: 'dau' tải lần đầu, 'them' trang tiếp theo, 'moi' lặng lẽ lấy trang đầu để cập nhật (góp ý mới, góp ý vừa bị ẩn)
  async function gyLoad(kieu) {
    if (GY.ban) return;
    GY.ban = true; $('#gy-more').disabled = true;
    if (kieu === 'dau') $('#gy-list').innerHTML = '<p class="muted">Đang tải góp ý…</p>';
    try {
      const res = await fetch(gyUrl(kieu === 'them' ? GY.items[GY.items.length - 1].id : null));
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      if (kieu === 'them') GY.items = [...GY.items, ...d.items];
      else if (kieu === 'moi' && GY.daTai) {
        const cu = new Set(GY.items.map((x) => x.id)), cuoi = d.items.length ? d.items[d.items.length - 1].id : Infinity;
        GY.moi = new Set(d.items.filter((x) => !cu.has(x.id)).map((x) => x.id));
        GY.items = [...d.items, ...(d.conNua ? GY.items.filter((x) => x.id < cuoi) : [])];
      } else GY.items = d.items;
      if (kieu !== 'them') GY.conNua = d.conNua || (kieu === 'moi' && GY.conNua && GY.items.length > d.items.length);
      GY.tk = d; GY.daTai = true;
      gyRender();
    } catch {
      if (kieu === 'dau') $('#gy-list').innerHTML = '<p class="muted">Chưa tải được góp ý. Kiểm tra mạng rồi mở lại.</p>';
      else if (kieu === 'them') toast('Chưa tải thêm được góp ý.');
    } finally { GY.ban = false; $('#gy-more').disabled = false; }
  }
  function gyRender() {
    const d = GY.tk;
    $('#gy-sum').innerHTML = d.tong ? `<div class="gy-avg"><b class="num">${d.trungBinh.toFixed(1)}</b>${saoTxt(Math.round(d.trungBinh))}<small>${d.tong} đánh giá</small></div>
      <div class="gy-bars">${[5, 4, 3, 2, 1].map((k) => `<div><span>${k} ★</span><span class="bt-meter"><i style="width:${Math.round((d.dem[k] / d.tong) * 100)}%"></i></span><small class="num">${d.dem[k]}</small></div>`).join('')}</div>`
      : '<p class="muted">Chưa có góp ý nào. Bạn là người đầu tiên nhé!</p>';
    const ngay = (t) => { const x = new Date(t); return `${pad(x.getDate())}/${pad(x.getMonth() + 1)}/${x.getFullYear()}`; };
    $('#gy-list').innerHTML = GY.items.length ? `<h3 class="gy-h">Mọi người nói gì</h3><ul class="gy-items">${GY.items.map((c) => `<li${GY.moi.has(c.id) ? ' class="is-new"' : ''}><div class="gy-meta"><b>${esc(c.ten)}</b>${saoTxt(c.sao)}<small>${ngay(c.luc)}</small></div><p>${esc(c.noiDung)}</p></li>`).join('')}</ul>` : '';
    $('#gy-more').hidden = !GY.conNua;
  }
  function gyPaint() { $$('#gy-pick button').forEach((b) => { const v = +b.getAttribute('data-sao'); b.classList.toggle('on', v <= GY.sao); b.setAttribute('aria-pressed', String(v === GY.sao)); }); }
  function gyOpen() {
    $('#gy-dialog').hidden = false; document.documentElement.classList.add('no-scroll');
    try { if (!$('#gy-ten').value) $('#gy-ten').value = localStorage.getItem(GY_TEN_KEY) || ''; } catch { /* bỏ qua */ }
    $('#gy-ok').textContent = ''; $('#gy-err').hidden = true;
    ($('#gy-ten').value ? $('#gy-pick button') : $('#gy-ten')).focus();
    GY.moi = new Set();
    gyLoad(GY.daTai ? 'moi' : 'dau');
    clearInterval(GY.timer);
    GY.timer = setInterval(() => { if (!document.hidden) gyLoad('moi'); }, GY_CHU_KY);
  }
  function gyClose() { clearInterval(GY.timer); GY.timer = null; $('#gy-dialog').hidden = true; document.documentElement.classList.remove('no-scroll'); $('#btn-gopy').focus(); }
  async function gySend(e) {
    e.preventDefault();
    const ten = $('#gy-ten').value.trim(), noiDung = $('#gy-nd').value.trim(), err = $('#gy-err');
    const fail = (m) => { err.textContent = m; err.hidden = false; };
    if (!ten) return fail('Nhập tên của bạn.');
    if (!GY.sao) return fail('Chọn số sao đánh giá.');
    if (noiDung.length < 3) return fail('Viết vài chữ góp ý nhé.');
    err.hidden = true; $('#gy-gui').disabled = true;
    try {
      const res = await fetch(gyUrl(), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ten, sao: GY.sao, noiDung, web: $('#gy-web').value }) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) return fail(d.error || 'Chưa gửi được, thử lại sau.');
      try { localStorage.setItem(GY_TEN_KEY, ten); } catch { /* bỏ qua */ }
      $('#gy-nd').value = ''; $('#gy-dem').textContent = '0/1000'; GY.sao = 0; gyPaint();
      $('#gy-ok').textContent = d.choDuyet ? 'Cảm ơn bạn! Góp ý sẽ hiện sau khi được duyệt.' : 'Cảm ơn bạn đã góp ý!';
      if (!d.choDuyet) gyLoad('moi');
    } catch { fail('Không kết nối được, kiểm tra mạng rồi thử lại.'); }
    finally { $('#gy-gui').disabled = false; }
  }

  // ---------- Dữ liệu cho AI và JSON ----------
  function chartText(ch = state.chart, withCc = true) {
    const tb = ch.thienBan;
    const lines = [
      `Giới tính: ${tb.gender} (${tb.amDuong}); sinh ${tb.duongLich.day}/${tb.duongLich.month}/${tb.duongLich.year} ${pad(tb.duongLich.hour)}:${pad(tb.duongLich.minute)} giờ Việt Nam`,
      `Âm lịch: ngày ${tb.amLich.day} tháng ${tb.amLich.month}${tb.amLich.leap ? ' nhuận' : ''} năm ${tb.canChi.nam}; tháng ${tb.canChi.thang}, ngày ${tb.canChi.ngay}, giờ ${tb.canChi.gio}`,
      `Bản mệnh: ${tb.banMenh}; ${tb.cucTen}; ${tb.quanHeMenhCuc}; ${tb.amDuongLy}; Mệnh chủ ${tb.menhChu}, Thân chủ ${tb.thanChu}; Thân cư ${tb.thanCu}`,
      `Năm xem: ${tb.namXem} (${tb.namXemCanChi}), ${tb.tuoi} tuổi âm; đại hạn hiện tại: ${tb.daiHanCung !== null ? `${ch.palaces[tb.daiHanCung].cung} (can chi cung ${tb.daiVanCanChi})` : 'chưa vào'}; tiểu hạn: cung ${ch.palaces[tb.tieuHanCung].cung}`,
      'Mười hai cung (tên cung, can chi, đại hạn, chính tinh, cát tinh, hung tinh, Tràng Sinh, sao lưu năm xem):',
    ];
    Array.from({ length: 12 }, (_, i) => mod(tb.menhCung + i)).forEach((chi) => {
      const p = ch.palaces[chi];
      const f = (k) => p.stars.filter((s) => s.kind === k).map((s) => s.name + (s.bright ? `(${s.bright})` : '')).join(', ') || '—';
      lines.push(`- ${p.cung}${p.isThan ? ' [Thân]' : ''} | ${p.canTen} ${p.chiTen} | ĐH ${p.daiHan}-${p.daiHanEnd} | Chính: ${f('chinh')} | Cát: ${f('cat')} | Hung: ${f('hung')} | ${p.trangSinh}${p.tuan ? ' | Tuần' : ''}${p.triet ? ' | Triệt' : ''}${p.luuNien.length ? ' | Lưu: ' + p.luuNien.join(', ') : ''}${p.daiVan.length ? ' | Lưu đại hạn: ' + p.daiVan.join(', ') : ''}`);
    });
    if (withCc && state.cc) lines.push('Cách cục (máy nhận diện theo cung Mệnh): ' + (ccAll().map((h) => `${h.ten} [${CC_TAG[h.nhom]}${h.pha.length ? ', bị phá bởi ' + h.pha.join(', ') : ''}] (${h.canCu})`).join('; ') || 'không có'));
    return lines.join('\n');
  }
  const chartJson = () => JSON.stringify({ version: 1, school: 'vn', input: state.chart.input, thien_ban: state.chart.thienBan, dia_ban: state.chart.palaces, cach_cuc: state.cc }, null, 2);

  // ---------- AI ----------
  const rules = () => 'Bạn là người luận giải Tử Vi Đẩu Số theo phái Việt Nam. Lá số dưới đây đã được an sẵn bằng phần mềm; dùng đúng dữ liệu này, không tự an lại.\n'
    + 'Viết tiếng Việt, giọng điềm đạm, thẳng thắn và cụ thể. Mỗi nhận định nêu rõ sao hoặc cung làm căn cứ. '
    + 'Nêu điểm xấu rõ ràng và ngang hàng với điểm tốt, không nói giảm, không khen để làm vui lòng người xem; sao hãm, sát tinh, Hóa Kỵ, hung cách thì nói thẳng ảnh hưởng của chúng. '
    + 'Tránh những câu chung chung ai đọc cũng thấy đúng; câu nào cũng phải gắn với một đặc điểm riêng của lá số này. '
    + 'Với mỗi điểm xấu, kèm một lời khuyên thực tế, cụ thể để giảm bớt ảnh hưởng. '
    + 'Không phán định tuyệt đối, không nói chuyện sống chết, không chẩn đoán y tế hay khuyên đầu tư cụ thể. '
    + 'Cuối bài nhắc một câu ngắn rằng Tử Vi là diễn giải truyền thống, chưa được khoa học chứng minh. '
    + 'Định dạng: các mục có tiêu đề dạng "## Tiêu đề", gạch đầu dòng bằng "- ", in đậm bằng **...**.\n\nLÁ SỐ:\n' + chartText();
  // Nút Sao chép thông tin: lời dặn + lá số để người xem dán vào AI khác
  const infoForAi = () => rules() + '\n\nHãy luận giải tổng quan lá số này: tính cách, công danh, tài lộc, tình cảm, sức khỏe và vận hạn năm xem. Sau đó tôi có thể hỏi thêm.';
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
    const bt = state.view === 'battu', tb = bt ? { name: state.bt.ten, duongLich: state.bt.duongLich } : state.chart.thienBan;
    const n = (tb.name || (bt ? 'bat-tu' : 'la-so')).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
    return `${n || 'la-so'}${bt && tb.name ? '-bat-tu' : ''}-${tb.duongLich.year}${pad(tb.duongLich.month)}${pad(tb.duongLich.day)}`;
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
  // Tải ảnh: Tử Vi chụp lá số, Bát Tự chụp khung tứ trụ (bỏ các nút có class no-export)
  async function exportPng() {
    const bt = state.view === 'battu', node = bt ? $('#bt-pillars').closest('section') : $('#chart');
    if (!window.htmlToImage) { toast('Chưa tải được công cụ xuất ảnh.'); return; }
    const btn = $(bt ? '#bt-png' : '#btn-png'); btn.disabled = true;
    try {
      const bg = getComputedStyle(node).backgroundColor;
      const filter = (n) => !(n.classList && (n.classList.contains('no-export') || n.classList.contains('info')));
      const blob = await window.htmlToImage.toBlob(node, { pixelRatio: 2, backgroundColor: bg, skipFonts: true, filter });
      if (!(await saveFile(fileBase() + '.png', blob))) { $('#png-preview').src = URL.createObjectURL(blob); $('#png-dialog').hidden = false; }
    } catch (e) { toast('Xuất ảnh không thành công.'); }
    finally { btn.disabled = false; }
  }

  // ---------- Lá số gần đây (chỉ trong trình duyệt này) ----------
  const RECENT_KEY = 'tuvi.recent.v1';
  function loadRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; } }
  function saveRecent(inp) {
    try {
      const key = (i) => [i.name, i.gender, i.calendar, i.day, i.month, i.year, i.hour, i.minute, i.mode || 'tuvi', !!i.noHour].join('|');
      localStorage.setItem(RECENT_KEY, JSON.stringify([inp, ...loadRecent().filter((x) => key(x) !== key(inp))].slice(0, 6)));
    } catch { /* trình duyệt chặn lưu */ }
  }
  function forgetRecent() { try { localStorage.removeItem(RECENT_KEY); } catch { /* bỏ qua */ } renderRecent(); toast('Đã xóa danh sách trên máy này'); }
  function renderRecent() {
    const list = loadRecent();
    $('#recent-wrap').hidden = !list.length;
    $('#recent').innerHTML = list.map((x, i) => `<button type="button" data-recent="${i}">${esc(x.name || 'Không tên')}, ${x.day}/${x.month}/${x.year}${x.calendar === 'am' ? ' âm lịch' : ''}${x.noHour ? ', chưa rõ giờ' : ''}${x.mode === 'battu' ? ' · Bát Tự' : ''}</button>`).join('');
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
      state.cc = K.detect(chart); state.ccPin = null; state.yearsOf = null;
      state.selected = chart.thienBan.menhCung;
      $('#form-error').hidden = true;
      renderWho(); renderYearbar(); renderChart(true); renderInspector(); renderTrack(); renderSummary();
      $('#json-out').textContent = chartJson();
      $('#ai-out').innerHTML = ''; $('#ai-ask').hidden = true; $('#ai-note').textContent = '';
      $('#find').value = '';
      state.cmp = null; $('#cmp-out').innerHTML = ''; $('#c-error').hidden = true; renderCmpRecent();
      paintHourNote();
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
      if (state.mode === 'battu') { openBt(inp); return; }
      if (inp.noHour) { openHours(inp); return; }
      state.fromHours = null;
      if (!compute(inp, false)) return;
      saveRecent(inp);
      const h = toHash(inp);
      if (location.hash.slice(1) === h) showView('chart'); else location.hash = h;
    });
    // Mở màn 12 giờ (từ form hoặc lá số gần đây)
    const openHours = (inp) => {
      if (!showHours(inp)) return;
      $('#form-error').hidden = true;
      saveRecent(inp);
      const h = toHoursHash(inp);
      if (location.hash.slice(1) === h) showView('hours'); else location.hash = h;
    };
    // Mở màn Bát Tự
    const openBt = (inp) => {
      if (!computeBt(inp)) return;
      saveRecent({ ...inp, mode: 'battu' });
      const h = toBtHash(inp);
      if (location.hash.slice(1) === h) showView('battu'); else location.hash = h;
    };
    // Mở lá số Tử Vi của cùng ngày giờ (không rõ giờ thì sang màn 12 giờ)
    const openTuVi = (inp) => {
      if (inp.noHour) { openHours({ ...inp, mode: 'tuvi' }); return; }
      state.fromHours = null;
      if (compute({ ...inp, mode: 'tuvi' }, false)) location.hash = toHash(inp);
    };
    $$('[name=mode]').forEach((x) => x.addEventListener('change', () => setMode(x.value)));
    $('#bt-facts').addEventListener('click', (e) => { if (e.target.closest('#bt-to-tv')) openTuVi(state.btInput); });
    $('#who-facts').addEventListener('click', (e) => { if (e.target.closest('#tv-to-bt')) openBt({ ...state.input, noHour: tryingHour() }); });
    $('#bt-dv').addEventListener('click', (e) => { const b = e.target.closest('[data-dv]'); if (b) { state.btDv = +b.getAttribute('data-dv'); renderBtYears(); } });
    $('#bt-years').addEventListener('click', (e) => { const b = e.target.closest('[data-year]'); if (b) setBtYear(+b.getAttribute('data-year')); });
    $('#bt-body').addEventListener('click', (e) => { if (e.target.closest('#bt-copy')) copyText(btText(), 'Đã chép, dán vào AI bạn dùng để hỏi'); });
    // Bấm thập thần, Trường Sinh, thần sát trong bảng tứ trụ để xem nghĩa
    $('#bt-pillars').addEventListener('click', (e) => {
      const b = e.target.closest('.bt-tap'); if (!b || e.target.closest('.info')) return;
      const d = b.dataset;
      $$('#bt-pillars .bt-tap').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      if (d.tt) { const t = BT.THAP_THAN[d.tt]; showBtNote(d.tt, `${t[0]} Khi nhiều: ${t[1]}`, t[2]); }
      else if (d.tsi) showBtNote(d.tsi, BT.TRUONG_SINH_Y[d.tsi]);
      else if (d.ts) showBtNote(d.ts, BT.THAN_SAT_Y[d.ts], BT.THAN_SAT_KHUYEN[d.ts]);
      else if (d.nc) showBtNote(`Nhật chủ ${state.bt.nhatChu.ten} ${state.bt.nhatChu.hanh}`, BT.NHAT_CHU[state.bt.nhatChu.can]);
    });
    $('#hv-filter').addEventListener('change', filterHours);
    $('#hv-grid').addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]'); if (!b) return;
      const g = ALL_GIO.find((x) => x[0] === b.getAttribute('data-pick'));
      const inp = { ...state.hoursInput, noHour: false, gio: g[0], hour: g[3], minute: g[4], exact: false };
      state.fromHours = dayKey(inp);
      if (compute(inp, false)) location.hash = toHash(inp);
    });
    $('#btn-hours-back').addEventListener('click', () => { location.hash = toHoursHash({ ...state.input, name: '' }); });
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
      if (!inp) return;
      if (inp.mode === 'battu') { setMode('battu'); openBt(inp); return; }
      if (inp.noHour) { openHours(inp); return; }
      state.fromHours = null;
      if (compute(inp, false)) { const h = toHash(inp); if (location.hash.slice(1) === h) showView('chart'); else location.hash = h; }
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
    $('#track').addEventListener('click', (e) => { const b = e.target.closest('[data-goto]'); if (b) { state.yearsOf = +b.getAttribute('data-goto'); select(state.yearsOf); } });
    $('#years').addEventListener('click', (e) => { const b = e.target.closest('[data-year]'); if (b) setYear(+b.getAttribute('data-year')); });
    // Nút ‹ ›: bấm một lần lùi/tới 1 năm, bấm giữ thì lướt liên tục; phím ← → khi đang ở thanh năm
    let hold = null;
    const stopHold = () => { clearTimeout(hold); clearInterval(hold); hold = null; };
    [['#y-prev', -1], ['#y-next', 1]].forEach(([id, d]) => {
      const b = $(id);
      b.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        setYear(state.input.namXem + d);
        stopHold(); hold = setTimeout(() => { hold = setInterval(() => setYear(state.input.namXem + d), 110); }, 420);
      });
      ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach((ev) => b.addEventListener(ev, stopHold));
      b.addEventListener('click', (e) => { if (e.detail === 0) setYear(state.input.namXem + d); }); // Enter / Space từ bàn phím
    });
    $('.yearbar').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setYear(state.input.namXem + (e.key === 'ArrowLeft' ? -1 : 1)); }
    });
    $('#y-today').addEventListener('click', () => setYear(new Date().getFullYear()));
    $('#t-dv').addEventListener('change', (e) => { state.showDv = e.target.checked; renderChart(false); });
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
    $('#cmp-form').addEventListener('submit', runCompare);
    $('#cmp-form').addEventListener('input', () => { $('#c-error').hidden = true; });
    $$('[name=ccal]').forEach((x) => x.addEventListener('change', () => { $('#c-leap-row').hidden = !$('#c-c-am').checked; }));
    $('#c-recent').addEventListener('click', (e) => {
      const b = e.target.closest('[data-recent]'); if (!b) return;
      const inp = loadRecent()[+b.getAttribute('data-recent')];
      if (inp) { writeCmp(inp); runCompare(); }
    });
    $('#cmp-out').addEventListener('click', (e) => { if (e.target.closest('#btn-copy-cmp')) copyText(compareText(), 'Đã chép, dán vào AI bạn dùng để hỏi'); });
    $('#ai-run').addEventListener('click', () => runAi());
    $('#ai-stop').addEventListener('click', () => state.ai.ctl?.abort());
    $('#ai-ask').addEventListener('submit', (e) => { e.preventDefault(); const q = $('#ai-q').value.trim(); if (!q) return; $('#ai-q').value = ''; runAi(q); });

    // Góp ý: chỉ hiện khi đã cấu hình worker
    if (CFG.feedbackEndpoint) {
      $('#btn-gopy').hidden = false;
      $('#gy-pick').innerHTML = [1, 2, 3, 4, 5].map((v) => `<button type="button" data-sao="${v}" aria-label="${v} sao" aria-pressed="false">★</button>`).join('');
      $('#btn-gopy').addEventListener('click', gyOpen);
      $('#gy-close').addEventListener('click', gyClose);
      $('#gy-dialog').addEventListener('click', (e) => { if (e.target === $('#gy-dialog')) gyClose(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#gy-dialog').hidden && $('#pop').hidden) gyClose(); });
      $('#gy-pick').addEventListener('click', (e) => { const b = e.target.closest('[data-sao]'); if (b) { GY.sao = +b.getAttribute('data-sao'); gyPaint(); $('#gy-err').hidden = true; } });
      $('#gy-nd').addEventListener('input', (e) => { $('#gy-dem').textContent = `${e.target.value.length}/1000`; });
      $('#gy-form').addEventListener('submit', gySend);
      $('#gy-more').addEventListener('click', () => gyLoad('them'));
    }
    $('#btn-png').addEventListener('click', exportPng);
    $('#bt-png').addEventListener('click', exportPng);
    $('#btn-json').addEventListener('click', async () => {
      if (state.view === 'battu') { if (!(await saveFile(fileBase() + '.json', JSON.stringify(state.bt, null, 2)))) toast('Không lưu được tệp ở đây; dùng nút Sao chép thông tin.'); return; }
      if (!(await saveFile(fileBase() + '.json', chartJson()))) { setTab('json'); toast('Mở tab Dữ liệu JSON để sao chép.'); }
    });
    $('#btn-copy').addEventListener('click', () => copyText(chartJson(), 'Đã chép JSON', $('#json-out')));
    $$('.js-copy-info').forEach((b) => b.addEventListener('click', () => copyText(infoForAi(), 'Đã chép, dán vào AI bạn dùng để hỏi')));
    $('#png-close').addEventListener('click', () => { $('#png-dialog').hidden = true; });
    // Ngoài Claude, địa chỉ trang chính là link của lá số
    if (!IN_CLAUDE) { $('#btn-link').hidden = false; $('#btn-link').addEventListener('click', () => copyText(location.href, state.view === 'battu' ? 'Đã chép link Bát Tự' : 'Đã chép link lá số')); }

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
