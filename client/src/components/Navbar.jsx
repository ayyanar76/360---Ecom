import { Bot, Home, Menu, Package, ShoppingBag, X } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth-context'

const ulList = [
    {name:"Home",lapel:<Home/>,link:"/"},
    {name:"AllProduct",lapel:<Package/>,link:"/products"},
    {name:"AI Helper",lapel:<Bot/>,link:"/ai-chat"},
    {name:"Cart",lapel:<ShoppingBag/>,link:"/cart"},
    
]


const Navbar = () => {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const {fetchUser,user} = useContext(AuthContext)
  const isAdmin = user?.getMe?.role?.toLowerCase?.() === "admin";
  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  
  
  return (
    <div className='px-4 sm:px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-40'>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
<div className="flex cursor-pointer" onClick={()=>{navigate('/')}}>
       <img src='/Vector.png' className='h-8 w-auto'/>
        <img src='/Vector-1.png' className='h-8 w-auto'/>
</div>
        <ul className='hidden md:flex gap-4 text-lg text-orange-600 hover:cursor-pointer px-6'>
         {
            ulList.map((i,_)=>(
                <li className='flex items-center gap-2 border-r last:border-none pr-4 font-stretch-200%' onClick={()=>{navigate(`${i.link}`)}} key={_}>{i.name}</li>
            ))
    }
      {isAdmin ? (
        <li
          className='flex items-center gap-2 border-r last:border-none pr-4 font-stretch-200%'
          onClick={() => navigate("/admin")}
        >
          Admin
        </li>
      ) : null}
      </ul>
      <div className="hidden md:flex items-center gap-4 ">
     {
      user !== null ?   <>
       <h1 className='flex items-center gap-2 font-stretch-200% text-orange-600 hover:cursor-pointer' onClick={()=>navigate('/orders')}><ShoppingBag/> Orders</h1>
      <div
        className="flex justify-center items-center bg-orange-600 w-10 text-white font-bold aspect-square rounded-full cursor-pointer"
        onClick={() => navigate('/profile')}
      >
        {user?.getMe?.name[0]}
      </div>
      </>:
     <>
      <button className='bg-orange-600 text-white font-stretch-200% px-6 py-2 text-center rounded' onClick={()=>{navigate('/login')}}>Login</button>
      <button className='border border-orange-600 text-orange-600 font-stretch-200% px-6 py-2 text-center rounded' onClick={()=>{navigate('/signup')}}>Sign Up</button>
     </>
    
     }
      </div>
      <button
        className="md:hidden text-orange-600"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden max-w-6xl mx-auto pt-4 pb-2 flex flex-col gap-4">
          <ul className='flex flex-col gap-3 text-base text-orange-600'>
            {
              ulList.map((i,_)=>(
                <li
                  className='font-medium'
                  onClick={() => {
                    navigate(`${i.link}`)
                    setMobileOpen(false)
                  }}
                  key={_}
                >
                  {i.name}
                </li>
              ))
            }
            {isAdmin ? (
              <li
                className='font-medium'
                onClick={() => {
                  navigate("/admin")
                  setMobileOpen(false)
                }}
              >
                Admin
              </li>
            ) : null}
          </ul>
          {user !== null ? (
            <div className="flex items-center justify-between">
              <h1
                className='flex items-center gap-2 text-orange-600'
                onClick={() => {
                  navigate('/orders')
                  setMobileOpen(false)
                }}
              >
                <ShoppingBag size={18}/> Orders
              </h1>
              <div
                className="flex justify-center items-center bg-orange-600 w-10 text-white font-bold aspect-square rounded-full cursor-pointer"
                onClick={() => {
                  navigate('/profile')
                  setMobileOpen(false)
                }}
              >
                {user?.getMe?.name[0]}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button className='bg-orange-600 text-white px-4 py-2 rounded' onClick={() => {navigate('/login'); setMobileOpen(false)}}>Login</button>
              <button className='border border-orange-600 text-orange-600 px-4 py-2 rounded' onClick={() => {navigate('/signup'); setMobileOpen(false)}}>Sign Up</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Navbar
