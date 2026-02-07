import { useState } from 'react'

import { Canvas } from '@react-three/fiber'
import './App.css'
import Landing from './pages/landing'
import Dashboard from './pages/Dashboard'
import { Routes, Route, useLocation } from 'react-router-dom'
import BusinessDash from './pages/BusinessDash'
import { ConsumerDash } from './pages/ConsumerDash'


function App() {
  const location = useLocation()

  
  return (
    <>
      <main className="relative w-screen h-screen">
      
        <Canvas style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0, 
          backgroundImage: `url(/matcaps/background.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          
        }}>
          
          
        </Canvas>
       <Routes>
        <Route path="/" element={<Landing  />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/businessdash" element={<BusinessDash/>}/>
        <Route path="/consumerdash" element={<ConsumerDash/>}/> 
      </Routes>
        

      </main>
    </>
  )
}

export default App
