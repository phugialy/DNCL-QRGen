import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const safeWindow = typeof window === 'undefined' ? null : window;

const getStorage = () => {
  if (!safeWindow) {
    return null;
  }

  try {
    return safeWindow.localStorage;
  } catch (error) {
    console.warn('localStorage is unavailable:', error);
    return null;
  }
};

const defaultSerializer = (value) => JSON.stringify(value);
const defaultParser = (value) => JSON.parse(value);

export default function usePersistentState(
  key,
  defaultValue,
  options = {},
) {
  const storageRef = useRef(getStorage());

  const serializer = options.serializer || defaultSerializer;
  const parser = options.parser || defaultParser;

  const readStoredValue = useCallback(() => {
    const storage = storageRef.current;

    if (!storage) {
      return defaultValue;
    }

    try {
      const raw = storage.getItem(key);

      if (raw === null || raw === undefined) {
        return defaultValue;
      }

      return parser(raw);
    } catch (error) {
      console.warn(`Failed to read "${key}" from localStorage:`, error);
      return defaultValue;
    }
  }, [defaultValue, key, parser]);

  const [value, setValue] = useState(() => readStoredValue());

  const writeValue = useCallback(
    (nextValue) => {
      setValue((previousValue) => {
        const resolvedValue = typeof nextValue === 'function'
          ? nextValue(previousValue)
          : nextValue;

        const storage = storageRef.current;

        if (!storage) {
          return resolvedValue;
        }

        try {
          if (resolvedValue === undefined) {
            storage.removeItem(key);
          } else {
            storage.setItem(key, serializer(resolvedValue));
          }
        } catch (error) {
          console.warn(`Failed to persist "${key}" to localStorage:`, error);
        }

        return resolvedValue;
      });
    },
    [key, serializer],
  );

  const reset = useCallback(() => {
    writeValue(defaultValue);
  }, [defaultValue, writeValue]);

  useEffect(() => {
    const storage = storageRef.current;

    if (!storage) {
      return undefined;
    }

    const handleStorage = (event) => {
      if (event.key !== key) {
        return;
      }

      setValue(event.newValue ? parser(event.newValue) : defaultValue);
    };

    safeWindow?.addEventListener('storage', handleStorage);

    return () => {
      safeWindow?.removeEventListener('storage', handleStorage);
    };
  }, [defaultValue, key, parser]);

  return useMemo(
    () => [value, writeValue, reset],
    [reset, value, writeValue],
  );
}

