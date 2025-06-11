import { useRef } from "react"
import { Button } from "../components/ui/Button"
import { useNavigate } from "react-router-dom"

export function EntryPage(){
    const primaryUserNameRef = useRef<HTMLInputElement>(null)
    const secondaryUserNameRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    
    function store() {

    }
    return(
        <div>
            <input type="text" placeholder="Enter your username" ref={primaryUserNameRef}/>
            <Button variant="primary" text="click" size="sm" onClick={store}/>
        </div>
    )
}