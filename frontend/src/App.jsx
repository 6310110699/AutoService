import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './components/register/Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Topbar from './components/topbar/Topbar'
import Startpage from './components/startpage/Startpage'
import Login from './components/login/Login'
import Home from './components/home/Home'
import History from './components/history/History'
import Report from './components/report/Report'
import EmployeeManagement from './components/informationmanagement/employeemanagement/EmployeeManagement'
import TabView from './components/informationmanagement/tabview/TabView'
import SpareManagement from './components/informationmanagement/sparemanagement/SpareManagement'
import CarRegistration from './components/home/CarRegistration'
import Receipt from './components/home/Receipt'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };


  return (
    <BrowserRouter>
      <Topbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path='/' element={<Startpage />}></Route>
        <Route path='/register' element={<Signup />}></Route>
        <Route path='/login' element={<Login onLogin={() => setIsLoggedIn(true)} />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/history' element={<History />}></Route>
        <Route path='/report' element={<Report />}></Route>
        <Route path='/infomanage' element={<TabView />} />
        <Route path='/employee' element={<EmployeeManagement />} />
        <Route path='/spare' element={<SpareManagement />} />
        <Route path='/carregis' element={<CarRegistration />} />
        <Route path='/receipt/:customerId' element={<Receipt />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App