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
import ScrollToTopSmooth from "./components/ScrollToTop";
import TuitionAccommodationFee from "./pages/TuitionAccommodationFee";

function App() {
  return (
    <>
      <ScrollToTopSmooth />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudentDashboard />} />
          <Route
            path="/payments/other-payment"
            element={<OtherFeesPayment />}
          />
          <Route path="/payments/select-hostel" element={<SelectHostel />} />
          <Route
            path="/payments/other-payment/checkout"
            element={<PaymentAnalysis />}
          />
          <Route
            path="/payments/view-avaliable-hostels"
            element={<ViewAvailableBedSpace />}
          />
          <Route
            path="/payments/payment-plan"
            element={<TuitionAccommodationFee />}
          />
          <Route path="/academics" element={<Academics />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
