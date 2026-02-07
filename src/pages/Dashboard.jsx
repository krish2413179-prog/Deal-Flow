import { Canvas } from '@react-three/fiber'
import React from 'react'
import Fairy from '@/components/fairy'
import { CardImage } from '@/components/card'
import { CardImage2     } from '@/components/card2'
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  return (
   
    <div className="relative w-screen h-screen">

        
        <Canvas className="w-full h-full block z-10 ">
            
            <Fairy isAnimating={true} /> 
        </Canvas>

        
       <div  className='flex absolute top-0 left-0 h-screen min-w-1/2  p-6 text-white  justify-center items-center  '>
       <CardImage ></CardImage>
       </div>
       <div className=' flex absolute top-0 right-0 h-screen min-w-1/2 z-20 p-6 text-white  justify-center items-center '>
       <CardImage2></CardImage2>
       </div>
    </div>
  )
}

export default Dashboard