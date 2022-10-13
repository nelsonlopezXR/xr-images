import './App.css';
import Home from './pages/Home.js';
import Register from './pages/Register.js';
import Sales from './pages/Sales.js';
import ProjectDelivery from './pages/ProjectDelivery.js';
import Marketing from './pages/Marketing.js';
import About from './pages/About.js';
import Myaccount from './pages/Myaccount.js';
import Profile from './pages/Profile.js';
import Login from './pages/Login.js';
import Logout from './pages/Logout.js';
import Header from "./components/Header.js";
import {Route} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header />
      <Route exact path="/" component={Home} />
      <Route exact path="/Register" component={Register} />
      <Route exact path="/Sales" component={Sales} />
      <Route exact path="/Marketing" component={Marketing} />
      <Route exact path="/ProjectDelivery" component={ProjectDelivery} />
      <Route exact path="/About" component={About} />
      <Route exact path="/Myaccount" component={Myaccount} />
      <Route exact path="/Profile" component={Profile} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Logout" component={Logout} />
    </div>
  );
}




export default App;