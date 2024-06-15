import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Name is required");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");

    //signup api
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // handle successful signup
      if (response.data && response.data.accessToken) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <Navbar/>

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          
          <form onSubmit={handleSignUp}>
            
            <h4 className="text-2xl mb-7">SignUp</h4>

            {/* name */}
            <input 
              placeholder="Name" 
              type="text" 
              className="input-box" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            {/* email */}
            <input 
              placeholder="example@email.com" 
              type="text" 
              className="input-box" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* password */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-red-500 text-xs pb-1">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary">
              SignUp
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>

          </form>
          
        </div>
      </div>

      <Footer/>
    </>
  )
}

export default SignUp
