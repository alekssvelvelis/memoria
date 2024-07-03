import React, { useState } from 'react';
import Header from '../Header';
const GameThemeSelector = ({ onSelectTheme }) => {
  const theme = ['futuristic', 'historic', 'nature', 'animal'];
  const [selectedTheme, setSelectedTheme] = useState(theme[0]);

  const handlePickTheme = () => {
    onSelectTheme(selectedTheme);
  };

  const backgroundImageMap = {
    historic: 'images/historic/historic.jpeg',
    futuristic: 'images/futuristic/futuristic.jpeg',
    nature: 'images/nature/nature.jpeg',
    animal: 'images/animal/animal.jpeg',
  };
  
  return (
    <>
      <Header/>
      <div className="overflow-y-scroll min-h-screen bg-[rgb(18,18,18,0.9)] flex flex-col items-center justify-center w-full text-white">
      <div className='w-full h-[10vh]'></div>
        <div className='h-full w-[95%] flex flex-col justify-center items-center'>
          <label className='uppercase tracking-widest text-3xl my-4 z-[1]'>Pick a theme:</label>
          <div className='flex flex-wrap gap-[25px] justify-center items-center'>
            {theme.map((genre) => (
                <div className={`overflow-hidden grid h-[500px] w-[300px] relative place-items-center cursor-pointer mb-8`}>
                    <div className={`before:absolute before:content-[""] before:top-[-40%] before:left-[25%] before:w-[50%] z-50 before:h-[180%] before:bg-[#fff] before:hover:running before:hover:animate-spin after:absolute after:content-[""] after:inset-[3px] after:bg-[#222]`}>
                        <span className='flex items-center justify-center w-[100%] h-[100%] top-[0%] left-[0%] absolute z-10'>
                            <div
                                key={genre}
                                value={genre}
                                onClick={() => onSelectTheme(genre)}
                                className='w-full relative h-[95%] hover:text-2xl m-4 rounded-sm text-center justify-center items-center flex cursor-pointer hover:scale-100 transition-all transform duration-500 object-cover bg-cover'
                            >
                                <div
                                    className='w-full h-full bg-cover opacity-60 hover:opacity-80 transition-all transform duration-500'
                                    style={{ backgroundImage: `url(${backgroundImageMap[genre]})` }}
                                >
                                </div>
                                <div className='absolute'>
                                    <h1 className='tracking-widest uppercase font-light'>{genre}</h1>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
                    
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameThemeSelector;
