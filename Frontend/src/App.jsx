import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './pages/Upload';
import Results from './pages/Results';
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import FeatureSection from './components/FeatureSection';
import Workflow from './components/WorkFlow';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <Routes>
          <Route path="/" element={[<HeroSection />,<FeatureSection />,<Workflow />]} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;