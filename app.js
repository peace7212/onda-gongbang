/* ==========================================================================
   ONDA PERFUME STUDIO (온다 향방) — Interactive Application Logic
   Seed data lives in data.js · persistence via onda-store.js
   ========================================================================== */


// ==========================================================================
// APPLICATION STATE
// ==========================================================================
let currentBookingState = {
  classId: 'class-perfume-50',
  year: 2026,
  month: 10, // October 2026
  selectedDay: 24,
  selectedTimeslot: '14:00',
  headcount: 2,
  payMode: 'deposit', // 'deposit' or 'full'
  payProvider: '네이버페이'
};

// Populated from OndaStore (reservations made in this browser: mine === true)
let reservationsList = [];

// ==========================================================================
// STORE HYDRATION (관리자 페이지와 localStorage 연동)
// ==========================================================================
function replaceArrayContents(target, source) {
  target.splice(0, target.length, ...source);
}

function formatReservationDate(dateStr, slot) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = ['일', '월', '화', '수', '목', '금', '토'][new Date(y, m - 1, d).getDay()];
  return `${y}년 ${m}월 ${d}일 (${dow}) · ${slot} 타임`;
}

const RES_STATUS_LABEL = {
  pending: '예약 접수 (확정 대기)',
  confirmed: '예약 확정',
  completed: '수강 완료',
  cancelled: '취소 · 환불 접수'
};

function hydrateFromStore() {
  if (typeof OndaStore === 'undefined') return;
  const state = OndaStore.load();

  if (state.heroSlides && state.heroSlides.length) replaceArrayContents(HERO_SLIDES, state.heroSlides);
  if (state.classes && state.classes.length) replaceArrayContents(CLASSES_DATA, state.classes.filter(c => c.active !== false));
  if (state.products && state.products.length) replaceArrayContents(PRODUCTS_DATA, state.products.filter(p => p.visible !== false));

  // Best reviews first, hidden reviews excluded
  REVIEWS_DATA = state.reviews
    .filter(r => !r.hidden)
    .sort((a, b) => (b.best ? 1 : 0) - (a.best ? 1 : 0));

  reservationsList = state.reservations
    .filter(r => r.mine)
    .map(r => ({
      resNo: r.resNo,
      classTitle: r.classTitle,
      dateStr: formatReservationDate(r.date, r.slot),
      headcount: r.headcount,
      guestName: r.name,
      engraving: r.engraving || '현장 작성 예정',
      paidAmount: r.paidAmount,
      status: r.status,
      payStatus: `${RES_STATUS_LABEL[r.status] || r.status} · ${r.payMode === 'deposit' ? '예약금' : '전액'} ${r.payProvider}`
    }));

  if (!CLASSES_DATA.find(c => c.id === currentBookingState.classId) && CLASSES_DATA[0]) {
    currentBookingState.classId = CLASSES_DATA[0].id;
  }

  applyNoticeBar(state.notice);
}

function applyNoticeBar(notice) {
  const bar = document.querySelector('.top-notice');
  if (!bar || !notice) return;
  bar.style.display = notice.enabled === false ? 'none' : '';
  const tagEl = document.getElementById('noticeTag');
  const textEl = document.getElementById('noticeText');
  const linkEl = document.getElementById('noticeLink');
  if (tagEl) tagEl.textContent = notice.tag || '';
  if (textEl) textEl.innerHTML = notice.html || '';
  if (linkEl) linkEl.textContent = notice.linkText || '';
}

function rerenderAll() {
  hydrateFromStore();
  renderHomeClasses();
  renderProgramGuideWindow();
  renderHomeProducts();
  renderShopProducts();
  renderReviewsAndSocial();
  renderBookingWorkbench();
  updateBadgesAndDrawers();
  const slide = HERO_SLIDES[currentHeroSlideIndex];
  const titleEl = document.getElementById('heroSlideTitle');
  const subEl = document.getElementById('heroSlideSubtitle');
  const tideEl = document.getElementById('tideStateLabel');
  if (slide && titleEl && subEl) {
    titleEl.innerHTML = slide.title;
    subEl.textContent = slide.subtitle;
    if (tideEl && slide.tideLabel) tideEl.textContent = slide.tideLabel;
  }
}

let shoppingCart = [];
let activeShopCategory = 'all';
let activeShopSort = 'featured';
let activeProgramGuideId = 'class-perfume-50';
let activeReviewFilter = 'all';
let inlineComposerState = {
  category: 'class',
  starsCount: 5
};

// ==========================================================================
// NAVIGATION & VIEW ROUTING
// ==========================================================================
function navigateTo(viewId, scrollAnchorId = null) {
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });
  const targetSection = document.getElementById(`view-${viewId}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Group 'about' and 'visit' under the same top nav item ('about')
  const navHighlightTarget = viewId === 'visit' ? 'about' : viewId;
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === navHighlightTarget);
  });

  // Close mobile menu if open
  document.getElementById('mainNav').classList.remove('mobile-open');

  if (scrollAnchorId) {
    setTimeout(() => {
      const anchor = document.getElementById(scrollAnchorId);
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function toggleMobileMenu() {
  document.getElementById('mainNav').classList.toggle('mobile-open');
}

// Sticky header scroll effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('siteHeader');
  if (header) {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }
});

// ==========================================================================
// HERO PHOTOREALISTIC SLIDE TRANSITION & AUTO-PLAY
// ==========================================================================
let currentHeroSlideIndex = 0;
let heroAutoSlideTimer = null;
let isHeroSlidePaused = false;

function switchHeroSlide(index) {
  const total = HERO_SLIDES.length;
  currentHeroSlideIndex = ((index % total) + total) % total;
  const slide = HERO_SLIDES[currentHeroSlideIndex];
  if (!slide) return;

  // 1. Slide Full-Bleed Background Track Horizontally
  const bgTrack = document.getElementById('heroBgTrack');
  if (bgTrack) {
    bgTrack.style.transform = `translate3d(-${currentHeroSlideIndex * 100}%, 0, 0)`;
  }
  document.querySelectorAll('.hero__bg-slide').forEach((el, idx) => {
    el.classList.toggle('active', idx === currentHeroSlideIndex);
  });

  // 2. Slide Right-Column Photorealistic Showcase Deck Horizontally in Sync
  const showcaseTrack = document.getElementById('heroShowcaseTrack');
  if (showcaseTrack) {
    showcaseTrack.style.transform = `translate3d(-${currentHeroSlideIndex * 100}%, 0, 0)`;
  }

  // 3. Smoothly transition Hero Title, Subtitle, Badge & Slide Counter
  const titleEl = document.getElementById('heroSlideTitle');
  const subEl = document.getElementById('heroSlideSubtitle');
  const tideLabelEl = document.getElementById('tideStateLabel');
  const numEl = document.getElementById('heroSlideCurrentNum');
  const tagTextEl = document.getElementById('heroSlideTagText');

  if (titleEl && subEl) {
    titleEl.style.opacity = '0';
    titleEl.style.transform = 'translateY(8px)';
    subEl.style.opacity = '0';
    subEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      titleEl.innerHTML = slide.title;
      subEl.textContent = slide.subtitle;
      if (tideLabelEl && slide.tideLabel) tideLabelEl.textContent = slide.tideLabel;
      titleEl.style.opacity = '1';
      titleEl.style.transform = 'translateY(0)';
      subEl.style.opacity = '1';
      subEl.style.transform = 'translateY(0)';
    }, 180);
  }

  if (numEl) numEl.textContent = slide.num;
  if (tagTextEl) tagTextEl.textContent = slide.tagText;

  // 4. Update Tab Buttons & Restart Progress Bar Animation
  const navBtns = document.querySelectorAll('.hero-slide-btn');
  navBtns.forEach((btn, idx) => {
    const isActive = idx === currentHeroSlideIndex;
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    if (isActive) {
      // Force reflow to restart CSS progress bar animation
      void btn.offsetWidth;
      btn.classList.add('active');
    }
  });

  resetHeroAutoSlideTimer();
}

function stepHeroSlide(delta) {
  switchHeroSlide(currentHeroSlideIndex + delta);
}

function pauseHeroAutoSlide(paused) {
  isHeroSlidePaused = paused;
}

function resetHeroAutoSlideTimer() {
  if (heroAutoSlideTimer) clearInterval(heroAutoSlideTimer);
  heroAutoSlideTimer = setInterval(() => {
    if (!isHeroSlidePaused) {
      switchHeroSlide(currentHeroSlideIndex + 1);
    }
  }, 6000);
}

function initHeroAutoSlider() {
  resetHeroAutoSlideTimer();
}

// ==========================================================================
// RENDER HOME, PROGRAM GUIDE WINDOW & SUBVIEW COMPONENTS
// ==========================================================================
function formatKRW(num) {
  return num.toLocaleString('ko-KR') + '원';
}

function renderHomeClasses() {
  const container = document.getElementById('homeClassGrid');
  if (!container) return;

  container.innerHTML = CLASSES_DATA.map(c => `
    <article class="class-card">
      <div class="class-card__img" onclick="openProgramDetailModal('${c.id}')" style="cursor:pointer;">
        <img src="${c.img}" alt="${c.title}" loading="lazy" />
        <span class="class-card__badge">${c.badge}</span>
      </div>
      <div class="class-card__body">
        <div class="class-card__meta">${c.meta}</div>
        <h3 class="class-card__title" onclick="openProgramDetailModal('${c.id}')" style="cursor:pointer;">${c.title}</h3>
        <p class="class-card__desc">${c.desc}</p>
        <div class="class-card__steps"><strong>진행 순서:</strong> ${c.steps}</div>
        <div class="class-card__footer tabular-nums">
          <div class="class-card__price">${formatKRW(c.price)} <small>/ 1인</small></div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn--outline-navy btn--sm" onclick="openProgramDetailModal('${c.id}')">
              상세 안내 창
            </button>
            <button class="btn btn--navy btn--sm" onclick="preselectClassAndBook('${c.id}')">
              예약하기 &rarr;
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

function createProgramDetailMarkup(c, isModal = false) {
  return `
    <div class="program-detail-grid">
      <div>
        <div style="border-radius:var(--radius-md); overflow:hidden; aspect-ratio:16/10; margin-bottom:18px;">
          <img src="${c.img}" alt="${c.title}" style="width:100%; height:100%; object-fit:cover;" />
        </div>
        <div style="background:var(--color-ivory); padding:18px; border-radius:var(--radius-sm); border:1px solid var(--border-hairline);">
          <div style="font-size:0.78rem; font-weight:700; color:var(--color-sage-deep); margin-bottom:6px;">RECOMMENDED FOR · 추천 대상</div>
          <p style="font-size:0.9rem; color:var(--color-navy); margin-bottom:14px;">${c.recommendFor}</p>
          <div style="font-size:0.78rem; font-weight:700; color:var(--color-sage-deep); margin-bottom:8px;">INCLUDED · 클래스 포함 내역</div>
          <div class="program-includes" style="margin:0;">
            ${c.includes.map(inc => `<span class="include-badge">✓ ${inc}</span>`).join('')}
          </div>
        </div>
      </div>

      <div>
        <span class="eyebrow">${c.badge} · ${c.meta}</span>
        <h3 style="font-family:var(--font-serif-kr); font-size:1.5rem; color:var(--color-navy); margin-bottom:8px;">${c.title}</h3>
        <div class="tabular-nums" style="font-size:1.25rem; font-weight:700; color:var(--color-navy); margin-bottom:12px;">
          ${formatKRW(c.price)} <small style="font-size:0.82rem; font-weight:400; color:var(--text-muted);">/ 1인 기준 (2인 이상 동반 시 5% 할인)</small>
        </div>
        <p style="font-size:0.92rem; color:var(--text-secondary); margin-bottom:16px;">${c.desc}</p>

        <div style="font-size:0.82rem; font-weight:700; color:var(--color-navy); margin-bottom:8px;">TIME-BY-TIME CURRICULUM (시간대별 세부 진행 안내)</div>
        <div class="program-timeline">
          ${c.timeline.map(step => `
            <div class="timeline-step">
              <div class="timeline-step__time tabular-nums">${step.time}</div>
              <div class="timeline-step__content">
                <strong>${step.title}</strong>
                <span>${step.detail}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:20px;">
          <button type="button" class="btn btn--navy" onclick="${isModal ? "closeModal('programDetailModal');" : ''} preselectClassAndBook('${c.id}')">
            이 프로그램으로 실시간 잔여석 예약하기 &rarr;
          </button>
          <button type="button" class="btn btn--outline-navy" onclick="${isModal ? "closeModal('programDetailModal');" : ''} navigateTo('journal', 'reviewComposerWindow')">
            수강생 리얼 후기 보기 / 작성
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderProgramGuideWindow() {
  const container = document.getElementById('programGuideDetailBody');
  if (!container) return;
  const c = CLASSES_DATA.find(item => item.id === activeProgramGuideId) || CLASSES_DATA[0];
  container.innerHTML = createProgramDetailMarkup(c, false);
}

function switchProgramGuideTab(classId, btnEl) {
  activeProgramGuideId = classId;
  document.querySelectorAll('#programGuideTabs .filter-tab').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderProgramGuideWindow();
}

function openProgramDetailModal(classId) {
  const c = CLASSES_DATA.find(item => item.id === classId) || CLASSES_DATA[0];
  const modalBody = document.getElementById('programDetailModalBody');
  if (!modalBody) return;
  modalBody.innerHTML = createProgramDetailMarkup(c, true);
  openModal('programDetailModal');
}

function createProductCardHTML(p) {
  const notesPreview = p.pyramid.top.split(',').slice(0, 2).concat(p.pyramid.base.split(',').slice(0, 1));
  return `
    <article class="product-card">
      <div class="product-card__media" onclick="openProductDetailModal('${p.id}')">
        <img src="${p.img}" alt="${p.title}" loading="lazy" />
        <span class="product-card__tag ${p.tagType === 'sage' ? 'product-card__tag--sage' : ''}">${p.tag}</span>
      </div>
      <div class="product-card__content">
        <div class="product-card__category">${p.categoryLabel}</div>
        <h3 class="product-card__title" onclick="openProductDetailModal('${p.id}')">${p.title}</h3>
        <p class="product-card__emotion">${p.emotion}</p>
        <div class="product-card__notes">
          ${notesPreview.map(n => `<span class="note-chip">${n.trim()}</span>`).join('')}
        </div>
        <div class="product-card__bottom tabular-nums">
          <span class="product-card__price">${formatKRW(p.price)}</span>
          <div class="product-card__actions">
            <button class="icon-btn" onclick="openProductDetailModal('${p.id}')">시향 노트</button>
            <button class="icon-btn" style="background:var(--color-navy); color:var(--color-ivory);" onclick="quickAddToCart('${p.id}')">담기</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderHomeProducts() {
  const container = document.getElementById('homeProductGrid');
  if (!container) return;
  container.innerHTML = PRODUCTS_DATA.slice(0, 4).map(createProductCardHTML).join('');
}

function renderShopProducts() {
  const container = document.getElementById('shopProductGrid');
  if (!container) return;

  let list = PRODUCTS_DATA.filter(p => activeShopCategory === 'all' || p.category === activeShopCategory);
  if (activeShopSort === 'price-asc') {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (activeShopSort === 'price-desc') {
    list = [...list].sort((a, b) => b.price - a.price);
  }

  container.innerHTML = list.map(createProductCardHTML).join('');
}

function filterShopProducts(category, tabBtn) {
  activeShopCategory = category;
  document.querySelectorAll('#shopCategoryTabs .filter-tab').forEach(b => b.classList.remove('active'));
  if (tabBtn) tabBtn.classList.add('active');
  renderShopProducts();
}

function sortShopProducts(sortValue) {
  activeShopSort = sortValue;
  renderShopProducts();
}

function renderReviewsAndSocial() {
  const homeRev = document.getElementById('homeReviewGrid');
  if (homeRev) {
    homeRev.innerHTML = REVIEWS_DATA.slice(0, 3).map(r => `
      <div class="review-card">
        <div>
          <div class="review-card__stars">${r.stars}</div>
          <p class="review-card__text">“${r.text}”</p>
          ${r.formulaNote ? `<div style="font-size:0.78rem; color:var(--color-sand); margin-bottom:10px;">• ${r.formulaNote}</div>` : ''}
        </div>
        <div class="review-card__author">
          <strong>${r.author}</strong>
          <span>${r.tag}</span>
        </div>
      </div>
    `).join('');
  }

  const archiveRev = document.getElementById('archiveReviewGrid');
  if (archiveRev) {
    const filtered = REVIEWS_DATA.filter(r => activeReviewFilter === 'all' || r.category === activeReviewFilter);
    archiveRev.innerHTML = filtered.map(r => `
      <div class="review-card review-card--light">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div class="review-card__stars" style="margin-bottom:0;">${r.stars}</div>
            <span class="note-chip" style="font-weight:600;">${r.category === 'class' ? '클래스 후기' : r.category === 'shop' ? '스토어 후기' : '단체 워크숍'}</span>
          </div>
          <p class="review-card__text">“${r.text}”</p>
          ${r.formulaNote ? `<div style="font-size:0.8rem; color:var(--color-sage-deep); font-weight:600; margin-bottom:8px;">• ${r.formulaNote}</div>` : ''}
          ${r.moodTags && r.moodTags.length ? `
            <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:14px;">
              ${r.moodTags.map(t => `<span class="note-chip">${t}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="review-card__author">
          <strong>${r.author}</strong>
          <span>${r.tag}</span>
        </div>
      </div>
    `).join('');
  }

  const instaStrip = document.getElementById('homeInstaStrip');
  if (instaStrip) {
    instaStrip.innerHTML = INSTA_POSTS.map(post => `
      <div class="insta-item" onclick="showToast('인스타그램 @onda_perfume_pohang 피드 상세 보기 (시안)')">
        <img src="${post.img}" alt="${post.caption}" loading="lazy" />
        <div class="insta-item__overlay">${post.caption}</div>
      </div>
    `).join('');
  }
}

function filterArchiveReviews(category, btnEl) {
  activeReviewFilter = category;
  document.querySelectorAll('#reviewCategoryFilterTabs .filter-tab').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderReviewsAndSocial();
}

function renderJournals() {
  const grid = document.getElementById('journalListGrid');
  if (!grid) return;

  grid.innerHTML = JOURNAL_DATA.map(j => `
    <article class="journal-card" onclick="openJournalModal('${j.id}')">
      <div class="journal-card__img">
        <img src="${j.img}" alt="${j.title}" loading="lazy" />
      </div>
      <div class="journal-card__body">
        <div class="journal-card__vol">${j.vol} · ${j.date}</div>
        <h3 class="journal-card__title">${j.title}</h3>
        <p class="journal-card__excerpt">${j.excerpt}</p>
        <span style="font-size:0.84rem; font-weight:600; color:var(--color-navy); text-decoration:underline;">
          아티클 전문 읽기 &rarr;
        </span>
      </div>
    </article>
  `).join('');
}

function renderFAQ() {
  const list = document.getElementById('faqAccordionList');
  if (!list) return;

  list.innerHTML = FAQ_DATA.map((item, idx) => `
    <div class="faq-item ${idx === 0 ? 'open' : ''}">
      <button class="faq-question" onclick="toggleFaqItem(this)">
        <span>${item.q}</span>
        <span>&#9662;</span>
      </button>
      <div class="faq-answer">${item.a}</div>
    </div>
  `).join('');
}

function toggleFaqItem(btn) {
  const parent = btn.closest('.faq-item');
  if (parent) parent.classList.toggle('open');
}

// ==========================================================================
// REAL-TIME CLASS BOOKING ENGINE (Calendar + Timeslots + Pricing)
// ==========================================================================
function preselectClassAndBook(classId) {
  currentBookingState.classId = classId;
  renderBookingWorkbench();
  navigateTo('class', 'bookingWorkbench');
}

function renderBookingWorkbench() {
  // 1. Render Class Selector Radio Cards
  const classListEl = document.getElementById('bookingClassList');
  if (classListEl) {
    classListEl.innerHTML = CLASSES_DATA.map(c => `
      <div class="class-radio-card ${currentBookingState.classId === c.id ? 'selected' : ''}" onclick="selectBookingClass('${c.id}')">
        <div class="class-radio-card__info">
          <h4>${c.title}</h4>
          <p>${c.meta}</p>
        </div>
        <div class="class-radio-card__price tabular-nums">${formatKRW(c.price)}</div>
      </div>
    `).join('');
  }

  // 2. Render Calendar
  renderBookingCalendar();

  // 3. Render Timeslots for Selected Date
  renderBookingTimeslots();

  // 4. Update Price Breakdown
  updateBookingSummary();
}

function selectBookingClass(classId) {
  currentBookingState.classId = classId;
  renderBookingWorkbench();
}

function changeCalendarMonth(delta) {
  let m = currentBookingState.month + delta;
  let y = currentBookingState.year;
  if (m < 10) {
    m = 10; // Lock min to Oct 2026
  } else if (m > 12) {
    m = 12;
  }
  currentBookingState.month = m;
  currentBookingState.year = y;
  currentBookingState.selectedDay = m === 10 ? 24 : 7;
  renderBookingWorkbench();
}

function renderBookingCalendar() {
  const { year, month, selectedDay } = currentBookingState;
  const labelEl = document.getElementById('calendarMonthLabel');
  if (labelEl) labelEl.textContent = `${year}년 ${month}월`;

  const gridEl = document.getElementById('calendarDaysGrid');
  if (!gridEl) return;

  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  let html = '';
  for (let i = 0; i < firstDayOfWeek; i++) {
    html += `<div class="cal-day cal-day--empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month - 1, d);
    const dow = dateObj.getDay(); // 1 === Monday (Closed)
    const isPastInOct = (month === 10 && d < 19);
    const isClosedMonday = (dow === 1);
    const disabled = isPastInOct || isClosedMonday;
    const isSelected = (!disabled && d === selectedDay);

    let statusText = '예약가능';
    if (isClosedMonday) statusText = '정기휴무';
    else if (isPastInOct) statusText = '마감';
    else if (d % 5 === 0) statusText = '잔여2석';

    html += `
      <button type="button"
        class="cal-day ${disabled ? 'cal-day--disabled' : ''} ${isSelected ? 'selected' : ''}"
        ${disabled ? 'disabled' : `onclick="selectCalendarDay(${d})"`}>
        <span>${d}</span>
        <span class="cal-day__status">${statusText}</span>
      </button>
    `;
  }

  gridEl.innerHTML = html;
}

function selectCalendarDay(day) {
  currentBookingState.selectedDay = day;
  renderBookingWorkbench();
}

function getSeatsForSlot(day, slot) {
  // Deterministic realistic seat availability based on date & slot
  const seed = (day * 7 + slot.charCodeAt(0) + slot.charCodeAt(1)) % 7;
  if (seed === 0) return 0; // Sold out occasionally
  return Math.max(1, Math.min(6, seed));
}

function renderBookingTimeslots() {
  const grid = document.getElementById('timeslotGrid');
  if (!grid) return;

  const slots = ['11:00', '14:00', '17:00'];
  const day = currentBookingState.selectedDay;

  grid.innerHTML = slots.map(slot => {
    const seats = getSeatsForSlot(day, slot);
    const isSoldOut = seats === 0;
    const isSelected = !isSoldOut && currentBookingState.selectedTimeslot === slot;
    return `
      <button type="button"
        class="timeslot-btn ${isSelected ? 'selected' : ''}"
        ${isSoldOut ? 'disabled' : `onclick="selectTimeslot('${slot}')"`}>
        <span class="timeslot-btn__time">${slot} 타임</span>
        <span class="timeslot-btn__seats">${isSoldOut ? '예약 마감' : `실시간 잔여 ${seats}석`}</span>
      </button>
    `;
  }).join('');
}

function selectTimeslot(slot) {
  currentBookingState.selectedTimeslot = slot;
  renderBookingTimeslots();
  updateBookingSummary();
}

function selectPayMode(mode) {
  currentBookingState.payMode = mode;
  document.getElementById('payTypeDeposit').classList.toggle('selected', mode === 'deposit');
  document.getElementById('payTypeFull').classList.toggle('selected', mode === 'full');
  updateBookingSummary();
}

function selectPayProvider(providerName, btnEl) {
  currentBookingState.payProvider = providerName;
  btnEl.parentElement.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('selected'));
  btnEl.classList.add('selected');
  updateBookingSummary();
}

function updateBookingSummary() {
  const headcountEl = document.getElementById('bookingHeadcount');
  const headcount = headcountEl ? parseInt(headcountEl.value, 10) : 2;
  currentBookingState.headcount = headcount;

  const selectedClass = CLASSES_DATA.find(c => c.id === currentBookingState.classId) || CLASSES_DATA[0];
  const baseTotal = selectedClass.price * headcount;
  const discount = headcount >= 2 ? Math.round(baseTotal * 0.05) : 0;
  const finalClassPrice = baseTotal - discount;
  const depositTotal = 20000 * headcount;
  const payNowAmount = currentBookingState.payMode === 'deposit' ? depositTotal : finalClassPrice;

  const breakdownEl = document.getElementById('bookingPriceBreakdown');
  if (!breakdownEl) return;

  breakdownEl.innerHTML = `
    <div class="price-row">
      <span>선택 클래스</span>
      <strong>${selectedClass.title}</strong>
    </div>
    <div class="price-row">
      <span>예약 일시</span>
      <strong>${currentBookingState.year}.${currentBookingState.month}.${currentBookingState.selectedDay} (${currentBookingState.selectedTimeslot} 타임)</strong>
    </div>
    <div class="price-row">
      <span>수강료 합계 (${headcount}명)</span>
      <span>${formatKRW(baseTotal)}</span>
    </div>
    ${discount > 0 ? `
      <div class="price-row" style="color:var(--color-success);">
        <span>동반 2인 이상 5% 할인</span>
        <span>-${formatKRW(discount)}</span>
      </div>
    ` : ''}
    <div class="price-row price-row--total">
      <span>지금 결제할 금액 (${currentBookingState.payMode === 'deposit' ? '예약금' : '전액'} · ${currentBookingState.payProvider})</span>
      <span>${formatKRW(payNowAmount)}</span>
    </div>
  `;
}

function submitClassBooking(e) {
  e.preventDefault();
  const name = document.getElementById('bookingName').value.trim();
  const phone = document.getElementById('bookingPhone').value.trim();
  const engraving = document.getElementById('bookingEngraving').value.trim() || '현장 작성 예정';
  const selectedClass = CLASSES_DATA.find(c => c.id === currentBookingState.classId) || CLASSES_DATA[0];
  const headcount = currentBookingState.headcount;
  const baseTotal = selectedClass.price * headcount;
  const discount = headcount >= 2 ? Math.round(baseTotal * 0.05) : 0;
  const payNowAmount = currentBookingState.payMode === 'deposit' ? (20000 * headcount) : (baseTotal - discount);

  const newRes = {
    resNo: `ONDA-${currentBookingState.month}${currentBookingState.selectedDay}-${Math.floor(100 + Math.random() * 900)}`,
    classTitle: selectedClass.title,
    dateStr: `${currentBookingState.year}년 ${currentBookingState.month}월 ${currentBookingState.selectedDay}일 · ${currentBookingState.selectedTimeslot} 타임`,
    headcount,
    guestName: `${name} (${phone})`,
    engraving,
    paidAmount: payNowAmount,
    payStatus: `${currentBookingState.payMode === 'deposit' ? '예약금' : '전액'} 결제 완료 (${currentBookingState.payProvider} · 카카오 알림톡 발송 완료)`
  };

  reservationsList.unshift(newRes);
  updateBadgesAndDrawers();
  e.target.reset();
  showToast(`[예약 확정] ${name}님, ${newRes.dateStr} 클래스 예약 및 알림톡 발송이 완료되었습니다!`);
  openDrawer('reservationDrawer');
}

// ==========================================================================
// PRODUCT DETAIL MODAL (Scent Pyramid + Live Bottle Label Engraving)
// ==========================================================================
function openProductDetailModal(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const container = document.getElementById('productModalContent');
  container.innerHTML = `
    <div class="product-modal__visual">
      <div class="product-modal__img-wrap">
        <img src="${product.img}" alt="${product.title}" />
      </div>
      <div class="bottle-label-preview">
        <div class="bottle-label-preview__brand">ONDA PERFUME STUDIO · POHANG</div>
        <div class="bottle-label-preview__name">${product.title}</div>
        <div style="font-size:0.75rem; color:var(--text-secondary);">Eau de Parfum · Vaporisateur Natural Spray</div>
        <div class="bottle-label-preview__custom" id="liveLabelPreview">For You, 2026.10</div>
      </div>
    </div>

    <div class="product-modal__details">
      <span class="eyebrow">${product.categoryLabel}</span>
      <h2 id="modalProductTitle" style="font-family:var(--font-serif-kr); font-size:1.55rem; color:var(--color-navy); margin-bottom:8px;">
        ${product.title}
      </h2>
      <div class="tabular-nums" style="font-size:1.3rem; font-weight:700; color:var(--color-navy); margin-bottom:16px;">
        ${formatKRW(product.price)}
      </div>

      <p style="font-size:0.93rem; color:var(--text-secondary); line-height:1.75; margin-bottom:16px;">
        ${product.storyLong}
      </p>

      <!-- Scent Pyramid Box -->
      <div class="scent-pyramid-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <strong style="font-size:0.84rem; color:var(--color-navy); letter-spacing:0.06em;">SCENT PYRAMID (향조 피라미드)</strong>
          <span style="font-size:0.76rem; color:var(--color-sage-deep);">${product.longevity}</span>
        </div>
        <div class="pyramid-row">
          <span class="pyramid-tier">▲ TOP</span>
          <span class="pyramid-notes">${product.pyramid.top}</span>
        </div>
        <div class="pyramid-row">
          <span class="pyramid-tier">◆ MIDDLE</span>
          <span class="pyramid-notes">${product.pyramid.middle}</span>
        </div>
        <div class="pyramid-row">
          <span class="pyramid-tier">■ BASE</span>
          <span class="pyramid-notes">${product.pyramid.base}</span>
        </div>
      </div>

      <!-- Gifting & Engraving Options -->
      <div class="form-group">
        <label class="form-label" for="modalEngravingInput">무료 보틀 라벨 각인 문구 (최대 18자 · 좌측 라벨 실시간 미리보기)</label>
        <input type="text" id="modalEngravingInput" class="form-input" maxlength="18" value="For You, 2026.10" oninput="updateLiveBottleLabel(this.value)" />
      </div>

      <div class="form-group">
        <label class="form-label" for="modalGiftOption">선물 패키징 옵션 (Gifting Option)</label>
        <select id="modalGiftOption" class="form-select tabular-nums">
          <option value="0">기본 시그니처 코튼 파우치 + 하드케이스 (무료)</option>
          <option value="4000">시그니처 리본 기프트 포장 + 전용 쇼핑백 + 메시지 카드 (+4,000원)</option>
        </select>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:22px;">
        <button class="btn btn--outline-navy" onclick="addProductFromModal('${product.id}', false)">
          장바구니 담기
        </button>
        <button class="btn btn--navy" onclick="addProductFromModal('${product.id}', true)">
          네이버페이 / 바로 구매
        </button>
      </div>
    </div>
  `;

  openModal('productModal');
}

function updateLiveBottleLabel(val) {
  const previewEl = document.getElementById('liveLabelPreview');
  if (previewEl) {
    previewEl.textContent = val.trim() || 'ONDA BESPOKE';
  }
}

function addProductFromModal(productId, openCartImmediately) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const engravingInput = document.getElementById('modalEngravingInput');
  const giftSelect = document.getElementById('modalGiftOption');
  const engravingText = engravingInput ? engravingInput.value.trim() : '각인 없음';
  const giftExtra = giftSelect ? parseInt(giftSelect.value, 10) : 0;

  shoppingCart.push({
    cartItemId: 'CART-' + Date.now() + '-' + Math.floor(Math.random() * 100),
    product,
    engravingText: engravingText || '기본 라벨',
    giftExtra,
    unitPrice: product.price + giftExtra
  });

  closeModal('productModal');
  updateBadgesAndDrawers();
  showToast(`[${product.title}] 상품이 장바구니에 담겼습니다.`);

  if (openCartImmediately) {
    openDrawer('cartDrawer');
  }
}

function quickAddToCart(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  shoppingCart.push({
    cartItemId: 'CART-' + Date.now() + '-' + Math.floor(Math.random() * 100),
    product,
    engravingText: '기본 시그니처 라벨',
    giftExtra: 0,
    unitPrice: product.price
  });

  updateBadgesAndDrawers();
  showToast(`[${product.title}] 장바구니에 추가되었습니다.`);
}

function removeCartItem(cartItemId) {
  shoppingCart = shoppingCart.filter(item => item.cartItemId !== cartItemId);
  updateBadgesAndDrawers();
}

function checkoutCart(payMethodName) {
  if (shoppingCart.length === 0) return;
  const total = shoppingCart.reduce((acc, item) => acc + item.unitPrice, 0);
  shoppingCart = [];
  updateBadgesAndDrawers();
  closeDrawer('cartDrawer');
  showToast(`[주문 완료] ${payMethodName}로 총 ${formatKRW(total)} 결제가 완료되었습니다. 시향 바이알 2종이 함께 발송됩니다!`);
}

// ==========================================================================
// SCENT FINDER QUIZ MODAL
// ==========================================================================
function openScentFinderModal() {
  const body = document.getElementById('scentFinderBody');
  body.innerHTML = `
    <span class="eyebrow">ONLINE SCENT FINDER</span>
    <h3 style="font-family:var(--font-serif-kr); font-size:1.45rem; color:var(--color-navy); margin-bottom:10px;">
      나에게 어울리는 온다 향방 시그니처 향 찾기
    </h3>
    <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:22px;">
      지금 가장 끌리는 영일대 바다의 순간과 선호하는 분위기를 선택해 주세요.
    </p>
    <div style="display:grid; gap:12px;">
      <button class="class-radio-card" onclick="showScentFinderResult('prod-yunseul')">
        <div class="class-radio-card__info">
          <h4>01. 햇살이 반짝이는 오후 2시의 맑고 투명한 바다</h4>
          <p>청량한 시트러스와 깨끗한 화이트 티, 비누/코튼 계열의 맑은 살결 잔향</p>
        </div>
        <span>선택 &rarr;</span>
      </button>
      <button class="class-radio-card" onclick="showScentFinderResult('prod-onda')">
        <div class="class-radio-card__info">
          <h4>02. 새벽 파도가 지나간 해변과 쌉싸름한 무화과 잎</h4>
          <p>흔하지 않은 중성적 아쿠아 우디, 차분하고 세련된 인상의 잔향</p>
        </div>
        <span>선택 &rarr;</span>
      </button>
      <button class="class-radio-card" onclick="showScentFinderResult('prod-warmsand')">
        <div class="class-radio-card__info">
          <h4>03. 노을 지는 백사장의 다정한 온기와 캐시미어 담요</h4>
          <p>부드러운 샌달우드와 파우더리한 아이리스, 포옹처럼 아늑한 머스크</p>
        </div>
        <span>선택 &rarr;</span>
      </button>
      <button class="class-radio-card" onclick="showScentFinderResult('prod-pinebreeze')">
        <div class="class-radio-card__info">
          <h4>04. 바닷바람이 스치는 고요한 해송 숲길 산책</h4>
          <p>머리를 맑게 비워주는 유칼립투스, 솔잎, 편백나무의 보타니컬 우디</p>
        </div>
        <span>선택 &rarr;</span>
      </button>
    </div>
  `;
  openModal('scentFinderModal');
}

function showScentFinderResult(productId) {
  closeModal('scentFinderModal');
  openProductDetailModal(productId);
  showToast('조향사 추천 시그니처 향수의 Scent Pyramid를 확인해 보세요!');
}

// ==========================================================================
// JOURNAL READER & REVIEW MODALS
// ==========================================================================
function openJournalModal(journalId) {
  const item = JOURNAL_DATA.find(j => j.id === journalId);
  if (!item) return;

  const body = document.getElementById('journalModalBody');
  body.innerHTML = `
    <span class="eyebrow">${item.vol} · ${item.date}</span>
    <h2 style="font-family:var(--font-serif-kr); font-size:1.65rem; color:var(--color-navy); margin-bottom:20px;">
      ${item.title}
    </h2>
    <div style="border-radius:6px; overflow:hidden; aspect-ratio:16/9; margin-bottom:24px;">
      <img src="${item.img}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;" />
    </div>
    <div style="font-size:0.96rem; color:var(--text-secondary); line-height:1.85;">
      ${item.body}
    </div>
    <div style="margin-top:28px; padding-top:20px; border-top:1px solid var(--border-hairline); display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:0.84rem; color:var(--text-muted);">Editor · ONDA Head Perfumer</span>
      <button class="btn btn--navy btn--sm" onclick="closeModal('journalModal'); navigateTo('class', 'bookingWorkbench');">
        원데이 클래스 예약하러 가기 &rarr;
      </button>
    </div>
  `;
  openModal('journalModal');
}

function openReviewWriteModal() {
  openModal('reviewWriteModal');
}

function setComposerCategory(category, btnEl) {
  inlineComposerState.category = category;
  document.querySelectorAll('#composerCategoryBtns .filter-tab').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const targetSelect = document.getElementById('inlineRevTarget');
  if (!targetSelect) return;

  if (category === 'class') {
    targetSelect.innerHTML = `
      <option value="시그니처 원데이 클래스 50ml">시그니처 원데이 클래스 50ml</option>
      <option value="공간 향기 (디퓨저·룸스프레이) 클래스">공간 향기 (디퓨저·룸스프레이) 클래스</option>
      <option value="조향 취미/정규 4주 과정">조향 취미/정규 4주 과정</option>
    `;
  } else if (category === 'shop') {
    targetSelect.innerHTML = `
      <option value="윤슬 (YUNSEUL) 오 드 퍼퓸">윤슬 (YUNSEUL) 오 드 퍼퓸</option>
      <option value="파도 (ONDA) 오 드 퍼퓸">파도 (ONDA) 오 드 퍼퓸</option>
      <option value="모래의 온기 (WARM SAND)">모래의 온기 (WARM SAND)</option>
      <option value="해송의 숲 (PINE BREEZE)">해송의 숲 (PINE BREEZE)</option>
      <option value="영일대의 밤 리드 디퓨저">영일대의 밤 리드 디퓨저</option>
      <option value="온다 시그니처 기프트 듀오 세트">온다 시그니처 기프트 듀오 세트</option>
    `;
  } else {
    targetSelect.innerHTML = `
      <option value="기업 임직원 힐링 조향 워크숍">기업 임직원 힐링 조향 워크숍</option>
      <option value="학교·관공서 출강 클래스">학교·관공서 출강 클래스</option>
      <option value="프라이빗 소그룹 대관 클래스">프라이빗 소그룹 대관 클래스</option>
    `;
  }
}

function setInlineStarRating(score) {
  inlineComposerState.starsCount = score;
  const starBtns = document.querySelectorAll('#inlineStarPicker .star-btn');
  starBtns.forEach((btn, idx) => {
    btn.classList.toggle('active', idx < score);
  });
  const labels = ['1.0 아쉬워요', '2.0 보통이에요', '3.0 괜찮아요', '4.0 만족해요', '5.0 최고예요'];
  const scoreText = document.getElementById('inlineStarScoreText');
  if (scoreText) scoreText.textContent = labels[score - 1] || '5.0 최고예요';
}

function toggleMoodTag(btnEl) {
  btnEl.classList.toggle('selected');
}

function submitInlineReview(e) {
  e.preventDefault();
  const author = document.getElementById('inlineRevAuthor').value.trim();
  const target = document.getElementById('inlineRevTarget').value;
  const formula = document.getElementById('inlineRevFormula').value.trim();
  const text = document.getElementById('inlineRevText').value.trim();

  const selectedTags = Array.from(document.querySelectorAll('#inlineMoodTags .mood-tag-btn.selected'))
    .map(b => b.textContent.trim());

  const starsStr = '★'.repeat(inlineComposerState.starsCount) + '☆'.repeat(5 - inlineComposerState.starsCount);

  REVIEWS_DATA.unshift({
    category: inlineComposerState.category,
    stars: starsStr,
    text,
    author,
    tag: `${target} · 방금 등록됨`,
    formulaNote: formula ? `기록 노트: ${formula}` : '',
    moodTags: selectedTags.length ? selectedTags : ['#온다향방추천']
  });

  activeReviewFilter = 'all';
  document.querySelectorAll('#reviewCategoryFilterTabs .filter-tab').forEach((b, i) => b.classList.toggle('active', i === 0));
  renderReviewsAndSocial();

  e.target.reset();
  setInlineStarRating(5);
  showToast(`[리뷰 등록 완료] ${author}님의 소중한 향기 기록이 등록되었으며 3,000P가 적립되었습니다!`);
}

function submitNewReview(e) {
  e.preventDefault();
  const author = document.getElementById('revAuthor').value.trim();
  const catSelect = document.getElementById('revCategorySelect');
  const category = catSelect ? catSelect.value : 'class';
  const tag = document.getElementById('revTag').value;
  const formulaEl = document.getElementById('revModalFormula');
  const formula = formulaEl ? formulaEl.value.trim() : '';
  const text = document.getElementById('revText').value.trim();

  REVIEWS_DATA.unshift({
    category,
    stars: '★★★★★',
    text,
    author,
    tag: `${tag} · 방금 작성됨`,
    formulaNote: formula ? `기록 노트: ${formula}` : '',
    moodTags: ['#온다향방', '#영일대공방']
  });

  renderReviewsAndSocial();
  e.target.reset();
  closeModal('reviewWriteModal');
  showToast('소중한 향기 기록이 아카이브에 등록되었습니다!');
}

// ==========================================================================
// DRAWERS, MODALS & TOAST HELPERS
// ==========================================================================
function updateBadgesAndDrawers() {
  // Cart Badge & Drawer
  const cartBadge = document.getElementById('cartBadgeCount');
  if (cartBadge) cartBadge.textContent = shoppingCart.length;

  const cartBody = document.getElementById('cartDrawerBody');
  const cartFooter = document.getElementById('cartDrawerFooter');

  if (cartBody && cartFooter) {
    if (shoppingCart.length === 0) {
      cartBody.innerHTML = `
        <div style="text-align:center; padding:48px 16px; color:var(--text-muted);">
          <p style="margin-bottom:16px;">장바구니에 담긴 향기 제품이 없습니다.</p>
          <button class="btn btn--outline-navy btn--sm" onclick="closeDrawer('cartDrawer'); navigateTo('shop');">
            시그니처 컬렉션 둘러보기 &rarr;
          </button>
        </div>
      `;
      cartFooter.innerHTML = '';
    } else {
      const total = shoppingCart.reduce((acc, item) => acc + item.unitPrice, 0);
      cartBody.innerHTML = shoppingCart.map(item => `
        <div class="cart-item">
          <img src="${item.product.img}" alt="${item.product.title}" />
          <div>
            <div style="font-weight:600; font-size:0.9rem; color:var(--color-navy);">${item.product.title}</div>
            <div style="font-size:0.78rem; color:var(--text-secondary);">각인: "${item.engravingText}" ${item.giftExtra > 0 ? '· 기프트 포장(+4,000원)' : ''}</div>
            <div class="tabular-nums" style="font-weight:700; font-size:0.88rem; margin-top:4px;">${formatKRW(item.unitPrice)}</div>
          </div>
          <button class="icon-btn" onclick="removeCartItem('${item.cartItemId}')" aria-label="삭제">&times;</button>
        </div>
      `).join('');

      cartFooter.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1.05rem; margin-bottom:14px;" class="tabular-nums">
          <span>총 결제 예정 금액 (무료배송)</span>
          <span>${formatKRW(total)}</span>
        </div>
        <div style="display:grid; gap:8px;">
          <button class="btn btn--full" style="background:#03C75A; color:#fff; font-weight:700;" onclick="checkoutCart('네이버페이(N Pay)')">
            N Pay 네이버페이 간편결제
          </button>
          <button class="btn btn--full" style="background:#FEE500; color:#191919; font-weight:700;" onclick="checkoutCart('카카오페이')">
            카카오페이 간편결제
          </button>
          <button class="btn btn--navy btn--full" onclick="checkoutCart('신용/체크카드 PG')">
            일반 신용카드 결제하기
          </button>
        </div>
      `;
    }
  }

  // Reservations Badge & Drawer
  const resBadge = document.getElementById('resBadgeCount');
  if (resBadge) resBadge.textContent = reservationsList.length;

  const resBody = document.getElementById('reservationDrawerBody');
  if (resBody) {
    if (reservationsList.length === 0) {
      resBody.innerHTML = `<p style="text-align:center; padding:40px 0; color:var(--text-muted);">예약 내역이 없습니다.</p>`;
    } else {
      resBody.innerHTML = reservationsList.map((r, idx) => `
        <div style="background:var(--color-ivory-pure); border:1px solid var(--border-hairline); border-radius:6px; padding:18px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:0.75rem; font-weight:700; color:var(--color-sage-deep);">${r.resNo}</span>
            <button style="font-size:0.75rem; color:var(--color-danger); text-decoration:underline;" onclick="cancelReservation(${idx})">예약 취소</button>
          </div>
          <h4 style="font-family:var(--font-serif-kr); font-size:1rem; color:var(--color-navy); margin-bottom:6px;">${r.classTitle}</h4>
          <p style="font-size:0.84rem; color:var(--text-secondary);">• 일시: <strong>${r.dateStr}</strong></p>
          <p style="font-size:0.84rem; color:var(--text-secondary);">• 예약자: ${r.guestName} (총 ${r.headcount}명)</p>
          <p style="font-size:0.84rem; color:var(--text-secondary);">• 라벨 각인: "${r.engraving}"</p>
          <p class="tabular-nums" style="font-size:0.82rem; color:var(--color-navy); font-weight:600; margin-top:8px; padding-top:8px; border-top:1px dashed var(--border-hairline);">
            결제금액: ${formatKRW(r.paidAmount)} · ${r.payStatus}
          </p>
        </div>
      `).join('');
    }
  }
}

function cancelReservation(idx) {
  reservationsList.splice(idx, 1);
  updateBadgesAndDrawers();
  showToast('선택하신 클래스 예약이 취소 및 환불 접수되었습니다.');
}

function openGroupInquiryModal() {
  navigateTo('visit');
  setTimeout(() => {
    const el = document.getElementById('b2bInquirySection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 120);
}

function copyStudioAddress() {
  const addr = '경상북도 포항시 북구 해안로 189번길 14, 2층 온다 향방';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(addr).catch(() => {});
  }
  showToast(`주소가 복사되었습니다: ${addr}`);
}

function submitDirectInquiry(e) {
  e.preventDefault();
  e.target.reset();
  showToast('1:1 문의가 접수되었습니다. 기재해주신 연락처(카카오 알림톡)로 빠르게 답변드리겠습니다.');
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

function closeModalOnBackdrop(e, id) {
  if (e.target.id === id) closeModal(id);
}

function openDrawer(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeDrawer(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

function closeDrawerOnBackdrop(e, id) {
  if (e.target.id === id) closeDrawer(id);
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3600);
}

// ==========================================================================
// SUBTLE CRYSTAL SPARKLE & PRISM REFRACTION CANVAS (과하지 않은 크리스탈 반짝임)
// ==========================================================================
function initOndaWaveCanvas() {
  const canvas = document.getElementById('ondaWaveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Stationary, understated crystal light sparkles & soft prism bokeh
  const crystals = Array.from({ length: 26 }, (_, i) => ({
    xRatio: 0.08 + Math.random() * 0.84,
    yRatio: 0.14 + Math.random() * 0.72,
    size: i % 3 === 0 ? 5.5 + Math.random() * 3.5 : 3.0 + Math.random() * 2.5,
    phase: Math.random() * Math.PI * 2,
    speed: 0.45 + Math.random() * 0.55, // slow, calm breathing speed
    isGoldTint: i % 2 === 0
  }));

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  let startTime = performance.now();

  function drawCrystalSparkle(x, y, radius, alpha, isGoldTint) {
    // 1. Soft ambient crystal halo
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.2);
    const coreColor = isGoldTint ? '248, 246, 240' : '217, 203, 184';
    grad.addColorStop(0, `rgba(${coreColor}, ${(alpha * 0.55).toFixed(3)})`);
    grad.addColorStop(0.5, `rgba(${coreColor}, ${(alpha * 0.16).toFixed(3)})`);
    grad.addColorStop(1, `rgba(${coreColor}, 0)`);

    ctx.beginPath();
    ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // 2. Delicate 4-point diamond crystal rays (only when near peak twinkle)
    if (alpha > 0.22) {
      const rayLen = radius * (1.2 + alpha * 1.1);
      const rayThickness = Math.max(0.6, radius * 0.16);

      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(253, 252, 249, ${(alpha * 0.78).toFixed(3)})`;

      // Horizontal & Vertical tapered crystal facets
      ctx.beginPath();
      ctx.moveTo(0, -rayLen);
      ctx.quadraticCurveTo(rayThickness, -rayThickness, rayLen, 0);
      ctx.quadraticCurveTo(rayThickness, rayThickness, 0, rayLen);
      ctx.quadraticCurveTo(-rayThickness, rayThickness, -rayLen, 0);
      ctx.quadraticCurveTo(-rayThickness, -rayThickness, 0, -rayLen);
      ctx.closePath();
      ctx.fill();

      // Tiny bright center pinpoint
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(0.8, radius * 0.22), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.9).toFixed(3)})`;
      ctx.fill();
      ctx.restore();
    }
  }

  function drawFrame(now) {
    const elapsed = (now - startTime) * 0.001;
    ctx.clearRect(0, 0, width, height);

    crystals.forEach(c => {
      // Smooth, non-linear twinkle curve so sparkles rest quietly and glint softly in place
      const wave = (Math.sin(elapsed * c.speed + c.phase) + 1) * 0.5;
      const twinkle = Math.pow(wave, 3.2); // stays subtle most of the time, glints gently at peak
      const alpha = 0.04 + twinkle * 0.58;

      const x = c.xRatio * width;
      const y = c.yRatio * height;

      drawCrystalSparkle(x, y, c.size, alpha, c.isGoldTint);
    });

    requestAnimationFrame(drawFrame);
  }

  requestAnimationFrame(drawFrame);
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderHomeClasses();
  renderProgramGuideWindow();
  renderHomeProducts();
  renderShopProducts();
  renderReviewsAndSocial();
  renderJournals();
  renderFAQ();
  renderBookingWorkbench();
  updateBadgesAndDrawers();
  initOndaWaveCanvas();
  initHeroAutoSlider();
  initB2bDragAndDrop();
});



/* ==========================================================================
   B2B GROUP & CORPORATE INQUIRY FORM LOGIC (단체 · 기업 견적 문의 로직)
   ========================================================================== */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxvfGIuM_zr3dAxgptOQrqyxqQ1HuZU5iwjhbPNmAROwE5HvKAPI-MLZSZU1GbN1d1v/exec";

// 서류 첨부 파일 데이터 관리
let b2bSelectedFileData = null;

// 파일 크기 가독 포맷 (KB, MB)
function formatB2bFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// 5. 진행 방식 변경 핸들러
function handleClassTypeChange(type) {
  const locInput = document.getElementById('b2bLocation');
  const locTag = document.getElementById('b2bLocationTag');
  const locHint = document.getElementById('b2bLocationHint');
  const optAtelier = document.getElementById('typeOptionAtelier');
  const optOutreach = document.getElementById('typeOptionOutreach');

  if (type === '외부 출강') {
    if (optAtelier) optAtelier.classList.remove('active');
    if (optOutreach) optOutreach.classList.add('active');
    if (locInput) {
      locInput.disabled = false;
      locInput.required = true;
      locInput.placeholder = "출강을 희망하시는 지역/장소를 입력해 주세요 (예: 서울 강남구 삼성동 본사 교육장)";
      locInput.focus();
    }
    if (locTag) {
      locTag.textContent = "필수 입력";
      locTag.style.color = "var(--color-danger, #B84A39)";
    }
    if (locHint) {
      locHint.textContent = "전문 조향사가 실습 재료 및 도구를 구비하여 방문합니다. 상세 주소 또는 지역명을 적어주세요.";
    }
  } else {
    if (optAtelier) optAtelier.classList.add('active');
    if (optOutreach) optOutreach.classList.remove('active');
    if (locInput) {
      locInput.disabled = true;
      locInput.required = false;
      locInput.value = "";
      locInput.placeholder = "포항 영일대 해안로 공방 아틀리에에서 진행됩니다.";
    }
    if (locTag) {
      locTag.textContent = "공방 방문";
      locTag.style.color = "var(--text-muted, #7C8794)";
    }
    if (locHint) {
      locHint.textContent = "공방 방문 클래스는 포항 영일대 온다 향방 전용 아틀리에에서 쾌적하게 진행됩니다.";
    }
  }
}

// 11. 서류 첨부 파일 선택 핸들러
function handleB2bFileSelect(input) {
  const file = input.files && input.files[0];
  if (!file) return;

  // 10MB (10 * 1024 * 1024 bytes) 용량 초과 체크
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    alert("첨부파일 용량이 10MB를 초과하여 등록할 수 없습니다.\n(선택하신 파일: " + (file.size / (1024 * 1024)).toFixed(1) + "MB)");
    input.value = "";
    removeB2bFile();
    return;
  }

  // FileReader를 사용해 Base64 문자열로 인코딩
  const reader = new FileReader();
  reader.onload = function(e) {
    const rawData = e.target.result;
    // data:application/pdf;base64,... 에서 순수 base64 데이터만 분리
    const base64Data = rawData.indexOf(',') > -1 ? rawData.split(',')[1] : rawData;
    
    b2bSelectedFileData = {
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileData: base64Data,
      sizeFormatted: formatB2bFileSize(file.size)
    };

    updateB2bFileUI();
  };

  reader.onerror = function() {
    alert("파일을 읽는 중 오류가 발생했습니다. 다시 시도해 주세요.");
    removeB2bFile();
  };

  reader.readAsDataURL(file);
}

// 파일 선택 UI 갱신
function updateB2bFileUI() {
  const dropInner = document.getElementById('b2bDropzoneInner');
  const selectedBox = document.getElementById('b2bSelectedFile');
  const nameEl = document.getElementById('b2bFileName');
  const sizeEl = document.getElementById('b2bFileSize');
  const extBadge = document.getElementById('b2bFileExtBadge');

  if (b2bSelectedFileData) {
    if (dropInner) dropInner.style.display = 'none';
    if (selectedBox) selectedBox.style.display = 'flex';
    if (nameEl) nameEl.textContent = b2bSelectedFileData.fileName;
    if (sizeEl) sizeEl.textContent = b2bSelectedFileData.sizeFormatted;
    if (extBadge) {
      const ext = b2bSelectedFileData.fileName.split('.').pop().toUpperCase();
      extBadge.textContent = ext.length <= 4 ? ext : 'FILE';
    }
  } else {
    if (dropInner) dropInner.style.display = 'block';
    if (selectedBox) selectedBox.style.display = 'none';
    const fileInput = document.getElementById('b2bFileInput');
    if (fileInput) fileInput.value = '';
  }
}

// 첨부파일 취소('X')
function removeB2bFile(e) {
  if (e) e.stopPropagation();
  b2bSelectedFileData = null;
  updateB2bFileUI();
}

// 드래그 앤 드롭 초기화
function initB2bDragAndDrop() {
  const dropzone = document.getElementById('b2bDropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      const fileInput = document.getElementById('b2bFileInput');
      if (fileInput) {
        fileInput.files = files;
        handleB2bFileSelect(fileInput);
      }
    }
  });
}

// 폼 전송 핸들러
async function handleB2bFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('b2bInquiryForm');
  if (!form) return;

  // 유효성 체크
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitBtn = document.getElementById('b2bSubmitBtn');
  const btnText = submitBtn.querySelector('.b2b-btn-text');
  const btnLoader = submitBtn.querySelector('.b2b-btn-loader');

  // 버튼 비활성화 및 로딩 인디케이터 표시
  submitBtn.disabled = true;
  if (btnText) btnText.style.display = 'none';
  if (btnLoader) btnLoader.style.display = 'inline-flex';

  // 폼 입력값 수집
  const classTypeInput = form.querySelector('input[name="classType"]:checked');
  const classType = classTypeInput ? classTypeInput.value : '공방 방문 클래스';
  const locationVal = document.getElementById('b2bLocation') ? document.getElementById('b2bLocation').value.trim() : '';

  const payload = {
    groupName: document.getElementById('b2bGroupName').value.trim(),
    contactPerson: document.getElementById('b2bContactPerson').value.trim(),
    phone: document.getElementById('b2bPhone').value.trim(),
    email: document.getElementById('b2bEmail').value.trim(),
    classType: classType,
    location: classType === '외부 출강' ? locationVal : '포항 온다 공방 방문',
    expectedCount: document.getElementById('b2bExpectedCount').value.trim(),
    preferredDate: document.getElementById('b2bPreferredDate').value.trim(),
    budget: document.getElementById('b2bBudget').value.trim() || '협의/미정',
    message: document.getElementById('b2bMessage').value.trim() || '요청사항 없음',
    fileName: b2bSelectedFileData ? b2bSelectedFileData.fileName : null,
    mimeType: b2bSelectedFileData ? b2bSelectedFileData.mimeType : null,
    fileData: b2bSelectedFileData ? b2bSelectedFileData.fileData : null,
    submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  };

  try {
    // Google Apps Script Web App으로 POST 전송
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    // 전송 완료 시: 화면 전환 없이 폼 위치에 부드러운 애니메이션과 함께 접수 완료 카드 노출
    showB2bSuccessView(payload);
  } catch (err) {
    console.error('견적 문의 전송 에러:', err);
    alert('견적 문의 전송 중 일시적인 네트워크 오류가 발생했습니다.\n다시 시도해 주시거나 카카오톡 채널로 문의해 주세요.');
    submitBtn.disabled = false;
    if (btnText) btnText.style.display = 'inline-block';
    if (btnLoader) btnLoader.style.display = 'none';
  }
}

// 접수 완료 카드 노출
function showB2bSuccessView(data) {
  const form = document.getElementById('b2bInquiryForm');
  const successCard = document.getElementById('b2bSuccessCard');
  const summary = document.getElementById('b2bSuccessSummary');

  if (summary) {
    summary.innerHTML = `
      <div class="b2b-summary-row"><span>단체 / 기업명</span><strong>${escapeHtml(data.groupName)}</strong></div>
      <div class="b2b-summary-row"><span>담당자 성함/직함</span><strong>${escapeHtml(data.contactPerson)} (${escapeHtml(data.phone)})</strong></div>
      <div class="b2b-summary-row"><span>회신 이메일</span><strong>${escapeHtml(data.email)}</strong></div>
      <div class="b2b-summary-row"><span>진행 방식</span><strong>${escapeHtml(data.classType)}${data.location && data.location !== '포항 온다 공방 방문' ? ' (' + escapeHtml(data.location) + ')' : ''}</strong></div>
      <div class="b2b-summary-row"><span>예상 인원 / 희망 일시</span><strong>${escapeHtml(data.expectedCount)} / ${escapeHtml(data.preferredDate)}</strong></div>
      ${data.budget && data.budget !== '협의/미정' ? `<div class="b2b-summary-row"><span>예산 범위</span><strong>${escapeHtml(data.budget)}</strong></div>` : ''}
      ${data.fileName ? `<div class="b2b-summary-row"><span>첨부 서류</span><strong>${escapeHtml(data.fileName)}</strong></div>` : ''}
    `;
  }

  if (form) form.style.display = 'none';
  if (successCard) {
    successCard.style.display = 'block';
    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 새로운 문의 작성하기 (초기화)
function resetB2bForm() {
  const form = document.getElementById('b2bInquiryForm');
  const successCard = document.getElementById('b2bSuccessCard');
  const submitBtn = document.getElementById('b2bSubmitBtn');
  const btnText = submitBtn ? submitBtn.querySelector('.b2b-btn-text') : null;
  const btnLoader = submitBtn ? submitBtn.querySelector('.b2b-btn-loader') : null;

  if (form) {
    form.reset();
    form.style.display = 'block';
  }
  if (successCard) {
    successCard.style.display = 'none';
  }
  if (submitBtn) {
    submitBtn.disabled = false;
    if (btnText) btnText.style.display = 'inline-block';
    if (btnLoader) btnLoader.style.display = 'none';
  }
  
  removeB2bFile();
  handleClassTypeChange('공방 방문 클래스');

  const section = document.getElementById('b2bInquirySection');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
