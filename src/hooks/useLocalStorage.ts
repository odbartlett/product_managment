import { useState, useCallback } from 'react';
import { storageGet, storageSet } from '../lib/storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() =>
    storageGet<T>(key, initialValue)
  );

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const next = typeof value === 'function' ? (value as (val: T) => T)(prev) : value;
      storageSet(key, next);
      return next;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}
