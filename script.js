const deck = document.querySelector("#deck");
const slides = Array.from(deck.querySelectorAll(".slide"));
const links = Array.from(document.querySelectorAll(".slide-tab"));
const arrows = Array.from(document.querySelectorAll(".nav-arrow"));
const range = document.querySelector(".slide-range");
const summaryWordCount = document.querySelector("#summary-word-count");
let activeSlide = 0;
let scrollFrame = 0;

range.max = String(slides.length - 1);

const summaryText = document.querySelector(".summary-grid").innerText.trim();
summaryWordCount.value = String(summaryText.split(/\s+/).filter(Boolean).length);

function updateNavigation() {
  links.forEach((link, index) => {
    const active = index === activeSlide;
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
  const activeLink = links[activeSlide];
  const tabsBounds = activeLink.parentElement.getBoundingClientRect();
  const activeBounds = activeLink.getBoundingClientRect();
  if (activeBounds.left < tabsBounds.left || activeBounds.right > tabsBounds.right) {
    activeLink.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
  range.value = String(activeSlide);
  range.setAttribute("aria-valuetext", `Slide ${activeSlide + 1} of ${slides.length}`);
  arrows[0].disabled = activeSlide === 0;
  arrows[1].disabled = activeSlide === slides.length - 1;
}

function goToSlide(index, behavior = "smooth") {
  activeSlide = Math.max(0, Math.min(index, slides.length - 1));
  deck.scrollTo({ left: activeSlide * deck.clientWidth, behavior });
  updateNavigation();
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    goToSlide(Number(link.dataset.slide));
  });
});

range.addEventListener("input", () => {
  goToSlide(Number(range.value));
});

arrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    goToSlide(activeSlide + Number(arrow.dataset.direction));
  });
});

deck.addEventListener(
  "scroll",
  () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      activeSlide = Math.max(
        0,
        Math.min(
          slides.length - 1,
          Math.round(deck.scrollLeft / deck.clientWidth),
        ),
      );
      updateNavigation();
    });
  },
  { passive: true },
);

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    goToSlide(activeSlide + 1);
  } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    goToSlide(activeSlide - 1);
  } else if (event.key === "Home") {
    goToSlide(0);
  } else if (event.key === "End") {
    goToSlide(slides.length - 1);
  }
});

window.addEventListener("resize", () => {
  goToSlide(activeSlide, "auto");
});

updateNavigation();
