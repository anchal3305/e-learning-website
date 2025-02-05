import React from 'react';
import { useNavigate } from "react-router-dom";
import Features from '../components/HomePage/Features.jsx';
import Heroes from '../components/HomePage/Heroes.jsx';


const Home = () => {
  return <>
    <div className="content">  
          <Heroes/>
          <Features/>
    </div>
  </>
}

export default Home;