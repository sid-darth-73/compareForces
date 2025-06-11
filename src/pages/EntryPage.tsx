import { useRef } from "react"
import { Button } from "../components/ui/Button"
import { useNavigate } from "react-router-dom"
import { Input } from "../components/Input"
export function EntryPage(){
    const primaryUserNameRef = useRef<HTMLInputElement>(null)
    const secondaryUserNameRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    
    function store() {
        const primaryUser = primaryUserNameRef.current?.value
        if(!primaryUser) {
            navigate("/Error")
            return
        }
        const secondaryUser = secondaryUserNameRef.current?.value
        if(!secondaryUser) {
            localStorage.setItem("primaryUser", primaryUser)
            navigate("/singleUser")
            return;
        }
        localStorage.setItem("primaryUser", primaryUser)
        localStorage.setItem("secondaryUser", secondaryUser)
        navigate("/multipleUser")
    }
    return(
        <div>
            <Input placeholder="Enter your codeforces handle" reference={primaryUserNameRef}/>
            {/* <Button variant="primary" text="click" size="sm" onClick={store}/> */}
            <Input placeholder="Enter your friend's codeforces handle" reference={secondaryUserNameRef}/>

            <Button variant="primary" text="click" size="sm" onClick={store}/>
        </div>
    )
}