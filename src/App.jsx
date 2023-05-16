import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './pages/home/Home';
import List from './pages/list/List';
import Login from './pages/login/Login';
import Single from './pages/single/Single';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import NewPage from './pages/new/NewPage';

function App() {

  return (
    <>
      {/* <h1>Dashboard Implementation</h1>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      <Router>
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='users'>
              <Route index element={<List />} />
              <Route path=':userId' element={<Single />} />
              <Route path='new' element={<NewPage />} />
            </Route>
          </Route>
        </Routes>

      </Router>
    </>
  )
}
 
export default App
