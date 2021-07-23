import { act, renderHook } from '@testing-library/react-hooks';

import { usePipeline } from './usePipeline';

const middlewares = [
  (a) => {
    console.log(1, a); // 1 "begin arg"
    return 'return1';
  },
  (b) => {
    console.log(2, b); // 2 "return 1"
    return 'return2';
  },
  async (c) => {
    console.log(3, c); // 3 "return 2"
    const res = await new Promise((r) => {
      setTimeout(() => {
        r('delay arg');
      }, 1000);
    });
    return res;
  },
  (d) => {
    console.log(4, d); // 4 "delay arg"
    return 'final';
  },
];

test('useCompose -> start', async () => {
  const { result } = renderHook(() => usePipeline([...middlewares]));
  const [start] = result.current;

  expect(await start({ a: 1 })).toBe('final');
});

test('useCompose -> setMiddlewares', async () => {
  const { result } = renderHook(() => usePipeline([() => 1]));

  act(() => {
    const [, setMidwares] = result.current;
    setMidwares([() => 2]);
  });

  const [start] = result.current;
  expect(await start({ a: 1 })).toBe(2);
});
