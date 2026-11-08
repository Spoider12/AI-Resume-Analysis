import {useState} from 'react'
import '../auth/auth.form.scss'
import { useNavigate, Link } from 'react-router'
import {useAuth} from "../hooks/useAuth.js"

const Login = () => {

  const{loading , handleLogin} = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) =>{
    e.preventDefault()

    const success = await handleLogin({email, password})

    if (success) {
      navigate("/")
    }
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} aria-busy={loading}>
            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                    onChange={(e) => {setEmail(e.target.value)}}
                 type="email" id="email" name="email" placeholder="Enter your Email" />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                onChange={(e) =>{setPassword(e.target.value)}}
                 type="password" id="password" name="password" placeholder="Enter your Password" />
            </div>
            <button className='button primary-button auth-submit' type="submit" disabled={loading}>
              {loading && <span className="auth-spinner" aria-hidden="true" />}
              <span>{loading ? "Signing you in..." : "Login"}</span>
            </button>
        </form>
        <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
        </div>  
    </main>
  )
}

export default Login
