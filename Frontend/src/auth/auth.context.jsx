import { createContext,useCallback,useState } from "react";
import { getMe } from "../services/auth.api";

export const AuthContext = createContext()


export const AuthProvider = ({children}) =>{
    const [user , setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const checkAuth = useCallback(async () => {
        setLoading(true)

        try {
            const data = await getMe()
            setUser(data || null)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

   
    return (
        <AuthContext.Provider value ={{user,setUser,loading,setLoading,checkAuth}} >
            {children}
        </AuthContext.Provider>
    )
}