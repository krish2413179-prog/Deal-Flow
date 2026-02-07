import { Badge } from "@/components/ui/badge"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardImage() {
  const [shouldFlyAway, setShouldFlyAway] = useState(false)
  const navigate = useNavigate();

  const handleClick = () => {
    setShouldFlyAway(true)
    setTimeout(() => {
      navigate("/businessdash")
    }, 1000)
  }

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      {/* 1. I REMOVED THE INVISIBLE DIV THAT WAS HERE */}
      
      <img
        src="/assets/right.jpeg"
        alt="Event cover"
        className="relative z-0 aspect-video w-full object-cover rounded-t-lg"
      />
      <CardHeader>
        <CardTitle>Register your Services</CardTitle>
        <CardDescription>
          Setup your business on our platform to set up insurance agent
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full relative z-50" onClick={handleClick}>Register</Button>
      </CardFooter>
    </Card>
  )
}