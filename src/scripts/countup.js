function formatNumber(value, decimals) {
  return value.toLocaleString("es-MX", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function animateCountUp(el) {
  const target = parseFloat(el.dataset.countup);
  if (Number.isNaN(target)) return;

  const decimals = parseInt(el.dataset.countupDecimals ?? "0", 10);
  const duration = parseInt(el.dataset.countupDuration ?? "1800", 10);
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatNumber(target * eased, decimals);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function initCountUp() {
  const elements = document.querySelectorAll("[data-countup]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.4 },
  );

  elements.forEach((el) => observer.observe(el));
}

initCountUp();
