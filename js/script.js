// ============================================================
// Catarina Lucas Herrera — Portfolio
// Small, dependency-free interactions: mobile nav, scroll-spy,
// and the resume preview modal.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollSpy();
  initResumeModal();
  document.getElementById("year").textContent = new Date().getFullYear();
});

function initResumeModal() {
  const modal = document.getElementById("resume-modal");
  const closeBtn = document.getElementById("resume-modal-close");
  const triggers = document.querySelectorAll(".resume-trigger");
  if (!modal || !closeBtn || !triggers.length) return;

  const open = () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
  };

  const close = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
  };

  triggers.forEach((trigger) => trigger.addEventListener("click", open));
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) close();
  });
}

function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-nav");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const match = link.getAttribute("href") === `#${entry.target.id}`;
          link.setAttribute("data-active", match ? "true" : "false");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}
