"use strict";

const header = document.querySelector("#siteHeader");
const menu = document.querySelector("#menuButton");
const nav = document.querySelector("#mainNavigation");
const backTop = document.querySelector("#backToTop");

function closeMenu() {
  menu.classList.remove("active");
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
  menu.setAttribute("aria-expanded", "false");
}

menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.classList.toggle("active", open);
  document.body.classList.toggle("menu-open", open);
  menu.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

function onScroll() {
  header.classList.toggle("scrolled", scrollY > 20);
  backTop.classList.toggle("visible", scrollY > 650);
  let current = "";
  document.querySelectorAll("main section[id]").forEach((section) => {
    if (scrollY >= section.offsetTop - 160) current = section.id;
  });
  nav.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.classList.toggle("active", a.hash === `#${current}`);
  });
}

addEventListener("scroll", onScroll, { passive: true });
onScroll();
backTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = document.querySelectorAll(".reveal");
if (reduced || !("IntersectionObserver" in window)) {
  reveals.forEach((x) => x.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.1, rootMargin: "0px 0px -35px" }
  );
  reveals.forEach((x) => observer.observe(x));
}

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const open = !item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((x) => {
      x.classList.remove("open");
      x.querySelector("button").setAttribute("aria-expanded", "false");
    });
    item.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
  });
});

const lightbox = document.querySelector("#projectLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");

document.querySelectorAll(".project").forEach((project) => {
  project.addEventListener("click", () => {
    const image = project.querySelector("img");
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = project.dataset.title;
    lightbox.showModal();
    document.body.classList.add("modal-open");
  });
});

function closeLightbox() {
  lightbox.close();
  document.body.classList.remove("modal-open");
}

document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("close", () => document.body.classList.remove("modal-open"));

const service = document.querySelector("#serviceType");
document.querySelectorAll("[data-service]").forEach((a) => {
  a.addEventListener("click", () => {
    service.value = a.dataset.service;
  });
});

document.querySelector("#quoteForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = form.get("name");
  const selected = form.get("service");
  const subject = `New Hojy's Quote Request - ${selected} - ${name}`;
  const body = `Hello Hojy's Paint & Property Care,\n\nI would like to request a project quote.\n\nName: ${name}\nEmail: ${form.get("email")}\nPhone: ${form.get("phone") || "Not provided"}\nLocation: ${form.get("location")}\nService: ${selected}\nPreferred timing: ${form.get("timing")}\n\nProject details:\n${form.get("details")}\n\nThank you,\n${name}`;
  document.querySelector("#formStatus").textContent = "Opening your email app…";
  location.href = `mailto:hello@hojyspaint.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelector("#currentYear").textContent = new Date().getFullYear();
