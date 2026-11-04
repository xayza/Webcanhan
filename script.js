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

// V5: spotlight hero theo chuột + gạch chân nav theo section đang xem.
// Tất cả đều tắt khi người dùng bật giảm chuyển động, và không chạy trên cảm ứng.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const hero = document.getElementById("hero");
if (hero && finePointer && !reducedMotion) {
  let spotTicking = false;
  hero.addEventListener("pointermove", (e) => {
    if (spotTicking) return;
    spotTicking = true;
    requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      hero.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      hero.classList.add("spotlight");
      spotTicking = false;
    });
  }, { passive: true });
  hero.addEventListener("pointerleave", () => hero.classList.remove("spotlight"));
}

const navLinks = {};
document.querySelectorAll(".top nav a[href^='#']").forEach((a) => {
  navLinks[a.getAttribute("href").slice(1)] = a;
});
if ("IntersectionObserver" in window) {
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && navLinks[e.target.id]) {
        Object.values(navLinks).forEach((a) => a.classList.remove("active"));
        navLinks[e.target.id].classList.add("active");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["about", "projects", "skills", "journey", "process", "products", "contact"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) navIo.observe(el);
  });
}

// San pham: bam nut phat -> tai cac file chunk base64, ghep thanh video, phat ngay tai cho.
document.querySelectorAll(".video-player").forEach((player) => {
  const video = player.querySelector("video");
  const btn = player.querySelector(".play-btn");
  if (!video || !btn) return;
  btn.addEventListener("click", async () => {
    if (video.src) { video.play(); return; }
    const original = btn.textContent;
    btn.textContent = "…"; btn.disabled = true;
    try {
      document.querySelectorAll(".video-player video").forEach((v) => { if (v !== video) v.pause(); });
      const prefix = player.dataset.prefix;
      const count = parseInt(player.dataset.chunks, 10);
      const parts = [];
      for (let i = 0; i < count; i++) {
        const res = await fetch("assets/video/" + prefix + "-" + String(i).padStart(2, "0") + ".txt");
        if (!res.ok) throw new Error("chunk missing");
        parts.push(await res.text());
      }
      const b64 = parts.join("").trim();
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      video.src = URL.createObjectURL(new Blob([bytes], { type: "video/mp4" }));
      await video.play();
    } catch (e) {
      btn.textContent = original; btn.disabled = false;
      alert("Không tải được video, vui lòng thử lại sau ít phút.");
    }
  });
  video.addEventListener("play", () => player.classList.add("playing"));
  video.addEventListener("pause", () => player.classList.remove("playing"));
});
