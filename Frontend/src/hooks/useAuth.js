import {useContext, useEffect} from "react";
import {AuthContext} from "../auth/auth.context";
import {register,login,logout,getMe} from "../services/auth.api"


export const useAuth = () =>{
    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context

    const handleLogin = async ({email,password}) =>{
        setLoading(true)
        try{
            const data = await login({email,password})
            if (!data?.user) {
                setUser(null)
                return false
            }

            setUser(data.user)
            return true
        } catch(err){
            setUser(null)
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
        } catch (err){
            setUser(null)
            return false
        } finally{setLoading(false)}
    }

    const hadlelogout = async () =>{
        setLoading(true)
        try{
            await logout()
            setUser(null)
        } catch(err){
            setUser(null)
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        const getAndSetUser = async()=>{
            setLoading(true)

            try {
              const data = await getMe()
              setUser(data || null)
            } catch (error) {
                console.error("Auth check failed:", error)
                setUser(null)
            } finally{
                 setLoading(false)
            }
        }

        getAndSetUser()
    },[])

    return {user,loading,hadlelogout,handleRegister,handleLogin}
}