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
      </Routes>
    </BrowserRouter>
  )
}

export default App



// import { Route, Routes } from "react-router-dom";
// import { Login, Signup } from "./pages";
// import Home from "./pages/Home";

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;


// App.js
// import React, { useState } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import './App.css';
// import Topbar from './components/topbar/Topbar';
// import Home from './components/home/Home';
// import Login from './components/login/Login';
// import Signup from './components/register/Signup';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') ? true : false);

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('username');
//     setIsLoggedIn(false);
//   };

//     return (
//     <BrowserRouter>
//       <Topbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
//       <Routes>
//         {/* <Route path='/' element={<Startpage />}></Route> */}
//         <Route path='/register' element={<Signup />}></Route>
//         <Route path='/login' element={<Login onLogin={() => setIsLoggedIn(true)} />}></Route>
//         <Route path='/home' element={<Home />}></Route>
//         {/* <Route path='/history' element={<History />}></Route> */}
//         {/* <Route path='/report' element={<Report />}></Route> */}
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App;
