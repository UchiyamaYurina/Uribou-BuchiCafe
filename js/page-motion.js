(() => {
  document.documentElement.classList.add("motion-ready");

  const motionTargets = [];
  const pageName = location.pathname.split("/").pop() || "index.html";

  const addTargets = (selector, direction = "motion-rise") => {
    document.querySelectorAll(selector).forEach((target, index) => {
      target.classList.add("page-motion", direction);
      target.style.setProperty("--motion-delay", `${index * 0.12}s`);
      target.style.setProperty("--float-duration", `${7.4 + (index % 3) * 0.55}s`);
      motionTargets.push(target);
    });
  };

  addTargets(".page-hero", "motion-rise");

  if (pageName === "about.html") {
    addTargets("main > .section .section-inner", "motion-rise");
  }

  if (pageName === "piggies.html") {
    addTargets(".profile-card:nth-child(odd)", "motion-from-left");
    addTargets(".profile-card:nth-child(even)", "motion-from-right");
  }

  if (pageName === "gallery.html") {
    addTargets(".featured-movie", "motion-rise");
    addTargets(".gallery-page-grid > :nth-child(odd)", "motion-from-left");
    addTargets(".gallery-page-grid > :nth-child(even)", "motion-from-right");
  }

  if (pageName === "access.html") {
    addTargets(".access-grid > :first-child", "motion-from-left");
    addTargets(".access-grid > :last-child", "motion-from-right");
  }

  if (pageName === "reserve.html") {
    addTargets(".reserve-card", "motion-rise");
    addTargets(".contact-section .section-inner", "motion-rise");
    addTargets(".faq-section .section-kicker, .faq-section h2", "motion-rise");
    addTargets(".faq-item", "motion-rise");
    addTargets(".visit-notice-section .soft-box", "motion-rise");
  }

  if (!("IntersectionObserver" in window)) {
    motionTargets.forEach((target) => target.classList.add("is-shown"));
    return;
  }

  const motionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-shown", "is-floating");
        } else {
          /* 一度表示した情報は隠さず、画面外では揺れだけを止める */
          entry.target.classList.remove("is-floating");
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px"
    }
  );

  motionTargets.forEach((target) => motionObserver.observe(target));
})();
