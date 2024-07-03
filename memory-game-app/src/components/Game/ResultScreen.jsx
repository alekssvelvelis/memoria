import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

function ResultScreen({ turns, time, pairs, gamestate, onPlayAgain, onNextLevel, difficulty, achievements, moneyEarned }) {
    const [gameStatus, setStatus] = useState('');

    useEffect(() => {
        switch (gamestate) {
            case 1:
                setStatus('won');
                break;
            case 0:
                setStatus('lost');
                break;
            default:
                break;
        }
    }, [gamestate]);

    return (    
        <>

            {gameStatus === 'won' && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
            <div className={`w-screen h-screen  fixed top-0 left-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300`}></div>
            <div className='border fixed z-[45] transition-all animate-fadeIn transform border-neutral-200 bg-[rgb(10,10,10)] rounded-xl w-[315px] flex text-white text-xl -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2'>
                <div className='w-full h-full relative flex flex-col justify-center items-center m-2'>
                <h1 className={`text-2xl tracking-wider uppercase m-2 ${gameStatus === 'won' ? 'text-green-500' : 'text-red-500'}`}>You {gameStatus}!</h1>
                    <div className='w-full justify-between flex my-1'>
                        <p className='uppercase font-light tracking-wider'>Turns:</p>
                        <p className='font-mono'>{turns}</p>
                    </div>
                    <div className='w-full justify-between flex my-1'>
                        <p className='uppercase font-light tracking-wider'>Time remaining:</p>
                        <p className='font-mono'>{time}</p>
                    </div>
                    <div className='w-full justify-between flex my-1'>
                        <p className='uppercase font-light tracking-wider'>Pairs matched:</p>
                        <p className='font-mono'>{Math.floor(pairs)}/{Math.floor(difficulty * difficulty / 3)}</p>
                    </div>
                    <div className='w-full justify-between flex my-1'>
                        <p className='uppercase font-light tracking-wider'>Money earned:</p>
                        <p className='font-mono'>{moneyEarned} 💸</p>
                    </div>
                    {achievements !== '' &&
                        <div className='w-full justify-between flex flex-col my-1'>
                            <p className='uppercase font-light tracking-wider'>Achievements earned:</p>
                            <p className='font-mono'>{achievements}</p>
                        </div>
                    }
                    <div className='w-full text-center justify-center items-center flex flex-col mt-2'>
                        <p
                            onClick={onPlayAgain}
                            className='mr-1 w-fit my-1 text-xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-wide'
                        >
                            Play again
                        </p>
                        {gameStatus === 'won' && difficulty !== 7 &&
                        <p
                            onClick={onNextLevel}
                            className='mr-1 w-fit text-xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-wide'
                        >
                            Next level
                        </p>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResultScreen;
