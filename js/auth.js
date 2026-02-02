(() => {
  const TD = (window.TD = window.TD || {});
  TD.auth = TD.auth || { isAuthenticated: false, user: null };

  const dom = {
    modal: document.getElementById("authModal"),
    tabs: {
      login: document.getElementById("authTabLogin"),
      register: document.getElementById("authTabRegister"),
      verify: document.getElementById("authTabVerify"),
    },
    sections: {
      login: document.getElementById("authLoginSection"),
      register: document.getElementById("authRegisterSection"),
      verify: document.getElementById("authVerifySection"),
    },
    loginEmail: document.getElementById("authLoginEmail"),
    loginPassword: document.getElementById("authLoginPassword"),
    loginError: document.getElementById("authLoginError"),
    loginSubmit: document.getElementById("authLoginSubmit"),
    toVerify: document.getElementById("authToVerify"),
    registerName: document.getElementById("authRegisterName"),
    registerEmail: document.getElementById("authRegisterEmail"),
    registerPassword: document.getElementById("authRegisterPassword"),
    registerConfirm: document.getElementById("authRegisterConfirm"),
    registerError: document.getElementById("authRegisterError"),
    registerSubmit: document.getElementById("authRegisterSubmit"),
    verifyEmail: document.getElementById("authVerifyEmail"),
    verifyCode: document.getElementById("authVerifyCode"),
    verifyHint: document.getElementById("authVerifyHint"),
    demoCode: document.getElementById("authDemoCode"),
    verifyError: document.getElementById("authVerifyError"),
    verifySubmit: document.getElementById("authVerifySubmit"),
    status: document.getElementById("authStatus"),
    logout: document.getElementById("authLogout"),
    reset: document.getElementById("authReset"),
  };

  const STORAGE_KEY = "td_users_v1";
  const SESSION_KEY = "td_session_v1";

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function setSession(email) {
    if (email) {
      localStorage.setItem(SESSION_KEY, email);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  function toBase64(value) {
    return btoa(unescape(encodeURIComponent(value)));
  }

  function fromBase64(value) {
    return decodeURIComponent(escape(atob(value)));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function showSection(section) {
    Object.keys(dom.sections).forEach((key) => {
      dom.sections[key].classList.toggle("active", key === section);
      dom.tabs[key].classList.toggle("active", key === section);
    });
  }

  function showModal(section = "login") {
    dom.modal.classList.add("show");
    dom.modal.setAttribute("aria-hidden", "false");
    showSection(section);
  }

  function hideModal() {
    dom.modal.classList.remove("show");
    dom.modal.setAttribute("aria-hidden", "true");
  }

  function setAuth(user) {
    TD.auth.isAuthenticated = !!user;
    TD.auth.user = user || null;
    dom.status.textContent = user ? `Eingeloggt: ${user.name}` : "Gast";
    dom.logout.disabled = !user;
    dom.reset.disabled = !user;
    if (user) {
      hideModal();
    } else {
      showModal("login");
    }
  }

  function tryLogin() {
    const email = dom.loginEmail.value.trim().toLowerCase();
    const password = dom.loginPassword.value;
    const users = loadUsers();
    const user = users[email];

    dom.loginError.textContent = "";

    if (!isValidEmail(email) || !password) {
      dom.loginError.textContent = "Bitte Email und Passwort eingeben.";
      return;
    }

    if (!user) {
      dom.loginError.textContent = "Account nicht gefunden.";
      return;
    }

    if (!user.verified) {
      dom.loginError.textContent = "Email noch nicht verifiziert.";
      dom.verifyEmail.value = email;
      dom.demoCode.textContent = user.code || "----";
      showSection("verify");
      return;
    }

    if (user.password !== toBase64(password)) {
      dom.loginError.textContent = "Passwort falsch.";
      return;
    }

    setSession(email);
    setAuth(user);
  }

  function tryRegister() {
    const name = dom.registerName.value.trim();
    const email = dom.registerEmail.value.trim().toLowerCase();
    const password = dom.registerPassword.value;
    const confirm = dom.registerConfirm.value;
    const users = loadUsers();

    dom.registerError.textContent = "";

    if (!name || !isValidEmail(email) || !password) {
      dom.registerError.textContent = "Bitte alle Felder korrekt ausfuellen.";
      return;
    }

    if (password.length < 6) {
      dom.registerError.textContent = "Passwort muss mindestens 6 Zeichen haben.";
      return;
    }

    if (password !== confirm) {
      dom.registerError.textContent = "Passwoerter stimmen nicht ueberein.";
      return;
    }

    if (users[email]) {
      dom.registerError.textContent = "Email ist bereits registriert.";
      return;
    }

    const code = generateCode();
    users[email] = {
      name,
      email,
      password: toBase64(password),
      verified: false,
      code,
      createdAt: Date.now(),
    };
    saveUsers(users);

    dom.verifyEmail.value = email;
    dom.demoCode.textContent = code;
    dom.verifyCode.value = "";
    dom.verifyError.textContent = "";
    showSection("verify");
  }

  function tryVerify() {
    const email = dom.verifyEmail.value.trim().toLowerCase();
    const code = dom.verifyCode.value.trim();
    const users = loadUsers();
    const user = users[email];

    dom.verifyError.textContent = "";

    if (!isValidEmail(email) || !code) {
      dom.verifyError.textContent = "Bitte Email und Code eingeben.";
      return;
    }

    if (!user) {
      dom.verifyError.textContent = "Account nicht gefunden.";
      return;
    }

    if (user.code !== code) {
      dom.verifyError.textContent = "Code ist falsch.";
      dom.demoCode.textContent = user.code || "----";
      return;
    }

    user.verified = true;
    user.code = "";
    users[email] = user;
    saveUsers(users);
    setSession(email);
    setAuth(user);
  }

  function logout() {
    setSession(null);
    setAuth(null);
  }

  function clearAllAccounts() {
    if (!confirm("Alle Accounts wirklich loeschen?")) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    dom.loginError.textContent = "";
    dom.registerError.textContent = "";
    dom.verifyError.textContent = "";
    dom.demoCode.textContent = "----";
    setAuth(null);
  }

  function init() {
    dom.tabs.login.addEventListener("click", () => showSection("login"));
    dom.tabs.register.addEventListener("click", () => showSection("register"));
    dom.tabs.verify.addEventListener("click", () => showSection("verify"));
    dom.loginSubmit.addEventListener("click", tryLogin);
    dom.registerSubmit.addEventListener("click", tryRegister);
    dom.verifySubmit.addEventListener("click", tryVerify);
    dom.toVerify.addEventListener("click", () => showSection("verify"));
    dom.logout.addEventListener("click", logout);
    dom.reset.addEventListener("click", clearAllAccounts);

    dom.loginPassword.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        tryLogin();
      }
    });
    dom.registerConfirm.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        tryRegister();
      }
    });
    dom.verifyCode.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        tryVerify();
      }
    });

    const sessionEmail = localStorage.getItem(SESSION_KEY);
    if (sessionEmail) {
      const users = loadUsers();
      const user = users[sessionEmail];
      if (user && user.verified) {
        setAuth(user);
        return;
      }
    }
    setAuth(null);
  }

  TD.auth.showModal = showModal;
  TD.auth.logout = logout;
  TD.auth.init = init;
})();
