import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Call from "./pages/Call";
import ImportLeads from "./pages/ImportLeads";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Call />} />
          <Route path="/importleads" element={<ImportLeads />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
