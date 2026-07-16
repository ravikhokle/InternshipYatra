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
import ContactUs from './pages/ContactUs'
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
import ViewDetails from './pages/ViewDetails';
import AppliedUsers from './pages/AppliedUsers';
import UpdatePost from './pages/UpdatePost';
import UpdateUserProfile from './pages/UpdateUserProfile';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
      <ErrorBoundary>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify-signup-otp' element={<VerifySignupOTP />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/' element={<Home />} />
        <Route path="/publicprofile/:username" element={<PublicProfile />} />

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
        </Route>

        <Route path='/internship/:id' element={<ViewDetails />} />
        <Route path='/:slug' element={<ViewDetails />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      </ErrorBoundary>
      </main>
      <Footer />
      {/* Single global ToastContainer — eliminates duplicate toasts across pages */}
      <ToastContainer position="top-right" />
    </div>
  )
}

export default App
