import React, { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import CreateIps from './CreateIps'
import AllIps from './Ips'
import PingIp from './PingIP'
import UpdateIps from './UpdateIps'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllIps />}></Route>
        <Route path="/create" element={<CreateIps />}></Route>
        <Route path="/update/:id" element={<UpdateIps />}></Route>
        <Route path="/ping" element={<PingIp />}></Route>
      </Routes>
      </BrowserRouter>
      <div className="categories-box">
        <h2>Categories</h2>
        <ul>
          <li>Category 1</li>
          <li>Category 2</li>
          <li>Category 3</li>
        </ul>
      </div>
    </div>
  )
}

export default App;