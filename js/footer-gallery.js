document.addEventListener("DOMContentLoaded", () => {
  const galleries = document.querySelectorAll(".footer-gallery");

  if (!galleries.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  galleries.forEach((gallery) => {
    const photos = Array.from(gallery.querySelectorAll(":scope > .footer-photo"));
    const track = document.createElement("div");

    track.className = "footer-gallery-track";
    photos.forEach((photo) => track.appendChild(photo));
    photos.forEach((photo) => {
      const duplicate = photo.cloneNode(true);
      duplicate.setAttribute("aria-hidden", "true");
      track.appendChild(duplicate);
    });
    gallery.appendChild(track);
    gallery.classList.add("footer-motion-ready");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      gallery.classList.add("is-shown");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-shown", "is-floating");
          } else {
            entry.target.classList.remove("is-floating");
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(gallery);
  });
});
