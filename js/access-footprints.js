document.addEventListener("DOMContentLoaded", () => {
  const accessSection = document.querySelector(".access-section");

  if (!accessSection) return;

  const showFootprints = () => accessSection.classList.add("footprints-visible");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showFootprints();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        showFootprints();
        observer.disconnect();
      }
    },
    { threshold: 0.12 }
  );

  observer.observe(accessSection);
});
