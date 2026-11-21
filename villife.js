(() => {
  const languageButton = document.querySelector(".language-switch");
  const root = document.documentElement;
  let language = localStorage.getItem("villife-site-language") === "ru" ? "ru" : "en";

  function applyLanguage() {
    root.lang = language;
    document.querySelectorAll("[data-en][data-ru]").forEach(element => {
      element.innerHTML = element.dataset[language];
    });
    languageButton.textContent = language === "en" ? "RU" : "EN";
    languageButton.setAttribute("aria-label", language === "en" ? "Switch to Russian" : "Switch to English");
    document.title = language === "en" ? "Villife — Music player for Windows" : "Villife — Музыкальный плеер для Windows";
  }

  languageButton.addEventListener("click", () => {
    language = language === "en" ? "ru" : "en";
    localStorage.setItem("villife-site-language", language);
    applyLanguage();
  });

  document.querySelector("#year").textContent = new Date().getFullYear();

  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealItems = document.querySelectorAll(
    ".manifesto-text, .manifesto-side, .feature-card, .window-copy, .windows-art, .about-body, .closing-section"
  );

  if ("IntersectionObserver" in window && !calm) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    revealItems.forEach(element => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  }

  const visual = document.querySelector(".hero-visual");
  const windowFrame = document.querySelector(".player-window");

  if (visual && windowFrame && !calm) {
    let frame = null;
    visual.addEventListener("pointermove", event => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = visual.getBoundingClientRect();
        const shiftX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const shiftY = (event.clientY - bounds.top) / bounds.height - 0.5;
        windowFrame.style.transform =
          `rotateY(${-6 + shiftX * 7}deg) rotateX(${2 - shiftY * 5}deg) rotateZ(-1deg) translateY(${-shiftY * 6}px)`;
      });
    });
    visual.addEventListener("pointerleave", () => {
      windowFrame.style.transform = "";
    });
  }

  const haze = document.querySelector(".mist-haze");
  const particles = document.querySelector(".mist-particles");
  const mistLayers = Array.from(document.querySelectorAll(".mist-fog"));

  if (haze && mistLayers.length && !calm) {
    const depth = [0.55, 0.85, 1.15, 1.45];
    const baseOpacity = mistLayers.map(layer => Number.parseFloat(getComputedStyle(layer).opacity) || 0.5);
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastScroll = window.scrollY;
    let velocity = 0;

    window.addEventListener("pointermove", event => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const frame = () => {
      const time = performance.now() / 1000;
      const scroll = window.scrollY;
      velocity = velocity * 0.88 + (scroll - lastScroll) * 0.12;
      lastScroll = scroll;
      pointerX += (targetX - pointerX) * 0.05;
      pointerY += (targetY - pointerY) * 0.05;
      const gust = Math.min(1, Math.abs(velocity) / 55);

      mistLayers.forEach((layer, index) => {
        const factor = depth[index] || 1;
        const driftX = Math.sin(time * (0.09 + index * 0.017) + index) * 70 * factor;
        const driftY = Math.cos(time * (0.07 + index * 0.021) + index) * 44 * factor;
        const push = velocity * 0.16 * factor;
        layer.style.transform =
          `translate3d(${driftX + pointerX * 46 * factor + push}px, ${driftY + pointerY * 34 * factor - scroll * 0.05 * factor}px, 0) scale(${1 + gust * 0.06})`;
        layer.style.opacity = String(Math.min(0.95, baseOpacity[index] + gust * 0.18));
      });

      haze.style.transform = `translate3d(${pointerX * 14}px, ${-scroll * 0.03 + pointerY * 10}px, 0) scale(${1 + gust * 0.03})`;
      haze.style.opacity = String(Math.min(1, 0.5 + gust * 0.2));

      if (particles) {
        particles.style.transform = `translate3d(${pointerX * 26}px, ${-scroll * 0.07 + pointerY * 18}px, 0)`;
        particles.style.opacity = String(Math.min(0.85, 0.48 + gust * 0.28));
      }

      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  const releaseBase = "https://github.com/whatawhere/villife/releases/latest/download/";
  const downloads = {
    windows: {
      href: releaseBase + "VillifeSetup.exe",
      icon: "/windows11.svg",
      alt: "Windows",
      en: "Download for Windows",
      ru: "Скачать для Windows"
    },
    mac: {
      href: releaseBase + "Villife-macOS-arm64.dmg",
      icon: "/apple.svg",
      alt: "macOS",
      en: "Download for macOS",
      ru: "Скачать для macOS"
    },
    linux: {
      href: releaseBase + "Villife-linux-x64.AppImage",
      icon: "/tux.svg",
      alt: "Linux",
      en: "Download for Linux",
      ru: "Скачать для Linux"
    }
  };

  function detectPlatform() {
    const ua = navigator.userAgent;
    if (/Mac|iPhone|iPad|iPod/i.test(ua)) return "mac";
    if (/Linux|X11/i.test(ua)) return "linux";
    return "windows";
  }

  const platform = detectPlatform();
  const chosen = downloads[platform];
  const heroButton = document.querySelector(".hero-actions .button-primary");

  if (heroButton) {
    heroButton.href = chosen.href;
    const icon = heroButton.querySelector("img");
    const label = heroButton.querySelector("span");
    if (icon) {
      icon.src = chosen.icon;
      icon.alt = chosen.alt;
    }
    if (label) {
      label.dataset.en = chosen.en;
      label.dataset.ru = chosen.ru;
    }
  }

  const platformButtons = document.querySelector(".platform-buttons");
  if (platformButtons) {
    const current = platformButtons.querySelector(`[data-platform="${platform}"]`);
    if (current) platformButtons.prepend(current);
  }

  const rawProfile = localStorage.getItem("villife_signup");
  let account = null;
  try { account = rawProfile ? JSON.parse(rawProfile) : null; } catch (error) { account = null; }

  const panel = document.getElementById("profile-panel");
  const headerProfile = document.getElementById("header-profile");
  const bigAvatar = document.getElementById("profile-big-avatar");
  const firstInput = document.getElementById("profile-first");
  const lastInput = document.getElementById("profile-last");
  const langSelect = document.getElementById("profile-language");
  const themeButtons = Array.from(document.querySelectorAll(".theme-choice"));

  function profileInitials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    return (parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)).toLocaleUpperCase();
  }

  function renderAvatar(element, profile) {
    element.innerHTML = "";
    if (profile && profile.photo) {
      const picture = document.createElement("img");
      picture.src = profile.photo;
      picture.alt = "";
      element.appendChild(picture);
    } else {
      element.textContent = profileInitials(profile ? (profile.name || profile.username) : "");
    }
  }

  function saveAccount() {
    localStorage.setItem("villife_signup", JSON.stringify(account));
  }

  function flashSave(button) {
    button.classList.add("is-saved");
    setTimeout(() => button.classList.remove("is-saved"), 1400);
  }

  function fillProfile() {
    if (!account) return;
    const parts = String(account.name || "").trim().split(/\s+/);
    firstInput.value = account.firstName || parts[0] || "";
    lastInput.value = account.lastName || parts.slice(1).join(" ") || "";
    renderAvatar(bigAvatar, account);
    langSelect.value = ["ru", "en", "es", "de", "fr"].includes(language) ? language : "en";
    const theme = localStorage.getItem("villife_site_theme") || "light";
    themeButtons.forEach(button => button.classList.toggle("active", button.dataset.theme === theme));
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
  }

  const userProfile = document.getElementById("user-profile");

  function fillUserProfile() {
    if (!userProfile || !account) return;
    const parts = String(account.name || "").trim().split(/\s+/);
    const first = account.firstName || parts[0] || "";
    const last = account.lastName || parts.slice(1).join(" ") || "";
    document.getElementById("user-profile-name").textContent = account.username || account.name || "";
    document.getElementById("user-profile-meta").textContent = [account.name, account.email].filter(Boolean).join(" · ");
    document.getElementById("user-profile-first").textContent = first;
    document.getElementById("user-profile-last").textContent = last;
    document.getElementById("user-profile-email").textContent = account.email || "";
    document.getElementById("user-profile-username").textContent = account.username || "";
    const avatar = document.getElementById("user-profile-avatar");
    avatar.innerHTML = "";
    if (account.photo) {
      const picture = document.createElement("img");
      picture.src = account.photo;
      picture.alt = "";
      avatar.appendChild(picture);
    } else {
      avatar.textContent = (first[0] || "") + (last[0] || "") || "?";
    }
  }

  function syncSettingsHash() {
    const hash = location.hash;
    if (panel) {
      const open = hash === "#settings";
      panel.hidden = !open;
      if (open) fillProfile();
    }
    if (userProfile) {
      const open = hash === "#profile";
      userProfile.hidden = !open;
      if (open) fillUserProfile();
    }
  }

  const profileMenu = document.getElementById("profile-menu");

  if (headerProfile && profileMenu) {
    headerProfile.addEventListener("click", event => {
      event.stopPropagation();
      profileMenu.hidden = !profileMenu.hidden;
    });
    document.addEventListener("click", event => {
      if (!profileMenu.hidden && !profileMenu.contains(event.target)) profileMenu.hidden = true;
    });
    profileMenu.querySelectorAll("[data-menu]").forEach(item => {
      item.addEventListener("click", () => {
        const action = item.dataset.menu;
        profileMenu.hidden = true;
        if (action === "logout") {
          localStorage.setItem("villife_session", "inactive");
          location.href = "/signin/";
          return;
        }
        if (action === "profile") {
          location.hash = "profile";
          return;
        }
        const tab = action === "settings" ? "personalization" : "account";
        location.hash = "settings";
        setTimeout(() => {
          document.querySelectorAll(".profile-tab").forEach(button => {
            button.classList.toggle("active", button.dataset.panelTab === tab);
          });
          document.querySelectorAll(".profile-section").forEach(section => {
            section.classList.toggle("active", section.dataset.panelSection === tab);
          });
        }, 60);
      });
    });
  }

  document.getElementById("user-profile-edit").addEventListener("click", () => { location.hash = "settings"; });
  document.getElementById("user-profile-settings").addEventListener("click", () => { location.hash = "settings"; });

  document.getElementById("profile-backdrop").addEventListener("click", () => {
    history.replaceState(null, "", "/");
    if (panel) panel.hidden = true;
  });

  window.addEventListener("hashchange", syncSettingsHash);
  syncSettingsHash();

  document.querySelectorAll(".profile-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".profile-tab").forEach(item => item.classList.toggle("active", item === tab));
      document.querySelectorAll(".profile-section").forEach(section => {
        section.classList.toggle("active", section.dataset.panelSection === tab.dataset.panelTab);
      });
    });
  });

  document.querySelectorAll('[data-panel-section="profile"] .profile-save').forEach(button => {
    button.addEventListener("click", () => {
      if (!account) return;
      account.firstName = firstInput.value.trim();
      account.lastName = lastInput.value.trim();
      account.name = [account.firstName, account.lastName].filter(Boolean).join(" ");
      saveAccount();
      document.getElementById("header-name").textContent = account.name;
      renderAvatar(document.getElementById("header-avatar"), account);
      flashSave(button);
    });
  });

  themeButtons.forEach(button => {
    button.addEventListener("click", () => {
      themeButtons.forEach(item => item.classList.toggle("active", item === button));
      document.documentElement.classList.toggle("theme-dark", button.dataset.theme === "dark");
    });
  });

  document.querySelectorAll('[data-panel-section="personalization"] .profile-save').forEach(button => {
    button.addEventListener("click", () => {
      localStorage.setItem("villife_site_theme", document.documentElement.classList.contains("theme-dark") ? "dark" : "light");
      const selected = langSelect.value;
      localStorage.setItem("villife-site-language", selected);
      if (selected === "ru" || selected === "en") {
        language = selected;
        applyLanguage();
      }
      flashSave(button);
    });
  });

  const exportRules = document.getElementById("export-rules");
  const exportOptions = document.getElementById("export-options");
  const exportStatus = document.getElementById("export-status");

  document.getElementById("download-data").addEventListener("click", () => {
    exportRules.hidden = false;
    exportOptions.hidden = true;
  });
  document.getElementById("accept-rules").addEventListener("click", () => {
    exportRules.hidden = true;
    exportOptions.hidden = false;
  });
  document.getElementById("decline-rules").addEventListener("click", () => {
    exportRules.hidden = true;
    exportOptions.hidden = true;
  });
  document.getElementById("cancel-sync").addEventListener("click", () => {
    exportOptions.hidden = true;
    exportStatus.hidden = true;
  });

  document.getElementById("start-sync").addEventListener("click", () => {
    const data = { format: "vlf", version: 1, requestedAt: new Date().toISOString() };
    document.querySelectorAll(".export-check input").forEach(input => {
      if (!input.checked) return;
      if (input.value === "profile") data.profile = account;
      if (input.value === "personalization") {
        data.personalization = {
          theme: localStorage.getItem("villife_site_theme") || "light",
          language: localStorage.getItem("villife-site-language") || "en"
        };
      }
      if (input.value === "account") {
        data.account = { email: account && account.email, username: account && account.username };
      }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "villife-account.vlf";
    link.click();
    URL.revokeObjectURL(url);
    exportStatus.hidden = false;
    const steps = Array.from(document.querySelectorAll(".export-step"));
    steps.forEach((step, index) => {
      step.classList.remove("active", "done");
      if (index === 0) step.classList.add("active");
    });
    const email = (account && account.email) || "вашей почты";
    document.getElementById("export-detail").innerHTML =
      "Запрос создан. Срок обработки зависит от выбранных разделов, объёма данных и текущей нагрузки — обычно это несколько минут, но при дополнительной проверке до 30 дней. " +
      "На адрес <b>" + email + "</b> с адреса <a href='mailto:alias@villife.root.sx'>alias@villife.root.sx</a> придёт письмо: в нём будут дата запроса, список экспортированных разделов, причина задержки, если она была, и ссылка на скачивание файла .vlf.";
    let current = 0;
    const timer = setInterval(() => {
      if (current >= steps.length - 1) {
        clearInterval(timer);
        return;
      }
      steps[current].classList.remove("active");
      steps[current].classList.add("done");
      current += 1;
      steps[current].classList.add("active");
    }, 1800);
  });

  document.getElementById("cancel-request").addEventListener("click", () => {
    exportStatus.hidden = true;
    exportOptions.hidden = true;
  });

  document.getElementById("profile-logout").addEventListener("click", () => {
    localStorage.setItem("villife_session", "inactive");
    location.href = "/signin/";
  });

  document.addEventListener("pointerdown", event => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = event.target.closest(".button, .profile-tab, .theme-choice, .header-link, .header-profile");
    if (!target) return;
    const bounds = target.getBoundingClientRect();
    const dot = document.createElement("span");
    dot.className = "ripple";
    dot.style.left = (event.clientX - bounds.left) + "px";
    dot.style.top = (event.clientY - bounds.top) + "px";
    target.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
  });

  applyLanguage();
})();
