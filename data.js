/* ==========================================================================
   ONDA PERFUME STUDIO (온다 향방) — Seed Data (shared by homepage & admin)
   ========================================================================== */

// 1. Hero Slides Data (Photorealistic Studio Slides)
const HERO_SLIDES = [
  {
    num: '01',
    tagText: '· ONDA WAVE',
    tideLabel: 'ONDA : 파도가 밀려오고 스며드는 시간',
    title: '바다가 보내온 쉼,<br />나만의 향기가 온다',
    subtitle: '영일대 파도 곁에서 마주하는 온전한 나만의 향. 120여 가지 자연의 향료와 아날로그 조향 오르간 앞에서 당신의 계절을 기록하세요.',
    img: './assets/images/hero_slide_1.jpg'
  },
  {
    num: '02',
    tagText: '· BESPOKE CLASS',
    tideLabel: 'ATELIER : 120여 종의 향료와 1:1 비스포크 조향',
    title: '창가에 스미는 윤슬,<br />프라이빗 조향 아틀리에',
    subtitle: '올팩션 테스트부터 포뮬러 설계, 시향 및 보틀 각인까지. 조향사의 1:1 가이드와 함께 세상에 단 하나뿐인 시그니처 퍼퓸을 완성합니다.',
    img: './assets/images/hero_slide_2.jpg'
  },
  {
    num: '03',
    tagText: '· SIGNATURE SCENT',
    tideLabel: 'COLLECTION : 포항의 사계절을 담은 시그니처 퍼퓸',
    title: '포항의 사계절을 담은<br />시그니처 프래그런스',
    subtitle: '시향 없이도 눈앞에 그려지는 감성 노트와 Scent Pyramid. 온다 향방의 시그니처 오 드 퍼퓸과 디퓨저를 온라인 스토어에서 만나보세요.',
    img: './assets/images/hero_slide_3.jpg'
  }
];

// 2. Curated Classes Data
const CLASSES_DATA = [
  {
    id: 'class-perfume-50',
    categoryGroup: '시그니처 퍼퓸 원데이',
    badge: 'BEST · 원데이 클래스',
    meta: '소요시간 90분 · 정원 최대 6명',
    title: '나만의 시그니처 향수 원데이 클래스 (50ml)',
    desc: '120여 가지 향료 중 취향의 노트를 찾아 세상에 하나뿐인 오 드 퍼퓸(50ml)을 제작하고 커스텀 각인 라벨과 기프트 패키지로 완성합니다.',
    steps: '올팩션 테스트 → 포뮬러 설계 → 시향 및 수정 → 각인 라벨링 & 패키징',
    price: 65000,
    img: './assets/images/hero_slide_2.jpg',
    recommendFor: '포항 영일대 커플 데이트, 우정 여행 기념품, 나만의 시그니처 살결 향수를 찾고 싶은 분',
    includes: [
      '오 드 퍼퓸 50ml 본품 보틀',
      '무료 보틀 레이저/라벨 각인',
      '시그니처 리넨 파우치 & 하드케이스',
      '조향 포뮬러 시트 영구 보관 (재구매 가능)',
      '계절 허브 웰컴 티 & 다과'
    ],
    timeline: [
      { time: '00 – 20분', title: '웰컴 티타임 & 올팩션(Olfaction) 시향', detail: '향수의 발향 구조를 배우고 30여 가지 핵심 베이스·키 노트를 시향하며 선호하는 향조를 찾습니다.' },
      { time: '20 – 45분', title: '1:1 포뮬러 설계 & 1차 샘플 블렌딩', detail: '조향사의 피드백을 바탕으로 Top · Middle · Base 비율을 설계하고 테스트 샘플을 조합합니다.' },
      { time: '45 – 70분', title: '피부 착향 테스트 & 최종 50ml 본품 조향', detail: '피부 온도에 따른 잔향을 확인한 뒤 비율을 미세 조정하여 50ml 오 드 퍼퓸 본품을 완성합니다.' },
      { time: '70 – 90분', title: '커스텀 라벨 각인 · 패키징 & 포토존 촬영', detail: '직접 지은 향수 이름을 라벨에 새기고 영일대 윤슬 오브제 포토존에서 기념 촬영을 진행합니다.' }
    ]
  },
  {
    id: 'class-home-fragrance',
    categoryGroup: '공간 향기 (디퓨저·룸스프레이)',
    badge: 'HOME LIVING · 공간 향기',
    meta: '소요시간 70분 · 정원 최대 6명',
    title: '공간 향기 클래스 (디퓨저 150ml + 룸스프레이 100ml)',
    desc: '머무는 공간의 공기를 바꾸는 오브제 디퓨저와 패브릭 겸용 룸스프레이를 함께 제작하는 실용적인 홈 프래그런스 클래스입니다.',
    steps: '공간 무드 상담 → 에센셜 베이스 블렌딩 → 리드 & 보틀 스타일링',
    price: 58000,
    img: './assets/images/fragrance_home_set.jpg',
    recommendFor: '신혼부부·집들이 선물 제작, 침실·서재의 공간 무드를 바꾸고 싶은 분, 부모님 동반 가족 체험',
    includes: [
      '오브제 글래스 디퓨저 150ml',
      '룸 & 패브릭 스프레이 100ml',
      '섬유 리드 스틱 & 프리저브드 플라워 장식',
      '기프트 박스 & 쇼핑백 패키징',
      '계절 허브 웰컴 티'
    ],
    timeline: [
      { time: '00 – 15분', title: '공간별 향기 큐레이션 & 아로마 시향', detail: '침실(릴랙싱), 거실(리프레시), 드레스룸(코튼·우디) 등 공간 목적에 맞는 에센셜 오일을 시향합니다.' },
      { time: '15 – 45분', title: '디퓨저 & 룸스프레이 듀얼 포뮬러 조향', detail: '곡물 발효 베이스를 사용하여 머리 아픔 없이 은은하게 발향되는 디퓨저와 스프레이를 각각 조향합니다.' },
      { time: '45 – 70분', title: '보타니컬 오브제 스타일링 & 기프트 포장', detail: '보틀 라벨링과 리드 스틱 컬러 매칭 후 바로 선물할 수 있는 기프트 패키지로 완성합니다.' }
    ]
  },
  {
    id: 'class-hobby-regular',
    categoryGroup: '정규 취미반 & 단체 워크숍',
    badge: 'ATELIER COURSE · 심화/단체',
    meta: '주 1회 120분 (4주) / 단체 90분 맞춤',
    title: '조향 취미/정규 과정 & 프라이빗 그룹 워크숍',
    desc: '단일 향료의 화학적 구조와 노트 밸런스를 깊이 있게 배우는 4주 취미반 및 기업·단체 맞춤형 힐링 조향 프로그램입니다.',
    steps: '시트러스/마린 · 플로럴 · 우디/앰버 · 시그니처 창작 조향 (4주)',
    price: 260000,
    img: './assets/images/hero_slide_3.jpg',
    recommendFor: '조향을 깊이 있게 배우고 싶은 취미생, 기업 팀빌딩 워크숍, 학교·관공서 출강 프로그램',
    includes: [
      '4주간 총 4병(각 30ml~50ml) 향수 제작',
      '전문 조향 워크북 & 향료 시향 키트 제공',
      '단체 워크숍 시 공방 단독 대관 또는 방문 출강',
      '기업 로고/행사명 커스텀 보틀 라벨 제작 지원'
    ],
    timeline: [
      { time: 'Week 01', title: 'Citrus & Marine Accord (영일대의 아침)', detail: '천연 시트러스 에센셜 오일과 마린 노트의 휘발도를 이해하고 청량한 코롱/오드뚜왈렛을 제작합니다.' },
      { time: 'Week 02', title: 'White Floral & Green Note (보타니컬 가든)', detail: '로즈, 자스민, 네롤리, 무화과 잎 등 플로럴과 그린 노트의 어코드 밸런스를 실습합니다.' },
      { time: 'Week 03', title: 'Woody, Musk & Amber (살결의 온기)', detail: '샌달우드, 시더우드, 베티버, 다양한 머스크의 보류제 역할을 배우고 깊은 우디 향수를 조향합니다.' },
      { time: 'Week 04', title: 'Bespoke Signature Creation (나만의 창작 향수)', detail: '120여 종의 전체 오르간을 활용해 나만의 스토리를 담은 최종 시그니처 향수(50ml)를 완성합니다.' }
    ]
  }
];

// 3. Online Shop Products Data (with Photorealistic Perfume Images & Scent Pyramid)
const PRODUCTS_DATA = [
  {
    id: 'prod-yunseul',
    category: 'perfume',
    categoryLabel: 'Signature Eau de Parfum · 50ml',
    tag: 'BEST SELLER',
    tagType: 'navy',
    title: '윤슬 (YUNSEUL) 오 드 퍼퓸 50ml',
    price: 78000,
    emotion: '영일대 수면 위로 부서지는 오후 두 시의 햇살. 청량한 베르가못과 바다 소금기 너머로 화이트 티와 시더우드가 살결에 투명하게 내려앉습니다.',
    storyLong: '구 윤슬향방 시절부터 가장 많은 사랑을 받아온 온다 향방의 첫 번째 시그니처 향수입니다. 첫 향은 잔잔한 파도가 발끝에 닿을 때처럼 맑고 싱그러우며, 시간이 흐를수록 햇볕에 잘 마른 하얀 코튼 셔츠처럼 포근한 화이트 머스크와 우디 잔향이 6시간 이상 지속됩니다.',
    pyramid: {
      top: 'Italian Bergamot, Lemon Zest, Crisp Sea Salt',
      middle: 'Silver Needle White Tea, Neroli Blossom, Freesia',
      base: 'Atlas Cedarwood, Clean Skin Musk, Ambergris'
    },
    longevity: '6–7 Hours (Eau de Parfum 18%)',
    season: 'Spring · Summer · All-Day Daily',
    img: './assets/images/perfume_yunseul.jpg'
  },
  {
    id: 'prod-onda',
    category: 'perfume',
    categoryLabel: 'Signature Eau de Parfum · 50ml',
    tag: 'SIGNATURE',
    tagType: 'navy',
    title: '파도 (ONDA) 오 드 퍼퓸 50ml',
    price: 78000,
    emotion: '새벽 파도가 밀려온 뒤의 차분한 물기와 무화과 잎의 푸르름. 흔한 마린 향을 넘어 베티버와 앰버가 깊은 여운을 남기는 중성적인 아쿠아 우디 향.',
    storyLong: '브랜드 리뉴얼과 함께 탄생한 메인 타이틀 향수 ‘파도(ONDA)’입니다. 인위적인 오이향이나 뻔한 바다향 대신, 비 온 뒤 해변의 젖은 조약돌과 야생 무화과 잎사귀를 으깼을 때 나는 쌉싸름한 그린 노트를 결합해 세련되고 지적인 인상을 줍니다.',
    pyramid: {
      top: 'Crushed Fig Leaf, Cold Marine Accord, Pink Pepper',
      middle: 'Water Lily, Clary Sage, Hinoki Leaf',
      base: 'Haitian Vetiver, Oakmoss, Mineral Amber'
    },
    longevity: '7–8 Hours (Eau de Parfum 18%)',
    season: 'All Seasons · Unisex Chic',
    img: './assets/images/perfume_onda.jpg'
  },
  {
    id: 'prod-warmsand',
    category: 'perfume',
    categoryLabel: 'Signature Eau de Parfum · 50ml',
    tag: 'NEW',
    tagType: 'sage',
    title: '모래의 온기 (WARM SAND) 오 드 퍼퓸 50ml',
    price: 82000,
    emotion: '해 질 녘 백사장에 남아있는 다정한 온기. 부드러운 아이리스와 샌달우드, 캐시미어 머스크가 어우러져 포옹처럼 아늑한 살결 향을 완성합니다.',
    storyLong: '노을이 내려앉은 해변을 걸을 때 느껴지는 나른하고 따뜻한 공기를 담았습니다. 자극적인 단맛 없이 파우더리한 아이리스와 크리미한 호주산 샌달우드가 조화를 이루어 가을·겨울은 물론 잠들기 전 침구류에 뿌리기에도 완벽합니다.',
    pyramid: {
      top: 'Cardamom, Soft Almond, Mandarin Peel',
      middle: 'Florentine Iris, Orris Concrete, Heliotrope',
      base: 'Australian Sandalwood, Cashmere Musk, Tonka Bean'
    },
    longevity: '8+ Hours (Eau de Parfum 20%)',
    season: 'Autumn · Winter · Cozy Night',
    img: './assets/images/perfume_warmsand_pine.jpg'
  },
  {
    id: 'prod-pinebreeze',
    category: 'perfume',
    categoryLabel: 'Signature Eau de Parfum · 50ml',
    tag: 'BOTANICAL',
    tagType: 'sage',
    title: '해송의 숲 (PINE BREEZE) 오 드 퍼퓸 50ml',
    price: 78000,
    emotion: '바닷바람이 스치는 영일대 해송 산책로의 피톤치드. 유칼립투스와 솔잎, 편백나무가 어우러져 복잡한 생각을 맑게 비워내는 숲의 호흡.',
    storyLong: '바다 바로 옆에 자리한 소나무 숲길을 산책하며 영감을 받은 보타니컬 포레스트 향수입니다. 첫 호흡에 들어오는 서늘한 유칼립투스와 솔잎 노트가 머리를 맑게 해주고, 묵직한 시더우드와 젖은 이끼 향이 고요한 안정감을 선사합니다.',
    pyramid: {
      top: 'Siberian Pine Needle, Eucalyptus, Green Galbanum',
      middle: 'Cypress, Rosemary, Juniper Berry',
      base: 'Hinoki Wood, Damp Forest Moss, Patchouli'
    },
    longevity: '6–7 Hours (Eau de Parfum 18%)',
    season: 'All Seasons · Mindful Relaxation',
    img: './assets/images/hero_slide_1.jpg'
  },
  {
    id: 'prod-midnight-diffuser',
    category: 'home',
    categoryLabel: 'Home Fragrance · Reed Diffuser 200ml',
    tag: 'BEST HOME',
    tagType: 'navy',
    title: '영일대의 밤 (MIDNIGHT TIDE) 리드 디퓨저 200ml',
    price: 54000,
    emotion: '고요한 밤바다와 은은한 달빛이 머무는 침실. 프렌치 라벤더와 편백, 클라리 세이지가 하루의 피로를 부드럽게 재워주는 릴랙싱 디퓨저.',
    storyLong: '곡물 발효 주정 베이스와 천연 에센셜 오일을 블렌딩하여 밀폐된 실내에서도 머리 아픔 없이 은은하게 퍼집니다. 미니멀한 반투명 보틀과 블랙 섬유 리드 스틱이 인테리어 오브제로서 공간의 품격을 높여줍니다.',
    pyramid: {
      top: 'French Lavender, Bergamot Leaf, Chamomile',
      middle: 'Clary Sage, Geranium, Sweet Marjoram',
      base: 'Hinoki Wood, Guaic Wood, Soft Amber'
    },
    longevity: '3–4 Months Continuous Diffusion',
    season: 'Bedroom · Living Room · Study',
    img: './assets/images/fragrance_home_set.jpg'
  },
  {
    id: 'prod-atelier-spray',
    category: 'home',
    categoryLabel: 'Home Fragrance · Room & Fabric Spray 100ml',
    tag: 'DAILY CARE',
    tagType: 'sage',
    title: '아틀리에 모닝 (ATELIER MORNING) 룸앤패브릭 스프레이 100ml',
    price: 36000,
    emotion: '갓 세탁한 화이트 리넨 커튼 사이로 불어오는 아침 바닷바람. 침구류와 의류, 공간 어디에나 산뜻하게 내려앉는 코튼 네롤리 향.',
    storyLong: '온다 향방 아틀리에에 들어서면 가장 먼저 느껴지는 바로 그 공간 향기입니다. 탈취 테스트를 완료한 식물성 에탄올 베이스로 코트나 니트, 침구류에 얼룩 걱정 없이 기분 좋은 리프레시를 선물합니다.',
    pyramid: {
      top: 'Green Pear, Petitgrain, Lemon Blossom',
      middle: 'Tunisian Neroli, Cotton Flower, White Rose',
      base: 'Clean White Musk, Powdery Iris, Cedar'
    },
    longevity: '3–4 Hours on Fabric & Air',
    season: 'Bedding · Wardrobe · Welcome Scent',
    img: './assets/images/hero_slide_2.jpg'
  },
  {
    id: 'prod-gift-duo',
    category: 'gift',
    categoryLabel: 'Special Gift Set · Engraving Included',
    tag: 'GIFT PICK',
    tagType: 'navy',
    title: '온다 시그니처 기프트 듀오 세트 (향수 50ml + 룸스프레이 50ml)',
    price: 98000,
    emotion: '소중한 사람의 이름과 기념일을 보틀에 각인하여 선물하세요. 시그니처 오 드 퍼퓸 본품과 휴대용 룸스프레이, 리넨 파우치 & 메시지 카드 패키지.',
    storyLong: '집들이, 결혼, 생일, 감사 선물로 가장 인기가 높은 기프트 세트입니다. 온다 향방의 4가지 시그니처 향 중 원하는 향을 선택하실 수 있으며, 아이보리 코튼 리본 패키징과 쇼핑백이 기본 포함됩니다.',
    pyramid: {
      top: 'Customizable Scent (윤슬 / 파도 / 모래의 온기 / 해송의 숲 중 택1)',
      middle: 'Complimentary Bottle Laser Engraving (최대 15자 무료 각인)',
      base: 'Signature Linen Pouch + Hard Box + Message Card + Shopping Bag'
    },
    longevity: 'Full Gift Presentation Ready',
    season: 'Anniversary · Housewarming · Wedding Gift',
    img: './assets/images/hero_slide_3.jpg'
  },
  {
    id: 'prod-discovery-set',
    category: 'gift',
    categoryLabel: 'Online Olfaction Kit · 2ml × 4 Vials',
    tag: 'TRY FIRST',
    tagType: 'sage',
    title: '온다 디스커버리 시향 키트 (2ml × 4종 + 1만원 본품 바우처)',
    price: 24000,
    emotion: '포항 공방에 직접 방문하기 어려운 분들을 위한 온라인 시향 키트. 윤슬·파도·모래의 온기·해송의 숲 4가지 향을 집에서 충분히 시향해 보세요.',
    storyLong: '시향지뿐만 아니라 실제 피부 위에서의 발향과 시간대별 잔향 변화를 충분히 경험하실 수 있도록 2ml 스프레이 바이알 4종과 조향사의 노트 카드가 함께 발송됩니다. 구매 후 50ml 본품 주문 시 사용 가능한 10,000원 할인 바우처 코드가 동봉됩니다.',
    pyramid: {
      top: '01. 윤슬 (YUNSEUL) — Citrus Sea Salt & White Tea',
      middle: '02. 파도 (ONDA) & 03. 해송의 숲 (PINE BREEZE)',
      base: '04. 모래의 온기 (WARM SAND) + Scent Story Guide Book'
    },
    longevity: 'Approx. 30 Sprays per Vial (Total 120 Sprays)',
    season: 'First Experience · Travel Size',
    img: './assets/images/perfume_yunseul.jpg'
  }
];

// 4. Journal Articles Data
const JOURNAL_DATA = [
  {
    id: 'journal-01',
    vol: 'SCENT STORY · EP.01',
    date: '2026. 10. 12',
    title: '윤슬향방에서 온다 향방으로, 이름에 담은 파도의 기록',
    excerpt: '영일대 바닷가 작은 작업실에서 시작된 윤슬향방이 왜 ‘온다(ONDA)’라는 새로운 이름을 입게 되었는지, 리뉴얼 비하인드 스토리를 전합니다.',
    img: './assets/images/hero_slide_1.jpg',
    body: `
      <p style="margin-bottom:16px;">처음 영일대 골목 2층에 작은 조향 작업실을 열었을 때, 창밖으로 가장 먼저 보였던 것은 오후의 햇살을 받아 반짝이는 잔물결, ‘윤슬’이었습니다. 지난 시간 동안 수많은 여행자와 포항의 이웃분들이 이곳에서 자신만의 계절을 향수로 기록해 주셨습니다.</p>
      <p style="margin-bottom:16px;">리뉴얼을 준비하며 우리가 가장 깊이 고민한 질문은 <strong>“향기는 우리에게 어떻게 다가오는가?”</strong>였습니다. 향기는 눈에 보이지 않지만, 파도가 해변으로 밀려오듯 어느 순간 불현듯 기억과 감정을 두드립니다.</p>
      <p style="margin-bottom:16px;">스페인어로 ‘파도’를 뜻하는 <strong>ONDA</strong>, 그리고 “나에게로 향기가 온다”는 한국어의 다정한 울림을 담아 <strong>온다 향방 (ONDA PERFUME STUDIO)</strong>으로 새롭게 인사드립니다. 기존 윤슬향방에서 조향하셨던 모든 수강생분들의 포뮬러 시트는 그대로 아카이빙되어 언제든 재제작이 가능합니다.</p>
    `
  },
  {
    id: 'journal-02',
    vol: 'PERFUME GUIDE · EP.02',
    date: '2026. 10. 15',
    title: '시향 없이 온라인으로 실패 없이 나만의 향수를 고르는 법',
    excerpt: 'Top 노트만 보고 향수를 골라 실패했던 경험이 있나요? 향조 피라미드(Scent Pyramid)를 읽는 법과 피부 온도에 따른 잔향 선택 가이드를 소개합니다.',
    img: './assets/images/perfume_yunseul.jpg',
    body: `
      <p style="margin-bottom:16px;">향수를 뿌린 직후 느껴지는 첫인상(Top Note)은 대개 15분에서 30분 사이에 날아갑니다. 반면 우리가 하루 종일 나에게서 맡게 되는 향은 1시간 뒤부터 피어오르는 <strong>Middle(Heart) Note</strong>와 <strong>Base Note</strong>입니다.</p>
      <p style="margin-bottom:16px;">평소 답답한 향에 쉽게 피로감을 느끼신다면 시트러스와 화이트 티, 시더우드가 중심을 잡는 <strong>‘윤슬(YUNSEUL)’</strong>이나 솔잎과 편백이 어우러진 <strong>‘해송의 숲(PINE BREEZE)’</strong>을 추천합니다.</p>
      <p style="margin-bottom:16px;">반대로 살결에 부드럽게 밀착되는 포근한 향을 선호하신다면 샌달우드와 아이리스가 조화된 <strong>‘모래의 온기(WARM SAND)’</strong>가 훌륭한 선택이 됩니다. 여전히 고민되신다면 4가지 시그니처 향을 모두 경험할 수 있는 ‘디스커버리 시향 키트’로 시작해 보세요.</p>
    `
  },
  {
    id: 'journal-03',
    vol: 'ATELIER NOTE · EP.03',
    date: '2026. 10. 18',
    title: '방금 만든 향수가 2주 뒤 더 깊어지는 이유: 숙성(Maceration)의 과학',
    excerpt: '원데이 클래스에서 완성한 향수를 바로 사용해도 좋지만, 서늘한 옷장 속에서 2주간 숙성했을 때 일어나는 놀라운 향의 변화를 알아봅니다.',
    img: './assets/images/perfume_warmsand_pine.jpg',
    body: `
      <p style="margin-bottom:16px;">조향 클래스에서 여러 가지 향료(Fragrance Oil)와 베이스를 블렌딩한 직후에는 각 향료 분자들이 아직 완전히 결합하지 않아 알코올의 날카로운 기운이 살짝 느껴질 수 있습니다.</p>
      <p style="margin-bottom:16px;">직사광선이 닿지 않는 서늘한 곳(15~20℃)에서 약 10일~14일간 안정화(Maceration) 과정을 거치면, 가벼운 시트러스 분자부터 묵직한 우디·머스크 분자까지 고르게 결합하여 훨씬 둥글고 깊은 발향을 보여줍니다.</p>
      <p style="margin-bottom:16px;">포항 여행의 마지막 날 온다 향방에서 만든 향수를 집으로 돌아가 2주 뒤 처음 꺼내 뿌리는 순간, 영일대 바다의 기억이 가장 완벽한 향기로 다시 찾아올 것입니다.</p>
    `
  }
];

// 5. Reviews & Instagram Feed Data (Grouped by Category: 'class', 'shop', 'group')
let REVIEWS_DATA = [
  {
    category: 'class',
    stars: '★★★★★',
    text: '포항 여행 중 남자친구와 영일대 데이트 코스로 예약했어요. 구 윤슬향방 때부터 유명해서 기대했는데, 리뉴얼된 공간이 정말 차분하고 예뻐요! 조향사님이 취향을 세심하게 잡아주셔서 둘 다 인생 향수 만들었습니다.',
    author: '김*연 님',
    tag: '시그니처 원데이 클래스 50ml · 2026.10',
    formulaNote: '나만의 레시피: "영일대 윤슬" (베르가못 + 화이트티 + 시더우드)',
    moodTags: ['#윤슬처럼맑은향', '#영일대데이트추천']
  },
  {
    category: 'shop',
    stars: '★★★★★',
    text: '시향 없이 온라인으로 ‘윤슬(YUNSEUL)’ 본품을 구매했는데 설명 그대로 오후 햇살이 비치는 바닷가에서 맑은 홍차를 마시는 기분이에요. 보틀에 각인해주신 문구도 고급스러워서 친구 생일 선물로 한 병 더 주문합니다.',
    author: '이*현 님',
    tag: '윤슬 (YUNSEUL) 오 드 퍼퓸 · 네이버페이 구매',
    formulaNote: '선택 향조: 시그니처 윤슬 (YUNSEUL) 50ml',
    moodTags: ['#보틀각인선물추천', '#살결에남는포근한잔향']
  },
  {
    category: 'class',
    stars: '★★★★★',
    text: '엄마와 모녀 여행으로 방문했는데 웰컴 티부터 시향 과정까지 대접받는 기분이었어요. 머리 아픈 인공 향이 아니라 자연스럽고 고급스러운 잔향이라 엄마도 매일 뿌리고 다니세요.',
    author: '최*서 님',
    tag: '시그니처 원데이 클래스 50ml · 2026.10',
    formulaNote: '나만의 레시피: "모래의 정원" (네롤리 + 아이리스 + 샌달우드)',
    moodTags: ['#머리안아픈자연향', '#조향사님섬세한가이드']
  },
  {
    category: 'shop',
    stars: '★★★★★',
    text: '침실에 둘 디퓨저를 찾다가 ‘영일대의 밤’ 디퓨저를 샀는데, 라벤더와 편백 향이 과하지 않고 은은하게 방 안을 채워줘서 퇴근하고 방문 열 때마다 힐링됩니다.',
    author: '정*우 님',
    tag: '영일대의 밤 리드 디퓨저 · 카카오페이 구매',
    formulaNote: '선택 향조: 영일대의 밤 디퓨저 200ml',
    moodTags: ['#머리안아픈자연향', '#살결에남는포근한잔향']
  },
  {
    category: 'group',
    stars: '★★★★★',
    text: '회사 팀 워크숍으로 12명 단체 클래스를 진행했습니다. 사전 문의부터 일정 조율, 영수증 처리까지 너무 깔끔했고 팀원들 만족도가 역대 최고였어요!',
    author: '박*진 매니저',
    tag: '기업/단체 프라이빗 워크숍 · 2026.09',
    formulaNote: '프로그램: 기업 맞춤형 룸스프레이 & 향수 단체 클래스',
    moodTags: ['#조향사님섬세한가이드', '#보틀각인선물추천']
  },
  {
    category: 'shop',
    stars: '★★★★★',
    text: '디스커버리 시향 키트로 4가지 향을 먼저 써보고 ‘파도(ONDA)’ 본품으로 정착했어요. 무화과 잎의 쌉싸름함과 차분한 물기 어린 우디 향이 독보적입니다.',
    author: '한*결 님',
    tag: '파도 (ONDA) 오 드 퍼퓸 · 바우처 사용 구매',
    formulaNote: '선택 향조: 시그니처 파도 (ONDA) 50ml',
    moodTags: ['#윤슬처럼맑은향', '#살결에남는포근한잔향']
  }
];

const INSTA_POSTS = [
  {
    img: './assets/images/hero_slide_1.jpg',
    caption: '영일대 오후 3시의 윤슬과 시그니처 보틀 #온다향방'
  },
  {
    img: './assets/images/hero_slide_2.jpg',
    caption: '오전 11시 타임 원데이 클래스 테이블 세팅 #포항조향클래스'
  },
  {
    img: './assets/images/perfume_yunseul.jpg',
    caption: '시그니처 오 드 퍼퓸 윤슬(YUNSEUL) 50ml #윤슬향수'
  },
  {
    img: './assets/images/perfume_onda.jpg',
    caption: '비 온 뒤 해변의 무화과 잎과 베티버, 파도(ONDA) #온다아틀리에'
  },
  {
    img: './assets/images/perfume_warmsand_pine.jpg',
    caption: '모래의 온기 & 해송의 숲 시그니처 듀오 #포항기념품'
  },
  {
    img: './assets/images/fragrance_home_set.jpg',
    caption: '공간을 채우는 영일대의 밤 디퓨저 & 룸스프레이 #영일대데이트'
  }
];

// 6. FAQ Data
const FAQ_DATA = [
  {
    q: 'Q. 원데이 클래스 소요 시간은 얼마나 걸리나요? 당일 예약도 가능한가요?',
    a: '시그니처 원데이 향수 클래스(50ml)는 약 80~90분, 홈 프래그런스(디퓨저/룸스프레이) 클래스는 약 70분 소요됩니다. 온다 향방은 100% 사전 예약제로 운영되나, 당일 잔여석이 있는 경우에 한해 홈페이지 실시간 예약 또는 카카오톡 채널 문의 후 당일 입장이 가능합니다.'
  },
  {
    q: 'Q. 향수를 잘 모르거나 결정장애가 있어도 나만의 향을 만들 수 있을까요?',
    a: '물론입니다. 수강생의 80% 이상이 조향을 처음 경험하시는 분들입니다. 전문 조향사가 선호하는 계절과 분위기, 피하고 싶은 노트를 먼저 상담한 뒤 단계별로 블렌딩 비율을 세심하게 가이드해 드리므로 누구나 완성도 높은 향수를 만드실 수 있습니다.'
  },
  {
    q: 'Q. 예약 취소 및 날짜/시간 변경, 환불 규정이 어떻게 되나요?',
    a: '노쇼(No-Show) 방지를 위해 예약금 또는 전액 결제 후 예약이 확정됩니다. 수업일 기준 2일 전까지는 100% 전액 환불 및 일정 변경이 가능하며, 수업 하루 전 취소 시 50% 환불, 당일 취소 및 노쇼의 경우 재료 세팅 관계로 환불이 불가합니다.'
  },
  {
    q: 'Q. 구 ‘윤슬향방’에서 만들었던 향수 레시피로 재주문할 수 있나요?',
    a: '네, 가능합니다! 기존 윤슬향방에서 작성하셨던 모든 수강생분들의 포뮬러 시트를 온다 향방에서 그대로 안전하게 보관하고 있습니다. 예약자 성함과 방문 시기를 [VISIT & CONTACT] 1:1 문의나 카카오톡 채널로 남겨주시면 공방 방문 또는 택배 발송으로 재제작해 드립니다.'
  },
  {
    q: 'Q. 임산부나 알레르기가 있는 경우, 또는 반려동물 동반이 가능한가요?',
    a: '온다 향방은 국제향료협회(IFRA) 기준을 준수한 안전한 원료를 사용하지만, 임신 초기이시거나 특정 천연 에센셜 오일 알레르기가 있으신 경우 사전 요청란에 기재해 주시면 자극 없는 원료 위주로 세팅해 드립니다. 반려동물은 후각 보호를 위해 케이지/이동가방 지참 시 프라이빗 타임에 한해 동반 가능합니다.'
  }
];
