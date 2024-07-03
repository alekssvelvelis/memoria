import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import GameInfo from './GameInfo';
import ResultScreen from './ResultScreen';

const isLoggedInObject = localStorage.getItem('token');
const isLoggedIn = isLoggedInObject ? JSON.parse(isLoggedInObject).value : null;

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const generateCards = (difficulty, theme) => {
  const symbols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '1', '12', '13', '14', '15', '16'];
  const cardCount = difficulty * difficulty;
  const pairsCount = cardCount / 3;
  const jokerCount = cardCount % 3;

  let cards = symbols.slice(0, pairsCount).flatMap((symbol) => Array(3).fill(symbol));
  cards = cards.concat(Array(jokerCount).fill('Joker'));
  cards = shuffleArray(cards);

  const imageFolderPath = `images/${theme}/`;
  return cards.map((card) => (card === 'Joker' ? `/${imageFolderPath}joker.jpeg` : `/${imageFolderPath}${card}.jpeg`));
};

const MemoryGame = ({ difficulty, theme }) => {
  function calculateTimeForDifficulty(difficulty) {
    let timeInSeconds;
    
    switch (difficulty) {
        case 3:
            timeInSeconds = 15;
            break;
        case 4:
            timeInSeconds = 60;
            break;
        case 5:
            timeInSeconds = 180;
            break;
        case 6:
            timeInSeconds = 240;
            break;
        case 7:
            timeInSeconds = 300;
            break;
        default:
            timeInSeconds = 240;
            break;
    }
    
    return timeInSeconds;
}
  const [totalPairs, setTotalPairs] = useState(difficulty * difficulty / 3);
  const [diffToPlay, setDiffToPlay] =  useState(difficulty)
  const [cards, setCards] = useState(generateCards(diffToPlay, theme));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [initialReveal, setInitialReveal] = useState(true);
  const [timeLeft, updateTimeLeft] = useState(calculateTimeForDifficulty(diffToPlay));
  const [currentTurnCount, setTurnCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameOutcome, setGameOutcome] = useState(0);
  const [achievements, setAchievements] = useState('');

  useEffect(() => { // for starting the game originally
    setCards(generateCards(diffToPlay, theme));
    setFlippedCards([]);
    setMatchedCards([]);
    setInitialReveal(true);

    const revealTimeout = setTimeout(() => {
      setInitialReveal(false);
    }, diffToPlay > 6 ? 10000 : diffToPlay > 5 ? 7000 : diffToPlay > 4 ? 6000 : 3000);

    return () => clearTimeout(revealTimeout);
  }, [diffToPlay, theme]);

  useEffect(() => { //for ending the game
    if (!initialReveal && timeLeft > 0 && !gameEnded) {
      if (matchedCards.length === totalPairs) {
        console.log('You win!');
        setGameEnded(true);
        setGameOutcome(1);
        handleSaveGame(1);
      } else {
        const remainingUnmatchedCards = cards.filter(
          (symbol, index) =>
            !flippedCards.includes(index) &&
            !matchedCards.some((matched) => matched.indexes.includes(index))
        );
        if (remainingUnmatchedCards.length === 1 && remainingUnmatchedCards[0] === `/images/${theme}/joker.jpeg`) {
          console.log('You win! Only the Joker is left.');
          setGameEnded(true);
          setGameOutcome(1);
          handleSaveGame(1);
        }
      }
    } else if (!initialReveal && (timeLeft === 0 || timeLeft < 0)) {
      console.log('You lose!');
      setGameEnded(true);
      setGameOutcome(0);
      handleSaveGame(0);
    }
  }, [initialReveal, timeLeft, matchedCards, totalPairs, cards, flippedCards]);


  useEffect(() => { //for checking matches and playing the game
    if (!initialReveal && timeLeft > 0 && gameEnded !== true) {
        const timerInterval = setInterval(() => {
          if (gameEnded !== true) {
            updateTimeLeft((prevTime) => prevTime - 1);
          }
        }, 1000);
        return () => clearInterval(timerInterval);
    }
  }, [initialReveal, timeLeft, gameEnded, matchedCards, totalPairs]);
  const handleCardClick = (index) => {
    if (initialReveal || gameEnded) {
      return;
    }
    // Check if the clicked card is already flipped
    if (flippedCards.includes(index) || flippedCards.length === 3 || matchedCards.some((matched) => matched.indexes.includes(index))) {
      return;
    }
    // Flip the clicked card
    setFlippedCards([...flippedCards, index]);

    if (flippedCards.length === 2) {
      // Check for a match
      const card1 = cards[flippedCards[0]];
      const card2 = cards[flippedCards[1]];
      const card3 = cards[index];

      if (card1 === card2 && card2 === card3) {
        const matchedContent = [card1, card2, card3];
        const matchedIndexes = [...flippedCards, index];
        setMatchedCards((prevMatchedCards) => [...prevMatchedCards, { content: matchedContent, indexes: matchedIndexes }]);
      }
      setTurnCount((prevTurnCount) => prevTurnCount + 1);

      setTimeout(() => {
        setFlippedCards([]);
      }, 500);

    }
  };

  const resetGame = (newDifficulty, newTheme) => {
    setGameEnded(false);
    setTurnCount(0);
    updateTimeLeft(calculateTimeForDifficulty(newDifficulty));
    setFlippedCards([]);
    setMatchedCards([]);
    setInitialReveal(true);
    setTotalPairs(newDifficulty * newDifficulty / 3);
    setCards(generateCards(newDifficulty, newTheme));
  
    const revealTimeout = setTimeout(() => {
      setInitialReveal(false);
    }, newDifficulty > 6 ? 10000 : newDifficulty > 5 ? 7000 : newDifficulty > 4 ? 6000 : 3000);
    
  
    return () => clearTimeout(revealTimeout);
  };
  
  const handlePlayAgain = () => {
    resetGame(diffToPlay, theme);
  };
  
  const handleNextLevel = () => {
    const nextDifficulty = diffToPlay + 1;
    setDiffToPlay(nextDifficulty);
    resetGame(nextDifficulty, theme);
  };
  
  const formattedTime = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;

  const handleSaveGame = async (outcome) => {
    const formData = {
      turn_count: currentTurnCount,
      pair_count: matchedCards.length,
      time: timeLeft,
      difficulty: diffToPlay,
      theme: theme,
      gameOutcome: outcome,
      moneyEarned: 100+timeLeft*2+matchedCards.length*10,
    };
    
    try{
      const response = await fetch('http://localhost/api/save-played-game', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${isLoggedIn}`
          },
          body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (!response.ok) {
          console.error('Error:', responseData);
      } else {
          console.log('game saved successfully');
      }
    } catch (error) {
        console.error('Error:', error);
    }

    try{
      const response = await fetch('http://localhost/api/saveClearedLevel', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${isLoggedIn}`
          },
          body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (!response.ok) {
          console.error('Error:', responseData);
      } else {
          console.log(responseData.message);
      }
    } catch (error) {
        console.error('Error:', error);
    }

    try{
      const response = await fetch('http://localhost/api/checkAndAwardAchievement', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${isLoggedIn}`
          },
          body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (!response.ok) {
          console.error('Error:', responseData);
      } else {
          console.log(responseData);
          if(responseData.message === 'User already has all available achievements or no achievements were awarded'){
            setAchievements('');
          }else{
            setAchievements(responseData.message);
          }
      }
    } catch (error) {
        console.error('Error:', error);
    }
    try{
      const moneyEarned = 100+timeLeft*2+matchedCards.length*10
      const response = await fetch('http://localhost/api/updateUserMoney', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${isLoggedIn}`
          },
          body: JSON.stringify({moneyEarned}),
      });
      const responseData = await response.json();
      if (!response.ok) {
          console.error('Error:', responseData);
      }else{
        console.log(responseData.message);
      }
    } catch (error) {
        console.error('Error:', error);
    }
  }

  return (
    <>
    <div className="overflow-y-scroll min-h-screen bg-[rgb(18,18,18,0.9)] flex justify-center w-full text-white flex-col">
      <div className='w-full h-[10vh]'></div>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <div className='flex flex-col mt-12 w-full  h-full items-center justify-center overflow-x-hidden'>
          <GameInfo currentTime={formattedTime} currentTurnCount={currentTurnCount} selectedTheme={theme}/>
          {gameEnded === true && <ResultScreen time={formattedTime} turns={currentTurnCount} gamestate={gameOutcome} pairs={matchedCards.length} onPlayAgain={handlePlayAgain}
                        onNextLevel={handleNextLevel} difficulty={diffToPlay} achievements={achievements} moneyEarned={100+timeLeft*2+matchedCards.length*10}/>}
          <GameBoard cards={cards} flippedCards={flippedCards} matchedCards={matchedCards} initialReveal={initialReveal} difficulty={diffToPlay} handleCardClick={handleCardClick} gameEnded={gameEnded} gameStatus={gameOutcome}/>
        </div>
      </div>
    </div>
    </>
  );
};

export default MemoryGame;