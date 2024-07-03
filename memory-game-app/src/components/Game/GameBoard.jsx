import React from 'react';
import Card from './Card';

const GameBoard = ({ cards, flippedCards, matchedCards, initialReveal, difficulty, handleCardClick, gameEnded, gameStatus }) => {
    function getGridScale(difficulty) {
        let baseScale = 0.12
        switch(difficulty){
          case 3:
            baseScale *= 1.6;
            break;
          case 4:
            baseScale *= 1.6;
            break;
          case 5:
            baseScale *= 1.25;
            break;
          case 6:
            baseScale *= 1.11;
            break;
          case 7:
            baseScale *= 0.88;
            break;
          default:
            break;
        }
        return Math.min(window.innerWidth * baseScale, 100);
    }
    console.log(difficulty + ' current difficulty');
  return (
    <div className={`flex items-center justify-center grid grid-cols-${difficulty} gap-3 mb-6 mt-2`}>
      {cards.map((symbol, index) => (
        <Card
          key={index}
          content={symbol}
          isFlipped={initialReveal || flippedCards.includes(index) || matchedCards.some((matched) => matched.indexes.includes(index))}
          isMatched={matchedCards.some((matched) => matched.indexes.includes(index))}
          onClick={() => handleCardClick(index)}
          cardSize={getGridScale(difficulty)}
          gameEnded={gameEnded}
          gameStatus={gameStatus}
        />
      ))}
    </div>
  );
};

export default GameBoard;