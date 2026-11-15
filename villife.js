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
  const mistLayers = Array.from(document.querySelectorAll(".mist-layer"));

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
        layer.style.opacity = String(Math.min(0.92, baseOpacity[index] + gust * 0.22));
      });

      haze.style.transform = `translate3d(${pointerX * 14}px, ${-scroll * 0.03 + pointerY * 10}px, 0) scale(${1 + gust * 0.03})`;
      haze.style.opacity = String(Math.min(1, 0.82 + gust * 0.18));

      if (particles) {
        particles.style.transform = `translate3d(${pointerX * 26}px, ${-scroll * 0.07 + pointerY * 18}px, 0)`;
        particles.style.opacity = String(Math.min(0.85, 0.5 + gust * 0.3));
      }

      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  applyLanguage();
})();
