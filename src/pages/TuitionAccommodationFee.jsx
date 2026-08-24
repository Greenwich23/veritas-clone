/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import { useMemo, useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Receipt, Info, X, Lightbulb, Loader } from "lucide-react";
import axios from "axios";

// ============================================================
// CONSTANTS
// ============================================================
const TUITION_FEE = 2217850;
const FALLBACK_HOSTEL_FEE = 168000;
const PLAN_OPTIONS = [25, 50, 75, 100];
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAYMENT_STATUS_KEY = "veritas_payment_status";
const BED_SPACE_ROUTE = "/payments/view-avaliable-hostels";

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function formatNaira(value) {
  return `₦${Number(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
  })}`;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============================================================
// COMPONENTS
// ============================================================
function Breadcrumb() {
  return (
    <div className="flex items-center justify-between px-4 md:px-4 pt-6 pb-4">
      <h1 className="text-3xl font-semibold text-slate-800">
        Tuition and Accommodation Fee Processing
      </h1>
      <span className="text-sm">
        <span className="text-blue-600 font-medium">Dashboard</span>
        <span className="text-slate-400 mx-2">/</span>
        <span className="text-slate-400">Fee Processing</span>
      </span>
    </div>
  );
}

function IntroBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-700 to-blue-800 text-white p-6">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-3 mb-2">
        <Receipt size={22} />
        <h2 className="text-xl font-bold">Tuition &amp; accommodation fees</h2>
      </div>
      <p className="relative text-sm text-blue-100 max-w-2xl leading-relaxed">
        Review your tuition and hostel amounts, then continue to payment.
      </p>
    </div>
  );
}

function NoteBar({ onDismiss, plan, totalAmount, planAmount, balance }) {
  return (
    <div className="bg-teal-600 rounded-md px-5 py-4 text-white flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <Info size={18} className="shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">NOTE:</span> From your selected
          Payment Plan of <span className="font-bold">{plan}%</span>, the sum
          for hostel and tuition fee is{" "}
          <span className="font-bold">{formatNaira(totalAmount)}</span>. You are
          to pay <span className="font-bold">{formatNaira(planAmount)}</span>{" "}
          now with a balance of{" "}
          <span className="font-bold">{formatNaira(balance)}</span>.
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-white/70 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function ReadOnlyField({ label, value, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        readOnly
        value={value}
        className="w-full border border-slate-200 rounded-md px-4 py-3 text-slate-600 text-[15px] bg-slate-100 cursor-not-allowed focus:outline-none"
      />
    </div>
  );
}

function DotSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TuitionAccommodationFee() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [noteVisible, setNoteVisible] = useState(true);
  const [payStatus, setPayStatus] = useState(null);
  const [plan, setPlan] = useState(100);
  const [pendingPlan, setPendingPlan] = useState(100);
  const [hostelFee, setHostelFee] = useState(FALLBACK_HOSTEL_FEE);
  const [student, setStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load student data from localStorage only - NO API CALL
  useEffect(() => {
    try {
      // Get student from localStorage (saved during login)
      const savedStudent = localStorage.getItem("student");
      if (savedStudent) {
        const parsed = JSON.parse(savedStudent);
        setStudent(parsed);
        console.log("📋 Loaded student from localStorage:", parsed.name);

        // Get hostel fee from selection if available
        if (parsed.hostelSelection) {
          setHostelFee(parsed.hostelSelection.fee || FALLBACK_HOSTEL_FEE);
        } else {
          // Try to get from localStorage as fallback
          const saved = localStorage.getItem("veritas_hostel_selection");
          if (saved) {
            const hostelData = JSON.parse(saved);
            if (hostelData.fee) setHostelFee(hostelData.fee);
          }
        }
      } else {
        console.log("⚠️ No student found in localStorage");
      }
    } catch (error) {
      console.error("Error loading student data:", error);
    } finally {
      setLoadingStudent(false);
    }

    // Check if payment was already successful
    const paymentStatus = localStorage.getItem(PAYMENT_STATUS_KEY);
    if (paymentStatus === "success") {
      setPayStatus("success");
    }
  }, []);

  // Calculate total and plan amounts
  const totalAmount = useMemo(() => {
    return TUITION_FEE + hostelFee;
  }, [hostelFee]);

  const planAmount = useMemo(() => {
    return totalAmount * (plan / 100);
  }, [totalAmount, plan]);

  const balance = useMemo(() => {
    return totalAmount - planAmount;
  }, [totalAmount, planAmount]);

  const handlePlanChange = (e) => {
    const newPlan = Number(e.target.value);
    setPendingPlan(newPlan);
    setIsLoading(true);

    setTimeout(() => {
      setPlan(newPlan);
      setIsLoading(false);
    }, 150);
  };

  // Paystack configuration
  const paystackConfig = {
    reference: `veritas_${Date.now()}`,
    email: student?.email || "student@veritas.edu.ng",
    amount: Math.round(planAmount * 100),
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Student",
          variable_name: "student_name",
          value: student?.name || "Student",
        },
        {
          display_name: "Reg No",
          variable_name: "reg_no",
          value: student?.regNo || "VUG/CSC/23/9682",
        },
        {
          display_name: "Payment Plan",
          variable_name: "payment_plan",
          value: `${plan}%`,
        },
        {
          display_name: "Hostel Fee",
          variable_name: "hostel_fee",
          value: formatNaira(hostelFee),
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const MAX_RETRIES = 5;
  let retryCount = 0;

  const verifyOnServer = async (reference) => {
    setPayStatus("verifying");
    setIsLoading(true);

    console.log("🔍 Verifying payment reference:", reference);

    if (!reference) {
      console.log("⚠️ No reference provided, checking localStorage...");
      const savedRef = localStorage.getItem("veritas_payment_reference");
      if (savedRef) {
        reference = savedRef;
        console.log("📦 Found reference in localStorage:", reference);
      } else {
        setPayStatus("failed");
        setIsLoading(false);
        setError("No payment reference found. Please contact support.");
        return;
      }
    }

    const cleanReference = reference.trim();
    console.log("🔍 Clean reference:", cleanReference);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/paystack/verify/${cleanReference}`,
        { headers: { ...getAuthHeaders() } },
      );

      console.log("📦 Verification response:", res.data);

      if (res.data.verified) {
        setPayStatus("success");
        localStorage.setItem(PAYMENT_STATUS_KEY, "success");
        localStorage.setItem("veritas_payment_status", "success");
        localStorage.removeItem("veritas_payment_reference");

        setTimeout(() => {
          setIsLoading(false);
          navigate(BED_SPACE_ROUTE);
        }, 1500);
      } else {
        if (res.data.pending && retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(
            `⏳ Payment pending, retry ${retryCount}/${MAX_RETRIES}...`,
          );
          setTimeout(() => {
            verifyOnServer(cleanReference);
          }, 3000);
          return;
        } else if (res.data.pending && retryCount >= MAX_RETRIES) {
          setPayStatus("failed");
          setIsLoading(false);
          setError(
            "Payment verification is taking too long. Please check your email for confirmation.",
          );
          return;
        }

        setPayStatus("failed");
        setIsLoading(false);

        const savedRef = localStorage.getItem("veritas_payment_reference");
        if (savedRef && savedRef === cleanReference) {
          setError(
            "Payment was processed but verification failed. Please contact support.",
          );
        }
      }
    } catch (err) {
      console.error("Verification request failed:", err);
      setPayStatus("failed");
      setIsLoading(false);
      setError("Could not verify payment. Please try again.");
    }
  };

  const handlePayClick = () => {
    if (!PAYSTACK_PUBLIC_KEY) {
      console.error("Missing VITE_PAYSTACK_PUBLIC_KEY in .env");
      setError("Payment configuration error. Please contact support.");
      return;
    }

    if (payStatus === "verifying" || payStatus === "success") {
      return;
    }

    retryCount = 0;
    const paymentRef = `veritas_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.log("📝 Generated payment reference:", paymentRef);
    localStorage.setItem("veritas_payment_reference", paymentRef);

    const configWithRef = {
      ...paystackConfig,
      reference: paymentRef,
    };

    const initializePaymentWithRef = usePaystackPayment(configWithRef);

    initializePaymentWithRef({
      onSuccess: (transaction) => {
        console.log("✅ Payment successful! Transaction:", transaction);
        localStorage.setItem(
          "veritas_payment_reference",
          transaction.reference,
        );
        setSuccess("Payment successful! Verifying...");
        verifyOnServer(transaction.reference);
      },
      onClose: () => {
        console.log("Payment popup closed without completing.");
        setPayStatus("failed");
        setIsLoading(false);
        setError("Payment was cancelled. Please try again.");
        localStorage.removeItem("veritas_payment_reference");
      },
    });
  };

  if (loadingStudent) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full bg-slate-100 font-sans">
      <div
        className={`flex w-full transition-all duration-200 ${
          isLoading ? "opacity-50 grayscale pointer-events-none" : ""
        }`}
      >
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">
            <Breadcrumb />

            <div className="px-3 md:px-4">
              <IntroBanner />
            </div>

            {noteVisible && (
              <div className="px-4 md:px-3 mt-5">
                <NoteBar
                  onDismiss={() => setNoteVisible(false)}
                  plan={plan}
                  totalAmount={totalAmount}
                  planAmount={planAmount}
                  balance={balance}
                />
              </div>
            )}

            {error && (
              <div className="px-4 md:px-3 mt-5">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-5 py-4 text-sm font-medium">
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="px-4 md:px-3 mt-5">
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-md px-5 py-4 text-sm font-medium">
                  {success}
                </div>
              </div>
            )}

            {payStatus === "success" && (
              <div className="px-4 md:px-3 mt-5">
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-md px-5 py-4 text-sm font-medium">
                  Payment verified successfully. Taking you to bed space
                  selection…
                </div>
              </div>
            )}

            {payStatus === "failed" && (
              <div className="px-4 md:px-3 mt-5">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-5 py-4 text-sm font-medium">
                  We couldn't verify that payment. Please contact support if you
                  were charged.
                </div>
              </div>
            )}

            <div className="px-4 md:px-3 py-6 w-full">
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-blue-900 text-[16px]">
                    Tuition and Accommodation Fee Processing
                  </h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <ReadOnlyField
                    label="Tuition Fee"
                    value={formatNaira(TUITION_FEE)}
                  />

                  <ReadOnlyField
                    label="Hostel Fee"
                    value={formatNaira(hostelFee)}
                  />

                  <ReadOnlyField
                    label="Selected Plan Fee"
                    value={formatNaira(planAmount)}
                  />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tuition Fee Payment Plan
                    </label>
                    <select
                      value={pendingPlan}
                      onChange={handlePlanChange}
                      className="w-full border border-slate-300 rounded-md px-4 py-3 text-slate-600 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    >
                      {PLAN_OPTIONS.map((pct) => (
                        <option key={pct} value={pct}>
                          {pct}%
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      Select percentage of total amount to pay now
                    </p>
                  </div>

                  {/* <ReadOnlyField
                    label="Payment Status"
                    value={
                      payStatus === "success"
                        ? "Paid ✓"
                        : payStatus === "verifying"
                          ? "Verifying..."
                          : payStatus === "failed"
                            ? "Failed ✗"
                            : "Pending"
                    }
                  /> */}
                </div>

                <div className="flex justify-end px-6 py-5 border-t border-slate-100">
                  <button
                    onClick={handlePayClick}
                    disabled={
                      payStatus === "verifying" || payStatus === "success"
                    }
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-6 py-3 rounded-md transition-colors"
                  >
                    {payStatus === "verifying" ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Verifying...
                      </>
                    ) : payStatus === "success" ? (
                      "Paid ✓"
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white border-2 border-dashed border-slate-300 rounded-md p-4 w-full mt-6 flex gap-3">
                <Lightbulb
                  size={18}
                  className="text-blue-600 shrink-0 mt-0.5"
                />
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Tip:</span> Select your
                  payment plan percentage, then click Continue to proceed with
                  the payment.
                </p>
              </div>
            </div>

            <footer className="text-center text-sm text-slate-500 font-medium py-4 border-t border-slate-200">
              Copyright &copy; Veritas University Abuja 2026.
            </footer>
          </main>
        </div>
      </div>

      {isLoading && payStatus !== "verifying" && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <DotSpinner />
        </div>
      )}
    </div>
  );
}
