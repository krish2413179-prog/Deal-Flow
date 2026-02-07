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
    // Wait for animation (1000ms) to finish before navigating
    setTimeout(() => {
      navigate("/businessdash")
    }, 1000)
  }

  return (
    <Card 
      className={`
        relative mx-auto w-full max-w-sm pt-0 
        transition-all duration-1000 ease-in-out  // 1. Enable transitions
        ${shouldFlyAway 
          ? "-translate-y-[150%] opacity-0 rotate-12 scale-75" // 2. Fly up, fade out, rotate, shrink
          : "translate-y-0 opacity-100 scale-100" // 3. Normal state
        }
      `}
    >
      <div className="absolute inset-0 aspect-video" />
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
        <Button 
            className="w-full relative z-50" 
            onClick={handleClick}
            disabled={shouldFlyAway} // Prevent double clicks
        >
            {shouldFlyAway ? "Registering..." : "Register"}
        </Button>
      </CardFooter>
    </Card>
  )
}