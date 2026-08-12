import StudentDashboard from "./pages/StudentDashboard";
import OtherFeesPayment from "./pages/OtherFeesPayment";
import { Routes, Route } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="/payments/other-payment" element={<OtherFeesPayment />} />
      {/* <Route path="/student/dashboard" element={<StudentDashboard />} /> */}
    </Routes>
  );
}

export default App;
