import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
function ProfileGameHistory(){
    const [gameHistory, setGameHistory] = useState([]);
    const isLoggedInObject = localStorage.getItem('token');
    const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;

    useEffect(() => {
        const handleGetGameHistory = async () => {
            try {
                const response = await fetch('http://localhost/api/getUserGames', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${isLoggedIn}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (JSON.stringify(data.games) !== JSON.stringify(gameHistory)) {
                        setGameHistory(data.games);
                    }
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching user info:', errorData);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        handleGetGameHistory();
    }, [isLoggedIn, gameHistory]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;
    };

    function getGameOutcome(outcome) {
        switch(outcome){
          case 0:
            return ('Loss');
          case 1:
            return ('Win');
          default:
            break;
        }
    }

    return(
        <>
        {gameHistory.length === 0 ? 
        <div className='flex flex-col text-center items-center justify-center'>
        <h1 className='uppercase font-light tracking-widest text-2xl mt-2'>You've played no games!</h1>
        <Link to="/play" className=' w-fit text-xl my-2 hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer rounded-sm uppercase tracking-wide'>Click here to start playing</Link>
        </div>
        : ''}
        {gameHistory.slice().reverse().map((info, index) => (  
            <div className='w-full flex flex-col items-center' key={info.id}>
                <div className='w-[95%] ml-0 max-[426px]:ml-5 flex justify-between'>
                    <h1 className='uppercase text-xl tracking-widest font-light text-center sm:text-start sm:ml-6 mt-4'>{`Game #${gameHistory.length - index}`}</h1> 
                    <h1 className='uppercase text-xl tracking-widest font-light text-center sm:text-start sm:ml-6 mt-4'>{info.theme.theme} {getGameOutcome(info.game_outcome)}</h1>    
                </div>
                <div className='w-[95%] flex flex-col sm:flex-row border border-neutral-300 rounded-lg m-2 sm:ml-4'>
                    <div className='w-full items-center sm:w-[30%] flex justify-center flex-col'>
                        <h1 className='uppercase text-2xl tracking-widest ml-2'>Difficulty</h1>
                        <p className='font-light text-lg text-[rgb(175,169,158)] mb-4 mt-2 ml-2'>{info.difficulty}x{info.difficulty}</p>
                    </div>
                    <div className='w-full items-center sm:w-[20%] flex justify-center items-center flex-col'>
                        <h1 className='uppercase text-2xl tracking-widest'>PAIRS</h1>
                        <p className='font-light text-lg text-[rgb(175,169,158)] mb-4 mt-2'>{info.pair_count}/{Math.floor(info.difficulty*info.difficulty/3)}</p>
                    </div>
                    <div className='w-full items-center sm:w-[20%] flex justify-center flex-col'>
                        <h1 className='uppercase text-2xl tracking-widest'>Turns</h1>
                        <p className='font-light text-lg uppercase text-[rgb(175,169,158)] mb-4 mt-2'>{info.turn_count}</p>
                    </div>
                    <div className='w-full items-center sm:w-[20%] flex justify-center flex-col'>
                        <h1 className='uppercase text-2xl tracking-widest'>Time</h1>
                        <p className='font-light text-lg uppercase text-[rgb(175,169,158)] mb-4 mt-2'>{formatTime(info.time_left)}</p>
                    </div>
                    <div className='w-full items-center sm:w-[30%] flex justify-center flex-col'>
                        <h1 className='uppercase text-2xl tracking-widest'>Reward</h1>
                        <p className='font-light text-lg uppercase text-[rgb(175,169,158)] mb-4 mt-2'>{info.money_earned} 💸</p>
                    </div>
                </div>
            </div>
        ))}
        </>
    );
}

export default ProfileGameHistory;
