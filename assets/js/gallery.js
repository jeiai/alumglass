const galleryData = window.ALUMGLASS_GALLERY || [];
const tabsNode = document.querySelector("[data-gallery-tabs]");
const gridNode = document.querySelector("[data-gallery-grid]");
const emptyNode = document.querySelector("[data-gallery-empty]");
const totalNode = document.querySelector("[data-gallery-total]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");

let activeCategory = "todos";
let activeImages = [];
let activeIndex = 0;

function allImages() {
  return galleryData.flatMap((category) =>
    category.images.map((image) => ({
      ...image,
      category: category.name
    }))
  );
}

function setTotal() {
  if (!totalNode) return;
  const total = allImages().length;
  const categories = galleryData.length;
  totalNode.textContent = `${total} imágenes · ${categories} categorías`;
}

function renderTabs() {
  if (!tabsNode) return;

  const tabs = [
    { id: "todos", name: "Todos", count: allImages().length },
    ...galleryData.map((category) => ({
      id: category.id,
      name: category.name,
      count: category.count
    }))
  ];

  tabsNode.innerHTML = tabs
    .map(
      (tab) => `
        <button class="gallery-tab${tab.id === activeCategory ? " is-active" : ""}" type="button" data-gallery-category="${tab.id}" aria-pressed="${tab.id === activeCategory}">
          <span>${tab.name}</span>
          <small>${tab.count}</small>
        </button>
      `
    )
    .join("");
}

function currentImages() {
  if (activeCategory === "todos") return allImages();
  const category = galleryData.find((item) => item.id === activeCategory);
  if (!category) return [];
  return category.images.map((image) => ({ ...image, category: category.name }));
}

function renderGallery() {
  if (!gridNode || !emptyNode) return;
  activeImages = currentImages();
  emptyNode.hidden = activeImages.length > 0;

  gridNode.innerHTML = activeImages
    .map(
      (image, index) => `
        <button class="work-card" type="button" data-gallery-index="${index}">
          <img src="${image.src}" alt="${image.alt}" width="${image.width}" height="${image.height}" loading="lazy">
          <span>${image.category}</span>
        </button>
      `
    )
    .join("");
}

function setCategory(categoryId) {
  activeCategory = categoryId;
  renderTabs();
  renderGallery();
}

function showLightbox(index) {
  if (!lightbox || !lightboxImage || !lightboxCaption || !activeImages[index]) return;
  activeIndex = index;
  const image = activeImages[activeIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.category;
  lightbox.hidden = false;
  document.body.classList.add("has-lightbox");
  lightboxClose?.focus();
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("has-lightbox");
}

function moveLightbox(direction) {
  if (!activeImages.length) return;
  const nextIndex = (activeIndex + direction + activeImages.length) % activeImages.length;
  showLightbox(nextIndex);
}

tabsNode?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-gallery-category]");
  if (!button) return;
  setCategory(button.dataset.galleryCategory);
});

gridNode?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-gallery-index]");
  if (!button) return;
  showLightbox(Number(button.dataset.galleryIndex));
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
lightboxNext?.addEventListener("click", () => moveLightbox(1));

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

setTotal();
renderTabs();
renderGallery();
