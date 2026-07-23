(() => {
  const triggers = Array.from(document.querySelectorAll(".gallery-trigger"));
  if (!triggers.length) return;

  document.documentElement.classList.add("has-gallery-lightbox");

  const items = triggers.map((trigger) => {
    const thumbnail = trigger.querySelector("img");
    return {
      src: trigger.href,
      alt: thumbnail?.alt || "ギャラリー画像"
    };
  });

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-labelledby", "image-lightbox-caption");
  lightbox.innerHTML = `
    <div class="image-lightbox__panel">
      <button class="image-lightbox__button image-lightbox__close" type="button" aria-label="拡大画像を閉じる">×</button>
      <button class="image-lightbox__button image-lightbox__previous" type="button" aria-label="前の画像">‹</button>
      <figure class="image-lightbox__figure">
        <img class="image-lightbox__image" src="" alt="">
        <figcaption class="image-lightbox__caption" id="image-lightbox-caption"></figcaption>
        <span class="image-lightbox__counter" aria-live="polite"></span>
      </figure>
      <button class="image-lightbox__button image-lightbox__next" type="button" aria-label="次の画像">›</button>
    </div>
  `;
  document.body.append(lightbox);

  const panel = lightbox.querySelector(".image-lightbox__panel");
  const enlargedImage = lightbox.querySelector(".image-lightbox__image");
  const caption = lightbox.querySelector(".image-lightbox__caption");
  const counter = lightbox.querySelector(".image-lightbox__counter");
  const closeButton = lightbox.querySelector(".image-lightbox__close");
  const previousButton = lightbox.querySelector(".image-lightbox__previous");
  const nextButton = lightbox.querySelector(".image-lightbox__next");

  let currentIndex = 0;
  let lastFocusedTrigger = null;
  let closeTimer = 0;

  const preloadNeighbor = (index) => {
    if (items.length < 2) return;
    const preload = new Image();
    preload.src = items[(index + items.length) % items.length].src;
  };

  const showImage = (index) => {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];

    panel.classList.add("is-loading");
    enlargedImage.src = item.src;
    enlargedImage.alt = item.alt;
    caption.textContent = item.alt;
    counter.textContent = `${currentIndex + 1} / ${items.length}`;
    if (enlargedImage.complete) panel.classList.remove("is-loading");

    const hasMultipleImages = items.length > 1;
    previousButton.hidden = !hasMultipleImages;
    nextButton.hidden = !hasMultipleImages;

    preloadNeighbor(currentIndex - 1);
    preloadNeighbor(currentIndex + 1);
  };

  const openLightbox = (index, trigger) => {
    window.clearTimeout(closeTimer);
    lastFocusedTrigger = trigger;
    showImage(index);
    lightbox.hidden = false;
    document.body.classList.add("is-lightbox-open");

    window.requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
      closeButton.focus();
    });
  };

  const closeLightbox = () => {
    if (lightbox.hidden) return;

    lightbox.classList.remove("is-open");
    document.body.classList.remove("is-lightbox-open");

    closeTimer = window.setTimeout(() => {
      lightbox.hidden = true;
      enlargedImage.src = "";
      lastFocusedTrigger?.focus();
    }, 240);
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(index, trigger);
    });
  });

  enlargedImage.addEventListener("load", () => {
    panel.classList.remove("is-loading");
  });
  enlargedImage.addEventListener("error", () => {
    panel.classList.remove("is-loading");
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showImage(currentIndex - 1));
  nextButton.addEventListener("click", () => showImage(currentIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(currentIndex - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(currentIndex + 1);
      return;
    }

    if (event.key !== "Tab") return;

    const focusableButtons = [closeButton, previousButton, nextButton]
      .filter((button) => !button.hidden);
    const firstButton = focusableButtons[0];
    const lastButton = focusableButtons[focusableButtons.length - 1];

    if (event.shiftKey && document.activeElement === firstButton) {
      event.preventDefault();
      lastButton.focus();
    } else if (!event.shiftKey && document.activeElement === lastButton) {
      event.preventDefault();
      firstButton.focus();
    }
  });
})();
