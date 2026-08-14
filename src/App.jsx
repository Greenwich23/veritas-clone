import StudentDashboard from "./pages/StudentDashboard";
import OtherFeesPayment from "./pages/OtherFeesPayment";
// import Academics from "./pages/Academics";
// import Topbar from "./components/Topbar";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import PaymentAnalysis from "./pages/PaymentAnalysis";
import Layout from "./components/Layout"; // Import the Layout component
import SelectHostel from "./pages/SelectHostel";
import Academics from "./pages/Academics";
import ViewAvailableBedSpace from "./pages/ViewAvailableBedSpace";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="/payments/other-payment" element={<OtherFeesPayment />} />
        <Route path="/payments/select-hostel" element={<SelectHostel />} />
        <Route
          path="/payments/other-payment/checkout"
          element={<PaymentAnalysis />}
        />
        <Route
          path="/payments/view-avaliable-hostels"
          element={<ViewAvailableBedSpace />}
        />
        <Route path="/academics" element={<Academics />} />
      </Route>
    </Routes>
  );
}

export default App;
