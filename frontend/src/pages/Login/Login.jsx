import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { Link } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'

const Login = () => {
  return (
    <>
      <Navbar/>

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          
          <form onSubmit={() => {}}>
            <h2 className="text-2xl mb-7">Login</h2>
            
            <input placeholder="example@email.com" type="text" className="input-box" />
            
            <PasswordInput/>

            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>
      
      <Footer/>
    </>
  )
}

export default Login
