import React from 'react';

const GameInfo = ({ currentTime, currentTurnCount, selectedTheme}) => {
  return (
    <>
    <div className='flex absolute top-[10vh] justify-around w-1/2 max-[425px]:w-full max-[320px]:flex-col max-[320px]:text-center m-4'>
        <h1 className='uppercase font-light tracking-wide'>Timer: {currentTime}</h1>
        <h1 className='uppercase font-light tracking-wide'>Turns: {currentTurnCount}</h1>
        <h1 className='uppercase font-light tracking-wide'>Theme: {selectedTheme}</h1>
    </div>
    </>
  );
};

export default GameInfo;