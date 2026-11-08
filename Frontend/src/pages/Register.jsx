import {useState} from 'react'
import {useNavigate, Link} from 'react-router'
import { useAuth } from '../hooks/useAuth'
const Register = () => {
  const navigate  = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState(" ")
  const {loading, handleRegister} = useAuth()
    const handleSubmit =  async(e) =>{
    e.preventDefault();
    const result = await handleRegister({username,email,password})
    if (result === true) {
      navigate("/")
    } else if (result === "already-exists") {
      navigate("/login")
    }
    }
    if(loading){
    return (<main><h1>Loading......</h1></main>)
  }
  return (
    <div>
      <main>
        <div className="form-container">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
              onChange={(e) => {setUsername(e.target.value)}}
               type="text" id="username" name="username" placeholder="Enter your Username" />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
              onChange={(e) => {setEmail(e.target.value)}}
               type="email" id="email" name="email" placeholder="Enter your Email" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
              onChange={(e) => {setPassword(e.target.value)}}
               type="password" id="password" name="password" placeholder="Type your Password" />
            </div>
            <button className='button primary-button' type="submit">Register</button>
          </form>
          <p> Already Have an Account <Link to={"/login"} >Login</Link> </p>
        </div>
      </main>
    </div>
  )
}

export default Register
