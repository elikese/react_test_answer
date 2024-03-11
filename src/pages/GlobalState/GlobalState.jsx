import React, { useState } from 'react';
import Component1 from './components/Component1/Component1';
import { useRecoilState } from 'recoil';
import { inputState } from './atoms/inputState';

function GlobalState() {
  const [text, setText] = useRecoilState(inputState);

  return (
    <div>
      <h1>{text}</h1>
      <Component1 />
    </div>
  );
}

export default GlobalState;