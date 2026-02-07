import { Canvas } from '@react-three/fiber'
import React, { useState } from 'react'
import Fairy from '@/components/fairy'
import { CardImage } from '@/components/card'
import { CardImage2 } from '@/components/card2'
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const [shouldFlyAway, setShouldFlyAway] = useState(false)
  const navigate = useNavigate()

  const handleCardClick = (route) => {
    setShouldFlyAway(true)
    // Navigate after animation starts
    setTimeout(() => {
      navigate(route)
    }, 1000)
  }

  return (
    <div className="relative w-screen h-screen">
        <Canvas className="w-full h-full block z-10">
            <Fairy shouldFlyAway={shouldFlyAway} /> 
        </Canvas>

       <div className='flex absolute top-0 left-0 h-screen min-w-1/2 p-6 text-white justify-center items-center'>
         <div onClick={() => handleCardClick('/business')}>
           <CardImage />
         </div>
       </div>
       <div className='flex absolute top-0 right-0 h-screen min-w-1/2 z-20 p-6 text-white justify-center items-center'>
         <div onClick={() => handleCardClick('/consumer')}>
           <CardImage2 />
         </div>
       </div>
    </div>
  )
}

export default Dashboard