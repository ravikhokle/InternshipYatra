import './App.css'
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOTP'
import VerifySignupOTP from './pages/VerifySignupOTP'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import About from './pages/About'
import NotFound from './pages/NotFound'
import CreatePost from './pages/CreatePost';
import ProtectedRoutes from './pages/ProtectedRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import UserProfile from './pages/UserProfile';
import UpdateResume from './pages/UpdateResume';
import UpdateProfileImg from './pages/UpdateProfileImg'
import ViewResume from './pages/ViewResume';
import UpdateCompanyLogo from './pages/UpdateCompanyLogo'
import PublicProfile from './pages/PublicProfile';
import DisplayUserPosts from './pages/DisplayUserPosts';
import ViewDetails from './pages/ViewDetails';
import AppliedUsers from './pages/AppliedUsers';
import UpdatePost from './pages/UpdatePost';
import UpdateUserProfile from './pages/UpdateUserProfile';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify-signup-otp' element={<VerifySignupOTP />} />
        <Route path='/about' element={<About />} />
        <Route path='/' element={<Home />} />
        <Route path='*' element={<NotFound />} />
        <Route path="/publicprofile/:id" element={<PublicProfile />} />
        <Route path='/internship/:id' element={<ViewDetails />} />

        <Route element={<ProtectedRoutes />}>
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/updateuserprofile' element={<UpdateUserProfile />} />
          <Route path='/updateresume' element={<UpdateResume />} />
          <Route path='/updateprofileimage' element={<UpdateProfileImg />} />
          <Route path='/view-resume' element={<ViewResume />} />
          <Route path='/view-resume/:userId' element={<ViewResume />} />
          <Route path='/updatecompanylogo' element={<UpdateCompanyLogo />} />
          <Route path='/createpost' element={<CreatePost />} />
          <Route path="/updatepost/:id" element={<UpdatePost />} />
          <Route path='/appliedusers/:id' element={<AppliedUsers />} />
          <Route path='/userposts' element={<DisplayUserPosts />} />
        </Route>
      </Routes>
      <Footer />
      {/* Single global ToastContainer — eliminates duplicate toasts across pages */}
      <ToastContainer position="top-right" />
    </>
  )
}

export default App
