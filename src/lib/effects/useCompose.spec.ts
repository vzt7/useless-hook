import { act, renderHook } from '@testing-library/react-hooks';

import { useCompose } from './useCompose';

const middlewares = [
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
  async (data, _next) => {
    data.a = await new Promise((r) => {
      setTimeout(() => r(0), 1000);
    });
  },
];

test('useCompose -> start', async () => {
  const { result } = renderHook(() => useCompose([...middlewares]));
  const [start] = result.current;

  expect(await start({ a: 1 })).toEqual({ a: 0 });
});

test('useCompose -> setMiddlewares', async () => {
  const { result } = renderHook(() => useCompose([() => 1]));

  act(() => {
    const [, setMidwares] = result.current;
    setMidwares([() => 2]);
  });

  const [start] = result.current;
  expect(await start({ a: 1 })).toEqual(2);
});
