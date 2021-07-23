/**
 * useCompose - 洋葱模型的函数调用
 * @param  {Middleware[]} middlewares
 *
 * @example
 * ```
const Example = () => {
  const compose = useCompose([
    async (data, next) => {
      console.log(1, data);
      await next();
      console.log(10, data);
      return data;
    },
    async (data, next) => {
      console.log(2, data);
      await next();
      console.log(20, data);
    },
    async (data, next) => {
      data.a = await new Promise((r) => {
        setTimeout(() => r(0), 1000);
      });
    },
  ]);
  useEffect(() => {
    compose({ a: 1 }).then((res) => { console.log(res) });
    // 1 {a: 1}
    // 2 {a: 1}
    // 20 {a: 0}
    // 10 {a: 0}
    // {a: 0}
  }, []);
  return <></>;
};
 * ```
 */

import { useCallback, useState } from 'react';

type DispatchCallback = (index?: number) => any;
type Middleware = (data: any, next: DispatchCallback) => any;

export const useCompose = (
  middlewares: Middleware[]
): [
  (data?: any) => Promise<CallableFunction>,
  (middlewares: Middleware[]) => any
] => {
  const [wares, setWares] = useState(middlewares ?? []);

  const start = useCallback(
    (data?: any) => {
      const dispatch: DispatchCallback = function (index = 0) {
        const next = wares[index + 1]
          ? () => dispatch(index + 1)
          : () => undefined;
        return Promise.resolve(wares[index](data, next));
      };
      return dispatch(0);
    },
    [wares]
  );

  return [start, setWares];
};
