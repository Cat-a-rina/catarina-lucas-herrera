// ============================================================
// Catarina Lucas Herrera — Portfolio
// Small, dependency-free interactions: mobile nav, scroll-spy,
// and the resume preview modal.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollSpy();
  initResumeModal();
  initCarousels();
  document.getElementById("year").textContent = new Date().getFullYear();
});

// Any photo slot can hold a carousel: wrap photos in
// <div class="card-photo relative ..." data-carousel><div data-carousel-track>
//   <img ...><img ...>
// </div></div>
// Arrows/dots are only added when there's more than one photo — a single
// photo just displays plainly, no chrome needed.
function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector("[data-carousel-track]");
    if (!track) return;
    const slides = Array.from(track.children);
    if (slides.length <= 1) return;

    let index = 0;
    track.style.transition = "transform 0.35s ease";

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "carousel-dots";
    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Go to photo ${i + 1} of ${slides.length}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.setAttribute("data-active", i === index ? "true" : "false"));
    };

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      update();
    };

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "carousel-arrow carousel-arrow-prev";
    prevBtn.setAttribute("aria-label", "Previous photo");
    prevBtn.innerHTML =
      '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>';
    prevBtn.addEventListener("click", () => goTo(index - 1));

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "carousel-arrow carousel-arrow-next";
    nextBtn.setAttribute("aria-label", "Next photo");
    nextBtn.innerHTML =
      '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>';
    nextBtn.addEventListener("click", () => goTo(index + 1));

    root.append(prevBtn, nextBtn, dotsWrap);

    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") goTo(index - 1);
      if (event.key === "ArrowRight") goTo(index + 1);
    });

    update();
  });
}

function initResumeModal() {
  const modal = document.getElementById("resume-modal");
  const closeBtn = document.getElementById("resume-modal-close");
  const triggers = document.querySelectorAll(".resume-trigger");
  if (!modal || !closeBtn || !triggers.length) return;

  const focusableSelector = "a[href], button, iframe";
  let lastFocused = null;

  const open = (event) => {
    lastFocused = event.currentTarget;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    closeBtn.focus();
  };

  const close = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    if (lastFocused) lastFocused.focus();
  };

  triggers.forEach((trigger) => trigger.addEventListener("click", open));
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener("keydown", (event) => {
    if (modal.classList.contains("hidden")) return;

    if (event.key === "Escape") {
      close();
      return;
    }

    if (event.key === "Tab") {
      const focusable = Array.from(modal.querySelectorAll(focusableSelector));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
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
