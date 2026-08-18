import StudentDashboard from "./pages/StudentDashboard";
import OtherFeesPayment from "./pages/OtherFeesPayment";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import PaymentAnalysis from "./pages/PaymentAnalysis";
import Layout from "./components/Layout";
import SelectHostel from "./pages/SelectHostel";
import Academics from "./pages/Academics";
import ViewAvailableBedSpace from "./pages/ViewAvailableBedSpace";
import ScrollToTopSmooth from "./components/ScrollToTop";
import TuitionAccommodationFee from "./pages/TuitionAccommodationFee";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <ScrollToTopSmooth />

      <Routes>
        {/* Pages WITHOUT the Layout */}
        <Route path="/" element={<LoginPage />} />

        {/* Pages WITH the Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />

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
