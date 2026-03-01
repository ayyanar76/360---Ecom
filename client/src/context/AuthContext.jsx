import React, { useCallback, useMemo, useState } from 'react'
import axios from 'axios'
import { AuthContext } from './auth-context'

const AuthProvider = ({children}) => {
  let [user,setUser] = useState(null)
  let [loading,setLoading] = useState(false)
  
  
 const api = useMemo(() => axios .create({
    baseURL:import.meta.env.VITE_API_KEY,
    withCredentials:true
 }), []);
 const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/me')
      setUser(response.data)
    } catch (error) {
      console.log(error.response?.data || error.message)
    }
  }, [api])
 
  const login = useCallback(async(email,password)=>{

    try {
      const res = await api.post('/login',{email,password})
      await fetchUser()
       return res.data;
       
    } catch (error) {
      console.log(error);
      return { success: false, msg: error.response?.data?.msg || "Login failed" }
    }
  }, [api, fetchUser])
  const register = useCallback(async(name,email,password)=>{

    try {
      const res = await api.post('/signup',{name,email,password})
      return res.data;
    } catch (error) {
      console.log(error);
      return { success: false, msg: error.response?.data?.msg || "Registration failed" }
    }
  }, [api])
 
  const logout = useCallback(async () => {
    try {
      const res = await api.post('/logout')
      setUser(null)
      return res.data
    } catch (error) {
      console.log(error);
      return { success: false, msg: "Logout failed" }
    }
  }, [api])
  return (
  <AuthContext.Provider value={{user,setUser,api ,login , register, logout,loading,setLoading ,fetchUser}} >
    {children}
  </AuthContext.Provider>
  )

}
export default AuthProvider
