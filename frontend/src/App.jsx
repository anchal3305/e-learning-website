import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './components/Navbar/Navbar';
import SideBar from './components/Sidebar/Sidebar';
import Footer from './components/Homepage/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Features from "./pages/Features";
import FAQs from "./pages/FAQs";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import Notes from "./pages/Notes/Notes";
import Compiler from "./pages/Compiler/Compiler";
import Certificates from "./pages/Certificates";
import Badges from "./pages/Badges";
import Favourites from "./pages/Favourites";
import Forum from "./pages/Forum/Forum";
import UploadVideo from "./pages/UploadVideo";
import { AuthContextProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        {/* All pages will display the Navbar */}
        <Navbar />
        <div className="d-flex">
          {/* All pages will display the Sidebar */}
          <SideBar />

          <div className="content-area">
            <Routes>
              {/* Navbar routes */}
              <Route path='/home' element={<Home />} />
              <Route path='/features' element={<Features />} />
              <Route path='/courses' element={<Courses />} />
              <Route path='/faqs' element={<FAQs />} />
              <Route path='/about' element={<About />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />

              {/* Sidebar routes */}
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/notes' element={<Notes />} />
              <Route path='/compiler' element={<Compiler />} />
              <Route path='/certificates' element={<Certificates />} />
              <Route path='/badges' element={<Badges />} />
              <Route path='/favourites' element={<Favourites />} />
              <Route path='/forum' element={<Forum />} />
              <Route path='/uploadvideo' element={<UploadVideo />} />
              </Routes>
          </div>
        </div>
        <Footer />
        <Chatbot />  {/* ✅ Add Chatbot here so it's visible on all pages */}
      </Router>
    </AuthContextProvider>
  );
}

export default App;
