import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CreateItem from './pages/CreateItem';
import Item from './pages/Item';
import Landing from './components/Home/Landing';
import {AuthContext } from './components/AuthContext'
import {useState, useEffect } from 'react';
import axios from 'axios';
import NotFound from './components/Modals/NotFound';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import NotAllowed from './components/Modals/NotAllowed';
import MailToggle from './pages/MailToggle';
import CreateCategory from './components/Admin/CreateCategory';
import Filter from './components/Searching/Filter';
import FilterCategories from './components/Searching/FilterCategories';
import Export from './pages/Export';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Auctions from './components/Searching/Auctions';


function App() {

  const [authState, setAuthState] = useState({
    username: "", 
    id: 0, 
    status:false 
  });

  useEffect(()=>{

      axios.get("https://localhost:33123/auth/validate", { headers: {
        accessToken: localStorage.getItem("accessToken"),
      }}).then((res)=>{
        if(res.data.error){
          setAuthState({
            username: "", 
            id: 0, 
            status:false
          });
        }
        else{
          setAuthState(res.data);
        }
      });

  }, []);

  

  return (

    <div className="App" >
      <AuthContext.Provider value={{authState, setAuthState}} >
        <Router>
          <Routes>

            {/* Is the User Authenticated */}
            {!authState.status ? (<> 

                {/* Logged out routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<><Navbar clicked={"login"} /><Login /></>} />
                <Route path="/profile/:id" element={<><Navbar clicked={"profile"}/> <NotAllowed /></>} />
                <Route path="/home/" element={<><Navbar clicked={"home"}/> <NotAllowed /></>} />
              </>)
            :
            
              (<>  
                {/* Logged in Routes */}
                <Route path="/" element={<><Navbar clicked={"home"}/> <Dashboard /></>} />
                <Route path="/profile/:id" element={<><Navbar clicked={"users"} /> <Profile /></>} />
                
                {/* Unavailable to admin  */}
                { ! (authState.username==="admin") ? (<>
                  <Route path="/createitem" element={<><Navbar clicked={"createitem"} /> <CreateItem /></>} />
                  <Route path="/home/" element={<><Navbar clicked={"home"} /> <Dashboard /></>} />
                  <Route path="/mail/" element={<><Navbar clicked={"mail"} /> <MailToggle  /></>} />
                </>)
                :  
                (<>
                  <Route path="/users" element={<><Navbar clicked={"users"} /> <Users /></>} />
                  <Route path="/addcategory" element={<><Navbar clicked={"addcategory"} /> <CreateCategory /></> } />
                  <Route path="/export" element={<><Navbar clicked={"export"} /> <Export /></>} />
                </>)
                }
              </>)
            }

            <Route path="/auctions" element={<><Navbar clicked={"auctions"}/> <Auctions /></>} />
            <Route path="/search" element={<><Navbar clicked={"search"} /> <FilterCategories /></>} />
            <Route path="/item/:id" element={<><Navbar clicked={"auctions"}/> <Item /></>} />
            <Route path="/filter" element={<><Navbar clicked={"search"} /> <Filter /></>} />
            
            {/* last the default if the page was not found */}
            <Route path="*" element= {<><Navbar /> <NotFound /></>} />

          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
