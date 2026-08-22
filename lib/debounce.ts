export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
