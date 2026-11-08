import {useContext} from "react";
import {AuthContext} from "../auth/auth.context";
import {register,login,logout} from "../services/auth.api"
import { toast } from "react-toastify";


export const useAuth = () =>{
    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading,checkAuth} = context

    const handleLogin = async ({email,password}) =>{
        setLoading(true)
        try{
            const data = await login({email,password})
            if (!data?.user) {
                setUser(null)
                toast.error("Login failed. Please check your email and password.")
                return false
            }

            setUser(data.user)
            return true
        } catch(error){
            setUser(null)
            const message = error.response?.status === 400 && error.response?.data?.message
                ? error.response.data.message
                : "Unable to log in. Please try again."
            toast.error(message)
            return false
        } finally{
            setLoading(false)
        }
    }

    const handleRegister = async ({username,email,password}) =>{
        setLoading(true)
        try{
            const data = await register({username,email,password})
            if (!data?.user) {
                setUser(null)
                return false
            }

            setUser(data.user)
            return true
        } catch(error){
            setUser(null)
            const message = error.response?.status === 400 && error.response?.data?.message
                ? error.response.data.message
                : "Unable to register. Please try again."
            toast.error(message)
            if (message === "User already exists") {
                return "already-exists"
            }
            return false
        } finally{setLoading(false)}
    }

    const hadlelogout = async () =>{
        setLoading(true)
        try{
            await logout()
            setUser(null)
        } catch{
            setUser(null)
        } finally{
            setLoading(false)
        }
    }

    return {user,loading,hadlelogout,handleRegister,handleLogin,checkAuth}
}