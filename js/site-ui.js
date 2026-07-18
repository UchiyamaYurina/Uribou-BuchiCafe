(() => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".site-nav a, .footer-nav a").forEach((link) => {
    const linkedPage = (link.getAttribute("href") || "").split("#")[0];
    if (linkedPage === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  if (currentPage === "index.html") {
    document.querySelectorAll(".header-logo, .footer-brand").forEach((link) => {
      link.setAttribute("aria-current", "page");
    });
  }

  const menuToggle = document.querySelector("#menu-toggle");
  const menuButton = document.querySelector(".menu-button");
  const siteNav = document.querySelector(".site-nav");

  if (menuToggle && menuButton && siteNav) {
    siteNav.id = siteNav.id || "global-navigation";
    menuButton.setAttribute("role", "button");
    menuButton.setAttribute("tabindex", "0");
    menuButton.setAttribute("aria-controls", siteNav.id);

    const updateMenuState = () => {
      menuButton.setAttribute("aria-expanded", String(menuToggle.checked));
      menuToggle.setAttribute("aria-label", menuToggle.checked ? "メニューを閉じる" : "メニューを開く");
    };

    menuToggle.addEventListener("change", updateMenuState);
    menuButton.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      menuToggle.checked = !menuToggle.checked;
      updateMenuState();
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.checked = false;
        updateMenuState();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !menuToggle.checked) return;
      menuToggle.checked = false;
      updateMenuState();
      menuButton.focus();
    });

    updateMenuState();
  }

  const prefersLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".video-motion-toggle").forEach((button) => {
    const video = document.querySelector(`#${button.dataset.video}`);
    if (!video) return;

    const updateButton = () => {
      const isPaused = video.paused;
      button.textContent = isPaused ? "動画を再生" : "動画を停止";
      button.setAttribute("aria-pressed", String(!isPaused));
      button.setAttribute("aria-label", `${isPaused ? "再生" : "停止"}：${video.getAttribute("aria-label") || "カフェの動画"}`);
    };

    button.addEventListener("click", () => {
      if (!video.paused) {
        video.pause();
        return;
      }

      if (!video.currentSrc && video.dataset.src) {
        video.src = video.dataset.src;
        video.load();
      }

      video.play().catch(updateButton);
    });

    video.addEventListener("play", updateButton);
    video.addEventListener("pause", updateButton);
    video.addEventListener("ended", updateButton);

    if (prefersLessMotion) video.pause();
    updateButton();
  });
})();
