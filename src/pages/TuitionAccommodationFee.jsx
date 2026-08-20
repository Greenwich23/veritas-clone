/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
import { useMemo, useState } from "react";
// import { usePaystackPayment } from "react-paystack";
import { ArrowRight, Receipt, Info, X, Lightbulb } from "lucide-react";
import { STORAGE_KEY as HOSTEL_STORAGE_KEY, STUDENT } from "./hostelData";

// ============================================================
// TEMPORARY PAYMENT AMOUNT
// For now, the student only pays ₦500.
// The original tuition + hostel calculation is kept below
// in comments so it can easily be restored later.
// ============================================================
const DEMO_PAYMENT_AMOUNT = 1000000;

// Original amounts — kept for when the real calculation is restored.
// const TUITION_FEE = 2217850;
// const FALLBACK_HOSTEL_FEE = 228000;
// const PLAN_OPTIONS = [25, 50, 75, 100];

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

function formatNaira(value) {
  return `₦${Number(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
  })}`;
}

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

function NoteBar({ onDismiss }) {
  return (
    <div className="bg-teal-600 rounded-md px-5 py-4 text-white flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <Info size={18} className="shrink-0 mt-0.5" />

        <p className="text-sm leading-relaxed">
          <span className="font-semibold">NOTE:</span> Your current payment
          amount is{" "}
          <span className="font-bold">{formatNaira(DEMO_PAYMENT_AMOUNT)}</span>.
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

function ReadOnlyField({ label, value }) {
  return (
    <div>
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
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <img
        src="/Spinner.png"
        alt="Loading"
        className="w-50 h-50 object-contain"
        style={{
          animation: "spin 1s linear infinite",
          filter: "brightness(0) invert(1)",
        }}
      />
    </div>
  );
}

export default function TuitionAccommodationFee() {
  /*
  ============================================================
  ORIGINAL HOSTEL FEE CALCULATION
  Kept here for later.

  const hostelFee = useMemo(() => {
    try {
      const saved = localStorage.getItem(HOSTEL_STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed.fee) return parsed.fee;
      }
    } catch (err) {
      console.error("Could not read saved hostel selection:", err);
    }

    return FALLBACK_HOSTEL_FEE;
  }, []);

  const sum = TUITION_FEE + hostelFee;

  const planFee = sum * (plan / 100);
  const balance = sum - planFee;
  ============================================================
  */

  const [isLoading, setIsLoading] = useState(false);
  const [noteVisible, setNoteVisible] = useState(true);
  const [payStatus, setPayStatus] = useState(null);

  /*
  Original payment plan state — kept for later.

  const [plan, setPlan] = useState(75);
  const [pendingPlan, setPendingPlan] = useState(75);

  const handlePlanChange = (e) => {
    const newPlan = Number(e.target.value);

    setPendingPlan(newPlan);
    setIsLoading(true);

    setTimeout(() => {
      setPlan(newPlan);
      setIsLoading(false);
    }, 150);
  };
  */

  // ============================================================
  // PAYSTACK
  // Amount must be in kobo.
  //
  // ₦500 × 100 = 50,000 kobo
  // ============================================================

  const paystackConfig = {
    reference: `veritas_${Date.now()}`,

    email: STUDENT.email,

    // TEMPORARY: Always charge ₦500
    amount: DEMO_PAYMENT_AMOUNT * 100,

    publicKey: PAYSTACK_PUBLIC_KEY,

    metadata: {
      custom_fields: [
        {
          display_name: "Student",
          variable_name: "student_name",
          value: STUDENT.name,
        },
        {
          display_name: "Reg No",
          variable_name: "reg_no",
          value: STUDENT.regNo,
        },

        // Original payment plan metadata can be restored later.
        /*
        {
          display_name: "Payment Plan",
          variable_name: "payment_plan",
          value: `${plan}%`,
        },
        */
      ],
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const verifyOnServer = async (reference) => {
    setPayStatus("verifying");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/paystack/verify/${reference}`,
      );

      const data = await res.json();

      setPayStatus(data.verified ? "success" : "failed");
    } catch (err) {
      console.error("Verification request failed:", err);
      setPayStatus("failed");
    }
  };

  const handlePayClick = () => {
    if (!PAYSTACK_PUBLIC_KEY) {
      console.error("Missing VITE_PAYSTACK_PUBLIC_KEY in .env");
      return;
    }

    initializePayment({
      onSuccess: (transaction) => {
        // transaction.reference is what you send to your backend to verify
        verifyOnServer(transaction.reference);
      },

      onClose: () => {
        console.log("Payment popup closed without completing.");
      },
    });
  };

  return (
    <div className="relative flex h-screen w-full bg-slate-100 font-sans">
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
                <NoteBar onDismiss={() => setNoteVisible(false)} />
              </div>
            )}

            {payStatus === "success" && (
              <div className="px-4 md:px-3 mt-5">
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-md px-5 py-4 text-sm font-medium">
                  Payment verified successfully.
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
                  {/* ==================================================
                      ORIGINAL TUITION FIELD

                      Restore later:

                      <ReadOnlyField
                        label="Tuition Fee"
                        value={TUITION_FEE.toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                        })}
                      />
                  ================================================== */}

                  <ReadOnlyField label="Tuition Fee" value="₦2,217,850.00" />

                  {/* ==================================================
                      ORIGINAL HOSTEL FIELD

                      Restore later:

                      <ReadOnlyField
                        label="Hostel Fee"
                        value={hostelFee.toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                        })}
                      />
                  ================================================== */}

                  <ReadOnlyField label="Hostel Fee" value="₦228,000.00" />

                  {/* ==================================================
                      TEMPORARY PAYMENT AMOUNT
                  ================================================== */}

                  <ReadOnlyField
                    label="Amount to Pay"
                    value={formatNaira(DEMO_PAYMENT_AMOUNT)}
                  />

                  {/* ==================================================
                      ORIGINAL PAYMENT PLAN DROPDOWN

                      Restore later:

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
                      </div>
                  ================================================== */}

                  <ReadOnlyField label="Payment Status" value="Pending" />
                </div>

                <div className="flex justify-end px-6 py-5 border-t border-slate-100">
                  <button
                    onClick={handlePayClick}
                    disabled={payStatus === "verifying"}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-6 py-3 rounded-md transition-colors"
                  >
                    {payStatus === "verifying" ? "Verifying..." : "Continue"}

                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              <div className="bg-white border-2 border-dashed border-slate-300 rounded-md p-4 w-full mt-6 flex gap-3">
                <Lightbulb
                  size={18}
                  className="text-blue-600 shrink-0 mt-0.5"
                />

                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Tip:</span> Click Continue to
                  proceed with the ₦500 payment.
                </p>
              </div>
            </div>

            <footer className="text-center text-sm text-slate-500 font-medium py-4 border-t border-slate-200">
              Copyright &copy; Veritas University Abuja 2026.
            </footer>
          </main>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <DotSpinner />
        </div>
      )}
    </div>
  );
}
