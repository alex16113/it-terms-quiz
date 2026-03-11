// ═══════════ SVG ICONS ═══════════
const ICONS = {
  check: `<span class="icon-check"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="#19F05A" stroke-width="2" fill="rgba(25,240,90,0.12)"/><path d="M7 12.5L10.5 16L17 9" stroke="#19F05A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`,
  cross: `<span class="icon-cross"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="#FF3B5C" stroke-width="2" fill="rgba(255,59,92,0.12)"/><path d="M8 8L16 16M16 8L8 16" stroke="#FF3B5C" stroke-width="2.5" stroke-linecap="round"/></svg></span>`,
  partial: `<span class="icon-check"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="#FFB830" stroke-width="2" fill="rgba(255,184,48,0.12)"/><path d="M8 12H16" stroke="#FFB830" stroke-width="2.5" stroke-linecap="round"/></svg></span>`,
  star: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#19F05A" style="filter:drop-shadow(0 0 4px rgba(25,240,90,0.4))"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg>`,
  fire: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#FFB830" style="filter:drop-shadow(0 0 4px rgba(255,184,48,0.4))"><path d="M12 23c-4.97 0-9-3.58-9-8 0-2.22.89-4.15 2.34-5.66C6.48 8.2 7 6.5 7 5c0 0 3 2 4 5 1-3 5-6 5-6s1 3-1 7c2.5-1 4-3 4-3s1 3-1 6c1.5-.5 3-2 3-2 0 4.42-4.03 11-10 11z"/></svg>`,
  // Rank icons — custom SVGs instead of basic emojis
  rankGuru: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#19F05A" stroke-width="2" fill="rgba(25,240,90,0.08)"/><circle cx="24" cy="24" r="16" stroke="#19F05A" stroke-width="1.5" fill="rgba(25,240,90,0.04)"/><path d="M24 8l4 8 8 2-6 6 2 8-8-4-8 4 2-8-6-6 8-2z" fill="#19F05A" filter="url(#glow)"/><defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`,
  rankPro: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><polygon points="24,4 30,18 44,20 34,30 36,44 24,38 12,44 14,30 4,20 18,18" stroke="#19F05A" stroke-width="2" fill="rgba(25,240,90,0.12)"/><circle cx="24" cy="24" r="8" fill="rgba(25,240,90,0.2)" stroke="#19F05A" stroke-width="1.5"/></svg>`,
  rankJunior: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="24" rx="4" stroke="#3B9EFF" stroke-width="2" fill="rgba(59,158,255,0.08)"/><path d="M14 22l6 6 14-12" stroke="#3B9EFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  rankIntern: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="10" y="8" width="28" height="32" rx="3" stroke="#9AA6B6" stroke-width="2" fill="rgba(154,166,182,0.06)"/><line x1="16" y1="18" x2="32" y2="18" stroke="#9AA6B6" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="24" x2="28" y2="24" stroke="#9AA6B6" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="30" x2="24" y2="30" stroke="#9AA6B6" stroke-width="1.5" stroke-linecap="round"/></svg>`
};

class QuizApp {
  constructor() {
    this.currentQuestion = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.answers = [];
    this.soundEnabled = true;
    this.audioCtx = null;
    this.quizQuestions = []; // shuffled copy
    this.timerInterval = null;
    this.timerSeconds = 60;
    this.timerMax = 60;
    this.answered = false;
    this.retryMode = false;
    this.init();
  }

  init() {
    this.renderStartScreen();
    document.getElementById('soundToggle').addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      document.getElementById('soundToggle').textContent = this.soundEnabled ? '🔊' : '🔇';
    });
  }

  // ──── SHUFFLE ────
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  shuffleOptions(q) {
    if (q.type === 'single' && q.options) {
      const indexed = q.options.map((o, i) => ({ text: o, origIdx: i }));
      const shuffled = this.shuffle(indexed);
      return { ...q, options: shuffled.map(s => s.text), correct: shuffled.findIndex(s => s.origIdx === q.correct), _shuffled: true };
    }
    if (q.type === 'multiple' && q.options) {
      const indexed = q.options.map((o, i) => ({ text: o, origIdx: i }));
      const shuffled = this.shuffle(indexed);
      const newCorrect = q.correct.map(ci => shuffled.findIndex(s => s.origIdx === ci));
      return { ...q, options: shuffled.map(s => s.text), correct: newCorrect, _shuffled: true };
    }
    return q;
  }

  // ──── AUDIO ────
  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playSound(type) {
    if (!this.soundEnabled) return;
    this.initAudio();
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    }
  }

  // ──── CONFETTI (neon green themed) ────
  spawnConfetti() {
    const colors = ['#19F05A', '#0AE08C', '#3B9EFF', '#FFB830', '#FF3B5C', '#A855F7', '#00FFAA'];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '-10px';
      const c = colors[Math.floor(Math.random() * colors.length)];
      el.style.backgroundColor = c;
      el.style.boxShadow = `0 0 6px ${c}`;
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.width = (Math.random() * 8 + 5) + 'px';
      el.style.height = (Math.random() * 8 + 5) + 'px';
      document.body.appendChild(el);

      const duration = Math.random() * 2 + 1.5;
      const xDrift = (Math.random() - 0.5) * 200;
      el.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${xDrift}px, ${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], { duration: duration * 1000, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' })
        .onfinish = () => el.remove();
    }
  }

  // ──── SCORE ────
  addScore(basePoints, bonus = 0) {
    let earned = basePoints;
    if (this.streak >= 3) earned *= 2;
    earned += bonus;
    this.score += earned;
    this.showScorePopup(earned);
  }

  showScorePopup(points) {
    const card = document.querySelector('.question-card');
    if (!card) return;
    const popup = document.createElement('div');
    popup.className = 'score-popup' + (this.streak >= 3 ? ' streak-bonus' : '');
    popup.textContent = `+${points}${this.streak >= 3 ? ' ×2' : ''}`;
    card.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }

  // ──── START SCREEN ────
  renderStartScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="start-screen">
        <div class="logo">🧠</div>
        <h1>Говорим <span class="neon">на одном языке</span></h1>
        <p class="subtitle">Интерактивный квиз по IT-терминам. Проверь свои знания через 8 разных игровых механик!</p>
        <div class="stats-row">
          <div class="stat-badge"><span class="num">30</span><span class="label">вопросов</span></div>
          <div class="stat-badge"><span class="num">8</span><span class="label">механик</span></div>
          <div class="stat-badge"><span class="num">~60</span><span class="label">терминов</span></div>
        </div>
        <div class="mechanics-preview">
          <div class="mechanic-chip">🎯 Выбор ответа</div>
          <div class="mechanic-chip">✅ Мульти-выбор</div>
          <div class="mechanic-chip">🔗 Соответствие</div>
          <div class="mechanic-chip">🃏 Флип-карточки</div>
          <div class="mechanic-chip">📝 Пропуски</div>
          <div class="mechanic-chip">🏗️ Категории</div>
          <div class="mechanic-chip">🧩 Правда/Ложь</div>
          <div class="mechanic-chip">🔄 Порядок</div>
        </div>
        <button class="btn-primary" id="startBtn">Начать квиз →</button>
      </div>
    `;
    document.getElementById('startBtn').addEventListener('click', () => {
      this.initAudio();
      this.playSound('click');
      this.startQuiz();
    });
  }

  startQuiz(customQuestions) {
    this.currentQuestion = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.answers = [];
    this.answered = false;
    if (customQuestions) {
      this.quizQuestions = customQuestions.map(q => this.shuffleOptions(q));
      this.retryMode = true;
    } else {
      this.quizQuestions = this.shuffle(questions).map(q => this.shuffleOptions(q));
      this.retryMode = false;
    }
    this.renderQuestion();
  }

  // ──── RENDER QUESTION ────
  renderQuestion() {
    const total = this.quizQuestions.length;
    // Midway screen at halfway (only in full quiz, not retry)
    if (!this.retryMode && this.currentQuestion === Math.floor(total / 2) && !this._midwayShown) {
      this._midwayShown = true;
      this.showMidway();
      return;
    }
    const q = this.quizQuestions[this.currentQuestion];
    const app = document.getElementById('app');
    const progress = (this.currentQuestion / total) * 100;
    this.answered = false;

    const typeLabels = {
      single: 'Выбор ответа', multiple: 'Мульти-выбор', matching: 'Соответствие',
      flashcard: 'Флип-карточка', fillin: 'Заполни пропуск', fillin_double: 'Заполни пропуски',
      categorize: 'Категоризация', truefalse: 'Правда / Ложь', ordering: 'Порядок'
    };

    let questionBody = '';
    switch (q.type) {
      case 'single': questionBody = this.renderSingle(q); break;
      case 'multiple': questionBody = this.renderMultiple(q); break;
      case 'matching': questionBody = this.renderMatching(q); break;
      case 'flashcard': questionBody = this.renderFlashcard(q); break;
      case 'fillin': questionBody = this.renderFillin(q); break;
      case 'fillin_double': questionBody = this.renderFillinDouble(q); break;
      case 'categorize': questionBody = this.renderCategorize(q); break;
      case 'truefalse': questionBody = this.renderTrueFalse(q); break;
      case 'ordering': questionBody = this.renderOrdering(q); break;
    }

    app.innerHTML = `
      <div class="progress-container">
        <div class="progress-info">
          <span class="question-num">${this.currentQuestion + 1} / ${total}</span>
          <div style="display:flex;align-items:center;gap:12px;">
            ${this.streak >= 3 ? `<span class="streak">${ICONS.fire} ×2 стрик</span>` : ''}
            <span class="score">${ICONS.star} ${this.score}</span>
          </div>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
      </div>
      <div class="question-card slide-in">
        <div class="question-header">
          <span class="question-type-badge">${q.emoji} ${typeLabels[q.type] || q.type}</span>
        </div>
        ${q.type !== 'flashcard' ? `<div class="question-text">${q.question || q.statement || ''}</div>` : ''}
        ${questionBody}
        <div class="timer-container"><div class="timer-bar-wrap"><div class="timer-bar"><div class="timer-fill" id="timerFill" style="width:100%"></div></div><span class="timer-text" id="timerText">60с</span></div><div class="timer-bonus" id="timerBonus">⚡ Бонус за скорость</div></div>
        <div id="feedback"></div>
        <div class="question-actions" id="actions"></div>
      </div>
    `;

    this.bindQuestionEvents(q);
    this.startTimer();
  }

  // ──── TIMER ────
  startTimer() {
    this.stopTimer();
    this.timerSeconds = this.timerMax;
    this.updateTimerUI();
    this.timerInterval = setInterval(() => {
      if (this.answered) { this.stopTimer(); return; }
      this.timerSeconds--;
      this.updateTimerUI();
      if (this.timerSeconds <= 0) {
        this.stopTimer();
        this.onTimerExpired();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
  }

  updateTimerUI() {
    const fill = document.getElementById('timerFill');
    const text = document.getElementById('timerText');
    if (!fill || !text) return;
    const pct = (this.timerSeconds / this.timerMax) * 100;
    fill.style.width = pct + '%';
    text.textContent = this.timerSeconds + 'с';
    fill.classList.remove('warning', 'danger');
    text.classList.remove('warning', 'danger');
    if (this.timerSeconds <= 10) { fill.classList.add('danger'); text.classList.add('danger'); }
    else if (this.timerSeconds <= 20) { fill.classList.add('warning'); text.classList.add('warning'); }
    const bonus = document.getElementById('timerBonus');
    if (bonus) {
      if (this.timerSeconds > 40) bonus.textContent = '⚡ Бонус +5 за скорость';
      else if (this.timerSeconds > 20) bonus.textContent = '⚡ Бонус +2 за скорость';
      else bonus.textContent = '⏳ Отвечайте быстрее!';
    }
  }

  getTimerBonus() {
    if (this.timerSeconds > 40) return 5;
    if (this.timerSeconds > 20) return 2;
    return 0;
  }

  onTimerExpired() {
    const q = this.quizQuestions[this.currentQuestion];
    this.handleAnswer(false, 0, q, ' Время вышло!');
  }

  // ──── MIDWAY SCREEN ────
  showMidway() {
    const correct = this.answers.filter(a => a.result === 'correct').length;
    const total = Math.floor(this.quizQuestions.length / 2);
    const pct = Math.round((correct / total) * 100);
    let msg = pct >= 80 ? 'Вы на огне! Продолжайте в том же духе!' : pct >= 50 ? 'Хороший темп! Вторая половина будет интереснее.' : 'Не сдавайтесь! Впереди ещё много шансов.';
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="midway-screen">
        <div class="midway-emoji">🔥</div>
        <h2>Половина <span class="neon">пройдена!</span></h2>
        <div class="midway-stats">
          <div class="stat-badge"><span class="num">${correct}/${total}</span><span class="label">верно</span></div>
          <div class="stat-badge"><span class="num">${this.score}</span><span class="label">баллов</span></div>
          <div class="stat-badge"><span class="num">${this.maxStreak}</span><span class="label">макс. серия</span></div>
        </div>
        <p class="midway-msg">${msg}</p>
        <button class="btn-primary" id="midwayContinue">Продолжить →</button>
      </div>`;
    this.spawnConfetti();
    document.getElementById('midwayContinue').addEventListener('click', () => {
      this.playSound('click');
      this.renderQuestion();
    });
  }

  // ──── SINGLE CHOICE ────
  renderSingle(q) {
    const labels = ['A', 'B', 'C', 'D', 'E'];
    return `
      <div class="options-list" id="optionsList">
        ${q.options.map((opt, i) => `
          <div class="option-item" data-idx="${i}">
            <span class="option-marker">${labels[i]}</span>
            <span class="option-text">${opt}</span>
          </div>
        `).join('')}
      </div>
      <button class="btn-check" id="checkBtn" disabled>Проверить</button>
    `;
  }

  renderMultiple(q) {
    return `
      <div class="question-hint">💡 Выберите все правильные варианты</div>
      <div class="options-list" id="optionsList">
        ${q.options.map((opt, i) => `
          <div class="option-item" data-idx="${i}">
            <span class="option-marker option-marker-multi">☐</span>
            <span class="option-text">${opt}</span>
          </div>
        `).join('')}
      </div>
      <button class="btn-check" id="checkBtn" disabled>Проверить</button>
    `;
  }

  renderMatching(q) {
    const shuffledMatches = [...q.pairs].sort(() => Math.random() - 0.5);
    return `
      <div class="matching-container">
        <div class="matching-column">
          <div class="matching-column-title">Термины</div>
          ${q.pairs.map((p, i) => `<div class="matching-item matching-term" data-idx="${i}">${p.term}</div>`).join('')}
        </div>
        <div class="matching-column">
          <div class="matching-column-title">Определения</div>
          ${shuffledMatches.map((p) => `<div class="matching-item matching-def" data-match="${p.match}">${p.match}</div>`).join('')}
        </div>
      </div>
    `;
  }

  renderFlashcard(q) {
    return `
      <div class="question-text">${q.hint ? '💡 Подсказка: ' + q.hint : ''}</div>
      <div class="flashcard-container">
        <div class="flashcard" id="flashcard">
          <div class="flashcard-face flashcard-front">
            <div class="card-label">Определение</div>
            <div class="card-text">${q.front}</div>
            <div class="tap-hint">👆 Нажмите, чтобы перевернуть</div>
          </div>
          <div class="flashcard-face flashcard-back">
            <div class="card-label">Ответ</div>
            <div class="answer-text">${q.back}</div>
          </div>
        </div>
      </div>
      <div class="flashcard-actions hidden" id="flashcardActions">
        <button class="btn-knew" id="btnKnew">${ICONS.check} Знал</button>
        <button class="btn-didnt" id="btnDidnt">${ICONS.cross} Не знал</button>
      </div>
    `;
  }

  renderFillin(q) {
    return `
      <div class="fillin-container">
        <div class="fillin-input-row">
          <input type="text" class="fillin-input" id="fillinInput" placeholder="Введите ответ..." autocomplete="off">
        </div>
      </div>
      <button class="btn-check" id="checkBtn">Проверить</button>
    `;
  }

  renderFillinDouble(q) {
    return `
      <div class="fillin-container">
        <div class="fillin-input-row">
          <div style="flex:1;min-width:180px">
            <div class="fillin-label">Первый термин:</div>
            <input type="text" class="fillin-input" id="fillinInput1" placeholder="Проверка личности..." autocomplete="off">
          </div>
          <div style="flex:1;min-width:180px">
            <div class="fillin-label">Второй термин:</div>
            <input type="text" class="fillin-input" id="fillinInput2" placeholder="Определение прав..." autocomplete="off">
          </div>
        </div>
      </div>
      <button class="btn-check" id="checkBtn">Проверить</button>
    `;
  }

  renderCategorize(q) {
    const shuffled = [...q.items].sort(() => Math.random() - 0.5);
    return `
      <div class="question-hint">💡 <b>Подсказка:</b> Перетаскивайте элементы в нужные категории или используйте клики (выберите термин, затем нажмите на категорию).</div>
      <div class="categorize-container">
        <div class="categorize-items-pool" id="itemsPool">
          ${shuffled.map((item) => `<div class="categorize-item" draggable="true" data-text="${item.text}" data-correct="${item.category}">${item.text}</div>`).join('')}
        </div>
        <div class="categorize-zones">
          ${q.categories.map((cat, i) => `
            <div class="categorize-zone" data-category="${i}">
              <div class="categorize-zone-title">${cat}</div>
              <div class="categorize-zone-items"></div>
            </div>
          `).join('')}
        </div>
      </div>
      <button class="btn-check" id="checkBtn" disabled>Проверить</button>
    `;
  }

  renderTrueFalse(q) {
    return `
      <div class="truefalse-container">
        <div class="truefalse-statement">${q.statement}</div>
        <div class="truefalse-buttons">
          <button class="btn-true" id="btnTrue">${ICONS.check} Правда</button>
          <button class="btn-false" id="btnFalse">${ICONS.cross} Ложь</button>
        </div>
      </div>
    `;
  }

  renderOrdering(q) {
    const shuffled = [...q.items].sort(() => Math.random() - 0.5);
    return `
      <div class="question-hint">💡 <b>Подсказка:</b> Перетаскивайте элементы или поочередно нажимайте на два элемента, чтобы поменять их местами.</div>
      <div class="ordering-container">
        <div class="ordering-list" id="orderingList">
          ${shuffled.map((item, i) => `
            <div class="ordering-item" draggable="true" data-text="${item}">
              <span class="ordering-num">${i + 1}</span>
              <span class="ordering-text">${item}</span>
              <span class="ordering-handle">⠿</span>
            </div>
          `).join('')}
        </div>
      </div>
      <button class="btn-check" id="checkBtn">Проверить</button>
    `;
  }

  // ──── BIND EVENTS ────
  bindQuestionEvents(q) {
    switch (q.type) {
      case 'single': this.bindSingle(q); break;
      case 'multiple': this.bindMultiple(q); break;
      case 'matching': this.bindMatching(q); break;
      case 'flashcard': this.bindFlashcard(q); break;
      case 'fillin': this.bindFillin(q); break;
      case 'fillin_double': this.bindFillinDouble(q); break;
      case 'categorize': this.bindCategorize(q); break;
      case 'truefalse': this.bindTrueFalse(q); break;
      case 'ordering': this.bindOrdering(q); break;
    }
  }

  bindSingle(q) {
    let selected = -1;
    const items = document.querySelectorAll('.option-item');
    const checkBtn = document.getElementById('checkBtn');

    items.forEach(item => {
      item.addEventListener('click', () => {
        if (this.answered) return;
        this.playSound('click');
        items.forEach(it => it.classList.remove('selected'));
        item.classList.add('selected');
        selected = parseInt(item.dataset.idx);
        checkBtn.disabled = false;
      });
    });

    checkBtn.addEventListener('click', () => {
      if (this.answered) return;
      items.forEach(it => it.classList.add('disabled'));
      checkBtn.classList.add('hidden');
      const isCorrect = selected === q.correct;
      items.forEach(it => {
        const idx = parseInt(it.dataset.idx);
        if (idx === q.correct) {
          it.classList.add('correct');
          it.querySelector('.option-marker').innerHTML = '✓';
        }
        else if (idx === selected && !isCorrect) {
          it.classList.add('incorrect');
          it.querySelector('.option-marker').innerHTML = '✗';
        }
      });
      this.handleAnswer(isCorrect, 10, q);
    });
  }

  bindMultiple(q) {
    const selectedSet = new Set();
    const items = document.querySelectorAll('.option-item');
    const checkBtn = document.getElementById('checkBtn');

    items.forEach(item => {
      item.addEventListener('click', () => {
        this.playSound('click');
        const idx = parseInt(item.dataset.idx);
        if (selectedSet.has(idx)) {
          selectedSet.delete(idx);
          item.classList.remove('selected');
          item.querySelector('.option-marker').textContent = '☐';
        } else {
          selectedSet.add(idx);
          item.classList.add('selected');
          item.querySelector('.option-marker').textContent = '☑';
        }
        checkBtn.disabled = selectedSet.size === 0;
      });
    });

    checkBtn.addEventListener('click', () => {
      items.forEach(it => it.classList.add('disabled'));
      checkBtn.classList.add('hidden');
      const correctSet = new Set(q.correct);
      let allCorrect = true;

      items.forEach(it => {
        const idx = parseInt(it.dataset.idx);
        const isCorrectOption = correctSet.has(idx);
        const wasSelected = selectedSet.has(idx);
        if (isCorrectOption) {
          it.classList.add('correct');
          it.querySelector('.option-marker').innerHTML = '✓';
        }
        if (wasSelected && !isCorrectOption) {
          it.classList.add('incorrect');
          it.querySelector('.option-marker').innerHTML = '✗';
          allCorrect = false;
        }
        if (!wasSelected && isCorrectOption) allCorrect = false;
      });

      const partialCorrect = [...selectedSet].some(i => correctSet.has(i)) && !allCorrect;
      if (allCorrect) this.handleAnswer(true, 15, q);
      else if (partialCorrect) this.handleAnswer('partial', 5, q);
      else this.handleAnswer(false, 0, q);
    });
  }

  bindMatching(q) {
    let selectedTerm = null;
    let matchCount = 0;
    let pairNum = 0;
    const terms = document.querySelectorAll('.matching-term');
    const defs = document.querySelectorAll('.matching-def');

    terms.forEach(term => {
      term.addEventListener('click', () => {
        if (term.classList.contains('matched')) return;
        this.playSound('click');
        terms.forEach(t => t.classList.remove('active'));
        term.classList.add('active');
        selectedTerm = term;
      });
    });

    defs.forEach(def => {
      def.addEventListener('click', () => {
        if (!selectedTerm || def.classList.contains('matched')) return;
        const termIdx = parseInt(selectedTerm.dataset.idx);
        const correctMatch = q.pairs[termIdx].match;
        const defMatch = def.dataset.match;

        if (correctMatch === defMatch) {
          pairNum++;
          this.playSound('correct');
          selectedTerm.classList.remove('active');
          selectedTerm.classList.add('matched');
          def.classList.add('matched');
          const numSpan = document.createElement('span');
          numSpan.className = 'match-num';
          numSpan.textContent = pairNum;
          selectedTerm.prepend(numSpan.cloneNode(true));
          def.prepend(numSpan);
          matchCount++;
          selectedTerm = null;
          if (matchCount === q.pairs.length) this.handleAnswer(true, 20, q);
        } else {
          this.playSound('wrong');
          def.classList.add('wrong');
          setTimeout(() => def.classList.remove('wrong'), 500);
        }
      });
    });
  }

  bindFlashcard(q) {
    const card = document.getElementById('flashcard');
    const actions = document.getElementById('flashcardActions');
    let flipped = false;

    card.addEventListener('click', () => {
      if (!flipped) {
        this.playSound('click');
        card.classList.add('flipped');
        flipped = true;
        actions.classList.remove('hidden');
      }
    });

    document.getElementById('btnKnew').addEventListener('click', () => this.handleAnswer(true, 10, q));
    document.getElementById('btnDidnt').addEventListener('click', () => this.handleAnswer(false, 0, q));
  }

  bindFillin(q) {
    const input = document.getElementById('fillinInput');
    const checkBtn = document.getElementById('checkBtn');

    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkBtn.click(); });

    checkBtn.addEventListener('click', () => {
      const val = input.value.trim().toLowerCase();
      checkBtn.classList.add('hidden');
      input.disabled = true;
      const allAnswers = [q.answer.toLowerCase(), ...(q.acceptableAnswers || []).map(a => a.toLowerCase())];
      const isCorrect = allAnswers.includes(val);
      input.classList.add(isCorrect ? 'correct' : 'incorrect');
      if (!isCorrect) input.value = `${input.value} → ${q.answer}`;
      this.handleAnswer(isCorrect, 15, q);
    });
  }

  bindFillinDouble(q) {
    const input1 = document.getElementById('fillinInput1');
    const input2 = document.getElementById('fillinInput2');
    const checkBtn = document.getElementById('checkBtn');

    input2.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkBtn.click(); });

    checkBtn.addEventListener('click', () => {
      const val1 = input1.value.trim().toLowerCase();
      const val2 = input2.value.trim().toLowerCase();
      checkBtn.classList.add('hidden');
      input1.disabled = true;
      input2.disabled = true;

      const answers1 = [q.answer1.toLowerCase(), ...(q.acceptableAnswers1 || []).map(a => a.toLowerCase())];
      const answers2 = [q.answer2.toLowerCase(), ...(q.acceptableAnswers2 || []).map(a => a.toLowerCase())];
      const c1 = answers1.includes(val1);
      const c2 = answers2.includes(val2);

      input1.classList.add(c1 ? 'correct' : 'incorrect');
      input2.classList.add(c2 ? 'correct' : 'incorrect');
      if (!c1) input1.value = `${input1.value} → ${q.answer1}`;
      if (!c2) input2.value = `${input2.value} → ${q.answer2}`;

      if (c1 && c2) this.handleAnswer(true, 15, q);
      else if (c1 || c2) this.handleAnswer('partial', 5, q);
      else this.handleAnswer(false, 0, q);
    });
  }

  bindCategorize(q) {
    const pool = document.getElementById('itemsPool');
    const zones = document.querySelectorAll('.categorize-zone');
    const checkBtn = document.getElementById('checkBtn');
    let draggedItem = null;
    const items = pool.querySelectorAll('.categorize-item');

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        draggedItem = null;
      });
      item.addEventListener('click', () => {
        if (item.parentElement === pool) {
          this.playSound('click');
          items.forEach(i => i.classList.remove('selected'));
          item.classList.toggle('selected');
        } else {
          this.playSound('click');
          item.classList.remove('selected');
          pool.appendChild(item);
          this.updateCategorizeCheck(q);
        }
      });
    });

    pool.addEventListener('dragover', (e) => { e.preventDefault(); pool.classList.add('drag-over'); });
    pool.addEventListener('dragleave', () => pool.classList.remove('drag-over'));
    pool.addEventListener('drop', (e) => {
      e.preventDefault();
      pool.classList.remove('drag-over');
      if (draggedItem) {
        pool.appendChild(draggedItem);
        this.playSound('click');
        this.updateCategorizeCheck(q);
      }
    });

    zones.forEach(zone => {
      zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        if (draggedItem) {
          zone.querySelector('.categorize-zone-items').appendChild(draggedItem);
          this.playSound('click');
          this.updateCategorizeCheck(q);
        }
      });
      zone.addEventListener('click', (e) => {
        if (e.target.closest('.categorize-item')) return;
        const sel = pool.querySelector('.categorize-item.selected');
        if (sel) {
          sel.classList.remove('selected');
          zone.querySelector('.categorize-zone-items').appendChild(sel);
          this.playSound('click');
          this.updateCategorizeCheck(q);
        }
      });
    });

    checkBtn.addEventListener('click', () => {
      checkBtn.classList.add('hidden');
      let allCorrect = true;
      zones.forEach(zone => {
        const catIdx = parseInt(zone.dataset.category);
        zone.querySelectorAll('.categorize-item').forEach(item => {
          const correctCat = parseInt(item.dataset.correct);
          if (correctCat === catIdx) item.classList.add('correct');
          else { item.classList.add('incorrect'); allCorrect = false; }
          item.setAttribute('draggable', 'false');
          item.style.cursor = 'default';
        });
      });
      this.handleAnswer(allCorrect, 20, q);
    });
  }

  updateCategorizeCheck(q) {
    const pool = document.getElementById('itemsPool');
    const checkBtn = document.getElementById('checkBtn');
    checkBtn.disabled = pool.querySelectorAll('.categorize-item').length > 0;
  }

  bindTrueFalse(q) {
    const btnTrue = document.getElementById('btnTrue');
    const btnFalse = document.getElementById('btnFalse');

    const handle = (answer) => {
      this.playSound('click');
      btnTrue.classList.add('disabled');
      btnFalse.classList.add('disabled');
      const isCorrect = answer === q.correct;

      if (answer === true) {
        btnTrue.classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) btnFalse.classList.add('correct');
      } else {
        btnFalse.classList.add(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) btnTrue.classList.add('correct');
      }

      const explanationText = q.explanation ? ` ${q.explanation}` : '';
      this.handleAnswer(isCorrect, 5, q, explanationText);
    };

    btnTrue.addEventListener('click', () => handle(true));
    btnFalse.addEventListener('click', () => handle(false));
  }

  bindOrdering(q) {
    const list = document.getElementById('orderingList');
    const checkBtn = document.getElementById('checkBtn');
    let draggedItem = null;
    let selectedItem = null;
    const items = list.querySelectorAll('.ordering-item');

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('click', () => {
        this.playSound('click');
        if (!selectedItem) {
          items.forEach(i => i.classList.remove('selected'));
          selectedItem = item;
          item.classList.add('selected');
        } else {
          if (selectedItem !== item) {
            const next1 = selectedItem.nextSibling;
            const next2 = item.nextSibling;
            const parent = item.parentNode;
            if (next1 === item) parent.insertBefore(item, selectedItem);
            else if (next2 === selectedItem) parent.insertBefore(selectedItem, item);
            else {
              parent.insertBefore(item, next1);
              parent.insertBefore(selectedItem, next2);
            }
            this.updateOrderingNumbers();
          }
          selectedItem.classList.remove('selected');
          selectedItem = null;
        }
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        document.querySelectorAll('.ordering-item').forEach(i => i.classList.remove('drag-over-top', 'drag-over-bottom'));
        draggedItem = null;
        this.updateOrderingNumbers();
      });
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (item === draggedItem) return;
        const rect = item.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        item.classList.remove('drag-over-top', 'drag-over-bottom');
        item.classList.add(e.clientY < midY ? 'drag-over-top' : 'drag-over-bottom');
      });
      item.addEventListener('dragleave', () => item.classList.remove('drag-over-top', 'drag-over-bottom'));
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedItem || item === draggedItem) return;
        const rect = item.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        list.insertBefore(draggedItem, e.clientY < midY ? item : item.nextSibling);
        item.classList.remove('drag-over-top', 'drag-over-bottom');
        this.playSound('click');
        this.updateOrderingNumbers();
      });
    });

    checkBtn.addEventListener('click', () => {
      checkBtn.classList.add('hidden');
      const currentItems = list.querySelectorAll('.ordering-item');
      let allCorrect = true;
      currentItems.forEach((item, i) => {
        const correctText = q.items[q.correctOrder[i]];
        if (item.dataset.text === correctText) item.classList.add('correct');
        else { item.classList.add('incorrect'); allCorrect = false; }
        item.setAttribute('draggable', 'false');
        item.style.cursor = 'default';
      });
      this.handleAnswer(allCorrect, 20, q);
    });
  }

  updateOrderingNumbers() {
    document.querySelectorAll('.ordering-item').forEach((item, i) => {
      item.querySelector('.ordering-num').textContent = i + 1;
    });
  }

  // ──── HANDLE ANSWER ────
  handleAnswer(result, points, q, extraText = '') {
    if (this.answered) return;
    this.answered = true;
    this.stopTimer();
    const feedbackEl = document.getElementById('feedback');
    const actionsEl = document.getElementById('actions');
    const timerBonus = result === true ? this.getTimerBonus() : 0;

    if (result === true) {
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;
      this.addScore(points, timerBonus);
      this.playSound('correct');
      if (this.streak >= 3) this.spawnConfetti();
      const bonusText = timerBonus > 0 ? ` (+${timerBonus} за скорость)` : '';
      feedbackEl.innerHTML = `<div class="feedback correct"><span class="feedback-icon">${ICONS.check}</span> Отлично! Правильный ответ!${bonusText}${extraText ? ' ' + extraText : ''}${this.streak >= 3 ? ` <strong>🔥 Серия из ${this.streak}!</strong>` : ''}</div>`;
      this.answers.push({ q, result: 'correct' });
    } else if (result === 'partial') {
      this.streak = 0;
      this.addScore(points);
      this.playSound('correct');
      feedbackEl.innerHTML = `<div class="feedback partial"><span class="feedback-icon">${ICONS.partial}</span> Частично верно!${extraText}</div>`;
      this.answers.push({ q, result: 'partial' });
    } else {
      this.streak = 0;
      this.playSound('wrong');
      feedbackEl.innerHTML = `<div class="feedback incorrect"><span class="feedback-icon">${ICONS.cross}</span> Неверно.${extraText}</div>`;
      this.answers.push({ q, result: 'incorrect' });
    }

    const total = this.quizQuestions.length;
    const isLast = this.currentQuestion === total - 1;
    actionsEl.innerHTML = `<button class="btn-next" id="nextBtn">${isLast ? 'Результаты →' : 'Далее →'}</button>`;
    document.getElementById('nextBtn').addEventListener('click', () => {
      // Slide-out animation
      const card = document.querySelector('.question-card');
      if (card) {
        card.classList.remove('slide-in');
        card.classList.add('slide-out');
        setTimeout(() => {
          if (isLast) this.showResults();
          else { this.currentQuestion++; this.renderQuestion(); }
        }, 300);
      } else {
        if (isLast) this.showResults();
        else { this.currentQuestion++; this.renderQuestion(); }
      }
    });
  }

  // ──── RESULTS ────
  showResults() {
    this.stopTimer();
    const app = document.getElementById('app');
    const total = this.quizQuestions.length;
    const correct = this.answers.filter(a => a.result === 'correct').length;
    const percent = Math.round((correct / total) * 100);
    let rank, rankDesc, rankIcon, rankColor;
    if (percent >= 90) { rank = 'Вайб-Архитектор'; rankDesc = 'Нейросети подчиняются вашему вайбу!'; rankIcon = ICONS.rankGuru; rankColor = '#19F05A'; }
    else if (percent >= 70) { rank = 'Промпт-Инженер'; rankDesc = 'Вы на верном пути к мастерству вайбкодинга.'; rankIcon = ICONS.rankPro; rankColor = '#19F05A'; }
    else if (percent >= 50) { rank = 'Начинающий кодер'; rankDesc = 'Хорошее начало! Стоит перечитать пару терминов.'; rankIcon = ICONS.rankJunior; rankColor = '#3B9EFF'; }
    else { rank = 'Стажёр'; rankDesc = 'Повторите материал урока и попробуйте ещё раз!'; rankIcon = ICONS.rankIntern; rankColor = '#9AA6B6'; }

    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (percent / 100) * circumference;
    const errors = this.answers.filter(a => a.result !== 'correct');

    app.innerHTML = `
      <div class="results-screen">
        <h1 class="results-title">Результаты <span class="neon">квиза</span></h1>
        <div class="results-circle-container">
          <svg class="results-circle" viewBox="0 0 220 220">
            <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#19F05A"/><stop offset="100%" stop-color="#0AE08C"/></linearGradient></defs>
            <circle class="results-circle-bg" cx="110" cy="110" r="90"/>
            <circle class="results-circle-fill" cx="110" cy="110" r="90" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" id="circleProgress"/>
          </svg>
          <div class="results-percent" id="percentText">0%</div>
        </div>
        <div class="results-rank"><span class="rank-icon">${rankIcon}</span><span style="color:${rankColor}">${rank}</span></div>
        <div class="results-rank-desc">${rankDesc}</div>
        <div class="results-stats">
          <div class="results-stat"><div class="stat-value" style="color:var(--accent)">${this.score}</div><div class="stat-label">Баллов</div></div>
          <div class="results-stat"><div class="stat-value" style="color:var(--success)">${correct}/${total}</div><div class="stat-label">Верно</div></div>
          <div class="results-stat"><div class="stat-value" style="color:var(--warning)">${this.maxStreak}</div><div class="stat-label">Макс. серия</div></div>
        </div>
        ${errors.length > 0 ? `
          <div class="results-errors">
            <h3>${ICONS.cross} Стоит повторить (${errors.length})</h3>
            ${errors.map(e => `<div class="error-item"><div class="error-q">${e.q.emoji} ${e.q.topic}: ${e.q.question || e.q.statement || e.q.front || ''}</div>${e.q.answer ? `<div class="error-correct">${ICONS.check} Ответ: ${e.q.answer}</div>` : ''}${e.q.back ? `<div class="error-correct">${ICONS.check} Ответ: ${e.q.back}</div>` : ''}${e.q.explanation ? `<div class="error-correct">${e.q.explanation}</div>` : ''}</div>`).join('')}
          </div>` : ''}
        <div class="results-actions">
          <button class="btn-primary" id="retryBtn">Пройти заново →</button>
          ${errors.length > 0 ? `<button class="btn-retry-errors" id="retryErrorsBtn">🔄 Повторить ошибки (${errors.length})</button>` : ''}
        </div>
        <div class="share-section"><button class="btn-share" id="shareBtn">📤 Поделиться результатом</button><div id="sharePreview"></div></div>
      </div>`;

    setTimeout(() => {
      const cp = document.getElementById('circleProgress');
      if (cp) cp.style.strokeDashoffset = offset;
      let cur = 0;
      const step = () => { cur++; if (cur > percent) cur = percent; const pt = document.getElementById('percentText'); if (pt) pt.textContent = cur + '%'; if (cur < percent) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, 300);

    if (percent >= 70) this.spawnConfetti();
    document.getElementById('retryBtn').addEventListener('click', () => { this._midwayShown = false; this.startQuiz(); });
    const retryErrBtn = document.getElementById('retryErrorsBtn');
    if (retryErrBtn) {
      retryErrBtn.addEventListener('click', () => {
        const errQuestions = errors.map(e => e.q);
        this._midwayShown = true; // skip midway in retry
        this.startQuiz(errQuestions);
      });
    }
    document.getElementById('shareBtn').addEventListener('click', () => this.generateShareCard(percent, rank, rankColor, correct, total));
  }

  // ──── SHARE CARD (Canvas) ────
  generateShareCard(percent, rank, rankColor, correct, total) {
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 400;
    const ctx = canvas.getContext('2d');
    // Background
    ctx.fillStyle = '#0B1C24'; ctx.fillRect(0, 0, 600, 400);
    // Grid
    ctx.strokeStyle = 'rgba(25,240,90,0.04)'; ctx.lineWidth = 1;
    for (let x = 0; x < 600; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 400); ctx.stroke(); }
    for (let y = 0; y < 400; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(600, y); ctx.stroke(); }
    // Glow
    const grd = ctx.createRadialGradient(500, 60, 0, 500, 60, 300);
    grd.addColorStop(0, 'rgba(25,240,90,0.12)'); grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 600, 400);
    // Title
    ctx.fillStyle = '#E3ECF7'; ctx.font = '900 28px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Квиз: Говорим на одном языке', 300, 55);
    // Circle
    ctx.beginPath(); ctx.arc(300, 190, 80, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(25,240,90,0.1)'; ctx.lineWidth = 8; ctx.stroke();
    ctx.beginPath(); ctx.arc(300, 190, 80, -Math.PI / 2, -Math.PI / 2 + (percent / 100) * Math.PI * 2);
    ctx.strokeStyle = '#19F05A'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.stroke();
    ctx.fillStyle = '#19F05A'; ctx.font = '900 48px "Roboto Mono", monospace'; ctx.textAlign = 'center';
    ctx.fillText(percent + '%', 300, 205);
    // Rank
    ctx.fillStyle = rankColor; ctx.font = '800 22px Inter, sans-serif'; ctx.fillText(rank, 300, 310);
    // Stats
    ctx.fillStyle = '#9AA6B6'; ctx.font = '500 15px Inter, sans-serif';
    ctx.fillText(`${correct}/${total} верно  •  ${this.score} баллов  •  серия ${this.maxStreak}`, 300, 345);
    // Footer
    ctx.fillStyle = 'rgba(25,240,90,0.3)'; ctx.font = '500 12px Inter, sans-serif';
    ctx.fillText('IT-термины • Урок 1.3', 300, 385);

    const preview = document.getElementById('sharePreview');
    preview.innerHTML = '';
    preview.className = 'share-preview';
    preview.appendChild(canvas);
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn-download';
    downloadBtn.textContent = '💾 Скачать картинку';
    downloadBtn.addEventListener('click', () => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'quiz-result.png';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    });
    preview.appendChild(downloadBtn);
  }
}

// ──── START ────
window.addEventListener('DOMContentLoaded', () => { new QuizApp(); });
