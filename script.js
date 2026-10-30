"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const header = $("#siteHeader");
const menu = $("#menuButton");
const nav = $("#mainNavigation");
const backTop = $("#backToTop");
const pageProgress = $("#pageProgress");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeMenu() {
  if (!menu || !nav) return;
  menu.classList.remove("active");
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
  menu.setAttribute("aria-expanded", "false");
}

if (menu && nav) {
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open);
    menu.setAttribute("aria-expanded", String(open));
  });
  $$("a", nav).forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (nav.classList.contains("open") && !nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) closeMenu();
  });
}

let scrollPending = false;
function onScroll() {
  const y = window.scrollY;
  if (header) header.classList.toggle("scrolled", y > 20);
  if (backTop) backTop.classList.toggle("visible", y > 650);
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (pageProgress) pageProgress.style.width = `${scrollable > 0 ? Math.min(100, Math.max(0, y / scrollable * 100)) : 0}%`;
  let current = "home";
  $$("main section[id]").forEach(section => {
    if (section.getBoundingClientRect().top <= 165) current = section.id;
  });
  if (nav) $$("a[href^='#']", nav).forEach(link => {
    link.classList.toggle("active", link.hash === `#${current}`);
  });
  scrollPending = false;
}
window.addEventListener("scroll", () => {
  if (!scrollPending) {
    scrollPending = true;
    window.requestAnimationFrame(onScroll);
  }
}, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();
if (backTop) backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

const reveals = $$(".reveal");
if (reduced || !("IntersectionObserver" in window)) {
  reveals.forEach(element => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
  reveals.forEach(element => observer.observe(element));
}

$$(".faq-item button").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const shouldOpen = !item.classList.contains("open");
    $$(".faq-item").forEach(other => {
      other.classList.remove("open");
      const trigger = $("button", other);
      const answer = $(".faq-answer", other);
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (answer) answer.inert = true;
    });
    item.classList.toggle("open", shouldOpen);
    button.setAttribute("aria-expanded", String(shouldOpen));
    const answer = $(".faq-answer", item);
    if (answer) answer.inert = !shouldOpen;
  });
});

const lightbox = $("#projectLightbox");
const lightboxImage = $("#lightboxImage");
const lightboxTitle = $("#lightboxTitle");
function closeLightbox() {
  if (lightbox && lightbox.open) lightbox.close();
}
if (lightbox && lightboxImage && lightboxTitle && typeof lightbox.showModal === "function") {
  $$(".project").forEach(project => {
    project.addEventListener("click", () => {
      const image = $("img", project);
      if (!image) return;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxTitle.textContent = project.dataset.title || "Gallery preview";
      lightbox.showModal();
      document.body.classList.add("modal-open");
    });
  });
  const closeButton = $(".lightbox-close", lightbox);
  if (closeButton) closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener("close", () => document.body.classList.remove("modal-open"));
}

const serviceSelect = $("#serviceType");
if (serviceSelect) {
  $$('[data-service]').forEach(link => {
    link.addEventListener("click", () => {
      const value = link.dataset.service;
      if ($$("option", serviceSelect).some(option => option.value === value)) {
        serviceSelect.value = value;
        serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });
}

const tiltCard = $("[data-tilt]");
if (tiltCard && !reduced && window.matchMedia("(pointer: fine)").matches) {
  tiltCard.addEventListener("pointermove", event => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `perspective(1100px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  tiltCard.addEventListener("pointerleave", () => { tiltCard.style.transform = ""; });
}

const quoteForm = $("#quoteForm");
const formStatus = $("#formStatus");
if (quoteForm && formStatus) {
  quoteForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;
    const submitButton = $('button[type="submit"]', quoteForm);
    const formData = new FormData(quoteForm);
    if (formData.get("_honey")) return;
    if (submitButton) { submitButton.disabled = true; submitButton.setAttribute("aria-busy", "true"); }
    formStatus.className = "form-status";
    formStatus.textContent = "Sending your request…";
    try {
      const response = await fetch(quoteForm.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });
      let result = {};
      try { result = await response.json(); } catch (_) { /* Service may return non-JSON errors. */ }
      if (!response.ok || result.success === "false" || result.success === false) {
        throw new Error("Submission was not confirmed.");
      }
      formStatus.classList.add("success");
      formStatus.textContent = "Your request was submitted. Thank you! We’ll contact you using the information provided.";
      quoteForm.reset();
    } catch (error) {
      formStatus.classList.add("error");
      formStatus.textContent = "We couldn’t confirm your submission. Please email m.zadehhojy@yahoo.com or call 403-383-5452 instead.";
    } finally {
      if (submitButton) { submitButton.disabled = false; submitButton.removeAttribute("aria-busy"); }
    }
  });
}

const currentYear = $("#currentYear");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});
