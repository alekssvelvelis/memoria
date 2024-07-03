import React, { useState } from 'react';
import DifficultySelector from '../components/StartGame/DifficultySelector';
import GameThemeSelector from '../components/StartGame/GameThemeSelector';
import MemoryGame from '../components/Game/MemoryGame';
import Header from '../components/Header';
import BackgroundReceiver from '../components/Backgrounds/BackgroundReceiver';

function StartGame(){
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);

    const isLoggedInObject = localStorage.getItem('token');
    const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;

    const handleSelectDifficulty = (difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    const handleThemeSelect = (theme) => {
        setSelectedTheme(theme);
    }

    const resetGame = () => {
      setSelectedTheme(null);
      setSelectedDifficulty(null);
    };

    return (
        <>
          <Header onPlayClick={resetGame}/>
          <BackgroundReceiver isLoggedIn={isLoggedIn}/>
          {selectedTheme ? (
            selectedDifficulty ? (
              <MemoryGame difficulty={selectedDifficulty} theme={selectedTheme} />
            ) : (
              <DifficultySelector onSelectDifficulty={handleSelectDifficulty} theme={selectedTheme}/>
            )
          ) : (
            <GameThemeSelector onSelectTheme={handleThemeSelect} />
          )}
        </>
      );
};

export default StartGame;