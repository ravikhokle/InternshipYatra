import './App.css'
import { Route, Routes} from 'react-router-dom';
import Login from './pages/Login'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import About from './pages/About'
import NotFound from './pages/NotFound'
import CreatePost from './pages/CreatePost';
import ProtectedRoutes from './pages/ProtectedRoutes';
import Header from './pages/Header';
import Footer from './pages/Footer';
import UserProfile from './pages/UserProfile';
import UpdateResume from './pages/UpdateResume';
import UpdateProfileImg from './pages/UpdateProfileImg'
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
    <Header/>
      <Routes>
      
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='*' element={<NotFound/>}/>
        <Route path="/publicprofile/:id" element={<PublicProfile />} />
        <Route path='/internship/:id' element={<ViewDetails/>}/>

        <Route element={<ProtectedRoutes/>}>
          <Route path='/profile' element={<UserProfile/>}/>
          <Route path='/updateprofile' element={<UpdateUserProfile/>}/>
          <Route path='/updateresume' element={<UpdateResume/>}/>
          <Route path='/updateprofileimage' element={<UpdateProfileImg/>}/>
          <Route path='/updatecompanylogo' element={<UpdateCompanyLogo/>}/>
          <Route path='/createpost' element={<CreatePost/>}/>
          <Route path="/updatepost/:id" element={<UpdatePost />} />
          <Route path='/appliedusers/:id' element={<AppliedUsers/>}/>
          <Route path='/userposts' element={<DisplayUserPosts/>}/>
        </Route>
        
      </Routes>
      <Footer/>
    </>
  )
}

export default App
