import StudentDashboard from "./pages/StudentDashboard";
import { Routes, Route } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      {/* <Route path="/student/dashboard" element={<StudentDashboard />} /> */}
    </Routes>
  );
}

export default App;
