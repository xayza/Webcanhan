// Hiệu ứng cuộn: thanh tiến trình, hiện dần khi tới, nút về đầu trang.
// Scroll được gom qua requestAnimationFrame để không giật khi cuộn nhanh.
document.getElementById("year").textContent = new Date().getFullYear();

const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");

function onScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  if (progress) progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  if (toTop) toTop.classList.toggle("show", h.scrollTop > 600);
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { onScroll(); ticking = false; });
}, { passive: true });
onScroll();

if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  // Trình duyệt cũ không có IntersectionObserver: hiện hết, không để trang trắng.
  revealEls.forEach((el) => el.classList.add("visible"));
}
