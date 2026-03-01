import { useContext, useEffect } from "react"
import Banner from "../components/Banner"
import FetauredProducts from "../components/FeaturedProduct"
import Footer from "../components/Footer"
import PromoSection from "../components/PromoSection"
import { AuthContext } from "../context/auth-context"


const Home = () => {
  const { fetchUser } = useContext(AuthContext)
  useEffect(() => {
    fetchUser()
  }, [fetchUser])
  
  return (
    <div className='w-full h-full '>
      <Banner/>
      <FetauredProducts/>
      <PromoSection/>
      <FetauredProducts/>
      <Footer/>
    </div>
  )
}

export default Home
