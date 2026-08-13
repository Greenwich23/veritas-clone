import StudentDashboard from "./pages/StudentDashboard";
import OtherFeesPayment from "./pages/OtherFeesPayment";
import Academics from "./pages/Academics";
import Topbar from "./components/Topbar";
import { Routes, Route } from "react-router-dom";
import "./index.css";
// import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div>
      <Topbar/>
      <main className="pt-16">
        <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="/payments/other-payment" element={<OtherFeesPayment />} />
      <Route path="/academics" element={<Academics />} />
      {/* <Route path="/academics" element={<Component />} /> */}

      {/* <Route path="/student/dashboard" element={<StudentDashboard />} /> */}
        </Routes>
      </main>
    </div>

  );
}

export default App;
