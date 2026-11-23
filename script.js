(() => {
  "use strict";

  const supported = ["fi", "en", "sv", "es", "de", "it"];
  const translations = window.LAMMENSYLI_TRANSLATIONS || {};
  const metaDescription = document.querySelector('meta[name="description"]');
  const languageSelect = document.getElementById("language-select");
  const menuButton = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const siteHeader = document.querySelector(".site-header");

  // Finnish is embedded in the HTML so the site remains useful without JavaScript.
  const finnish = {
    metaTitle: document.title,
    metaDescription: metaDescription?.content || "",
    menuClose: "Sulje valikko"
  };

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!(key in finnish)) finnish[key] = element.innerHTML;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.dataset.i18nAria;
    if (!(key in finnish)) finnish[key] = element.getAttribute("aria-label") || "";
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const key = element.dataset.i18nAlt;
    if (!(key in finnish)) finnish[key] = element.getAttribute("alt") || "";
  });

  function dictionaryFor(language) {
    return language === "fi" ? finnish : (translations[language] || finnish);
  }

  function applyLanguage(language, updateUrl = false) {
    const lang = supported.includes(language) ? language : "fi";
    const dictionary = dictionaryFor(lang);

    document.documentElement.lang = lang;
    document.title = dictionary.metaTitle || finnish.metaTitle;
    if (metaDescription) metaDescription.content = dictionary.metaDescription || finnish.metaDescription;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = dictionary[element.dataset.i18n];
      if (value !== undefined) element.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const value = dictionary[element.dataset.i18nAria];
      if (value !== undefined) element.setAttribute("aria-label", value);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      const value = dictionary[element.dataset.i18nAlt];
      if (value !== undefined) element.setAttribute("alt", value);
    });

    if (languageSelect) languageSelect.value = lang;
    try { localStorage.setItem("lammensyli-language", lang); } catch (_) { /* storage may be blocked */ }

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (lang === "fi") url.searchParams.delete("lang");
      else url.searchParams.set("lang", lang);
      history.replaceState({}, "", url);
    }

    updateMenuLabel();
  }

  function currentDictionary() {
    return dictionaryFor(document.documentElement.lang || "fi");
  }

  function updateMenuLabel() {
    if (!menuButton) return;
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    const dictionary = currentDictionary();
    menuButton.setAttribute("aria-label", expanded ? (dictionary.menuClose || "Close menu") : (dictionary.menuOpen || "Open menu"));
  }

  let initialLanguage = "fi";
  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  let storedLanguage = null;
  try { storedLanguage = localStorage.getItem("lammensyli-language"); } catch (_) { /* ignore */ }
  if (supported.includes(queryLanguage)) initialLanguage = queryLanguage;
  else if (supported.includes(storedLanguage)) initialLanguage = storedLanguage;
  applyLanguage(initialLanguage);

  languageSelect?.addEventListener("change", (event) => {
    applyLanguage(event.target.value, true);
  });

  function closeMenu() {
    if (!menuButton || !mainNav) return;
    menuButton.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    updateMenuLabel();
  }

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    mainNav?.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    updateMenuLabel();
  });

  mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  const updateHeader = () => siteHeader?.classList.toggle("scrolled", window.scrollY > 32);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");

  document.querySelectorAll(".gallery-item").forEach((button) => {
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      const thumbnail = button.querySelector("img");
      lightboxImage.src = button.dataset.full || thumbnail?.src || "";
      lightboxImage.alt = thumbnail?.alt || "";
      if (typeof lightbox.showModal === "function") lightbox.showModal();
    });
  });

  lightboxClose?.addEventListener("click", () => lightbox.close());
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
