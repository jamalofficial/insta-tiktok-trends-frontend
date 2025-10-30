import { useRef, useEffect } from "react";

/**
 * useDebounce
 * Returns a stable debounced version of a callback.
 * It guarantees that older calls are discarded, and the latest call
 * executes only after `delay` ms of inactivity.
 *
 * Usage:
 *   const debouncedHandler = useDebounce(handler, 300);
 *   <input onChange={(e) => debouncedHandler(e.target.value)} />
 *
 * @param {Function} fn    The function to debounce.
 * @param {number}   delay Delay in ms (default: 300).
 * @returns {Function}     Debounced function (stable reference).
 */
export function useDebounce(fn, delay = 300) {
  const fnRef = useRef(fn);
  const timerRef = useRef(null);

  // Keep latest function reference
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Return a stable debounced function
  function debounced(...args) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fnRef.current(...args);
    }, delay);
  }

  // Return same instance across renders
  return debounced;
}
