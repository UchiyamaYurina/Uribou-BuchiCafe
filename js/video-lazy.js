document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll("video[data-src]");

  const loadVideo = (video) => {
    if (video.src) return;
    video.src = video.dataset.src;
    video.load();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.play().catch(() => {
        /* 自動再生が制限された場合は、ポスター画像を表示したままにする。 */
      });
    }
  };

  if (!("IntersectionObserver" in window)) {
    videos.forEach(loadVideo);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadVideo(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "300px 0px" }
  );

  videos.forEach((video) => observer.observe(video));
});
