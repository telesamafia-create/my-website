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

  applyLanguage();
})();
