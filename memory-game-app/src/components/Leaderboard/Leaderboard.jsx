import React, { useState, useEffect } from 'react';
import Header from '../Header';
import BackgroundReceiver from '../Backgrounds/BackgroundReceiver';

function Leaderboard(){

    const [gameThemes, setGameThemes] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState('3');
    const [selectedGameTheme, setSelectedGameTheme] = useState('1');
    const [playedGames, setPlayedGames] = useState([]);
    const [search, setSearch] = useState('');
    
    const isLoggedInObject = localStorage.getItem('token');
    const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;

    useEffect(() => {
        const fetchGameThemes = async () => {
            try {
                const response = await fetch('http://localhost/api/getGameThemes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setGameThemes(data.themes);
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching user info:', errorData);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchGameThemes();
    }, []);

    useEffect(() => {
        const fetchPlayedGames = async () => {
            try {
                const response = await fetch('http://localhost/api/getAllGames', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched games:", data);
                    setPlayedGames(data);
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching user info:', errorData);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchPlayedGames();
    }, [selectedGameTheme]);
    
    const difficulties = [
        { value: '3', label: '3x3' },
        { value: '4', label: '4x4' },
        { value: '5', label: '5x5' },
        { value: '6', label: '6x6' },
        { value: '7', label: '7x7' },
    ];

    const handleSearchReset = () => {
        setSearch('');
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;
    };

    let filteredGames = [];
    if (playedGames.games) {
        filteredGames = playedGames.games.filter(game => {
            if (selectedDifficulty && game.difficulty !== parseInt(selectedDifficulty)) {
                return false;
            }
            if (selectedGameTheme && game.theme_id !== parseInt(selectedGameTheme)) {
                return false;
            }
            if (search && !game.username.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }
            return true;
        });
    }

    filteredGames.sort((a, b) => {
        if (a.time_left !== b.time_left) {
            return b.time_left - a.time_left;
        }
        return a.turn_count - b.turn_count;
    });

    const getColorRanking = (rankingindex) => {
        switch (rankingindex) {
            case 3:
                return 'text-[#cd7f32] border-[#cd7f32]';
            case 2:
                return 'text-neutral-200 border-neutral-200';
            case 1:
                return 'text-yellow-500 border-yellow-500';
            default:
                return '';
        }
    };

    return(
        <>
        {isLoggedIn ? <BackgroundReceiver isLoggedIn={isLoggedIn}/> : <div className='w-screen min-h-screen overflow-y-scroll bg-[rgb(18,18,18,0.9)]'></div>}
        <Header/>
        <div className={`overflow-y-scroll min-h-screen absolute bg-[rgb(18,18,18,0.6)] flex justify-center w-full text-white flex-col`}>
                <div className='w-full h-[10vh]'></div>
                <div className='h-full w-[100%] flex flex-col justify-center items-center my-6'>
                    <div className='rounded-xl bg-[rgb(44,44,44,0.8)] w-[85%] flex flex-col m-4'>
                        <div className='w-full flex justify-around'>
                            <select
                                className='bg-[rgb(26,26,26,0.9)] flex font-light text-center max-[425px]:w-[25%] w-[10%] h-8 rounded-lg border border-neutral-200 m-2 hover:scale-105 focus:scale-105 transition-all transform duration-500 cursor-pointer'
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                            >
                                {difficulties.map(({ value, label }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <select
                                className='bg-[rgb(26,26,26,0.9)] flex font-light text-center max-[425px]:w-[25%] w-[10%] h-8 rounded-lg border border-neutral-200 m-2 hover:scale-105 focus:scale-105 transition-all transform duration-500 cursor-pointer'
                                value={selectedGameTheme}
                                onChange={(e) => setSelectedGameTheme(e.target.value)}
                            >
                                {gameThemes.map(({ id, theme }) => (
                                    <option key={id} value={id}>
                                        {theme}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            {filteredGames.length > 0 ? (
                                <table className='w-full h-full'>
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-4 font-light uppercase">Rank</th>
                                            <th scope="col" className="py-4 font-light uppercase">User</th>
                                            <th scope="col" className="py-4 font-light uppercase">Turns</th>
                                            <th scope="col" className="py-4 font-light uppercase">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {filteredGames.map((game, index) => (
                                        <tr key={game.id} className={`${getColorRanking(index+1)} border-b even:bg-[rgb(65,65,65,0.9)]`}>
                                            <td className="py-2 text-center">
                                                <span className={`${index < 3 ? 'ml-4' : ''}`}>
                                                    {index + 1}
                                                    {index < 3 && <span className="ml-1">&#9733;</span>}
                                                </span>
                                            </td>
                                            <td className="py-2 text-center">{game.username}</td>
                                            <td className="py-2 text-center">{game.turn_count}</td>
                                            <td className="py-2 text-center">{formatTime(game.time_left)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="w-full flex justify-center items-center text-center flex-grow my-8">
                                    <p className="font-light text-4xl tracking-widest uppercase flex">No results match your search</p>
                                </div>
                            )}
                        </div>
                        <div className='w-full flex justify-center mt-auto bg-[rgb(44,44,44,0.1)] rounded-lg'>
                            <div className='relative'>
                                <label htmlFor='search' onClick={handleSearchReset} className='absolute right-4 z-10 top-3 text-white cursor-pointer hover:scale-105'>X</label>
                                <input type='text' placeholder='Search...' id='search' value={search} onChange={(e) => setSearch(e.target.value)} className='rounded-lg h-8 pr-6 indent-2 text-start relative border border-neutral-200 m-2 hover:scale-105 focus:scale-105 transition-all transform duration-500 cursor-pointer bg-[rgb(26,26,26,0.9)] flex font-light'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Leaderboard;
