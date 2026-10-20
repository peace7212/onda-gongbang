/* ==========================================================================
   ONDA PERFUME STUDIO — Shared Data Store (localStorage)
   - Homepage(index.html)와 관리자(admin.html)가 같은 브라우저 localStorage를 공유합니다.
   - data.js 의 시드 데이터를 최초 1회 복사해 저장하고, 이후에는 저장된 상태를 사용합니다.
   - 실제 서비스 전환 시 load()/save() 만 API 호출로 교체하면 됩니다.
   ========================================================================== */
(function (global) {
  const STORE_KEY = 'onda_store_v1';
  const SLOT_TIMES = ['11:00', '14:00', '17:00'];
  const DEFAULT_CAPACITY = 6;

  const clone = (obj) => JSON.parse(JSON.stringify(obj));
  const pad = (n) => String(n).padStart(2, '0');
  const dateKey = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
  const nowISO = () => new Date().toISOString();
  const uid = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;

  function daysAgoISO(days, hour = 14) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(hour, 10, 0, 0);
    return d.toISOString();
  }

  function buildSeed() {
    const classes = clone(global.CLASSES_DATA || []).map(c => ({ ...c, active: true }));
    const products = clone(global.PRODUCTS_DATA || []).map((p, i) => ({
      ...p,
      stock: [24, 18, 6, 12, 15, 30, 8, 40][i] ?? 10,
      soldOut: false,
      visible: true
    }));
    const reviews = clone(global.REVIEWS_DATA || []).map((r, i) => ({
      ...r,
      id: `REV-SEED-${i + 1}`,
      hidden: false,
      best: i === 0,
      reply: i === 0 ? '소중한 후기 감사합니다. 영일대의 윤슬처럼 오래 기억에 남는 향이 되길 바랍니다. — 온다 조향사 드림' : '',
      createdAt: daysAgoISO(i + 1)
    }));
    const titleOf = (id) => (classes.find(c => c.id === id) || classes[0] || {}).title || '';

    const reservations = [
      { resNo: 'ONDA-1024-141', classId: 'class-perfume-50', date: '2026-10-24', slot: '14:00', headcount: 2, name: '김윤슬', phone: '010-2481-0924', engraving: 'Onda de Pohang', payMode: 'deposit', payProvider: '네이버페이', paidAmount: 40000, status: 'confirmed', mine: true, request: '기념일 방문입니다.', createdAt: daysAgoISO(2) },
      { resNo: 'ONDA-1019-112', classId: 'class-home-fragrance', date: '2026-10-19', slot: '11:00', headcount: 3, name: '박서연', phone: '010-3392-1180', engraving: '우리집 향기', payMode: 'full', payProvider: '카카오페이', paidAmount: 165300, status: 'completed', request: '', createdAt: daysAgoISO(4) },
      { resNo: 'ONDA-1019-173', classId: 'class-perfume-50', date: '2026-10-19', slot: '17:00', headcount: 2, name: '이도현', phone: '010-7712-5531', engraving: 'D&H 1st', payMode: 'deposit', payProvider: '네이버페이', paidAmount: 40000, status: 'confirmed', request: '시트러스 계열 선호', createdAt: daysAgoISO(1) },
      { resNo: 'ONDA-1022-144', classId: 'class-perfume-50', date: '2026-10-22', slot: '14:00', headcount: 4, name: '최민지', phone: '010-5521-8890', engraving: '', payMode: 'deposit', payProvider: '신용/체크카드', paidAmount: 80000, status: 'pending', request: '친구 4명 우정 여행', createdAt: daysAgoISO(0, 9) },
      { resNo: 'ONDA-1025-115', classId: 'class-hobby-regular', date: '2026-10-25', slot: '11:00', headcount: 1, name: '정하윤', phone: '010-9032-4471', engraving: '', payMode: 'full', payProvider: '카카오페이', paidAmount: 260000, status: 'confirmed', request: '4주 정규반 첫 수업', createdAt: daysAgoISO(3) },
      { resNo: 'ONDA-1018-146', classId: 'class-perfume-50', date: '2026-10-18', slot: '14:00', headcount: 2, name: '한결', phone: '010-1180-2234', engraving: 'Gyeol', payMode: 'deposit', payProvider: '네이버페이', paidAmount: 40000, status: 'cancelled', request: '', createdAt: daysAgoISO(6) }
    ].map(r => ({ ...r, classTitle: titleOf(r.classId) }));

    const prod = (id) => products.find(p => p.id === id) || products[0];
    const item = (id, engraving = '기본 시그니처 라벨', giftExtra = 0) => {
      const p = prod(id);
      return { productId: p.id, title: p.title, img: p.img, engraving, giftExtra, unitPrice: p.price + giftExtra };
    };
    const order = (orderNo, items, customer, payMethod, status, days, hour) => ({
      orderNo, items, customer, payMethod, status,
      total: items.reduce((a, it) => a + it.unitPrice, 0),
      address: '경북 포항시 북구 (시안 주소)',
      trackingNo: status === 'shipped' || status === 'delivered' ? `CJ${Math.floor(1e9 + Math.random() * 9e9)}` : '',
      createdAt: daysAgoISO(days, hour)
    });
    const orders = [
      order('ORD-261019-01', [item('prod-yunseul', 'For. Seoyeon', 4000)], '이*현', '네이버페이(N Pay)', 'paid', 0, 10),
      order('ORD-261018-03', [item('prod-midnight-diffuser'), item('prod-atelier-spray')], '정*우', '카카오페이', 'preparing', 1, 16),
      order('ORD-261017-02', [item('prod-onda', 'Hangyeol 2026')], '한*결', '신용/체크카드 PG', 'shipped', 2, 13),
      order('ORD-261016-05', [item('prod-discovery-set')], '오*린', '네이버페이(N Pay)', 'delivered', 3, 11),
      order('ORD-261015-01', [item('prod-gift-duo', 'Happy Wedding', 4000)], '서*준', '카카오페이', 'delivered', 4, 19),
      order('ORD-261014-04', [item('prod-warmsand')], '윤*아', '네이버페이(N Pay)', 'delivered', 5, 15),
      order('ORD-261013-02', [item('prod-pinebreeze'), item('prod-discovery-set')], '김*호', '신용/체크카드 PG', 'cancelled', 6, 12)
    ];

    const inquiries = [
      { id: 'INQ-SEED-1', name: '(주)포스코씨앤씨 인사팀', phone: '054-220-0000', type: '기업 · 학교 · 관공서 출강 및 단체 워크숍 문의', message: '11월 둘째 주 팀빌딩으로 20명 단체 클래스 견적 부탁드립니다. 출강도 가능한지 궁금합니다.', status: 'new', memo: '', createdAt: daysAgoISO(0, 11) },
      { id: 'INQ-SEED-2', name: '김*슬', phone: '010-4421-0091', type: '기존 수강생 조향 레시피 재주문 문의', message: '2024년 여름 윤슬향방에서 만든 향수 재주문 원해요. 성함 김*슬입니다.', status: 'in_progress', memo: '레시피 시트 #2407-118 확인 완료, 택배 발송 예정', createdAt: daysAgoISO(1, 15) },
      { id: 'INQ-SEED-3', name: '문*영', phone: '010-8812-3304', type: '온라인 스토어 배송 / 답례품 대량 주문 문의', message: '결혼식 답례품으로 30ml 향수 80개 주문 가능할까요?', status: 'done', memo: '견적서 메일 발송 완료 (10/15)', createdAt: daysAgoISO(4, 10) }
    ];

    return {
      version: 1,
      updatedAt: nowISO(),
      notice: {
        enabled: true,
        tag: 'RENEWAL OPEN',
        html: '‘윤슬향방’이 <strong>온다 향방 (ONDA PERFUME STUDIO)</strong>으로 새롭게 인사드립니다 · 온라인 첫 구매 시 시향 바이알 2종 증정',
        linkText: '실시간 클래스 예약 →'
      },
      heroSlides: clone(global.HERO_SLIDES || []),
      classes,
      products,
      reviews,
      reservations,
      slotOverrides: {},
      orders,
      inquiries
    };
  }

  let cache = null;

  function load() {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        cache = JSON.parse(raw);
        return cache;
      }
    } catch (err) {
      console.warn('[OndaStore] load failed, reseeding', err);
    }
    cache = buildSeed();
    persist();
    return cache;
  }

  function persist() {
    cache.updatedAt = nowISO();
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(cache));
    } catch (err) {
      console.warn('[OndaStore] save failed', err);
    }
  }

  /** Mutate the state with a callback and persist. */
  function update(mutator) {
    const state = load();
    mutator(state);
    persist();
    return state;
  }

  function reset() {
    cache = buildSeed();
    persist();
    return cache;
  }

  function invalidate() {
    cache = null;
  }

  // ---------- Timeslot helpers ----------
  function getSlotInfo(date, slot) {
    const state = load();
    const ov = state.slotOverrides[`${date}|${slot}`] || {};
    const capacity = Number.isFinite(ov.capacity) ? ov.capacity : DEFAULT_CAPACITY;
    const booked = state.reservations
      .filter(r => r.date === date && r.slot === slot && r.status !== 'cancelled')
      .reduce((a, r) => a + (parseInt(r.headcount, 10) || 0), 0);
    const closed = !!ov.closed;
    return { capacity, booked, closed, remaining: closed ? 0 : Math.max(0, capacity - booked) };
  }

  function setSlotOverride(date, slot, patch) {
    update(state => {
      const key = `${date}|${slot}`;
      state.slotOverrides[key] = { ...(state.slotOverrides[key] || {}), ...patch };
    });
  }

  // React to changes made in another tab (admin ↔ homepage)
  function onExternalChange(callback) {
    window.addEventListener('storage', (e) => {
      if (e.key !== STORE_KEY) return;
      invalidate();
      callback(load());
    });
  }

  global.OndaStore = {
    STORE_KEY, SLOT_TIMES, DEFAULT_CAPACITY,
    load, update, reset, invalidate, onExternalChange,
    getSlotInfo, setSlotOverride,
    helpers: { clone, pad, dateKey, nowISO, uid }
  };
})(window);
