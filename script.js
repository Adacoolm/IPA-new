const deck = document.querySelector("#deck");
const slides = Array.from(deck.querySelectorAll(".slide"));
const links = Array.from(document.querySelectorAll(".slide-link"));
const arrows = Array.from(document.querySelectorAll(".nav-arrow"));
const track = document.querySelector("#slide-track");
let activeSlide = 0;
let scrollFrame = 0;

function selectSlide(index, behavior = "smooth") {
  const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
  activeSlide = nextIndex;
  deck.scrollTo({
    left: nextIndex * deck.clientWidth,
    behavior,
  });
  updateNavigation();
}

function updateNavigation() {
  links.forEach((link, index) => {
    const isActive = index === activeSlide;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
      link.scrollIntoView({ block: "nearest", inline: "nearest" });
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    selectSlide(Number(link.dataset.slide));
  });
});

arrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    selectSlide(activeSlide + Number(arrow.dataset.direction));
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
    selectSlide(activeSlide + 1);
  } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    selectSlide(activeSlide - 1);
  } else if (event.key === "Home") {
    selectSlide(0);
  } else if (event.key === "End") {
    selectSlide(slides.length - 1);
  }
});

window.addEventListener("resize", () => {
  selectSlide(activeSlide, "auto");
});

updateNavigation();
