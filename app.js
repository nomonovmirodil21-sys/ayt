/**
 * META IT SCHOOL — script.js
 * Responsive navbar, IT Battle voting (LocalStorage), Counter animation,
 * Carousel, Modals, Form validation, Phone masking.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. SCROLL PROGRESS & BACK TO TOP
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

    if (scrollProgress) scrollProgress.style.width = `${progress * 100}%`;
    if (header) {
      if (scrollTop > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    if (backToTopBtn) {
      if (scrollTop > 350) backToTopBtn.classList.add('visible');
      else backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. HAMBURGER MENU & DRAWER
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeDrawer));

  // 3. CODE TYPING SIMULATOR
  const codeOutput = document.getElementById('typing-code-output');
  if (codeOutput) {
    const phrases = [
      'student.learn() -> Professional Developer! 🚀',
      'student.level_up() -> 95% Amaliy Ta\'lim ⚡',
      'student.get_job() -> High-Paying IT Career 💼'
    ];
    let pIdx = 0, cIdx = 0, isDel = false, speed = 70;

    function type() {
      const current = phrases[pIdx];
      if (isDel) {
        codeOutput.textContent = current.substring(0, cIdx - 1);
        cIdx--;
        speed = 35;
      } else {
        codeOutput.textContent = current.substring(0, cIdx + 1);
        cIdx++;
        speed = 70;
      }
      if (!isDel && cIdx === current.length) { speed = 2000; isDel = true; }
      else if (isDel && cIdx === 0) { isDel = false; pIdx = (pIdx + 1) % phrases.length; speed = 400; }
      setTimeout(type, speed);
    }
    type();
  }

  // 4. ANIMATED COUNTERS (1000+, 15+, 10+, 95%)
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - (1 - progress) * (1 - progress);
        counter.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target;
      }
      requestAnimationFrame(update);
    });
  }

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !animated) {
          animated = true;
          runCounters();
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(statsSection);
  }

  // 5. KURSLAR FILTERING
  const filterTabs = document.querySelectorAll('.filter-tab');
  const courseCards = document.querySelectorAll('.course-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const val = tab.getAttribute('data-filter');

      courseCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (val === 'all' || cat === val) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 20);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 200);
        }
      });
    });
  });

  // 6. PROMO COUNTDOWN
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  let deadline = localStorage.getItem('meta_promo_deadline');
  if (!deadline || new Date(deadline).getTime() < Date.now()) {
    const t = new Date();
    t.setDate(t.getDate() + 6);
    deadline = t.toISOString();
    localStorage.setItem('meta_promo_deadline', deadline);
  }

  function updateTimer() {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = d < 10 ? '0' + d : d;
    if (hoursEl) hoursEl.textContent = h < 10 ? '0' + h : h;
    if (minsEl) minsEl.textContent = m < 10 ? '0' + m : m;
    if (secsEl) secsEl.textContent = s < 10 ? '0' + s : s;
  }
  updateTimer();
  setInterval(updateTimer, 1000);

  // 7. META IT BATTLE PLATFORM (LOCALSTORAGE & SORTING)
  const defaultSchools = [
    { id: 'meta', name: 'META IT SCHOOL', logo: 'assets/images/battle-meta.svg', votes: 1420, type: 'IT Akademiya' },
    { id: 'alpha', name: 'Alpha Tech Academy', logo: 'assets/images/battle-alpha.svg', votes: 1180, type: 'Dasturlash Maktabi (Demo)' },
    { id: 'nova', name: 'Nova Coding School', logo: 'assets/images/battle-nova.svg', votes: 940, type: 'IT Ta\'lim Markazi (Demo)' },
    { id: 'cyber', name: 'Cyber Future Hub', logo: 'assets/images/battle-cyber.svg', votes: 820, type: 'Texnologiya Markazi (Demo)' },
    { id: 'vertex', name: 'Vertex IT Academy', logo: 'assets/images/battle-vertex.svg', votes: 750, type: 'Akademiya (Demo)' }
  ];

  function getSchools() {
    const s = localStorage.getItem('meta_battle_data');
    return s ? JSON.parse(s) : defaultSchools;
  }

  function renderBattle() {
    const list = document.getElementById('battle-cards-container');
    const leaderName = document.getElementById('current-leader-name');
    const leaderScore = document.getElementById('current-leader-score');
    const userStatus = document.getElementById('battle-user-status');
    if (!list) return;

    const schools = getSchools();
    schools.sort((a, b) => b.votes - a.votes);
    const totalVotes = schools.reduce((acc, c) => acc + c.votes, 0);

    if (leaderName) leaderName.textContent = schools[0].name;
    if (leaderScore) leaderScore.textContent = schools[0].votes.toLocaleString('uz-UZ');

    const userVotedId = localStorage.getItem('meta_battle_user_voted');
    if (userStatus) {
      userStatus.innerHTML = userVotedId 
        ? `<i class="fa-solid fa-circle-check" style="color: #10B981;"></i> Siz ovoz bergansiz! Natijalar yangilandi.`
        : `<i class="fa-solid fa-circle-info"></i> Har bir qurilmada faqat 1 marta ovoz berish mumkin.`;
    }

    list.innerHTML = schools.map((school, i) => {
      const rank = i + 1;
      const pct = ((school.votes / totalVotes) * 100).toFixed(1);
      const isVoted = userVotedId === school.id;
      return `
        <div class="battle-card rank-${rank}">
          <div class="rank-badge">${rank === 1 ? '<i class="fa-solid fa-crown"></i>' : rank}</div>
          <img src="${school.logo}" alt="${school.name}" class="battle-logo">
          <div>
            <h4 class="battle-school-title">${school.name}</h4>
            <span class="battle-school-type">${school.type}</span>
          </div>
          <div>
            <div class="meter-header">
              <span>${school.votes.toLocaleString('uz-UZ')} ball</span>
              <span>${pct}%</span>
            </div>
            <div class="meter-bar-track">
              <div class="meter-bar-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
          <div>
            <button class="btn-vote ${isVoted ? 'voted' : ''}" data-school="${school.id}" ${userVotedId ? 'disabled' : ''}>
              ${isVoted ? '<i class="fa-solid fa-check"></i> Ovoz berildi' : '<i class="fa-solid fa-bolt"></i> Ovoz berish'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('.btn-vote:not([disabled])').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-school');
        const sc = getSchools();
        const target = sc.find(x => x.id === id);
        if (target) {
          target.votes += 1;
          localStorage.setItem('meta_battle_data', JSON.stringify(sc));
          localStorage.setItem('meta_battle_user_voted', id);
          showToast(`${target.name} uchun ovozingiz qabul qilindi!`, 'success');
          renderBattle();
        }
      });
    });
  }

  const resetBattle = document.getElementById('btn-reset-battle-vote');
  if (resetBattle) {
    resetBattle.addEventListener('click', () => {
      localStorage.removeItem('meta_battle_user_voted');
      localStorage.removeItem('meta_battle_data');
      renderBattle();
      showToast('Ovoz berish holati demo uchun qayta tiklandi.', 'info');
    });
  }
  renderBattle();

  // 8. TESTIMONIALS CAROUSEL
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const nextBtn = document.getElementById('carousel-next');
  const prevBtn = document.getElementById('carousel-prev');
  const dots = document.querySelectorAll('#carousel-dots .dot');

  let curSlide = 0;
  let autoTimer = null;

  function goToSlide(idx) {
    if (idx >= slides.length) curSlide = 0;
    else if (idx < 0) curSlide = slides.length - 1;
    else curSlide = idx;

    if (track) track.style.transform = `translateX(-${curSlide * 100}%)`;
    dots.forEach((d, i) => {
      if (i === curSlide) d.classList.add('active');
      else d.classList.remove('active');
    });
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(curSlide + 1); resetCarouselTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(curSlide - 1); resetCarouselTimer(); });

  function startCarouselTimer() {
    autoTimer = setInterval(() => goToSlide(curSlide + 1), 5000);
  }
  function resetCarouselTimer() {
    clearInterval(autoTimer);
    startCarouselTimer();
  }
  startCarouselTimer();

  const cContainer = document.getElementById('carousel-track-container');
  if (cContainer) {
    cContainer.addEventListener('mouseenter', () => clearInterval(autoTimer));
    cContainer.addEventListener('mouseleave', () => startCarouselTimer());
  }

  // 9. FAQ ACCORDION
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
      });
    }
  });

  // 10. MODAL OYNALAR
  function openModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('[data-open-modal]').forEach(b => {
    b.addEventListener('click', () => {
      const modalId = b.getAttribute('data-open-modal');
      const crs = b.getAttribute('data-course');
      openModal(modalId);
      if (crs) {
        const select = document.getElementById('reg-course');
        if (select) select.value = crs;
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(b => {
    b.addEventListener('click', () => {
      const modal = b.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
    });
  });

  // 11. TELEFON MASKASI (+998 ...)
  document.querySelectorAll('.phone-mask').forEach(input => {
    input.addEventListener('focus', () => {
      if (!input.value) input.value = '+998 ';
    });
    input.addEventListener('input', () => {
      let val = input.value.replace(/\D/g, '');
      if (!val.startsWith('998')) val = '998' + val;
      val = val.substring(0, 12);
      let res = '+998';
      if (val.length > 3) res += ' (' + val.substring(3, 5);
      if (val.length >= 5) res += ') ' + val.substring(5, 8);
      if (val.length >= 8) res += '-' + val.substring(8, 10);
      if (val.length >= 10) res += '-' + val.substring(10, 12);
      input.value = res;
    });
  });

  // 12. RO‘YXATDAN O‘TISH FORMA TEKSHIRUVI
  const regForm = document.getElementById('modal-registration-form');
  const regSuccess = document.getElementById('modal-success-state');

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name');
      const phone = document.getElementById('reg-phone');
      const age = document.getElementById('reg-age');
      let valid = true;

      if (!name.value.trim() || name.value.trim().length < 3) {
        name.classList.add('input-invalid');
        document.getElementById('reg-name-error').textContent = 'Ism va familiyani to‘liq kiriting.';
        document.getElementById('reg-name-error').classList.add('visible');
        valid = false;
      } else {
        name.classList.remove('input-invalid');
        document.getElementById('reg-name-error').classList.remove('visible');
      }

      if (phone.value.replace(/\D/g, '').length !== 12) {
        phone.classList.add('input-invalid');
        document.getElementById('reg-phone-error').textContent = 'Telefon raqamini to‘liq kiriting.';
        document.getElementById('reg-phone-error').classList.add('visible');
        valid = false;
      } else {
        phone.classList.remove('input-invalid');
        document.getElementById('reg-phone-error').classList.remove('visible');
      }

      if (!age.value || +age.value < 10 || +age.value > 75) {
        age.classList.add('input-invalid');
        document.getElementById('reg-age-error').textContent = 'Yoshingizni to‘g‘ri kiriting.';
        document.getElementById('reg-age-error').classList.add('visible');
        valid = false;
      } else {
        age.classList.remove('input-invalid');
        document.getElementById('reg-age-error').classList.remove('visible');
      }

      if (valid) {
        const leads = JSON.parse(localStorage.getItem('meta_it_leads') || '[]');
        leads.push({
          name: name.value.trim(),
          phone: phone.value.trim(),
          course: document.getElementById('reg-course').value,
          age: age.value,
          date: new Date().toLocaleString()
        });
        localStorage.setItem('meta_it_leads', JSON.stringify(leads));

        regForm.style.display = 'none';
        if (regSuccess) regSuccess.style.display = 'block';
        showToast('Muvaffaqiyatli ro‘yxatdan o‘tdingiz!', 'success');
      }
    });
  }

  // 13. TOAST XABARLAR
  window.showToast = function(msg, type = 'info') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${msg}</span>`;
    c.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast-show'));
    setTimeout(() => {
      t.classList.remove('toast-show');
      setTimeout(() => t.remove(), 400);
    }, 3500);
  };
});