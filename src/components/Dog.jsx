import React from 'react'
import * as THREE from "three"
import {Canvas, useThree} from '@react-three/fiber'
import { DirectionalLight, Mesh } from 'three'
import { OrbitControls ,useGLTF,useTexture,useAnimations, Html} from '@react-three/drei' 
import { normalMap, sample, texture } from 'three/tsl'
import { useEffect } from "react"
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import { useRef } from 'react'




const Dog
 = ({isAnimating}) => {


  gsap.registerPlugin(useGSAP)
  

useGSAP(() => {
  if (isAnimating) {
    const tl = gsap.timeline();


    tl.to(dogModel.current.scene.position, {
      z: "-=0.75",
      y: "+=0.1",
      duration: 1,    
      ease: "power2.out"
    })

   
    .to(dogModel.current.scene.rotation, {
      x: `+=${Math.PI/6 }`,
      duration: 1.5,
      
    })
    
    .to(dogModel.current.scene.rotation, {
      y: `-=${Math.PI * 2}`,
      duration: 1.5,
      ease: "power2.inOut"
    }, "<") 

   
    .to(dogModel.current.scene.position, {
      x: 0,        
      z: "+=1.5",  
      y: "-=0.05",
      duration: 1.5,
      ease: "power2.inOut"
    }, "<")
  }
}, [isAnimating])

const model = useGLTF("/models/dog.drc.glb")
const[normalMap,sampleMatCap]=(useTexture(["/models/dog_normals.jpg","/matcaps/image1.png"]))
.map(texture=>{
  texture.flipY =false
 texture.colorSpace = THREE.SRGBColorSpace
 
 
  return texture
})


const[eyeMap]=(useTexture(["/matcaps/image2.png"]))
.map(texture=>{
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
})

const eyeMaterial = new THREE.MeshMatcapMaterial({
    matcap: eyeMap, 
     })
 

    const[ branchMap,branchNormalMap]=(useTexture(["/matcaps/branches_diffuse.jpg","/matcaps/branches_normals.jpg"]))
.map(texture=>{
  texture.flipY =false
  texture.colorSpace = THREE.SRGBColorSpace
  return texture 
})


 const dogMaterial =new THREE.MeshMatcapMaterial({
        normalMap:normalMap,
       matcap: sampleMatCap,
       
 })

 const branchMaterial =new THREE.MeshMatcapMaterial({
        normalMap:branchNormalMap,
        map: branchMap
 })

model.scene.traverse((child) => {
    if (child.isMesh) {
       
        

        
        if (child.name.includes("Reye") || child.name.includes("Leye")) {
             child.material = eyeMaterial;
        }
        
        else if (child.name.includes("DOG")) {
             child.material = dogMaterial;
        }
        
        else {
             child.material = branchMaterial;
        }
    }
})

    const dogModel = useRef(model)

useThree(({camera,scene,gl})=>{
    camera.position.z =0.5;
    gl.toneMapping = THREE.ReinhardToneMapping
    gl.outputColorSpace = THREE.SRGBColorSpace




})

const {actions} = useAnimations(model.animations,model.scene)

useEffect(()=>{

    actions["Take 001"].play()

},[actions])
  return (
   <>
         <primitive object={model.scene} position ={[-0.03 ,-0.58,0]} rotation ={[0,Math.PI/2.5,0]}/>
         <directionalLight position={[0,5,5]} color={0xFFFF00} intensity ={10}/>
        
   
   
   </>
  )
}


export default Dog
