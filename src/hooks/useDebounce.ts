import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value changes (e.g. search inputs).
 * Delays updating the returned value until `delay` milliseconds have elapsed
 * since the last time the input value changed.
 *
 * @param value The raw input value
 * @param delay Milliseconds to wait before updating (default: 350ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

