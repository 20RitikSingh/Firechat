import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import {BrowserRouter,Navigate,Route,Routes} from 'react-router-dom';
import "./style.scss";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
function App() {
  const {currentUser}= useContext(AuthContext);  
  const ProtectedRouter =({children})=>{
    if(!currentUser){
      return <Navigate to="/login" />;
    }
    return children;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={
            <ProtectedRouter><Home/></ProtectedRouter>
          } />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Route>
      </Routes>
    </BrowserRouter> 
  );
}

export default App;
