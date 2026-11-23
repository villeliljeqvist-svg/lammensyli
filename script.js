(() => {
  "use strict";

  const supported = ["fi", "en", "sv", "es", "de", "it"];
  const translations = window.LAMMENSYLI_TRANSLATIONS || {};
  const metaDescription = document.querySelector('meta[name="description"]');
  const languageSelect = document.getElementById("language-select");
  const menuButton = document.querySelector(".menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const siteHeader = document.querySelector(".site-header");
  const carousel = document.querySelector(".carousel");
  const carouselTrack = carousel?.querySelector(".carousel-track");
  const dotsContainer = carousel?.querySelector(".carousel-dots");
  const carouselStatus = carousel?.querySelector(".carousel-status");
  const carouselMessage = carousel?.querySelector(".carousel-message");
  let slides = [];
  let carouselIndex = 0;

  // Finnish is embedded in the HTML so the site remains useful without JavaScript.
  const finnish = {
    metaTitle: document.title,
    metaDescription: metaDescription?.content || "",
    menuClose: "Sulje valikko",
    carouselEmpty: "Galleriakuvia ei löytynyt.",
    carouselImageAlt: "Lammensylin galleriakuva",
    carouselDotLabel: "Näytä kuva"
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
    updateCarouselAccessibility();

    if (languageSelect) languageSelect.value = lang;
    languageSelect?.closest(".language-picker")?.setAttribute("data-language", lang.toUpperCase());
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

  function updateCarouselAccessibility() {
    if (!slides.length) return;
    const dictionary = currentDictionary();
    slides.forEach((slide, index) => {
      const image = slide.querySelector("img");
      if (image) image.alt = `${dictionary.carouselImageAlt || "Gallery image"} ${index + 1}`;
    });
    dotsContainer?.querySelectorAll(".carousel-dot").forEach((dot, index) => {
      dot.setAttribute("aria-label", `${dictionary.carouselDotLabel || "Show image"} ${index + 1}`);
    });
  }

  function showSlide(nextIndex) {
    if (!carouselTrack || !slides.length) return;
    carouselIndex = (nextIndex + slides.length) % slides.length;
    carouselTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === carouselIndex));
    dotsContainer?.querySelectorAll(".carousel-dot").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === carouselIndex);
      dot.setAttribute("aria-current", index === carouselIndex ? "true" : "false");
    });
    if (carouselStatus) carouselStatus.textContent = `${String(carouselIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  }

  function buildCarousel(imagePaths) {
    if (!carousel || !carouselTrack || !dotsContainer) return;
    carouselTrack.replaceChildren();
    dotsContainer.replaceChildren();

    imagePaths.forEach((path, index) => {
      const slide = document.createElement("figure");
      slide.className = `carousel-slide${index === 0 ? " is-active" : ""}`;
      const image = document.createElement("img");
      image.src = path;
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";
      slide.appendChild(image);
      carouselTrack.appendChild(slide);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.addEventListener("click", () => showSlide(index));
      dotsContainer.appendChild(dot);
    });

    slides = [...carouselTrack.querySelectorAll(".carousel-slide")];
    carousel.classList.toggle("is-empty", !slides.length);
    carousel.classList.toggle("is-ready", Boolean(slides.length));
    if (!slides.length && carouselMessage) carouselMessage.textContent = currentDictionary().carouselEmpty || "No gallery images found.";
    updateCarouselAccessibility();
    showSlide(0);
  }

  function inferGitHubRepository() {
    const configured = window.LAMMENSYLI_GALLERY?.repository?.trim();
    if (configured) return configured;
    if (!window.location.hostname.endsWith(".github.io")) return "";
    const owner = window.location.hostname.split(".")[0];
    const firstPathPart = window.location.pathname.split("/").filter(Boolean)[0];
    return firstPathPart ? `${owner}/${firstPathPart}` : `${owner}/${owner}.github.io`;
  }

  async function loadImagesFromGitHub() {
    const repository = inferGitHubRepository();
    if (!repository) return null;
    const config = window.LAMMENSYLI_GALLERY || {};
    const branch = config.branch || "main";
    const folder = config.folder || "images";
    const endpoint = `https://api.github.com/repos/${repository}/contents/${folder}?ref=${encodeURIComponent(branch)}`;
    const response = await fetch(endpoint, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`GitHub image listing failed: ${response.status}`);
    const entries = await response.json();
    if (!Array.isArray(entries)) throw new Error("Invalid GitHub image listing");
    return entries
      .filter((entry) => entry.type === "file" && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }))
      .map((entry) => `${folder}/${encodeURIComponent(entry.name)}`);
  }

  async function loadImagesFromManifest() {
    const manifestPath = window.LAMMENSYLI_GALLERY?.manifest || "images/images.json";
    const response = await fetch(`${manifestPath}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Image manifest request failed: ${response.status}`);
    const manifest = await response.json();
    const imagePaths = Array.isArray(manifest) ? manifest : manifest.images;
    if (!Array.isArray(imagePaths)) throw new Error("Invalid image manifest");
    return imagePaths;
  }

  async function loadCarouselImages() {
    if (!carousel) return;
    try {
      let imagePaths = null;
      try { imagePaths = await loadImagesFromGitHub(); } catch (githubError) { console.warn(githubError.message); }
      if (!imagePaths) imagePaths = await loadImagesFromManifest();
      buildCarousel(imagePaths.filter((path) => typeof path === "string" && /^images\/.+\.(avif|gif|jpe?g|png|webp)$/i.test(path)));
    } catch (error) {
      console.error("Carousel images could not be loaded.", error);
      carousel.classList.add("is-empty");
      if (carouselMessage) carouselMessage.textContent = currentDictionary().carouselEmpty || "No gallery images found.";
    }
  }

  carousel?.querySelector(".carousel-prev")?.addEventListener("click", () => showSlide(carouselIndex - 1));
  carousel?.querySelector(".carousel-next")?.addEventListener("click", () => showSlide(carouselIndex + 1));
  carousel?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(carouselIndex - 1);
    if (event.key === "ArrowRight") showSlide(carouselIndex + 1);
  });
  loadCarouselImages();

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
