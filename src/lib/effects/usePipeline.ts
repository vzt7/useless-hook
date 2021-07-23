import { useCallback, useState } from 'react';

/** typescript
 * usePipeline - 管道式的函数调用
 * @param  {CallableFunction[]} middlewares
 *
 * @example
 * ```
const Example = () => {
  const pipeline = usePipeline([
    (a) => {
      console.log(1, a); // 1 "begin arg"
      return "return1";
    },
    (b) => {
      console.log(2, b); // 2 "return 1"
      return "return2";
    },
    async (c) => {
      console.log(3, c); // 3 "return 2"
      const res = await new Promise((r) => {
        setTimeout(() => {
          r("delay arg");
        }, 1000);
      });
      return res;
    },
    (d) => {
      console.log(4, d); // 4 "delay arg"
      return "final";
    }
  ]);
  return (
    <div
      onClick={() => {
        const res = pipeline("begin arg");
        console.log("res", res); // "res" <Promise>
        res.then((r) => {
          console.log(r); // "final"
        });
      }}
    >
      test pipeline
    </div>
  );
}
 * ```
 */
export const usePipeline = (
  middlewares: CallableFunction[]
): [
  (...args: any[]) => Promise<CallableFunction>,
  (middlewares: CallableFunction[]) => any
] => {
  const [wares, setWares] = useState(middlewares ?? []);

  const dispatch: any = useCallback(
    async (index = 0, ...currArgs: any[]) => {
      if (index > wares.length - 1) {
        return currArgs[0];
      }
      const item = wares[index];
      const itemType = Object.prototype.toString.call(item);
      if (itemType === '[object Function]') {
        return await Promise.resolve(item(...[].concat(currArgs as any))).then(
          (res) => {
            return dispatch(index + 1, res);
          }
        );
      }
      return dispatch(index + 1, item);
    },
    [wares]
  );

  const start = useCallback(
    (...args: any[]) => {
      return dispatch(0, ...args);
    },
    [dispatch]
  );

  return [start, setWares];
};
