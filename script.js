// Hiệu ứng cuộn: thanh tiến trình, hiện dần khi tới, nút về đầu trang.
document.getElementById("year").textContent = new Date().getFullYear();

const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");

function onScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  toTop.classList.toggle("show", h.scrollTop > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
