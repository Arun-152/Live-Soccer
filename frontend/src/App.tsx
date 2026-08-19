import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Live } from './pages/Live/Live';
import { Leagues } from './pages/Leagues/Leagues';
import { LeagueDetails } from './pages/LeagueDetails/LeagueDetails';
import { MatchDetails } from './pages/MatchDetails/MatchDetails';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<Live />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/league/:id" element={<LeagueDetails />} />
          <Route path="/match/:id" element={<MatchDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
