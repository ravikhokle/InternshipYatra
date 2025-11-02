
import { useState } from "react"


const NewCom = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const consoleFun = (event) => {
        
        setName(event.target.value);
        setEmail(event.target.value);
    }

    const onSubmitFun = (event) => {
        event.preventDefault()
        console.log(name);
        console.log(email);
    }

  return (
    <div>
        <form onSubmit={onSubmitFun}>
            <label >Name</label>
            <input type="text" id="name" name="name" onChange={consoleFun}></input>
            <label >Email</label>
            <input type="email" id="email" name="email" onChange={consoleFun}></input>
            <input type="submit" value="Submit"/>
        </form>
    </div>
  )
}

export default NewCom