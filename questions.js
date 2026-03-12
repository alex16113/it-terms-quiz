const questions = [
  // Q1 — Single Choice: Вайбкодинг
  {
    id: 1,
    type: 'single',
    emoji: '🎯',
    topic: 'Вайбкодинг',
    question: 'Что такое вайбкодинг?',
    options: [
      'Написание кода вручную в IDE',
      'Подход к разработке через диалог с ИИ',
      'Инструмент для тестирования приложений',
      'Способ оформления интерфейса'
    ],
    correct: 1
  },
  // Q2 — Multiple Choice: Веб-технологии
  {
    id: 2,
    type: 'multiple',
    emoji: '✅',
    topic: 'Веб-технологии',
    question: 'Какие из перечисленных являются базовыми веб-технологиями?',
    options: ['HTML', 'Git', 'CSS', 'JavaScript', 'REST'],
    correct: [0, 2, 3]
  },
  // Q3 — Matching: Аналогии (HTML, CSS, JS, API)
  {
    id: 3,
    type: 'matching',
    emoji: '🔗',
    topic: 'Аналогии',
    question: 'Соедините термин с его аналогией',
    pairs: [
      { term: 'HTML', match: 'Каркас дома' },
      { term: 'CSS', match: 'Дизайн и отделка дома' },
      { term: 'JavaScript', match: 'Электричество и механизмы' },
      { term: 'API', match: 'Официант между залом и кухней' }
    ]
  },
  // Q4 — Flashcard: Промпт
  {
    id: 4,
    type: 'flashcard',
    emoji: '🃏',
    topic: 'Промпт',
    front: 'Текстовое задание или инструкция для нейросети, описывающая, что нужно создать или изменить',
    back: 'Промпт (Prompt)',
    hint: 'Как техническое задание для специалиста'
  },
  // Q5 — Fill in the Blank: MVP
  {
    id: 5,
    type: 'fillin',
    emoji: '📝',
    topic: 'MVP',
    question: '_______ — это минимальная рабочая версия продукта с одной основной функцией для проверки идеи',
    answer: 'MVP',
    acceptableAnswers: ['mvp', 'мвп', 'minimum viable product']
  },
  // Q6 — Categorization: Фича vs Баг
  {
    id: 6,
    type: 'categorize',
    emoji: '🏗️',
    topic: 'Фича vs Баг',
    question: 'Распределите примеры по категориям',
    categories: ['Фича', 'Баг'],
    items: [
      { text: 'Онлайн-оплата', category: 0 },
      { text: 'Кнопка не реагирует', category: 1 },
      { text: 'Форма регистрации', category: 0 },
      { text: 'Страница не загружается', category: 1 },
      { text: 'Уведомления', category: 0 },
      { text: 'Неверный расчёт суммы', category: 1 }
    ]
  },
  // Q7 — Single Choice: Логи
  {
    id: 7,
    type: 'single',
    emoji: '🎯',
    topic: 'Логи',
    question: 'Для чего используются логи?',
    options: [
      'Для оформления страницы',
      'Для хронологической записи событий в системе',
      'Для генерации кода нейросетью',
      'Для хранения паролей пользователей'
    ],
    correct: 1
  },
  // Q8 — Multiple Choice: Контроль версий
  {
    id: 8,
    type: 'multiple',
    emoji: '✅',
    topic: 'Контроль версий',
    question: 'Какие термины связаны с контролем версий?',
    options: ['Git', 'JSON', 'Коммит', 'Репозиторий', 'Деплой'],
    correct: [0, 2, 3]
  },
  // Q9 — Matching: Клиент-серверная архитектура
  {
    id: 9,
    type: 'matching',
    emoji: '🔗',
    topic: 'Архитектура',
    question: 'Соедините термин с определением',
    pairs: [
      { term: 'Фронтенд', match: 'Часть приложения, видимая в браузере' },
      { term: 'Бэкенд', match: 'Серверная часть, обрабатывающая логику' },
      { term: 'База данных', match: 'Система хранения данных приложения' },
      { term: 'Клиент-серверная модель', match: 'Клиент запрашивает — сервер отвечает' }
    ]
  },
  // Q10 — Flashcard: Localhost
  {
    id: 10,
    type: 'flashcard',
    emoji: '🃏',
    topic: 'Localhost',
    front: 'Специальный адрес, который ссылается на ваш собственный компьютер для тестирования без интернета',
    back: 'Localhost',
    hint: 'http://...'
  },
  // Q11 — Fill in the Blank: Рефакторинг
  {
    id: 11,
    type: 'fillin',
    emoji: '📝',
    topic: 'Рефакторинг',
    question: '_______ — это улучшение внутренней структуры кода без изменения его внешнего поведения',
    answer: 'Рефакторинг',
    acceptableAnswers: ['рефакторинг', 'refactoring']
  },
  // Q12 — Categorization: Инструменты vs Модели
  {
    id: 12,
    type: 'categorize',
    emoji: '🏗️',
    topic: 'Инструменты vs Модели',
    question: 'Распределите термины по категориям',
    categories: ['IDE-инструменты', 'ИИ-модели'],
    items: [
      { text: 'VS Code', category: 0 },
      { text: 'ChatGPT', category: 1 },
      { text: 'Cursor', category: 0 },
      { text: 'Claude', category: 1 },
      { text: 'Antigravity', category: 0 },
      { text: 'Gemini', category: 1 }
    ]
  },
  // Q13 — Single Choice: Фреймворк
  {
    id: 13,
    type: 'single',
    emoji: '🎯',
    topic: 'Фреймворк',
    question: 'Чем фреймворк отличается от библиотеки?',
    options: [
      'Фреймворк задаёт архитектуру приложения',
      'Фреймворк — это язык программирования',
      'Библиотека более мощная, чем фреймворк',
      'Между ними нет различий'
    ],
    correct: 0
  },
  // Q14 — Multiple Choice: Безопасность
  {
    id: 14,
    type: 'multiple',
    emoji: '✅',
    topic: 'Безопасность',
    question: 'Какие термины связаны с безопасностью данных?',
    options: ['Переменные среды (.env)', 'API-ключ', 'Аутентификация', 'Адаптивность', 'Пайплайн'],
    correct: [0, 1, 2]
  },
  // Q15 — Matching: Инфраструктура — аналогии
  {
    id: 15,
    type: 'matching',
    emoji: '🔗',
    topic: 'Инфраструктура',
    question: 'Соедините термин с аналогией',
    pairs: [
      { term: 'Сервер', match: 'Сотрудник, отвечающий 24/7' },
      { term: 'Хостинг', match: 'Аренда помещения для бизнеса' },
      { term: 'Домен', match: 'Адрес здания' },
      { term: 'Деплой', match: 'Открытие магазина для посетителей' }
    ]
  },
  // Q16 — Flashcard: RAG
  {
    id: 16,
    type: 'flashcard',
    emoji: '🃏',
    topic: 'RAG',
    front: 'Подход, при котором модель генерирует ответ с использованием внешних данных из базы знаний или документов',
    back: 'RAG (Retrieval-Augmented Generation)',
    hint: 'Сначала ищет, потом отвечает'
  },
  // Q17 — Fill in the Blank: Аутентификация и Авторизация
  {
    id: 17,
    type: 'fillin_double',
    emoji: '📝',
    topic: 'Аутентификация и Авторизация',
    question: '_______ — это проверка личности, а _______ — определение прав доступа',
    answer1: 'Аутентификация',
    answer2: 'Авторизация',
    acceptableAnswers1: ['аутентификация', 'authentication'],
    acceptableAnswers2: ['авторизация', 'authorization']
  },
  // Q18 — Ordering: Пайплайн
  {
    id: 18,
    type: 'ordering',
    emoji: '🔄',
    topic: 'Пайплайн',
    question: 'Расположите этапы пайплайна в правильном порядке',
    items: ['Идея', 'Прототип', 'Код', 'Запуск (деплой)'],
    correctOrder: [0, 1, 2, 3]
  },
  // Q19 — Single Choice: LLM
  {
    id: 19,
    type: 'single',
    emoji: '🎯',
    topic: 'LLM',
    question: 'Что означает аббревиатура LLM?',
    options: [
      'Low-Level Module',
      'Lightweight Learning Method',
      'Большая языковая модель (Large Language Model)',
      'Limited Logic Machine'
    ],
    correct: 2
  },
  // Q20 — Multiple Choice: Подходы без кода
  {
    id: 20,
    type: 'multiple',
    emoji: '✅',
    topic: 'Подходы к разработке',
    question: 'Какие подходы НЕ требуют написания кода вручную?',
    options: ['No-code', 'Open source', 'Вайбкодинг', 'Low-code', 'Рефакторинг'],
    correct: [0, 2, 3]
  },
  // Q21 — Categorization: Протоколы и Форматы
  {
    id: 21,
    type: 'categorize',
    emoji: '🏗️',
    topic: 'Протоколы и форматы',
    question: 'Распределите термины по категориям',
    categories: ['Протоколы взаимодействия', 'Форматы / стили данных'],
    items: [
      { text: 'HTTP/HTTPS', category: 0 },
      { text: 'JSON', category: 1 },
      { text: 'REST', category: 0 },
      { text: 'Webhook', category: 0 }
    ]
  },
  // Q22 — True/False: CSS
  {
    id: 22,
    type: 'truefalse',
    emoji: '🧩',
    topic: 'CSS',
    statement: 'CSS — это язык программирования, который делает сайт интерактивным',
    correct: false,
    explanation: 'CSS — это язык стилей для оформления. Интерактивность обеспечивает JavaScript.'
  },
  // Q23 — Ordering: Разработка и публикация
  {
    id: 23,
    type: 'ordering',
    emoji: '🔄',
    topic: 'Жизненный цикл',
    question: 'Расположите этапы разработки в правильном порядке',
    items: ['Написать код в IDE', 'Протестировать на localhost', 'Сделать коммит в Git', 'Выполнить деплой на хостинг'],
    correctOrder: [0, 1, 2, 3]
  },
  // Q24 — Single Choice: Контекстное окно
  {
    id: 24,
    type: 'single',
    emoji: '🎯',
    topic: 'Контекстное окно',
    question: 'Что такое контекстное окно в контексте ИИ?',
    options: [
      'Всплывающее окно на сайте',
      'Объём текста, который модель учитывает при ответе',
      'Окно для ввода пароля',
      'Рабочая область IDE'
    ],
    correct: 1
  },
  // Q25 — Multiple Choice: Конструкторы
  {
    id: 25,
    type: 'multiple',
    emoji: '✅',
    topic: 'Конструкторы',
    question: 'Какие сервисы являются ИИ-конструкторами для создания приложений?',
    options: ['Lovable', 'GitHub', 'Rork', 'ChatPlace', 'Codex'],
    correct: [0, 2, 3]
  },
  // Q26 — Matching: ИИ-инструменты
  {
    id: 26,
    type: 'matching',
    emoji: '🔗',
    topic: 'ИИ-инструменты',
    question: 'Соедините инструмент с описанием',
    pairs: [
      { term: 'Canvas', match: 'Рабочая область для кода с ИИ' },
      { term: 'Copilot', match: 'AI-ассистент автодополнения кода' },
      { term: 'Cursor', match: 'AI-IDE с глубоким анализом проекта' },
      { term: 'Antigravity', match: 'AI-IDE от Google с агентами' }
    ]
  },
  // Q27 — Flashcard: Webhook
  {
    id: 27,
    type: 'flashcard',
    emoji: '🃏',
    topic: 'Webhook',
    front: 'Механизм автоматической отправки события от одного сервиса к другому при определённом действии',
    back: 'Webhook',
    hint: 'Автоматическое уведомление'
  },
  // Q28 — Single Choice: Токен
  {
    id: 28,
    type: 'single',
    emoji: '🎯',
    topic: 'Токен',
    question: 'Что такое токен в контексте ИИ-моделей?',
    options: [
      'Тип криптовалюты',
      'Единица текста, на которую модель разбивает данные',
      'Ключ доступа к API',
      'Единица хранения в базе данных'
    ],
    correct: 1
  },
  // Q29 — Fill in the Blank: Адаптивность
  {
    id: 29,
    type: 'fillin',
    emoji: '📝',
    topic: 'Адаптивность',
    question: '_______ — это способность интерфейса корректно отображаться на разных устройствах и размерах экранов',
    answer: 'Адаптивность',
    acceptableAnswers: ['адаптивность', 'адаптивный дизайн', 'responsive', 'responsiveness']
  },
  // Q30 — True/False: Open Source
  {
    id: 30,
    type: 'truefalse',
    emoji: '🧩',
    topic: 'Open Source',
    statement: 'Open source — это ПО, за которое всегда нужно платить',
    correct: false,
    explanation: 'Open source — ПО с открытым исходным кодом, доступным для просмотра и модификации. Обычно бесплатно.'
  }
];

// Бонусные вопросы (выдаются при стрике 5+)
const bonusQuestions = [
  {
    id: 101,
    type: 'single',
    emoji: '⭐',
    topic: 'Фуллстек',
    question: 'Как называют разработчика, который умеет делать и фронтенд, и бэкенд проекта?',
    options: [
      'DevOps-инженер',
      'Системный администратор',
      'Фуллстек (Fullstack)',
      'Тимлид'
    ],
    correct: 2,
    isBonus: true
  },
  {
    id: 102,
    type: 'truefalse',
    emoji: '⭐',
    topic: 'Галлюцинации ИИ',
    statement: 'Галлюцинация ИИ — это когда нейросеть уверенно выдает выдуманную или ложную информацию за неоспоримый факт.',
    correct: true,
    explanation: 'Нейросети иногда "придумывают" факты, если не знают точного ответа.',
    isBonus: true
  },
  {
    id: 103,
    type: 'flashcard',
    emoji: '⭐',
    topic: 'Дебаггинг',
    front: 'Процесс методичного поиска и исправления багов (ошибок) в коде.',
    back: 'Дебаггинг (Debugging)',
    hint: 'Как детективное расследование в коде',
    isBonus: true
  },
  {
    id: 104,
    type: 'single',
    emoji: '⭐',
    topic: 'Agile / Scrum',
    question: 'Что такое "Спринт" (Sprint) в разработке?',
    options: [
      'Быстрый набор текста на клавиатуре',
      'Короткий отрезок времени, за который команда выполняет определенный объем работы',
      'Процесс быстрого удаления старого кода',
      'Программа для ускорения загрузки сайта'
    ],
    correct: 1,
    isBonus: true
  },
  {
    id: 105,
    type: 'truefalse',
    emoji: '⭐',
    topic: 'Кэширование',
    statement: 'Кэширование (Caching) — это процесс сохранения временных данных на клиенте, чтобы при повторном заходе страница грузилась мгновенно.',
    correct: true,
    explanation: 'Это сильно ускоряет загрузку сайтов для постоянных посетителей.',
    isBonus: true
  },
  {
    id: 106,
    type: 'single',
    emoji: '⭐',
    topic: 'Кибербезопасность',
    question: 'Что такое DDoS-атака?',
    options: [
      'Вирус, который шифрует файлы на компьютере',
      'Кража паролей через поддельный сайт',
      'Искусственное создание огромного количества запросов, чтобы перегрузить и "положить" сервер',
      'Взлом базы данных через SQL-инъекцию'
    ],
    correct: 2,
    isBonus: true
  }
];
