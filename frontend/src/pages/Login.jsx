import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utils";
 

const Login = () => {
  const [LoginInfo, setLoginInfo] = useState({
    email:'',
    password:''
  });

  const navigate = useNavigate();

  const handleChange = (e)=>{
    const { name, value} = e.target;
    const copyLoginInfo = {...LoginInfo};
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  }

  const handleLogin = async (e)=> {
    e.preventDefault();
    const {email, password} = LoginInfo;
    if (!email || !password) {
      return handleError('email and password not valid');
    }

    try {
      const url = `${import.meta.env.VITE_API}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(LoginInfo)
      });

      const result = await response.json();
      const {message, success, Token, name, userID, userProfile, error} = result;
      if(success){
        handleSuccess(message);
        localStorage.setItem('token',Token);
        localStorage.setItem('LogedInUser',name);
        localStorage.setItem('userID',userID);
        localStorage.setItem('userProfile',userProfile);

        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      }else if(error){
        const details = error?.details[0].message;
        handleError(details);
      }else if(!success){
        handleError(message);
      }

    } catch (err) {
      handleError(err)
    }



  }

  return (
    <div className="px-8 sm:px-16 lg:px-32 pb-16">
  <h2 className="text-black pt-8 text-3xl sm:text-4xl font-bold">Welcome Back!</h2>
  <h3 className="pb-8 pt-1 text-lg sm:text-xl">Login to your Account</h3>

  <div className="flex flex-col sm:flex-row w-full mt-5">
    <div className="w-full sm:w-1/2 pr-8 pb-8">
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">
            <h4 className="text-2xl">Email ID</h4>
          </label>
          <input
            className="text-xl mb-5 w-full py-2 my-3 px-2 border-2"
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email id"
            value={LoginInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">
            <h4 className="text-2xl">Password</h4>
          </label>
          <input
            className="text-xl mb-5 w-full py-2 my-3 px-2 border-2"
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password..."
            value={LoginInfo.password}
          />
        </div>

        <button
          type="submit"
          className="text-[#FFFFFF] text-lg font-bold rounded border-2 bg-purple-600 border-purple-600 w-full py-3"
        >
          Login
        </button>
        <p className="text-xl text-center mt-3">
          <span>
            Don&apos;t have an account?
            <Link to="/signup" className="text-blue-600">
              {" "}
              Register
            </Link>
          </span>
        </p>
      </form>
    </div>

    <div className="w-full sm:w-1/2 mt-5 sm:mt-0">
      <img
        src="https://res.cloudinary.com/db1xxbbat/image/upload/v1736079379/frontend/bw0k9pjed2irxfm3kmh7.jpg"
        alt="team image"
        className="rounded-xl w-full h-auto"
      />
    </div>
  </div>

  <ToastContainer />
</div>

  )
}

export default Login