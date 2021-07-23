/**
 * 对 IntersectionObserver 的封装
 * @param  {MutableRefObject<unknown>} el
 * @param  {CallableFunction} callback
 * @param  {{readonlyonce:boolean;}} options
 *
 * @example
 * ```
const Example = () => {
  const wrapper = useRef();
  useIntersection(wrapper, () => { console.log('emit'); }, { once: true });
  return <div ref={wrapper}></div>
}
 * ```
 */

import { MutableRefObject, useEffect, useMemo, useState } from 'react';

export const useIntersection = (
  el: MutableRefObject<unknown>,
  callback: CallableFunction,
  options?: {
    readonly once?: boolean;
  }
) => {
  const hasIntersectionOb = window && 'IntersectionObserver' in window;
  if (!hasIntersectionOb) {
    console.warn(
      'useIntersection: IntersectionObserver is not support in current environment!'
    );
    return {};
  }

  const [isIntersecting, setIsIntersecting] = useState(false);
  const intersectionOb = useMemo(() => {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { target } = entry;
        if (entry.isIntersecting) {
          callback(target);
          if (options?.once) {
            intersectionOb.unobserve(target);
          }
        }
        setIsIntersecting(entry.isIntersecting);
      });
    });
  }, [callback, options]);

  useEffect(() => {
    if (el.current) {
      [].concat(el.current).forEach((item) => {
        intersectionOb.observe(item);
      });
    }
  }, [el.current, intersectionOb]);

  return { isIntersecting };
};
