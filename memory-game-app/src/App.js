import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authorization from './views/Authorization.jsx';
import Profile from './views/Profile.jsx';
import StartGame from './views/StartGame.jsx';
import NotFound from './views/NotFoundPage.jsx';
import LeaderboardPage from './views/LeaderboardPage.jsx';
import Home from './views/Home.jsx';

function App() {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <>
      <Router>
        <div className='w-screen overflow-y-scroll flex bg-[rgb(18,18,18,0.9)]'>
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/Authorize" element={<Authorization />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/play" element={<StartGame />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </>
            ) : (
              <>
                <Route path="/Authorize" element={<Authorization />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
