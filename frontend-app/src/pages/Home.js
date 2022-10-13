import React from "react";
import Data from '../components/Data.js';
import {Link} from 'react-router-dom';

function Home() {
  return (
    <div>
        This is our Monolithic Application<br></br>

        We have 3 Dynamic pages pulling live Data:
        <ul>
          <li><Link to="/Sales">Sales</Link></li>
          <li><Link to="/Marketing">Marketing</Link></li>
          <li><Link to="/ProjectDelivery">Project Delivery</Link></li>
        </ul>
    </div>
  );
}

export default Home;