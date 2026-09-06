import { useAuth } from "../hooks/useAuth";
import React, {useEffect, useState} from "react"
import {Navigate} from "react-router"



const  Protected = ({children}) => {
  const {loading,user,checkAuth} = useAuth()
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  useEffect(() => {
    const authenticate = async () => {
      await checkAuth()
      setHasCheckedAuth(true)
    }

    authenticate()
  }, [checkAuth])
     

  if(loading || !hasCheckedAuth){
        return (<main><h1>Loading...</h1></main>)
    }

    if(!user){
       return <Navigate to = {"/login"} />
    }
  return children
}

export default Protected

