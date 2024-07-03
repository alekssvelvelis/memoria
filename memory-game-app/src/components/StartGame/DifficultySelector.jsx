import React, { useState, useEffect } from 'react';
import Header from '../Header';
const DifficultySelector = ({ onSelectDifficulty, theme, handleResetTheme }) => {
  const isLoggedInObject = localStorage.getItem('token');
  const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;
  const [userClearedLevels, setUserClearedLevels] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(3);
  const [allDifficultyLevels, setAllDifficultyLevels] = useState([3, 4, 5, 6, 7]);

  useEffect(() => {
    const fetchUserClearedLevels = async () => {
      try {
        const response = await fetch(`http://localhost/api/getClearedLevels?theme=${theme}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${isLoggedIn}`
          },
        });
        const responseData = await response.json();
        if (!response.ok) {
          console.error('Error:', responseData);
        } else {
          setUserClearedLevels(responseData.cleared_levels);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserClearedLevels();
  }, [isLoggedIn, theme]);
  let maxUnlockedDifficulty = 3;
  if (userClearedLevels.length > 0) {
    const maxClearedDifficulty = Math.max(...userClearedLevels.map(level => level.difficulty));
    maxUnlockedDifficulty = maxClearedDifficulty + 1;
  }
  const unlockedLevels = allDifficultyLevels.filter(difficulty => difficulty <= maxUnlockedDifficulty);

  const handleStartGame = () => {
    onSelectDifficulty(selectedDifficulty);
  };

  const resetTheme = () => {
    handleResetTheme();
  };

  const getDifficultyName = (difficulty) => {
    switch (difficulty) {
      case 3:
        return 'Beginner';
      case 4:
        return 'Intermediate';
      case 5:
        return 'Advanced';
      case 6:
        return 'Expert';
      case 7:
        return 'Master';
      default:
        return 'Unknown';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 3:
        return '#C564D2';
      case 4:
        return '#9E35B5';
      case 5:
        return '#720E98';
      case 6:
        return '#4D0A76';
      case 7:
        return '#320652';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <Header onPlayClick={resetTheme} />
      <div className="overflow-y-scroll min-h-screen bg-[rgb(18,18,18,0.9)] flex items-center justify-center w-full text-white">
        <div className='h-full w-[95%] flex flex-col justify-center items-center'>
          <label className='uppercase font-light tracking-widest text-2xl my-4 z-[1]'>Select Difficulty:</label>
          
          {allDifficultyLevels.map((difficulty) => (
            <div
              key={difficulty}
              className={`w-[300px] transition-all transform duration-500 ${
                unlockedLevels.includes(difficulty) ? 'hover:scale-105 cursor-pointer' : ''
              } ${selectedDifficulty === difficulty ? 'scale-105' : ''} relative m-2 border border-neutral-200`}
              style={{ 
                backgroundColor: selectedDifficulty === difficulty ? getDifficultyColor(difficulty) : '',
                opacity: unlockedLevels.includes(difficulty) ? '1' : '0.5', // Adjust opacity based on whether the level is unlocked
              }}
              onClick={() => {
                if (unlockedLevels.includes(difficulty)) {
                  setSelectedDifficulty(difficulty);
                }
              }}
            >
              <div className={`w-full text-2xl ${selectedDifficulty === difficulty ? 'opacity-100' : 'opacity-80'}`}>
                <div>
                  <h1 className='text-center uppercase font-light tracking-widest'>
                    {getDifficultyName(difficulty)}
                  </h1>
                </div>
              </div>
            </div>
          ))}
          <button className='w-fit z-[10] mt-2 text-xl hover:bg-white hover:text-black duration-500 transition-bg cursor-pointer p-1 rounded-sm uppercase tracking-widest' onClick={handleStartGame}>Start Game</button>
        </div>
      </div>
    </>
  );
};

export default DifficultySelector;

