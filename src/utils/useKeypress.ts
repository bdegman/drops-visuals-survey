import { useEffect } from 'react';

export function useKeypress(
  key: string,
  callback: () => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    const handleKeypress = (event: KeyboardEvent) => {
      if (event.key === key) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeypress);
    return () => document.removeEventListener('keydown', handleKeypress);
  }, [key, callback, ...dependencies]);
}

export function useKeypressMultiple(
  keys: string[],
  callback: (key: string) => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    const handleKeypress = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        event.preventDefault();
        callback(event.key);
      }
    };

    document.addEventListener('keydown', handleKeypress);
    return () => document.removeEventListener('keydown', handleKeypress);
  }, [keys, callback, ...dependencies]);
}
