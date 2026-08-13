import StudentDashboard from "./pages/StudentDashboard";
import OtherFeesPayment from "./pages/OtherFeesPayment";
import Academics from "./pages/Academics";
import Topbar from "./components/Topbar";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import PaymentAnalysis from "./pages/PaymentAnalysis";
import Layout from "./components/Layout"; // Import the Layout component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="payments/other-payment" element={<OtherFeesPayment />} />
        <Route
          path="payments/other-payment/checkout"
          element={<PaymentAnalysis />}
        />
        <Route path="academics" element={<h1>This is the academics page</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
