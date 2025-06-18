import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import LandingPage from "./components/landingPage";

function App() {

  return (
    <Router>
     <Routes>
      <Route path="/dashboard/:username" element={<Home/>} />
      <Route path="/" element={<LandingPage/>} />
     </Routes>
    </Router>
  )
}

export default App
