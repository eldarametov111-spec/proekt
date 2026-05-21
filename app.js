'use strict';

/* =========================
   Быстрые помощники
========================= */

const $ = (selector, root = document) => root.querySelector(selector);
const app = $('#app');

const store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

/* =========================
   Основные настройки
========================= */

const APP = 'сайт для практики';

const roles = [
  'Руководитель',
  'Менеджер',
  'Репетитор',
  'Партнёр',
  'Новый пользователь',
  'Практикант'
];

/* =========================
   Демо-данные
========================= */

const usersSeed = [
  {
    id: 1,
    name: 'Анна Волкова',
    phone: '+79990000001',
    password: 'admin2026',
    role: 'Руководитель',
    about: 'Управляет закрытой учебной экосистемой и контролирует ключевые процессы.',
    rating: 5,
    contacts: 'anna@practice.test'
  },
  {
    id: 2,
    name: 'Марат Ильин',
    phone: '+79990000002',
    password: '123456',
    role: 'Менеджер',
    about: 'Распределяет задания, отвечает за поддержку и контроль отчётов.',
    rating: 4.8,
    contacts: 'marat@practice.test'
  },
  {
    id: 3,
    name: 'Елена Соколова',
    phone: '+79990000003',
    password: '123456',
    role: 'Репетитор',
    about: 'Математика, подготовка к экзаменам, отчётность по ученикам.',
    rating: 4.9,
    contacts: 'elena@practice.test'
  },
  {
    id: 4,
    name: 'Игорь Ким',
    phone: '+79990000004',
    password: '123456',
    role: 'Практикант',
    about: 'Помогает менеджерам, модерирует ленту и выполняет внутренние задачи.',
    rating: 4.4,
    contacts: 'igor@practice.test'
  }
];

const tasksSeed = [
  {
    id: 101,
    title: 'Подготовить отчёт по ученику',
    description: 'Собрать прогресс, проблемы и рекомендации для родителя.',
    deadline: '2026-05-28',
    limit: 2,
    files: 'шаблон.docx',
    priority: 'Высокий',
    status: 'Новое',
    category: 'Репетиторы',
    creatorId: 2,
    executorIds: [3],
    responses: [3],
    reports: []
  },
  {
    id: 102,
    title: 'Проверить отчёты практикантов',
    description: 'Проверить 12 отчётов и отметить спорные пункты.',
    deadline: '2026-05-25',
    limit: 1,
    files: 'таблица.xlsx',
    priority: 'Средний',
    status: 'В работе',
    category: 'Менеджеры',
    creatorId: 1,
    executorIds: [2],
    responses: [2],
    reports: []
  },
  {
    id: 103,
    title: 'Модерация публикаций',
    description: 'Проверить внутреннюю ленту и убрать дубли.',
    deadline: '2026-05-30',
    limit: 3,
    files: '',
    priority: 'Обычный',
    status: 'Новое',
    category: 'Практикант',
    creatorId: 2,
    executorIds: [],
    responses: [],
    reports: []
  }
];

const postsSeed = [
  {
    id: 1,
    userId: 3,
    text: 'Разобрала новый формат домашнего задания. Ученики быстрее включаются, когда видят короткий чек-лист.',
    photo: '',
    likes: [1, 2],
    comments: [
      {
        userId: 2,
        text: 'Отлично, добавим в методичку.'
      }
    ],
    date: '2026-05-20T10:00:00'
  },
  {
    id: 2,
    userId: 2,
    text: 'Сегодня фокус на закрытии просроченных отчётов и быстрых ответах в поддержке.',
    photo: '',
    likes: [1, 3, 4],
    comments: [],
    date: '2026-05-19T14:20:00'
  }
];

const chatsSeed = [
  {
    id: 'general',
    title: 'Общий чат',
    members: [1, 2, 3, 4],
    messages: [
      {
        userId: 1,
        text: 'Добро пожаловать в рабочее пространство.',
        date: '2026-05-20T09:00:00'
      },
      {
        userId: 2,
        text: 'Все новые задачи смотрим в разделе «Задания».',
        date: '2026-05-20T09:05:00'
      }
    ]
  },
  {
    id: 'support',
    title: 'Поддержка',
    members: [1, 2, 3, 4],
    messages: [
      {
        userId: 2,
        text: 'Опишите вопрос — менеджер подключится к обращению.',
        date: '2026-05-20T10:00:00'
      }
    ]
  }
];

/* =========================
   Инициализация хранилища
========================= */

function init() {
  if (!store.get('sp_users')) store.set('sp_users', usersSeed);
  if (!store.get('sp_tasks')) store.set('sp_tasks', tasksSeed);
  if (!store.get('sp_posts')) store.set('sp_posts', postsSeed);
  if (!store.get('sp_chats')) store.set('sp_chats', chatsSeed);
  if (!store.get('sp_tickets')) store.set('sp_tickets', []);
}

init();

/* =========================
   Состояние приложения
========================= */

let current = store.get('sp_current', null);
let page = 'home';
let authMode = 'login';
let taskFilter = 'Все';
let taskSearch = '';
let activeChat = 'general';
let postDraftImage = '';

/* =========================
   Геттеры и сеттеры данных
========================= */

const U = () => store.get('sp_users', []);
const T = () => store.get('sp_tasks', []);
const P = () => store.get('sp_posts', []);
const C = () => store.get('sp_chats', []);
const Tickets = () => store.get('sp_tickets', []);

const setU = value => store.set('sp_users', value);
const setT = value => store.set('sp_tasks', value);
const setP = value => store.set('sp_posts', value);
const setC = value => store.set('sp_chats', value);
const setTickets = value => store.set('sp_tickets', value);

const me = () => U().find(user => user.id === current?.id);

const user = id =>
  U().find(item => item.id === id) || {
    name: 'Удалённый пользователь',
    role: '—'
  };

const canCreateTasks = () =>
  ['Руководитель', 'Менеджер'].includes(me()?.role);

const isBoss = () => canCreateTasks();

/* =========================
   Навигация
========================= */

const nav = [
  ['home', '⌂', 'Главная'],
  ['messages', '✉', 'Чаты'],
  ['feed', '◎', 'Лента'],
  ['tasks', '✓', 'Задания'],
  ['support', '?', 'Помощь'],
  ['profile', '◉', 'Профиль']
];

/* =========================
   Главный рендер
========================= */

function render() {
  if (!current || !me()) {
    return renderAuth();
  }

  app.innerHTML = `
    <div class="app-shell">
      <main class="phone">
        ${topbar()}
        ${pages[page]()}
      </main>
      ${bottomNav()}
    </div>
  `;

  bindAfterRender();
}

function topbar() {
  const currentUser = me();

  return `
    <div class="top">
      <div class="brand">
        <div class="brand-mark">ПР</div>
        <div>
          <h1>${APP}</h1>
          <p>закрытая платформа для практики, задач и коммуникации</p>
        </div>
      </div>

      <div class="top-actions">
        <span class="pill">${currentUser.role}</span>
        <span class="pill">${esc(currentUser.name)}</span>
        <button class="btn ghost" onclick="logout()">Выйти</button>
      </div>
    </div>
  `;
}

function bottomNav() {
  return `
    <nav class="bottom-nav" aria-label="Основная навигация">
      ${nav.map(item => `
        <button
          data-page="${item[0]}"
          class="${page === item[0] ? 'active' : ''}"
        >
          <b>${item[1]}</b>
          ${item[2]}
        </button>
      `).join('')}
    </nav>
  `;
}

/* =========================
   Авторизация
========================= */

function renderAuth() {
  app.innerHTML = `
    <div class="login-wrap">
      <section class="card login">
        <h1>${APP}</h1>

        <p>
          ${
            authMode === 'login'
              ? 'Вход в закрытую платформу'
              : authMode === 'register'
                ? 'Создание профиля пользователя'
                : 'Восстановление доступа'
          }
        </p>

        <div class="switch">
          <button
            class="btn ${authMode === 'login' ? '' : 'ghost'}"
            onclick="authMode='login';render()"
          >
            Вход
          </button>

          <button
            class="btn ${authMode === 'register' ? '' : 'ghost'}"
            onclick="authMode='register';render()"
          >
            Регистрация
          </button>

          <button
            class="btn ${authMode === 'recover' ? '' : 'ghost'}"
            onclick="authMode='recover';render()"
          >
            Доступ
          </button>
        </div>

        ${authForms[authMode]()}

        <div class="hint">
          <b>Демо-доступ:</b><br>
          Руководитель: +79990000001 / admin2026<br>
          Менеджер: +79990000002 / 123456<br>
          Репетитор: +79990000003 / 123456
        </div>

        <div id="authErr" class="error"></div>
      </section>
    </div>
  `;
}

const authForms = {
  login: () => `
    <div class="grid">
      <label class="field">
        Телефон
        <input id="login" value="+79990000001" autocomplete="username">
      </label>

      <label class="field">
        Пароль
        <input id="pass" type="password" value="admin2026" autocomplete="current-password">
      </label>

      <button class="btn" onclick="login()">Войти</button>
    </div>
  `,

  register: () => `
    <div class="form-grid">
      <label class="field">Имя<input id="rName"></label>
      <label class="field">Фамилия<input id="rLast"></label>
      <label class="field">Отчество<input id="rMid"></label>
      <label class="field">Дата рождения<input id="rBirth" type="date"></label>
      <label class="field">Телефон<input id="rPhone" placeholder="+79990000000"></label>
      <label class="field">Пароль<input id="rPass" type="password"></label>
      <label class="field wide">Реферальный код<input id="rRef"></label>

      <button class="btn wide" onclick="register()">Создать профиль</button>
    </div>
  `,

  recover: () => `
    <div class="grid">
      <label class="field">
        Телефон
        <input id="recPhone" placeholder="+79990000000">
      </label>

      <button class="btn" onclick="recover()">Получить SMS-код</button>

      <p class="sub">
        В прототипе код не отправляется: сценарий показывает логику восстановления.
      </p>
    </div>
  `
};

function err(text) {
  $('#authErr').textContent = text;
}

window.login = () => {
  const phone = $('#login').value.trim();
  const password = $('#pass').value;

  const foundUser = U().find(item =>
    item.phone === phone && item.password === password
  );

  if (!foundUser) {
    return err('Неверный телефон или пароль.');
  }

  current = { id: foundUser.id };
  store.set('sp_current', current);

  page = 'home';
  render();
};

window.register = () => {
  const phone = $('#rPhone').value.trim();
  const password = $('#rPass').value;

  const name = [
    $('#rLast').value,
    $('#rName').value,
    $('#rMid').value
  ].filter(Boolean).join(' ').trim();

  if (!name || !phone || !password) {
    return err('Заполните ФИО, телефон и пароль.');
  }

  if (password.length < 6) {
    return err('Пароль должен быть не короче 6 символов.');
  }

  if (U().some(item => item.phone === phone)) {
    return err('Телефон уже зарегистрирован.');
  }

  const newUser = {
    id: Date.now(),
    name,
    phone,
    password,
    role: 'Новый пользователь',
    about: 'Новый участник платформы.',
    rating: 0,
    contacts: phone,
    birth: $('#rBirth').value,
    ref: $('#rRef').value
  };

  setU([...U(), newUser]);

  current = { id: newUser.id };
  store.set('sp_current', current);

  toast('Профиль создан');
  render();
};

window.recover = () => {
  const phone = $('#recPhone').value.trim();

  err(
    phone
      ? 'SMS-код отправлен. В прототипе используйте демо-пароль или зарегистрируйтесь заново.'
      : 'Введите телефон.'
  );
};

/* =========================
   Страницы
========================= */

const pages = {
  home() {
    const myTasks = T().filter(task => task.executorIds.includes(me().id));

    return `
      <section class="head">
        <div>
          <h2>Главная</h2>
          <p class="sub">Сводка по задачам, публикациям, обращениям и активности.</p>
        </div>

        <button class="btn" onclick="page='tasks';render()">
          Перейти к заданиям
        </button>
      </section>

      <section class="grid grid-4">
        ${stat('✓', 'Всего заданий', T().length)}
        ${stat('✉', 'Чатов', C().length)}
        ${stat('◎', 'Публикаций', P().length)}
        ${stat('?', 'Обращений', Tickets().length)}
      </section>

      <br>

      <section class="grid grid-2">
        <div class="card pad">
          <h2>Актуальные задания</h2>
          <div class="list">${taskList(T().slice(0, 3))}</div>
        </div>

        <div class="card pad">
          <h2>Моя роль</h2>
          <p class="sub">${roleText(me().role)}</p>

          <hr>

          <h3>Мои активные задачи</h3>
          <p><b>${myTasks.length}</b> назначено на вас</p>
          <p class="sub">Данные синхронизированы с профилем, чатами и поддержкой.</p>
        </div>
      </section>
    `;
  },

  messages() {
    const chats = C();
    const active = chats.find(chat => chat.id === activeChat) || chats[0];

    if (!active) {
      return `
        <section class="head"><h2>Сообщения</h2></section>
        <div class="card pad empty">Чатов пока нет.</div>
      `;
    }

    return `
      <section class="head">
        <div>
          <h2>Сообщения</h2>
          <p class="sub">Личные и рабочие чаты с историей переписки.</p>
        </div>

        <button class="btn" onclick="newChat()">Новый чат</button>
      </section>

      <section class="chat-layout">
        <aside class="card pad chat-list">
          ${chats.map(chat => `
            <div class="item" onclick="activeChat='${chat.id}';render()">
              <div class="person">
                <div class="avatar">${chat.title[0]}</div>
                <div>
                  <b>${esc(chat.title)}</b>
                  <p>${esc(lastMsg(chat))}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </aside>

        <div class="card chat-window">
          <div class="pad">
            <h2>${esc(active.title)}</h2>
            <p class="sub">Участников: ${active.members.length}</p>
          </div>

          <div class="messages">
            ${
              active.messages.map(message => `
                <div class="msg ${message.userId === me().id ? 'mine' : ''}">
                  <b>${esc(user(message.userId).name)}</b><br>
                  ${esc(message.text)}
                  <small>${new Date(message.date).toLocaleString('ru-RU')}</small>
                </div>
              `).join('') || '<div class="empty">Сообщений пока нет.</div>'
            }
          </div>

          <div class="chat-input">
            <input
              id="msg"
              placeholder="Введите сообщение"
              onkeydown="if(event.key==='Enter')sendMsg()"
            >

            <button class="btn" onclick="sendMsg()">Отправить</button>
          </div>
        </div>
      </section>
    `;
  },

  feed() {
    return `
      <section class="head">
        <div>
          <h2>Лента</h2>
          <p class="sub">Внутренняя социальная сеть: посты, фото, лайки и комментарии.</p>
        </div>

        <button class="btn" onclick="openPost()">Создать пост</button>
      </section>

      <div class="grid grid-2">
        ${P().map(postCard).join('')}
      </div>
    `;
  },

  tasks() {
    const categories = [
      'Все',
      'Руководители',
      'Менеджеры',
      'Репетиторы',
      'Партнёры',
      'Новый пользователь',
      'Практикант'
    ];

    const query = taskSearch.toLowerCase();

    const list = T().filter(task =>
      (taskFilter === 'Все' || task.category === taskFilter) &&
      (`${task.title} ${task.description} ${task.status}`.toLowerCase().includes(query))
    );

    return `
      <section class="head">
        <div>
          <h2>Задания</h2>
          <p class="sub">
            Создание, отклики, назначение исполнителей, отчёты и контроль статусов.
          </p>
        </div>

        ${canCreateTasks() ? '<button class="btn" onclick="openTask()">Создать задание</button>' : ''}
      </section>

      <div class="card tabs">
        ${categories.map(category => `
          <button
            onclick="taskFilter='${category}';render()"
            class="${taskFilter === category ? 'active' : ''}"
          >
            ${category}
          </button>
        `).join('')}
      </div>

      <div class="toolbar">
        <input
          placeholder="Поиск по заданиям"
          value="${esc(taskSearch)}"
          oninput="taskSearch=this.value;render()"
        >

        <button class="btn ghost" onclick="taskSearch='';render()">Сброс</button>
      </div>

      <div class="list">
        ${taskList(list)}
      </div>
    `;
  },

  support() {
    const supportMessages = C().find(chat => chat.id === 'support')?.messages || [];

    return `
      <section class="head">
        <div>
          <h2>Поддержка</h2>
          <p class="sub">
            Обращения к администрации: аккаунт, задания, финансы, техника, предложения.
          </p>
        </div>

        <button class="btn" onclick="openTicket()">Создать обращение</button>
      </section>

      <section class="grid grid-2">
        <div class="card pad">
          <h2>Чат поддержки</h2>

          <div class="messages" style="height:360px">
            ${
              supportMessages.map((message, index) => `
                <div class="msg ${message.userId === me().id ? 'mine' : ''}">
                  <b>${esc(user(message.userId).name)}</b><br>
                  ${esc(message.text)}
                  <small>${new Date(message.date).toLocaleString('ru-RU')}</small>

                  ${
                    message.userId === me().id
                      ? `<button class="mini-delete" onclick="deleteSupportMsg(${index})">Удалить</button>`
                      : ''
                  }
                </div>
              `).join('') || '<div class="empty">Сообщений пока нет.</div>'
            }
          </div>

          <div class="chat-input">
            <input
              id="supportMsg"
              placeholder="Опишите проблему"
              onkeydown="if(event.key==='Enter')sendSupport()"
            >

            <button class="btn" onclick="sendSupport()">Отправить</button>
          </div>
        </div>

        <div class="card pad">
          <h2>Мои обращения</h2>

          <div class="list">
            ${
              Tickets().map(ticket => `
                <div class="item">
                  <div class="item-top">
                    <b>${esc(ticket.category)}</b>
                    <span class="badge b-blue">${esc(ticket.status)}</span>
                  </div>

                  <p>${esc(ticket.text)}</p>

                  <div class="meta">
                    Ответственный: ${esc(user(ticket.managerId).name)}
                  </div>
                </div>
              `).join('') || '<p class="sub">Обращений пока нет.</p>'
            }
          </div>

          <hr>

          <h3>FAQ</h3>
          <p class="sub">
            По задаче укажите номер задания. По аккаунту — телефон и описание ошибки.
            По оплатам — сумму и дату операции.
          </p>
        </div>
      </section>
    `;
  },

  profile() {
    const currentUser = me();
    const myPosts = P().filter(post => post.userId === currentUser.id);
    const doneTasks = T().filter(task =>
      task.executorIds.includes(currentUser.id) && task.status === 'Выполнено'
    );

    return `
      <section class="head">
        <div>
          <h2>Профиль</h2>
          <p class="sub">Личный кабинет с ролью, рейтингом, контактами и статистикой.</p>
        </div>

        <button class="btn ghost" onclick="editProfile()">Редактировать</button>
      </section>

      <section class="grid grid-2">
        <div class="card">
          <div class="profile-cover"></div>

          <div class="profile-main">
            <div class="profile-photo">${esc(currentUser.name[0])}</div>

            <h2>${esc(currentUser.name)}</h2>

            <p>
              <span class="badge b-blue">${esc(currentUser.role)}</span>
              <span class="badge b-green">★ ${currentUser.rating}</span>
            </p>

            <p class="sub">${esc(currentUser.about || '')}</p>
            <p><b>Контакты:</b> ${esc(currentUser.contacts || currentUser.phone)}</p>
          </div>
        </div>

        <div class="grid">
          ${stat('◎', 'Мои публикации', myPosts.length)}
          ${stat('✓', 'Выполнено заданий', doneTasks.length)}
          ${stat('★', 'Рейтинг', currentUser.rating || 0)}
        </div>
      </section>
    `;
  }
};

/* =========================
   Компоненты
========================= */

function stat(icon, title, number) {
  return `
    <div class="card pad stat">
      <div class="icon">${icon}</div>
      <span>${title}</span>
      <b>${number}</b>
    </div>
  `;
}

function taskList(list) {
  if (!list.length) {
    return '<div class="card pad empty">Ничего не найдено.</div>';
  }

  return list.map(task => `
    <article class="item">
      <div class="item-top">
        <div>
          <h3>#${task.id} ${esc(task.title)}</h3>
          <p>${esc(task.description)}</p>
        </div>

        <span class="badge ${statusClass(task.status)}">
          ${esc(task.status)}
        </span>
      </div>

      <div class="meta">
        <span>Категория: <b>${esc(task.category)}</b></span>
        <span>Дедлайн: <b>${fmt(task.deadline)}</b></span>
        <span>Исполнители: <b>${task.executorIds.length}/${task.limit}</b></span>
        <span class="badge ${prioClass(task.priority)}">${esc(task.priority)}</span>
        ${task.files ? `<span>Файлы: <b>${esc(task.files)}</b></span>` : ''}
      </div>

      <div class="row" style="margin-top:14px">
        ${taskButtons(task)}
      </div>
    </article>
  `).join('');
}

function taskButtons(task) {
  const responded = task.responses.includes(me().id);
  const assigned = task.executorIds.includes(me().id);
  const full = task.executorIds.length >= task.limit;

  let buttons = '';

  if (!assigned && !responded && !full) {
    buttons += `
      <button class="btn small" onclick="respondTask(${task.id})">
        Откликнуться
      </button>
    `;
  }

  if (assigned) {
    buttons += `
      <button class="btn green small" onclick="reportTask(${task.id})">
        Отправить отчёт
      </button>
    `;
  }

  if (isBoss()) {
    buttons += `
      <button class="btn ghost small" onclick="approveTask(${task.id})">
        Назначить
      </button>

      <button class="btn red small" onclick="deleteTask(${task.id})">
        Удалить
      </button>
    `;
  }

  if (full && !assigned) {
    buttons += '<span class="badge b-gray">Отклики закрыты</span>';
  }

  return buttons || '<span class="badge b-gray">Ожидает решения менеджера</span>';
}

function postCard(post) {
  const isMine = post.userId === me().id;

  const media = post.photo
    ? `<img class="post-photo" src="${post.photo}" alt="Фото публикации">`
    : '<div class="feed-img">📚</div>';

  return `
    <article class="card pad feed-post">
      <div class="person">
        <div class="avatar">${esc(user(post.userId).name[0])}</div>

        <div>
          <b>${esc(user(post.userId).name)}</b><br>
          <small>
            ${esc(user(post.userId).role)} ·
            ${new Date(post.date).toLocaleDateString('ru-RU')}
          </small>
        </div>
      </div>

      ${media}

      <p>${esc(post.text)}</p>

      <div class="post-actions">
        <span onclick="likePost(${post.id})">♥ ${post.likes.length}</span>
        <span onclick="commentPost(${post.id})">💬 ${post.comments.length}</span>
        <span onclick="activeChat='general';page='messages';render()">Написать</span>
        ${isMine ? `<span onclick="deletePost(${post.id})">Удалить</span>` : ''}
      </div>

      ${
        post.comments.length
          ? `
            <div class="meta">
              ${post.comments.slice(-2).map(comment => `
                <span>
                  <b>${esc(user(comment.userId).name)}:</b>
                  ${esc(comment.text)}
                </span>
              `).join('')}
            </div>
          `
          : ''
      }
    </article>
  `;
}

/* =========================
   Служебные функции
========================= */

function bindAfterRender() {
  document.querySelectorAll('[data-page]').forEach(button => {
    button.onclick = () => {
      page = button.dataset.page;
      render();
    };
  });
}

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, symbol => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[symbol]));
}

function fmt(date) {
  return date ? new Date(date).toLocaleDateString('ru-RU') : '—';
}

function lastMsg(chat) {
  const message = chat.messages.at(-1);
  return message ? `${user(message.userId).name}: ${message.text}` : 'Нет сообщений';
}

function roleText(role) {
  return {
    'Руководитель': 'Полный доступ: пользователи, задания, контроль, отчёты и поддержка.',
    'Менеджер': 'Управление задачами, сотрудниками, обращениями и рабочими чатами.',
    'Репетитор': 'Отклики на задания, выполнение задач, отчёты, публикации и личные чаты.',
    'Партнёр': 'Ограниченный доступ к ленте, профилю и выбранным задачам.',
    'Новый пользователь': 'Базовый доступ до назначения постоянной роли.',
    'Практикант': 'Ограниченный функционал: внутренние задачи, помощь менеджерам, отчётность.'
  }[role];
}

function statusClass(status) {
  return {
    'Новое': 'b-blue',
    'В работе': 'b-orange',
    'Выполнено': 'b-green',
    'Проверяется': 'b-orange',
    'Закрыто': 'b-green',
    'Отклонено': 'b-red',
    'Назначено': 'b-blue'
  }[status] || 'b-gray';
}

function prioClass(priority) {
  if (priority === 'Высокий') return 'b-red';
  if (priority === 'Средний') return 'b-orange';
  return 'b-gray';
}

function toast(text) {
  const element = document.createElement('div');

  element.className = 'toast';
  element.textContent = text;

  document.body.append(element);

  setTimeout(() => element.remove(), 2200);
}

/* =========================
   Действия пользователя
========================= */

window.logout = () => {
  current = null;
  store.set('sp_current', null);
  render();
};

window.sendMsg = () => {
  const text = $('#msg')?.value.trim();

  if (!text) return;

  setC(C().map(chat =>
    chat.id === activeChat
      ? {
          ...chat,
          messages: [
            ...chat.messages,
            {
              userId: me().id,
              text,
              date: new Date().toISOString()
            }
          ]
        }
      : chat
  ));

  render();
};

window.sendSupport = () => {
  const text = $('#supportMsg')?.value.trim();

  if (!text) return;

  setC(C().map(chat =>
    chat.id === 'support'
      ? {
          ...chat,
          messages: [
            ...chat.messages,
            {
              userId: me().id,
              text,
              date: new Date().toISOString()
            }
          ]
        }
      : chat
  ));

  render();
};

window.deleteSupportMsg = index => {
  const chats = C();
  const supportChat = chats.find(chat => chat.id === 'support');

  if (!supportChat || !supportChat.messages[index]) {
    return alert('Сообщение не найдено.');
  }

  if (supportChat.messages[index].userId !== me().id) {
    return alert('Можно удалять только свои сообщения.');
  }

  if (!confirm('Удалить сообщение из поддержки?')) {
    return;
  }

  supportChat.messages.splice(index, 1);
  setC(chats);

  toast('Сообщение удалено');
  render();
};

window.respondTask = id => {
  setT(T().map(task =>
    task.id === id && !task.responses.includes(me().id)
      ? {
          ...task,
          responses: [...task.responses, me().id],
          status: 'Проверяется'
        }
      : task
  ));

  toast('Отклик отправлен');
  render();
};

window.approveTask = id => {
  const task = T().find(item => item.id === id);
  const candidates = task.responses.filter(uid => !task.executorIds.includes(uid));

  const uid = +(
    prompt(
      'ID пользователя для назначения. Отклики: ' + (candidates.join(', ') || 'нет'),
      candidates[0] || ''
    ) || 0
  );

  if (!uid) return;

  if (!U().some(item => item.id === uid)) {
    return alert('Такого пользователя нет.');
  }

  if (task.executorIds.length >= task.limit) {
    return alert('Лимит исполнителей уже достигнут.');
  }

  setT(T().map(item =>
    item.id === id
      ? {
          ...item,
          executorIds: [...item.executorIds, uid],
          status: 'Назначено'
        }
      : item
  ));

  toast('Исполнитель назначен');
  render();
};

window.reportTask = id => {
  const text = prompt('Комментарий к отчёту:', 'Задание выполнено.');

  if (text === null) return;

  setT(T().map(task =>
    task.id === id
      ? {
          ...task,
          status: 'Выполнено',
          reports: [
            ...task.reports,
            {
              userId: me().id,
              text,
              date: new Date().toISOString()
            }
          ]
        }
      : task
  ));

  toast('Отчёт отправлен');
  render();
};

window.deleteTask = id => {
  if (!confirm('Удалить задание?')) {
    return;
  }

  setT(T().filter(task => task.id !== id));

  toast('Задание удалено');
  render();
};

window.likePost = id => {
  setP(P().map(post =>
    post.id === id
      ? {
          ...post,
          likes: post.likes.includes(me().id)
            ? post.likes.filter(uid => uid !== me().id)
            : [...post.likes, me().id]
        }
      : post
  ));

  render();
};

window.commentPost = id => {
  const text = prompt('Комментарий:');

  if (!text?.trim()) return;

  setP(P().map(post =>
    post.id === id
      ? {
          ...post,
          comments: [
            ...post.comments,
            {
              userId: me().id,
              text: text.trim()
            }
          ]
        }
      : post
  ));

  render();
};

window.deletePost = id => {
  const post = P().find(item => item.id === id);

  if (!post) {
    return alert('Пост не найден.');
  }

  if (post.userId !== me().id) {
    return alert('Можно удалять только свои посты.');
  }

  if (!confirm('Удалить этот пост?')) {
    return;
  }

  setP(P().filter(item => item.id !== id));

  toast('Пост удалён');
  render();
};

window.newChat = () => {
  const title = prompt('Название чата:');

  if (!title?.trim()) return;

  const chat = {
    id: 'chat' + Date.now(),
    title: title.trim(),
    members: [me().id, 1, 2],
    messages: []
  };

  setC([...C(), chat]);

  activeChat = chat.id;
  render();
};

/* =========================
   Посты и фото
========================= */

window.openPost = () => {
  postDraftImage = '';

  modal(`
    <h2>Создание публикации</h2>

    <label class="field">
      Описание поста
      <textarea
        id="postText"
        maxlength="800"
        placeholder="Что публикуем во внутренней ленте?"
      ></textarea>
    </label>

    <label class="upload-box">
      <input
        id="postPhoto"
        type="file"
        accept="image/*"
        onchange="previewPostPhoto(this)"
      >

      <b>+ Добавить фото</b>
      <span>PNG, JPG, WEBP до 8 МБ. Фото автоматически сжимается.</span>
    </label>

    <div id="postPreview" class="feed-img">Фото</div>
  `, () => {
    const text = $('#postText').value.trim();

    if (!text && !postDraftImage) {
      return alert('Добавьте текст или фото.');
    }

    setP([
      {
        id: Date.now(),
        userId: me().id,
        text,
        photo: postDraftImage,
        likes: [],
        comments: [],
        date: new Date().toISOString()
      },
      ...P()
    ]);

    closeModal();
    toast('Пост опубликован');
    render();
  });
};

window.previewPostPhoto = input => {
  const file = input.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    return alert('Выберите файл изображения.');
  }

  if (file.size > 8 * 1024 * 1024) {
    return alert('Фото слишком большое. Лимит: 8 МБ.');
  }

  const reader = new FileReader();

  reader.onload = event => {
    const image = new Image();

    image.onload = () => {
      const maxSize = 1200;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);

      const canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      canvas.getContext('2d').drawImage(image, 0, 0, width, height);

      postDraftImage = canvas.toDataURL('image/jpeg', 0.84);

      const preview = $('#postPreview');

      if (preview) {
        preview.outerHTML = `
          <img
            id="postPreview"
            class="post-photo preview"
            src="${postDraftImage}"
            alt="Предпросмотр фото"
          >
        `;
      }
    };

    image.src = event.target.result;
  };

  reader.readAsDataURL(file);
};

/* =========================
   Обращения
========================= */

window.openTicket = () => modal(`
  <h2>Новое обращение</h2>

  <div class="form-grid">
    <label class="field">
      Категория

      <select id="ticketCat">
        <option>технические проблемы</option>
        <option>вопросы по заданиям</option>
        <option>проблемы аккаунта</option>
        <option>финансовые вопросы</option>
        <option>предложения</option>
      </select>
    </label>

    <label class="field wide">
      Сообщение
      <textarea id="ticketText" maxlength="700"></textarea>
    </label>
  </div>
`, () => {
  const text = $('#ticketText').value.trim();

  if (!text) {
    return alert('Опишите обращение.');
  }

  setTickets([
    {
      id: Date.now(),
      userId: me().id,
      category: $('#ticketCat').value,
      text,
      status: 'Назначен менеджер',
      managerId: 2
    },
    ...Tickets()
  ]);

  closeModal();
  toast('Обращение создано');
  render();
});

/* =========================
   Задания
========================= */

window.openTask = () => modal(`
  <h2>Создание задания</h2>

  <div class="form-grid">
    <label class="field wide">
      Название
      <input id="tTitle" maxlength="80">
    </label>

    <label class="field wide">
      Описание
      <textarea id="tDesc" maxlength="700"></textarea>
    </label>

    <label class="field">
      Дедлайн
      <input id="tDead" type="date">
    </label>

    <label class="field">
      Количество исполнителей
      <input id="tLimit" type="number" min="1" max="50" value="1">
    </label>

    <label class="field">
      Приоритет
      <select id="tPr">
        <option>Обычный</option>
        <option>Средний</option>
        <option>Высокий</option>
      </select>
    </label>

    <label class="field">
      Категория
      <select id="tCat">
        <option>Руководители</option>
        <option>Менеджеры</option>
        <option>Репетиторы</option>
        <option>Партнёры</option>
        <option>Новый пользователь</option>
        <option>Практикант</option>
      </select>
    </label>

    <label class="field wide">
      Файлы
      <input id="tFiles" placeholder="названия файлов через запятую">
    </label>
  </div>
`, () => {
  const title = $('#tTitle').value.trim();
  const deadline = $('#tDead').value;
  const limit = +$('#tLimit').value || 1;

  if (!title || !deadline) {
    return alert('Укажите название и дедлайн.');
  }

  if (limit < 1) {
    return alert('Количество исполнителей должно быть больше 0.');
  }

  setT([
    {
      id: Date.now(),
      title,
      description: $('#tDesc').value.trim(),
      deadline,
      limit,
      files: $('#tFiles').value.trim(),
      priority: $('#tPr').value,
      status: 'Новое',
      category: $('#tCat').value,
      creatorId: me().id,
      executorIds: [],
      responses: [],
      reports: []
    },
    ...T()
  ]);

  closeModal();
  toast('Задание создано');
  render();
});

/* =========================
   Профиль
========================= */

window.editProfile = () => {
  const currentUser = me();

  modal(`
    <h2>Редактировать профиль</h2>

    <div class="form-grid">
      <label class="field wide">
        ФИО
        <input id="pName" value="${esc(currentUser.name)}">
      </label>

      <label class="field">
        Контакты
        <input id="pContacts" value="${esc(currentUser.contacts || '')}">
      </label>

      <label class="field">
        Рейтинг
        <input
          id="pRating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value="${currentUser.rating || 0}"
        >
      </label>

      <label class="field wide">
        Описание
        <textarea id="pAbout" maxlength="400">${esc(currentUser.about || '')}</textarea>
      </label>
    </div>
  `, () => {
    const rating = Math.max(0, Math.min(5, +$('#pRating').value || 0));

    setU(U().map(userItem =>
      userItem.id === currentUser.id
        ? {
            ...userItem,
            name: $('#pName').value.trim() || userItem.name,
            contacts: $('#pContacts').value.trim(),
            rating,
            about: $('#pAbout').value.trim()
          }
        : userItem
    ));

    closeModal();
    toast('Профиль обновлён');
    render();
  });
};

/* =========================
   Сброс демо-данных
========================= */

window.resetDemo = () => {
  if (!confirm('Сбросить демо-данные?')) {
    return;
  }

  localStorage.removeItem('sp_users');
  localStorage.removeItem('sp_tasks');
  localStorage.removeItem('sp_posts');
  localStorage.removeItem('sp_chats');
  localStorage.removeItem('sp_tickets');
  localStorage.removeItem('sp_current');

  init();

  current = null;
  render();
};

/* =========================
   Модальные окна
========================= */

function modal(body, onSave) {
  app.insertAdjacentHTML('beforeend', `
    <div class="modal-back" id="modal">
      <div class="card pad modal">
        ${body}

        <div class="row" style="justify-content:flex-end;margin-top:16px">
          <button class="btn ghost" onclick="closeModal()">Отмена</button>
          <button class="btn" id="saveModal">Сохранить</button>
        </div>
      </div>
    </div>
  `);

  $('#saveModal').onclick = onSave;
}

window.closeModal = () => $('#modal')?.remove();

/* =========================
   Запуск
========================= */

render();
