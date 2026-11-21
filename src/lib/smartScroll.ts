/**
 * Intelligent, calm viewport positioning utility for AGLA KADAM.
 *
 * Brings newly revealed or updated result sections smoothly into view ONLY when
 * they are outside the comfortable visible area, using an offset that clears
 * the sticky 64px header without jarring jumps to the top of the page.
 */

const DEFAULT_HEADER_OFFSET = 84; // 64px sticky navbar + 20px breathing room

export interface SmartScrollOptions {
  /** Pixel offset from top of viewport to clear sticky navbar */
  offset?: number;
  /** Scroll even if top is partly visible, e.g. for newly generated AI results */
  forceAlign?: boolean;
  /** Fraction of viewport height below which the top is considered "too low" (default 0.58) */
  comfortThreshold?: number;
}

export function scrollIntoViewIfNeeded(
  element: HTMLElement | null | undefined,
  options: SmartScrollOptions = {}
): void {
  if (!element || typeof window === 'undefined') return;

  const {
    offset = DEFAULT_HEADER_OFFSET,
    forceAlign = false,
    comfortThreshold = 0.58,
  } = options;

  // Defer one frame so React DOM updates have painted final layout geometry
  window.requestAnimationFrame(() => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    const isAboveHeader = rect.top < offset - 4;
    const isTooLow = rect.top > viewportHeight * comfortThreshold;
    const isMostlyVisible = !isAboveHeader && !isTooLow;

    if (isMostlyVisible && !forceAlign) {
      return;
    }

    // If forceAlign is set, still skip scrolling if the heading is already right near the top
    if (forceAlign && rect.top >= offset - 8 && rect.top <= offset + 96) {
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targetY = Math.max(0, window.scrollY + rect.top - offset);

    window.scrollTo({
      top: targetY,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  });
}
