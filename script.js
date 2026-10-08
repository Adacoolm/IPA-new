const deck = document.querySelector("#deck");
const slides = Array.from(deck.querySelectorAll(".slide"));
const links = Array.from(document.querySelectorAll(".slide-link"));
const arrows = Array.from(document.querySelectorAll(".nav-arrow"));
let activeSlide = 0;
let scrollFrame = 0;

function updateNavigation() {
  links.forEach((link, index) => {
    const active = index === activeSlide;
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "true");
      link.scrollIntoView({ block: "nearest", inline: "nearest" });
    } else {
      link.removeAttribute("aria-current");
    }
  });
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
