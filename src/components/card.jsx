import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardImage() {
    const navigate = useNavigate();
    const handleClick=()=>{
        navigate("/businessdash")
    }
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0  aspect-video  " />
      <img
        src="src/assets/right.jpeg"
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
