export function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "Custom";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function truncate(text: string, length = 160) {
  if (text.length <= length) return text;
  return text.slice(0, length - 1).trimEnd() + "...";
}
/**
 * Smooth scroll to a target element with dynamic header offset
 * Respects prefers-reduced-motion for accessibility
 */
export function scrollToSectionWithOffset(targetEl: HTMLElement, extraPaddingPx = 20) {
  if (!targetEl) return;

  // Calculate header height dynamically
  const headerEl = document.querySelector("header[class*='sticky']");
  const headerHeight = headerEl ? (headerEl as HTMLElement).offsetHeight : 0;
  
  // Get target position
  const targetTop = targetEl.getBoundingClientRect().top + window.scrollY;
  const offset = headerHeight + extraPaddingPx;
  const finalTop = targetTop - offset;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  window.scrollTo({
    top: Math.max(0, finalTop),
    behavior: prefersReducedMotion ? "auto" : "smooth"
  });

  // Focus the target for accessibility
  setTimeout(() => {
    targetEl.focus({ preventScroll: true });
  }, prefersReducedMotion ? 0 : 600);
}

/**
 * Update URL hash without page scroll (for browser history)
 */
export function updateUrlHash(hash: string) {
  if (window.history.replaceState) {
    window.history.replaceState(null, "", hash ? `#${hash}` : window.location.pathname);
  }
}

/**
 * Get hash from URL
 */
export function getUrlHash(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash.slice(1);
}