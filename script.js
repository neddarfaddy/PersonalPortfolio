const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZone: "Africa/Algiers",
  timeZoneName: "short",
});

function updateClock() {
  const formatted = timeFormatter.format(new Date()).replace(/\s/g, " ");
  const label = `Now, ${formatted}`;

  const currentTime = document.getElementById("current-time");
  const footerTime = document.getElementById("footer-time");

  if (currentTime) currentTime.textContent = label;
  if (footerTime) footerTime.textContent = label;
}

updateClock();
setInterval(updateClock, 1000);

const contactDrawer = document.getElementById("contact-drawer");
const contactPanel = document.querySelector(".contact-drawer");
const contactBackdrop = document.querySelector(".contact-backdrop");
const contactForm = document.getElementById("contact-form");
const contactOpenButtons = document.querySelectorAll("[data-contact-open]");
const contactCloseButtons = document.querySelectorAll("[data-contact-close]");
const projectCards = document.querySelectorAll(".project-card");
const skillToggleButtons = document.querySelectorAll("[data-skill-toggle]");
const siteHeader = document.querySelector(".site-header");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a, .mobile-menu button");
const themePicker = document.querySelector("[data-theme-picker]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeMenu = document.getElementById("theme-menu");
let themeOptions = document.querySelectorAll("[data-theme-value]");
const pageTransition = document.querySelector(".page-transition");
const mediaLightbox = document.querySelector("[data-media-lightbox]");
const mediaLightboxImage = document.querySelector("[data-media-image]");
const mediaLightboxCaption = document.querySelector("[data-media-caption]");
const mediaCloseButtons = document.querySelectorAll("[data-media-close]");
const gsapScript = document.querySelector("[data-gsap]");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const THEME_STORAGE_KEY = "portfolio-theme-v18";
const OLD_THEME_STORAGE_KEYS = ["portfolio-theme", "portfolio-theme-v16", "portfolio-theme-v17"];
const THEME_BACKGROUNDS = {
  default: "#121312",
  olive: "#10140f",
  cyan: "#0f1212",
  wine: "#150f11",
  ember: "#14110e",
  plum: "#131015",
  mono: "#0d0d0d",
  paper: "#eeeae2",
  "mint-light": "#e9f0e8",
  "sky-light": "#e8eef0",
  "blush-light": "#f0e9e9",
  pink: "#f5e5ee",
  acid: "#0b1009",
  ocean: "#09111d",
  blue: "#050b24",
  violet: "#120d1b",
  red: "#140407",
  ruby: "#170d10",
  gold: "#171307",
  "teal-light": "#e2f2ef",
  "lilac-light": "#eee9f6",
  "citrus-light": "#f4f1df",
};
const THEME_TRANSITION_BACKGROUNDS = {
  default: "#0e0f0e",
  olive: "#0c100b",
  cyan: "#0b1010",
  wine: "#100b0d",
  ember: "#100d0a",
  plum: "#0f0c11",
  mono: "#050505",
  paper: "#ded9cf",
  "mint-light": "#d9e2d7",
  "sky-light": "#d7e2e6",
  "blush-light": "#e2d6d8",
  pink: "#ead1df",
  acid: "#080d07",
  ocean: "#060d16",
  blue: "#030817",
  violet: "#0e0916",
  red: "#0d0305",
  ruby: "#10090b",
  gold: "#100d05",
  "teal-light": "#d0e5e0",
  "lilac-light": "#ddd5ea",
  "citrus-light": "#e5dec0",
};
const LIGHT_THEMES = new Set(["paper", "mint-light", "sky-light", "blush-light", "pink", "teal-light", "lilac-light", "citrus-light"]);
const extraThemes = [
  { value: "acid", label: "Acid", swatch: "swatch-acid" },
  { value: "blue", label: "Blue", swatch: "swatch-blue" },
  { value: "ocean", label: "Ocean", swatch: "swatch-ocean" },
  { value: "red", label: "Red", swatch: "swatch-red" },
  { value: "ruby", label: "Ruby", swatch: "swatch-ruby" },
  { value: "gold", label: "Gold", swatch: "swatch-gold" },
  { value: "teal-light", label: "Teal", swatch: "swatch-teal-light" },
  { value: "lilac-light", label: "Lilac", swatch: "swatch-lilac-light" },
  { value: "citrus-light", label: "Citrus", swatch: "swatch-citrus-light" },
];
let drawerAnimation;
let logoMagnetReady = false;
let lastFocusedBeforeDrawer = null;

function canAnimate() {
  return !reducedMotionQuery.matches;
}

function gsapReady() {
  return Boolean(window.gsap) && canAnimate();
}

function waitForAnimation(animation) {
  if (!animation) return Promise.resolve();
  if (animation.finished) return animation.finished.catch(() => {});

  return new Promise((resolve) => {
    animation.onfinish = resolve;
    animation.oncancel = resolve;
  });
}

function getFocusableElements(container) {
  if (!container) return [];

  return [
    ...container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ),
  ].filter((element) => !element.hasAttribute("inert") && element.offsetParent !== null);
}

function nativeAnimate(element, keyframes, options) {
  if (!element || !element.animate || !canAnimate()) return Promise.resolve();
  return waitForAnimation(element.animate(keyframes, options));
}

function runPageIntro() {
  const introTargets = [
    ...document.querySelectorAll(
      ".nav-shell, .intro-title, .contact-panel, .availability, .work-index-heading, .case-kicker, .case-title, .case-intro-copy, .case-final, .case-video-card"
        + ", .about-copy, .about-portrait"
    ),
  ];

  if (!canAnimate()) {
    if (pageTransition) {
      pageTransition.style.display = "none";
    }
    return;
  }

  if (gsapReady()) {
    gsap.set(introTargets, { autoAlpha: 0, y: 34 });
    if (pageTransition) {
      gsap.set(pageTransition, { autoAlpha: 1, display: "block", yPercent: 0 });
    }

    const introTimeline = gsap.timeline();

    if (pageTransition) {
      introTimeline.to(
        pageTransition,
        {
          yPercent: 100,
          duration: 0.92,
          ease: "power4.inOut",
        },
        0
      );
    }

    introTimeline.to(
      introTargets,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.82,
        stagger: 0.055,
        ease: "power3.out",
      },
      pageTransition ? 0.24 : 0.08
    );

    if (pageTransition) {
      introTimeline.set(pageTransition, { display: "none" });
    }

    introTimeline.set(introTargets, { clearProps: "opacity,visibility,transform" });
    return;
  }

  introTargets.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(34px)";
  });

  if (pageTransition) {
    pageTransition.style.display = "block";
    pageTransition.style.transform = "translateY(0)";
    nativeAnimate(
      pageTransition,
      [
        { transform: "translateY(0)" },
        { transform: "translateY(100%)" },
      ],
      {
        duration: 920,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      }
    ).then(() => {
      pageTransition.style.display = "none";
      pageTransition.style.transform = "translateY(100%)";
    });
  }

  introTargets.forEach((element, index) => {
    const animation = element.animate(
      [
        { opacity: 0, transform: "translateY(34px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 760,
        delay: 260 + index * 55,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both",
      }
    );

    waitForAnimation(animation).then(() => {
      element.style.opacity = "";
      element.style.transform = "";
    });
  });
}

function samePageHashLink(url) {
  return (
    sameSitePage(url) &&
    url.pathname === window.location.pathname &&
    url.search === window.location.search &&
    Boolean(url.hash)
  );
}

function samePageLink(url) {
  return (
    sameSitePage(url) &&
    url.pathname === window.location.pathname &&
    url.search === window.location.search &&
    !url.hash
  );
}

function sameSitePage(url) {
  if (url.protocol === "file:" && window.location.protocol === "file:") {
    return true;
  }

  return url.origin === window.location.origin;
}

function shouldTransitionLink(link) {
  const rawHref = link.getAttribute("href");
  if (!rawHref || rawHref.startsWith("#")) return false;
  if (link.target && link.target !== "_self") return false;
  if (link.hasAttribute("download")) return false;
  if (/^(mailto|tel|sms):/i.test(rawHref)) return false;

  const url = new URL(link.href, window.location.href);
  if (!sameSitePage(url)) return false;
  if (samePageLink(url)) return false;
  if (samePageHashLink(url)) return false;

  return true;
}

function setupPageTransitions() {
  if (!pageTransition || !canAnimate()) {
    if (pageTransition) pageTransition.style.display = "none";
    return;
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted && pageTransition) {
      pageTransition.style.display = "none";
      pageTransition.style.transform = "translateY(100%)";
    }
  });

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest("a[href]");
    if (!link || !shouldTransitionLink(link)) return;

    event.preventDefault();
    const destination = link.href;

    const navigate = () => {
      window.location.href = destination;
    };

    if (gsapReady()) {
      gsap.killTweensOf(pageTransition);
      gsap.set(pageTransition, { autoAlpha: 1, display: "block", yPercent: -100 });
      gsap.to(pageTransition, {
        yPercent: 0,
        duration: 0.78,
        ease: "power4.inOut",
        onComplete: navigate,
      });
      return;
    }

    pageTransition.style.display = "block";
    pageTransition.style.transform = "translateY(-100%)";
    nativeAnimate(
      pageTransition,
      [
        { transform: "translateY(-100%)" },
        { transform: "translateY(0)" },
      ],
      {
        duration: 780,
        easing: "cubic-bezier(0.76, 0, 0.24, 1)",
        fill: "forwards",
      }
    ).then(navigate);
  });
}

function revealElement(element) {
  if (element.dataset.revealed === "true") return;
  element.dataset.revealed = "true";

  if (gsapReady()) {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 42 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.76,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform",
      }
    );
    return;
  }

  nativeAnimate(
    element,
    [
      { opacity: 0, transform: "translateY(42px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    {
      duration: 720,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "both",
    }
  ).then(() => {
    element.style.opacity = "";
    element.style.transform = "";
  });
}

function setupScrollReveals() {
  if (!canAnimate()) return;

  const revealTargets = [
    ...document.querySelectorAll(
      ".project-card, .work-index-card, .approach .statement, .approach-copy, .capability-list, .case-snapshot, .case-section-header, .case-break, .pain-card, .quote-card, .persona-card, .flow-card, .design-pair, .screen-card, .case-image-card, .annotation-card, .decision-item, .case-nav-row, .footer-top, .footer-middle"
        + ", .case-tldr, .care-screen-row, .about-panel"
    ),
  ].filter((element) => element.dataset.revealBound !== "true");

  revealTargets.forEach((element) => {
    element.dataset.revealBound = "true";
    element.style.opacity = "0";
    element.style.transform = "translateY(42px)";
  });

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach(revealElement);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        revealElement(entry.target);
      });
    },
    {
      rootMargin: "0px 0px 25% 0px",
      threshold: 0.01,
    }
  );

  revealTargets.forEach((element) => observer.observe(element));
}

function setDrawerInitialState() {
  if (!contactDrawer || !contactPanel) return;

  contactDrawer.classList.remove("is-open");
  contactDrawer.style.opacity = "";
  contactDrawer.style.visibility = "";
  contactPanel.style.transform = "";
}

function closeMobileMenu() {
  if (!siteHeader || !mobileMenu || !mobileMenuToggle) return;

  siteHeader.classList.remove("is-menu-open");
  mobileMenuToggle.setAttribute("aria-expanded", "false");
  mobileMenuToggle.setAttribute("aria-label", "Open menu");
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileMenu.setAttribute("inert", "");
}

function toggleMobileMenu() {
  if (!siteHeader || !mobileMenu || !mobileMenuToggle) return;

  const isOpen = siteHeader.classList.toggle("is-menu-open");
  mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen) {
    mobileMenu.removeAttribute("inert");
  } else {
    mobileMenu.setAttribute("inert", "");
  }
}

function openContactDrawer() {
  if (!contactDrawer || !contactPanel) return;

  closeMobileMenu();
  lastFocusedBeforeDrawer = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  drawerAnimation?.kill?.();
  contactDrawer.style.opacity = "";
  contactDrawer.style.visibility = "";
  contactPanel.style.transform = "";
  contactDrawer.classList.add("is-open");
  contactDrawer.setAttribute("aria-hidden", "false");
  contactDrawer.removeAttribute("inert");
  document.body.classList.add("contact-open");

  if (gsapReady()) {
    gsap.set([".drawer-close", ".drawer-intro > *", ".contact-form > *"], {
      clearProps: "all",
    });
  }

  const firstInput =
    contactDrawer.querySelector(".drawer-close") ||
    contactDrawer.querySelector(".contact-drawer input, .contact-drawer select, .contact-drawer textarea");
  window.setTimeout(() => firstInput?.focus(), gsapReady() ? 520 : 120);
}

function closeContactDrawer() {
  if (!contactDrawer || !contactPanel || contactDrawer.getAttribute("aria-hidden") === "true") {
    return;
  }

  drawerAnimation?.kill?.();

  const afterClose = () => {
    contactPanel.style.transform = "";
    contactDrawer.style.visibility = "";
    contactDrawer.style.opacity = "";
    contactDrawer.classList.remove("is-open");
    contactDrawer.setAttribute("aria-hidden", "true");
    contactDrawer.setAttribute("inert", "");
    document.body.classList.remove("contact-open");
    lastFocusedBeforeDrawer?.focus?.();
    lastFocusedBeforeDrawer = null;
  };

  afterClose();
}

function setupContactButtons() {
  document.querySelectorAll("[data-contact-open]").forEach((button) => {
    if (button.dataset.contactBound === "true") return;
    button.dataset.contactBound = "true";
    button.addEventListener("click", openContactDrawer);
  });

  document.querySelectorAll("[data-contact-close]").forEach((button) => {
    if (button.dataset.contactBound === "true") return;
    button.dataset.contactBound = "true";
    button.addEventListener("click", closeContactDrawer);
  });
}

function setupSkillToggles() {
  document.querySelectorAll("[data-skill-toggle]").forEach((button) => {
    if (button.dataset.skillBound === "true") return;
    button.dataset.skillBound = "true";

    button.addEventListener("click", () => {
      const item = button.closest(".capability-item");
      if (!item) return;

      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));

      if (gsapReady() && isOpen) {
        gsap.fromTo(
          item.querySelector(".capability-copy"),
          { autoAlpha: 0, y: -5 },
          { autoAlpha: 1, y: 0, duration: 0.26, ease: "power2.out" }
        );
      }
    });
  });
}

function setupMagneticBrand() {
  if (logoMagnetReady || !gsapReady()) return;

  const brand = document.querySelector(".brand");
  if (!brand) return;

  logoMagnetReady = true;
  gsap.set(brand, {
    transformPerspective: 800,
    transformOrigin: "center center",
  });

  const triggerRadius = 120;
  let bounds;
  let centerX;
  let centerY;
  let isActive = false;

  function refreshBounds() {
    bounds = brand.getBoundingClientRect();
    centerX = bounds.left + bounds.width / 2;
    centerY = bounds.top + bounds.height / 2;
  }

  refreshBounds();
  window.addEventListener("resize", refreshBounds);
  window.addEventListener("scroll", refreshBounds, { passive: true });

  window.addEventListener("mousemove", (event) => {
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < triggerRadius) {
      const strength = 1 - distance / triggerRadius;
      const nx = dx / triggerRadius;
      const ny = dy / triggerRadius;
      isActive = true;

      gsap.to(brand, {
        x: nx * 10 * strength,
        y: ny * 6 * strength,
        rotateY: nx * 4 * strength,
        rotateX: -ny * 2.5 * strength,
        duration: 0.48,
        ease: "power3.out",
        overwrite: "auto",
      });
    } else if (isActive) {
      isActive = false;
      gsap.to(brand, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.68,
        ease: "power4.out",
        overwrite: "auto",
      });
    }
  });
}

function setupBeforeAfterSliders() {
  document.querySelectorAll("[data-before-after]").forEach((slider) => {
    if (slider.dataset.sliderBound === "true") return;
    slider.dataset.sliderBound = "true";

    const range = slider.querySelector(".before-after-range");
    if (!range) return;

    const updateSlider = () => {
      const value = Math.max(0, Math.min(100, Number(range.value) || 50));
      slider.style.setProperty("--split", `${value}%`);
      range.setAttribute("aria-valuetext", `${value}% before`);
    };

    updateSlider();
    range.addEventListener("input", updateSlider);
    range.addEventListener("change", updateSlider);
  });
}

function setupAutoCarousels() {
  const carousels = document.querySelectorAll("[data-auto-carousel]");
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    if (carousel.dataset.carouselBound === "true") return;
    carousel.dataset.carouselBound = "true";

    let isDragging = false;
    let dragStarted = false;
    let startX = 0;
    let startScrollLeft = 0;
    let pressedImage = null;
    let activePointerId = null;
    let touchStartX = 0;
    let touchStartY = 0;

    const imageSelector = ".case-image, .care-screen-row img";

    const markDragged = () => {
      carousel.dataset.dragged = "true";
      window.setTimeout(() => {
        delete carousel.dataset.dragged;
      }, 220);
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      activePointerId = null;
      carousel.classList.remove("is-dragging");

      if (dragStarted) markDragged();
    };

    carousel.addEventListener("touchstart", (event) => {
      const touch = event.touches?.[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      carousel.classList.add("is-touching");
    }, { passive: true });

    carousel.addEventListener("touchmove", (event) => {
      const touch = event.touches?.[0];
      if (!touch) return;
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        markDragged();
      }
    }, { passive: true });

    carousel.addEventListener("touchend", () => {
      carousel.classList.remove("is-touching");
    }, { passive: true });

    carousel.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") return;
      if (event.button !== 0 && event.pointerType === "mouse") return;
      const target = event.target;
      pressedImage = target instanceof Element ? target.closest(imageSelector) : null;
      isDragging = true;
      dragStarted = false;
      activePointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = carousel.scrollLeft;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture?.(event.pointerId);
    });

    carousel.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      if (!isDragging || activePointerId !== event.pointerId) return;

      const delta = event.clientX - startX;
      if (Math.abs(delta) > 3) {
        dragStarted = true;
        event.preventDefault();
      }

      carousel.scrollLeft = startScrollLeft - delta;
    });

    carousel.addEventListener("pointerup", endDrag);
    carousel.addEventListener("pointercancel", endDrag);
    carousel.addEventListener("lostpointercapture", endDrag);

    carousel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const image = target.closest(imageSelector) || pressedImage;
      pressedImage = null;
      if (!image || !carousel.contains(image)) return;

      event.preventDefault();
      if (carousel.dataset.dragged === "true") return;
      openMediaLightbox(image);
    });
  });
}
function setupVideoPreviews() {
  const videoPreviewCards = document.querySelectorAll(".case-video-card");
  if (!videoPreviewCards.length) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  videoPreviewCards.forEach((card) => {
    if (card.dataset.videoPreviewBound === "true") return;
    card.dataset.videoPreviewBound = "true";

    const preview = card.querySelector(".case-video-preview");
    if (!preview) return;

    const setPreviewPosition = (x, y) => {
      const previewWidth = preview.offsetWidth || 420;
      const previewHeight = preview.offsetHeight || 236;
      const safeX = Math.max(16, Math.min(window.innerWidth - previewWidth - 16, x));
      const safeY = Math.max(16, Math.min(window.innerHeight - previewHeight - 16, y));

      preview.style.setProperty("--preview-x", `${safeX}px`);
      preview.style.setProperty("--preview-y", `${safeY}px`);
    };

    const movePreview = (event) => {
      const previewWidth = preview.offsetWidth || 420;
      const previewHeight = preview.offsetHeight || 236;
      const shouldFlip = event.clientX + previewWidth + 24 > window.innerWidth;
      const x = shouldFlip ? event.clientX - previewWidth - 22 : event.clientX + 22;
      const y = event.clientY - previewHeight / 2;

      setPreviewPosition(x, y);
    };

    const showPreview = (event) => {
      card.classList.add("is-previewing");
      movePreview(event);
    };

    const hidePreview = () => {
      card.classList.remove("is-previewing");
    };

    card.addEventListener("mouseenter", showPreview);
    card.addEventListener("mousemove", movePreview);
    card.addEventListener("mouseleave", hidePreview);
    window.addEventListener("scroll", hidePreview, { passive: true });
    window.addEventListener("wheel", hidePreview, { passive: true });
    card.addEventListener("focus", () => {
      const rect = card.getBoundingClientRect();
      const previewWidth = preview.offsetWidth || 420;
      const previewHeight = preview.offsetHeight || 236;
      const x = Math.min(rect.right - previewWidth, window.innerWidth - previewWidth - 16);
      const y = rect.top > previewHeight + 24 ? rect.top - previewHeight - 12 : rect.bottom + 12;

      card.classList.add("is-previewing");
      setPreviewPosition(x, y);
    });
    card.addEventListener("blur", hidePreview);
  });
}

function openMediaLightbox(image) {
  if (!mediaLightbox || !mediaLightboxImage || !image?.src) return;

  const caption =
    image.closest("figure")?.querySelector("figcaption")?.textContent?.trim() ||
    image.closest(".screen-card")?.querySelector(".screen-card-title")?.textContent?.trim() ||
    image.alt ||
    "Case study image";

  mediaLightboxImage.src = image.currentSrc || image.src;
  mediaLightboxImage.alt = image.alt || caption;
  mediaLightbox.classList.remove("is-wide");
  mediaLightbox.querySelector(".media-lightbox-frame")?.scrollTo?.(0, 0);

  const updateLightboxShape = () => {
    const ratio = mediaLightboxImage.naturalWidth / Math.max(mediaLightboxImage.naturalHeight, 1);
    mediaLightbox.classList.toggle("is-wide", ratio > 1.55);
  };

  mediaLightboxImage.onload = updateLightboxShape;
  if (mediaLightboxImage.complete) updateLightboxShape();

  if (mediaLightboxCaption) {
    mediaLightboxCaption.textContent = caption;
    mediaLightboxCaption.hidden = !caption;
  }

  mediaLightbox.classList.add("is-open");
  mediaLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("media-open");
  window.setTimeout(() => mediaLightbox.querySelector("[data-media-close]")?.focus?.(), 0);
}

function closeMediaLightbox() {
  if (!mediaLightbox || mediaLightbox.getAttribute("aria-hidden") === "true") return;

  mediaLightbox.classList.remove("is-open");
  mediaLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("media-open");

  window.setTimeout(() => {
    if (mediaLightbox.getAttribute("aria-hidden") === "true" && mediaLightboxImage) {
      mediaLightbox.classList.remove("is-wide");
      mediaLightboxImage.onload = null;
      mediaLightboxImage.removeAttribute("src");
      mediaLightboxImage.alt = "";
    }
  }, 260);
}

function setupMediaLightbox() {
  const zoomImages = document.querySelectorAll(
    ".case-final .case-image, .flow-card img, .screen-card-media img, .case-image-card img, .care-screen-row img"
  );

  zoomImages.forEach((image) => {
    const hiddenClone = image.closest("[aria-hidden='true']");
    const carouselImage = Boolean(image.closest("[data-auto-carousel]"));
    if (hiddenClone && !carouselImage) return;
    if (image.dataset.lightboxBound === "true") return;
    image.dataset.lightboxBound = "true";

    image.setAttribute("tabindex", hiddenClone ? "-1" : "0");
    image.setAttribute("role", "button");
    if (!hiddenClone) {
      image.setAttribute("aria-label", `Open image preview: ${image.alt || "case study image"}`);
    }

    if (!carouselImage) {
      image.addEventListener("click", () => {
        openMediaLightbox(image);
      });
    }
    image.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openMediaLightbox(image);
    });
  });
}

mediaCloseButtons.forEach((button) => {
  button.addEventListener("click", closeMediaLightbox);
});

mobileMenuToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleMobileMenu();
});

mobileMenuLinks.forEach((item) => {
  item.addEventListener("click", closeMobileMenu);
});

projectCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (card.getAttribute("href") === "#") event.preventDefault();
  });
});

function setTheme(theme) {
  const themeValue = theme || "violet";
  const root = document.documentElement;
  const body = document.body;
  const background = THEME_BACKGROUNDS[themeValue] || THEME_BACKGROUNDS.violet;
  const transitionBackground = THEME_TRANSITION_BACKGROUNDS[themeValue] || THEME_TRANSITION_BACKGROUNDS.violet;

  root.setAttribute("data-theme", themeValue);
  root.style.setProperty("--initial-bg", background);
  root.style.setProperty("--initial-transition-bg", transitionBackground);
  root.style.backgroundColor = background;
  root.style.colorScheme = LIGHT_THEMES.has(themeValue) ? "light" : "dark";

  if (body) {
    body.setAttribute("data-theme", themeValue);
    body.style.backgroundColor = background;
    body.style.colorScheme = LIGHT_THEMES.has(themeValue) ? "light" : "dark";
  }

  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", background);
  document.querySelector(".page-transition")?.style.setProperty("background", transitionBackground);

  document.querySelectorAll(".background-waves span").forEach((wave) => {
    wave.style.animationName = "none";
    void wave.offsetHeight;
    wave.style.animationName = "diagonal-slide";
  });

  themeOptions.forEach((option) => {
    option.classList.toggle("is-active", option.dataset.themeValue === themeValue);
  });

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeValue);
    OLD_THEME_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    return;
  }
}

function ensureExtraThemes() {
  if (!themeMenu) return;

  const existingValues = new Set(
    [...themeMenu.querySelectorAll("[data-theme-value]")].map((option) => option.dataset.themeValue)
  );

  extraThemes.forEach(({ value, label, swatch }) => {
    if (existingValues.has(value)) return;

    const button = document.createElement("button");
    button.className = "theme-option";
    button.type = "button";
    button.dataset.themeValue = value;

    const swatchElement = document.createElement("span");
    swatchElement.className = `theme-swatch ${swatch}`;
    swatchElement.setAttribute("aria-hidden", "true");

    const labelElement = document.createElement("span");
    labelElement.textContent = label;

    button.append(swatchElement, labelElement);
    themeMenu.append(button);
  });

  themeOptions = document.querySelectorAll("[data-theme-value]");
}

function closeThemeMenu() {
  if (!themePicker || !themeToggle || !themeMenu) return;

  themePicker.classList.remove("is-open");
  themeToggle.setAttribute("aria-expanded", "false");
  themeMenu.setAttribute("aria-hidden", "true");
  themeMenu.setAttribute("inert", "");
}

function toggleThemeMenu() {
  if (!themePicker || !themeToggle || !themeMenu) return;

  const isOpen = themePicker.classList.toggle("is-open");
  themeToggle.setAttribute("aria-expanded", String(isOpen));
  themeMenu.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen) {
    themeMenu.removeAttribute("inert");
  } else {
    themeMenu.setAttribute("inert", "");
  }
}

themeToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleThemeMenu();
});

ensureExtraThemes();

themeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setTheme(option.dataset.themeValue);
    closeThemeMenu();
  });
});

document.addEventListener("click", (event) => {
  if (siteHeader?.classList.contains("is-menu-open") && !siteHeader.contains(event.target)) {
    closeMobileMenu();
  }

  if (!themePicker?.classList.contains("is-open")) return;
  if (themePicker.contains(event.target)) return;
  closeThemeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && contactDrawer?.classList.contains("is-open")) {
    const focusable = getFocusableElements(contactDrawer);
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

  if (event.key === "Escape") {
    closeMediaLightbox();
    closeContactDrawer();
    closeMobileMenu();
    closeThemeMenu();
  }
});

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const firstName = data.get("firstName") || "";
  const lastName = data.get("lastName") || "";
  const enquiryType = data.get("enquiryType") || "Portfolio enquiry";
  const phone = data.get("phone") || "";
  const email = data.get("email") || "";
  const message = data.get("message") || "";
  const sendButton = contactForm.querySelector(".send-button");
  const status = contactForm.querySelector("[data-form-status]");
  const originalButtonText = sendButton?.querySelector("span:last-child")?.textContent || "Send Message";
  const fullName = `${firstName} ${lastName}`.trim();

  data.set("name", fullName);
  data.set("_subject", `Portfolio enquiry: ${enquiryType}`);
  data.set("_template", "table");
  data.set("_captcha", "false");

  const setStatus = (messageText, state = "") => {
    if (!status) return;
    status.textContent = messageText;
    status.classList.remove("is-success", "is-error");
    if (state) status.classList.add(state);
  };

  const setLoading = (isLoading) => {
    if (!sendButton) return;
    sendButton.disabled = isLoading;
    const label = sendButton.querySelector("span:last-child");
    if (label) label.textContent = isLoading ? "Sending..." : originalButtonText;
  };

  const body = [
    `Name: ${fullName}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    `Enquiry type: ${enquiryType}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  setLoading(true);
  setStatus("Sending message...");

  try {
    const response = await fetch("https://formsubmit.co/ajax/fadyneddar@gmail.com", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Form endpoint failed");

    contactForm.reset();
    setStatus("Message sent. I’ll get back to you soon.", "is-success");
  } catch (error) {
    setStatus("Automatic send failed. Opening your email app instead.", "is-error");
    const mailto = new URL("mailto:fadyneddar@gmail.com");
    mailto.searchParams.set("subject", `Portfolio enquiry: ${enquiryType}`);
    mailto.searchParams.set("body", body);
    window.location.href = mailto.toString();
  } finally {
    setLoading(false);
  }
});

gsapScript?.addEventListener("load", setupMagneticBrand);

try {
  setTheme(window.localStorage.getItem(THEME_STORAGE_KEY) || "violet");
} catch {
  setTheme("violet");
}

setDrawerInitialState();
closeMobileMenu();
closeThemeMenu();
setupContactButtons();
setupSkillToggles();
setupBeforeAfterSliders();
setupAutoCarousels();
setupVideoPreviews();
setupMediaLightbox();
setupPageTransitions();
runPageIntro();
setupScrollReveals();
setupMagneticBrand();
