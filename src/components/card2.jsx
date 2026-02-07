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

export function CardImage2() {
     const navigate =useNavigate()

    const handleClick = ()=>{
        navigate("/consumerdash")
    }
    
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-0 aspect-video  " />
      <img
        src="src/assets/left.jpeg"
        alt="Event cover"
        className="relative z-0 aspect-video w-full object-cover rounded-t-lg  "
      />
      <CardHeader>
       
        <CardTitle>Not a bussiness?</CardTitle>
        <CardDescription>
          Know status of your claim 
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={handleClick}>Track Status</Button>
      </CardFooter>
    </Card>
  )
}
