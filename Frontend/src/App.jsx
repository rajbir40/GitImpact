import Login from './User Tools/Login/Login';
import Signup from './User Tools/Signup';
import UserProfile from './User Tools/Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './User Tools/Home/Home'
import Navbar from './User Tools/Navbar';
import Predict from './User Tools/Predict';
import Inventory from './User Tools/Inventory';
import VolunteerDonationSystem from './User Tools/VolunteerManage';
function App() {

  return (
    <Router>
      <Navbar/>
     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/profile' element={<UserProfile/>}/>
      <Route path='/predict' element={<Predict/>}/>
      <Route path='/inventory' element={<Inventory/>}/>
      <Route path='/v-manage' element={<VolunteerDonationSystem/>}/>
     </Routes>
    </Router>
  )
}

export default App
