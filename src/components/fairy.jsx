import React, { useRef, useEffect } from 'react'
import * as THREE from "three"
import { useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, Environment } from '@react-three/drei' 
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const Fairy = ({ shouldFlyAway = false }) => {

  const model = useGLTF("/models/fairy.glb")
  const fairyRef = useRef() 

  const { actions } = useAnimations(model.animations, fairyRef)

  
  useEffect(() => {
    const idleAction = actions["10616_XiaoQiao_Show4 (merge)|Idleshow|Base Layer"]; 
    
    if (idleAction) {
        idleAction.reset().fadeIn(0.5).play();
    }
  }, [actions])


  useThree(({ camera, gl }) => {
    camera.position.z = 1; 
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace
  })


  // Initial entrance animation
  useGSAP(() => {
    if (fairyRef.current) {
      const tl = gsap.timeline(); 
     
     
      tl.fromTo(fairyRef.current.position, 
        { x: -10, y: -30, z: -10 }, 
        { 
          x: 0,           
          y: -8,          
          z: -10,
          duration: 3,    
          ease: "power2.out" 
        })
        
        .to(fairyRef.current.position, {
          y: -7.5,
          duration: 1.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        })
        
      
      gsap.to(fairyRef.current.rotation, {
        y: Math.PI / 6 + 0.1,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      })
    }
  }, [])

  
  useEffect(() => {
    if (shouldFlyAway && fairyRef.current) {
      gsap.killTweensOf(fairyRef.current.position)
      gsap.killTweensOf(fairyRef.current.rotation)
      
      const tl = gsap.timeline()
      
     
      tl.to(fairyRef.current.position, {
        y: 30,
        z: 5,
        duration: 2.5,
        ease: "power2.in"
      })
      .to(fairyRef.current.rotation, {
        y: Math.PI * 2,
        duration: 2.5,
        ease: "power1.inOut"
      }, 0)
    }
  }, [shouldFlyAway])

  return (
    <>
      <primitive 
        ref={fairyRef}
        object={model.scene} 
        position={[0, -30, -10]} 
        rotation={[0, Math.PI / 6, 0]} 
        scale={600} 
      />

      <directionalLight position={[0, 5, 5]} color={0xFFFF00} intensity={5} />
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
    </>
  )
}

export default Fairy