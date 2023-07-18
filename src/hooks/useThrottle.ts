import type { ThrottleSettings } from 'lodash';
import throttle from 'lodash.throttle';
import { useEffect, useMemo, useRef } from 'react';

export interface ThrottleOptions extends ThrottleSettings {
  wait?: number;
}

type Noop = (...args: any[]) => any;

export default function useThrottle<T extends Noop = Noop>(
  fn: T,
  options?: ThrottleOptions,
) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const wait = options?.wait ?? 1000;

  const throttled = useMemo(
    () =>
      throttle(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args);
        },
        wait,
        options,
      ),
    [],
  );

  useEffect(
    () => () => {
      throttled.cancel();
    },
    [],
  );

  return {
    run: throttled,
    cancel: throttled.cancel,
    flush: throttled.flush,
  };
}
