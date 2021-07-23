// import React, { useRef, useState } from 'react';
// import test from 'ava';
// import { shallow } from 'enzyme';
// import { useIntersection } from './useIntersection';

import { shallow } from 'enzyme';
import React, { useRef, useState } from 'react';

import { useIntersection } from './useIntersection';

const Example = () => {
  const [emitted, setEmitted] = useState(false);
  const el = useRef();
  const { isIntersecting } = useIntersection(
    el,
    () => {
      setEmitted(true);
    },
    {
      once: true,
    }
  );

  return (
    <div id="wrapper" style={{ height: '100vh' }}>
      <div id="emitted">{`${emitted}`}</div>
      <div id="isIntersecting">{`${isIntersecting}`}</div>
      <div style={{ height: '2000px' }}></div>
      <div style={{ height: '100px' }} ref={el}>
        test
      </div>
    </div>
  );
};

test('useIntersection', async () => {
  const mockIntersectionObserver = jest.fn();
  const mockFns = {
    observe: jest.fn().mockReturnValue(null),
    unobserve: jest.fn().mockReturnValue(null),
    disconnect: jest.fn().mockReturnValue(null),
  };
  mockIntersectionObserver.mockReturnValue(mockFns);
  window.IntersectionObserver = mockIntersectionObserver;

  const Wrapper = shallow(<Example />);

  expect(Wrapper.find('#emitted').text()).toEqual('false');
  expect(Wrapper.find('#isIntersecting').text()).toEqual('false');

  // TODO:
});
