import React from 'react';
import MemoriaCard from '../../assets/memoriacard.svg';

function Card({ content, isFlipped, isMatched, onClick, cardSize, gameEnded, gameStatus }) {
    return (
        <div
            className={`group rounded-xl [perspective:1000px]`}
            onClick={() => !isMatched && onClick()}
            style={{
                height: `${cardSize}px`,
                width: `${cardSize}px`,
                opacity: isMatched ? 0.5 : 1,
                transition: 'opacity 0.25s ease-in',
            }}
        >
            <div
                className={`hover:scale-105 cursor-pointer relative h-full w-full rounded-xl shadow-xl transition-all duration-500 text-slate-200 [transform-style:preserve-3d] [backface-visibility:hidden] ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                } ${
                    gameEnded && gameStatus !== 1 ? `animate-rotateAndMoveDown` : ''
                }`}
            >
                <div className='absolute inset-0 flex rounded-xl justify-center items-center align-center' style={{ backgroundImage: `url(${MemoriaCard})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                    {isFlipped ? <img className='w-full h-full rounded-xl object-cover bg-cover' src={content} alt="Card Front"></img> : ''}
                </div>
                <div
                    className={`absolute inset-0 h-full w-full rounded-xl bg-slate-600 flex justify-center items-center align-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden] `}
                >
                    {isFlipped && <img className='w-full h-full rounded-xl object-cover bg-cover' src={content} alt="Card Back"></img>}
                </div>
            </div>
        </div>
    );
}

export default Card;
