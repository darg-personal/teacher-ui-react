import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImportLeads from "./pages/ImportLeads";
import BaseView from "./views/BaseView";
import LoginScreen from "./pages/auth/LoginScreen";
import InitView from "./pages/InitView";
import RegisterScreen from "./pages/auth/RegisterScreen";

function App() {
  return (
    <>
      <Router>
        <Routes>
            <Route path={"/"} element={<BaseView/>}>
                <Route index element={<InitView />} />
                <Route path={'login'} element={<LoginScreen/>} />
                <Route path={'register'} element={<RegisterScreen/>}/>
                <Route path={"importleads"} element={<ImportLeads />} />
            </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
