import React from 'react';
import { useRecoilState } from 'recoil';
import { inputState } from '../../atoms/inputState';

function Component4() {
  const [text, setText] = useRecoilState(inputState);

  const handleTextChange = (e) => {
    setText(() => e.target.value)
  }
  return (
    <div>
      <input type="text" value={text} onChange={handleTextChange} />
    </div>
  );
}

export default Component4;