"use strict";

/* =========================================================
   HOJY'S PAINT & PROPERTY CARE
   Navigation, animation, FAQ and quote calculator
========================================================= */

/*
    IMPORTANT:
    Replace this with the email address that should receive
    customer quote requests.
*/
const BUSINESS_EMAIL = "hello@hojyspaint.com";

/* =========================================================
   ELEMENTS
========================================================= */

const siteHeader = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const mainNavigation = document.getElementById("mainNavigation");
const navigationLinks = document.querySelectorAll(
    '.main-navigation a[href^="#"]'
);

const backToTopButton = document.getElementById("backToTop");
const revealElements = document.querySelectorAll(".reveal");
const faqItems = document.querySelectorAll(".faq-item");

const quoteForm = document.getElementById("quoteForm");
const calculateQuoteButton = document.getElementById(
    "calculateQuoteButton"
);

const serviceType = document.getElementById("serviceType");
const propertySize = document.getElementById("propertySize");
const projectTiming = document.getElementById("projectTiming");

const estimatePrice = document.getElementById("estimatePrice");
const summaryService = document.getElementById("summaryService");
const summarySize = document.getElementById("summarySize");
const summaryTiming = document.getElementById("summaryTiming");
const summaryAddOns = document.getElementById("summaryAddOns");

const formStatus = document.getElementById("formStatus");
const currentYear = document.getElementById("currentYear");

const serviceCards = document.querySelectorAll(
    ".service-card[data-service-choice]"
);

/* =========================================================
   CURRENT YEAR
========================================================= */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function openMenu() {
    menuButton.classList.add("active");
    mainNavigation.classList.add("open");
    document.body.classList.add("menu-open");

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation menu");
}

function closeMenu() {
    menuButton.classList.remove("active");
    mainNavigation.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
}

if (menuButton && mainNavigation) {
    menuButton.addEventListener("click", () => {
        const menuIsOpen = mainNavigation.classList.contains("open");

        if (menuIsOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

/* =========================================================
   HEADER AND BACK-TO-TOP SCROLL EFFECTS
========================================================= */

function handleScrollEffects() {
    const scrollPosition = window.scrollY;

    if (siteHeader) {
        siteHeader.classList.toggle("scrolled", scrollPosition > 20);
    }

    if (backToTopButton) {
        backToTopButton.classList.toggle(
            "visible",
            scrollPosition > 600
        );
    }
}

window.addEventListener("scroll", handleScrollEffects, {
    passive: true
});

handleScrollEffects();

if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

/* =========================================================
   ACTIVE NAVIGATION LINK
========================================================= */

const pageSections = document.querySelectorAll("main section[id]");

function updateActiveNavigation() {
    let currentSectionId = "";

    pageSections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {
            currentSectionId = section.id;
        }
    });

    navigationLinks.forEach((link) => {
        const linkTarget = link.getAttribute("href");

        link.classList.toggle(
            "active",
            linkTarget === `#${currentSectionId}`
        );
    });
}

window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
});

/* =========================================================
   FAQ ACCORDION
========================================================= */

faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!question || !answer) {
        return;
    }

    question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        faqItems.forEach((otherItem) => {
            const otherQuestion =
                otherItem.querySelector(".faq-question");

            const otherAnswer =
                otherItem.querySelector(".faq-answer");

            otherItem.classList.remove("open");

            if (otherQuestion) {
                otherQuestion.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

            if (otherAnswer) {
                otherAnswer.style.maxHeight = null;
            }
        });

        if (!isOpen) {
            item.classList.add("open");
            question.setAttribute("aria-expanded", "true");
            answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
    });
});

/* =========================================================
   QUOTE CALCULATOR DATA
========================================================= */

/*
    These are sample preliminary values only.

    Change the base numbers and multipliers to match your
    real business pricing.
*/

const servicePricing = {
    interior: {
        label: "Interior painting",
        base: 850
    },

    exterior: {
        label: "Exterior painting",
        base: 1500
    },

    commercial: {
        label: "Commercial painting",
        base: 2200
    },

    landscaping: {
        label: "Landscaping",
        base: 650
    },

    seasonal: {
        label: "Seasonal cleanup",
        base: 300
    },

    winter: {
        label: "Winter property care",
        base: 180
    }
};

const sizePricing = {
    small: {
        label: "Small project",
        multiplier: 1
    },

    medium: {
        label: "Medium project",
        multiplier: 1.6
    },

    large: {
        label: "Large project",
        multiplier: 2.5
    },

    estate: {
        label: "Full property / major project",
        multiplier: 3.75
    }
};

const timingPricing = {
    flexible: {
        label: "Flexible",
        multiplier: 1
    },

    month: {
        label: "Within one month",
        multiplier: 1.04
    },

    soon: {
        label: "Within two weeks",
        multiplier: 1.12
    },

    priority: {
        label: "Priority scheduling",
        multiplier: 1.25
    }
};

const addOnPricing = {
    surfacePrep: {
        label: "Surface preparation",
        amount: 275
    },

    materials: {
        label: "Premium materials",
        amount: 225
    },

    cleanup: {
        label: "Removal and cleanup",
        amount: 180
    },

    consultation: {
        label: "Colour or design help",
        amount: 120
    }
};

/* =========================================================
   QUOTE CALCULATOR HELPERS
========================================================= */

function getSelectedAddOns() {
    return Array.from(
        quoteForm.querySelectorAll(
            'input[name="addOns"]:checked'
        )
    ).map((checkbox) => checkbox.value);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0
    }).format(amount);
}

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
}

function clearFormStatus() {
    formStatus.textContent = "";
    formStatus.className = "form-status";
}

/* =========================================================
   QUOTE SUMMARY
========================================================= */

function updateQuoteSummary() {
    const serviceValue = serviceType.value;
    const sizeValue = propertySize.value;
    const timingValue = projectTiming.value || "flexible";
    const selectedAddOns = getSelectedAddOns();

    summaryService.textContent = servicePricing[serviceValue]
        ? servicePricing[serviceValue].label
        : "Not selected";

    summarySize.textContent = sizePricing[sizeValue]
        ? sizePricing[sizeValue].label
        : "Not selected";

    summaryTiming.textContent = timingPricing[timingValue]
        ? timingPricing[timingValue].label
        : "Flexible";

    if (selectedAddOns.length === 0) {
        summaryAddOns.textContent = "None selected";
    } else {
        summaryAddOns.textContent = selectedAddOns
            .map((addOn) => addOnPricing[addOn].label)
            .join(", ");
    }
}

/* =========================================================
   CALCULATE PRELIMINARY ESTIMATE
========================================================= */

function calculateEstimate(showValidationMessage = true) {
    clearFormStatus();
    updateQuoteSummary();

    const selectedService = serviceType.value;
    const selectedSize = propertySize.value;
    const selectedTiming = projectTiming.value || "flexible";
    const selectedAddOns = getSelectedAddOns();

    serviceType.classList.remove("invalid");
    propertySize.classList.remove("invalid");

    if (!selectedService || !selectedSize) {
        estimatePrice.innerHTML = `
            <small>Estimated project range</small>
            <strong>Select a service and size</strong>
        `;

        if (showValidationMessage) {
            showFormStatus(
                "Select a service and project size to calculate an estimate.",
                "error"
            );
        }

        if (!selectedService) {
            serviceType.classList.add("invalid");
        }

        if (!selectedSize) {
            propertySize.classList.add("invalid");
        }

        return null;
    }

    const basePrice = servicePricing[selectedService].base;
    const sizeMultiplier = sizePricing[selectedSize].multiplier;
    const timingMultiplier =
        timingPricing[selectedTiming].multiplier;

    const addOnTotal = selectedAddOns.reduce(
        (total, addOnKey) => {
            return total + addOnPricing[addOnKey].amount;
        },
        0
    );

    const projectEstimate =
        (basePrice * sizeMultiplier + addOnTotal) *
        timingMultiplier;

    const lowEstimate = Math.round(projectEstimate * 0.88 / 25) * 25;
    const highEstimate = Math.round(projectEstimate * 1.22 / 25) * 25;

    estimatePrice.innerHTML = `
        <small>Estimated project range</small>
        <strong>
            ${formatCurrency(lowEstimate)}
            –
            ${formatCurrency(highEstimate)}
        </strong>
    `;

    if (showValidationMessage) {
        showFormStatus(
            "Your preliminary planning estimate has been calculated.",
            "success"
        );
    }

    return {
        lowEstimate,
        highEstimate,
        selectedService,
        selectedSize,
        selectedTiming,
        selectedAddOns
    };
}

if (calculateQuoteButton) {
    calculateQuoteButton.addEventListener("click", () => {
        const result = calculateEstimate(true);

        if (result && window.innerWidth < 851) {
            document.querySelector(".estimate-card").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}

/* =========================================================
   LIVE FORM UPDATES
========================================================= */

[
    serviceType,
    propertySize,
    projectTiming
].forEach((field) => {
    if (!field) {
        return;
    }

    field.addEventListener("change", () => {
        field.classList.remove("invalid");
        clearFormStatus();
        updateQuoteSummary();

        if (serviceType.value && propertySize.value) {
            calculateEstimate(false);
        }
    });
});

quoteForm
    .querySelectorAll('input[name="addOns"]')
    .forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            updateQuoteSummary();

            if (serviceType.value && propertySize.value) {
                calculateEstimate(false);
            }
        });
    });

/* =========================================================
   CLICKABLE SERVICE CARDS
========================================================= */

function openServiceQuote(serviceCard) {
    const serviceChoice = serviceCard.dataset.serviceChoice || "";

    if (serviceChoice && servicePricing[serviceChoice]) {
        serviceType.value = serviceChoice;
        updateQuoteSummary();
    }

    document.getElementById("quote").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    window.setTimeout(() => {
        propertySize.focus();
    }, 650);
}

serviceCards.forEach((serviceCard) => {
    const cardTitle =
        serviceCard.querySelector("h3")?.textContent.trim() ||
        "service";

    serviceCard.setAttribute("role", "button");
    serviceCard.setAttribute("tabindex", "0");
    serviceCard.setAttribute(
        "aria-label",
        `Get a quote for ${cardTitle}`
    );

    serviceCard.addEventListener("click", () => {
        openServiceQuote(serviceCard);
    });

    serviceCard.addEventListener("keydown", (event) => {
        if (event.target !== serviceCard) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openServiceQuote(serviceCard);
        }
    });
});

/* =========================================================
   FORM VALIDATION
========================================================= */

function validateQuoteForm() {
    const requiredFields = quoteForm.querySelectorAll("[required]");
    let formIsValid = true;
    let firstInvalidField = null;

    requiredFields.forEach((field) => {
        field.classList.remove("invalid");

        const fieldValue = field.value.trim();

        if (!fieldValue) {
            field.classList.add("invalid");
            formIsValid = false;

            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        }

        if (
            field.type === "email" &&
            fieldValue &&
            !isValidEmail(fieldValue)
        ) {
            field.classList.add("invalid");
            formIsValid = false;

            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        }
    });

    if (firstInvalidField) {
        firstInvalidField.focus();
    }

    return formIsValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

quoteForm
    .querySelectorAll("input, select, textarea")
    .forEach((field) => {
        field.addEventListener("input", () => {
            field.classList.remove("invalid");
        });

        field.addEventListener("change", () => {
            field.classList.remove("invalid");
        });
    });

/* =========================================================
   EMAIL QUOTE REQUEST
========================================================= */

/*
    This version opens the customer's email application with
    the quote details already completed.

    It does not require a server.

    For fully automatic website submissions, connect the form
    to Formspree, Netlify Forms, Web3Forms, or your own backend.
*/

quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormStatus();

    const formIsValid = validateQuoteForm();

    if (!formIsValid) {
        showFormStatus(
            "Please complete every required field before sending your request.",
            "error"
        );

        return;
    }

    const estimate = calculateEstimate(false);

    if (!estimate) {
        showFormStatus(
            "Please select a service and project size.",
            "error"
        );

        return;
    }

    const formData = new FormData(quoteForm);

    const customerName = formData.get("customerName");
    const customerEmail = formData.get("customerEmail");
    const customerPhone =
        formData.get("customerPhone") || "Not provided";

    const projectLocation = formData.get("projectLocation");
    const propertyType = formData.get("propertyType");
    const description = formData.get("projectDescription");

    const serviceLabel =
        servicePricing[estimate.selectedService].label;

    const sizeLabel =
        sizePricing[estimate.selectedSize].label;

    const timingLabel =
        timingPricing[estimate.selectedTiming].label;

    const addOnLabels =
        estimate.selectedAddOns.length > 0
            ? estimate.selectedAddOns
                  .map((addOn) => addOnPricing[addOn].label)
                  .join(", ")
            : "None selected";

    const emailSubject =
        `New Quote Request – ${serviceLabel} – ${customerName}`;

    const emailBody = `
Hello Hojy's Paint & Property Care,

I would like to request a detailed project quote.

CONTACT INFORMATION
Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
Location: ${projectLocation}

PROJECT INFORMATION
Service: ${serviceLabel}
Project size: ${sizeLabel}
Property type: ${propertyType}
Preferred timing: ${timingLabel}
Additional options: ${addOnLabels}

PRELIMINARY WEBSITE ESTIMATE
${formatCurrency(estimate.lowEstimate)} – ${formatCurrency(
        estimate.highEstimate
    )} CAD

PROJECT DESCRIPTION
${description}

Please contact me to discuss the project and confirm final pricing.

Thank you,
${customerName}
    `.trim();

    const mailtoLink =
        `mailto:${encodeURIComponent(BUSINESS_EMAIL)}` +
        `?subject=${encodeURIComponent(emailSubject)}` +
        `&body=${encodeURIComponent(emailBody)}`;

    showFormStatus(
        "Your quote request is ready. Your email application should now open with the project details completed.",
        "success"
    );

    window.location.href = mailtoLink;
});

/* =========================================================
   INITIALIZE SUMMARY
========================================================= */

updateQuoteSummary();
