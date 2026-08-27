/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import { useMemo, useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Receipt,
  Info,
  X,
  Lightbulb,
  Loader,
  CreditCard,
  Landmark,
  Building2,
  Grid3x3,
  Copy,
  Check,
  Lock,
  ChevronRight,
} from "lucide-react";
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
const MERCHANT_CREST =
  "https://api.dicebear.com/7.x/shapes/svg?seed=veritasuni";
const NIGERIAN_BANKS = [
  "Access Bank",
  "Zenith Bank",
  "Guaranty Trust Bank",
  "First Bank of Nigeria",
  "United Bank for Africa",
  "Fidelity Bank",
  "Union Bank",
  "Sterling Bank",
  "Wema Bank",
  "Ecobank Nigeria",
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function formatNaira(value) {
  return `₦${Number(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
  })}`;
}

function formatNairaShort(value) {
  return `NGN ${Number(value).toLocaleString("en-NG")}`;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============================================================
// PAGE COMPONENTS
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
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// ============================================================
// PAYSTACK-STYLE CHECKOUT MODAL
// ============================================================
const CHECKOUT_TABS = [
  { key: "zap", label: "Zap", icon: null, badge: "NEW" },
  { key: "card", label: "Card", icon: CreditCard },
  { key: "transfer", label: "Transfer", icon: Landmark },
  { key: "bank", label: "Bank", icon: Building2 },
  { key: "ussd", label: "USSD", icon: Grid3x3 },
  { key: "opay", label: "OPay", icon: null },
];

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(String(value)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[11px] tracking-wide text-slate-400 uppercase mb-1">
          {label}
        </div>
        <div className="text-[17px] font-semibold text-[#1a1a2e]">{value}</div>
      </div>
      <button
        onClick={handleCopy}
        className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1"
        title="Copy"
        type="button"
      >
        {copied ? (
          <Check size={17} className="text-emerald-500" />
        ) : (
          <Copy size={17} />
        )}
      </button>
    </div>
  );
}

function CheckoutHeader({ email, amount, onClose }) {
  return (
    <>
      <div className="flex items-start justify-between px-7 pt-6 pb-4">
        <img src={MERCHANT_CREST} alt="merchant" className="w-9 h-9 rounded" />
        <div className="text-right">
          <div className="text-[13px] text-slate-400 max-w-[200px] truncate">
            {email}
          </div>
          <div className="text-[15px] text-slate-600">
            Pay{" "}
            <span className="text-[#1e9e5b] font-bold">
              {formatNairaShort(amount)}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        type="button"
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
      >
        <X size={18} />
      </button>
      <div className="border-b border-slate-100" />
    </>
  );
}

function CardPane({ amount, onPay, submitting }) {
  return (
    <div className="px-7 py-7">
      <h3 className="text-center text-[17px] font-semibold text-[#1a1a2e] mb-6">
        Enter your card details to pay
      </h3>

      <label className="block text-[11px] font-semibold tracking-wide text-[#2f7dc0] mb-1.5">
        CARD NUMBER
      </label>
      <input
        type="text"
        placeholder="0000 0000 0000 0000"
        className="w-full border border-[#2f7dc0] rounded-md px-3.5 py-3 text-[15px] text-slate-500 placeholder:text-slate-300 outline-none mb-4 tracking-wider"
      />

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-[11px] font-semibold tracking-wide text-slate-400 mb-1.5">
            CARD EXPIRY
          </label>
          <input
            type="text"
            placeholder="MM / YY"
            className="w-full border border-slate-200 rounded-md px-3.5 py-3 text-[15px] text-slate-500 placeholder:text-slate-300 outline-none"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-semibold tracking-wide text-slate-400">
              CVV
            </label>
            <span className="text-[11px] text-slate-300">HELP?</span>
          </div>
          <input
            type="text"
            placeholder="123"
            className="w-full border border-slate-200 rounded-md px-3.5 py-3 text-[15px] text-slate-500 placeholder:text-slate-300 outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onPay}
        disabled={submitting}
        className="w-full bg-[#4fae6f] hover:bg-[#3f9c5f] disabled:opacity-60 text-white font-semibold text-[15px] py-3.5 rounded-md flex items-center justify-center gap-2"
      >
        {submitting ? <Loader size={16} className="animate-spin" /> : null}
        Pay {formatNairaShort(amount)}
      </button>
    </div>
  );
}

function OpayPane({ onPay, submitting }) {
  return (
    <div className="px-7 py-14 flex flex-col items-center">
      <div className="flex items-center gap-1.5 mb-8">
        <svg width="26" height="26" viewBox="0 0 26 26">
          <circle
            cx="13"
            cy="13"
            r="11"
            fill="none"
            stroke="#0dbf83"
            strokeWidth="3"
          />
          <circle cx="13" cy="13" r="4" fill="#0dbf83" />
        </svg>
        <span className="text-[26px] font-extrabold text-[#1a1a5e]">Pay</span>
      </div>
      <p className="text-center text-[15px] text-[#1a1a2e] font-medium mb-8 max-w-[280px]">
        Please click the button below to authenticate with your bank
      </p>
      <button
        type="button"
        onClick={onPay}
        disabled={submitting}
        className="w-full bg-[#4fae6f] hover:bg-[#3f9c5f] disabled:opacity-60 text-white font-semibold text-[15px] py-3.5 rounded-md flex items-center justify-center gap-2"
      >
        {submitting ? <Loader size={16} className="animate-spin" /> : null}
        Authenticate
      </button>
    </div>
  );
}

function TransferPane({ amount, onPay, submitting }) {
  const [secondsLeft, setSecondsLeft] = useState(29 * 60 + 59);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="px-7 py-6">
      <h3 className="text-[16px] font-bold text-[#1a1a2e] mb-5">
        Transfer {formatNairaShort(amount)} to PAYSTACK CHECKOUT
      </h3>

      <div className="bg-slate-50 rounded-lg p-5 flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] tracking-wide text-slate-400 uppercase mb-1">
              Bank Name
            </div>
            <div className="text-[17px] font-semibold text-[#1a1a2e]">
              Paystack MFB
            </div>
          </div>
          <button
            type="button"
            className="text-[13px] text-slate-500 hover:text-slate-700 bg-transparent border-none cursor-pointer mt-1"
          >
            CHANGE BANK
          </button>
        </div>
        <CopyField label="Account Number" value="9748857454" />
        <CopyField label="Amount" value={formatNairaShort(amount)} />
      </div>

      <div className="border-t border-dashed border-slate-200 my-6" />

      <p className="text-[14.5px] text-slate-500 leading-relaxed mb-6">
        Search for <strong className="text-slate-600">Paystack MFB</strong> in
        your bank app. This account is for this transaction only and expires in{" "}
        <span className="text-emerald-500 font-semibold">
          {mm}:{ss}
        </span>
      </p>

      <button
        type="button"
        onClick={onPay}
        disabled={submitting}
        className="w-full border border-slate-200 hover:bg-slate-50 disabled:opacity-60 text-[#1a1a2e] font-semibold text-[15px] py-3.5 rounded-md bg-white flex items-center justify-center gap-2"
      >
        {submitting ? <Loader size={16} className="animate-spin" /> : null}
        I've sent the money
      </button>
    </div>
  );
}

function UssdPane({ onPay, submitting }) {
  return (
    <div className="px-7 py-8 flex flex-col items-center text-center">
      <div className="w-9 h-9 rounded-md bg-[#8fe3b0] flex items-center justify-center text-[#1a5c37] font-bold text-lg mb-6">
        *#
      </div>
      <p className="text-[16px] font-semibold text-[#1a1a2e] mb-3 max-w-[300px]">
        Dial the code below to complete this transaction with GTBank's 737
      </p>
      <a href="#" className="text-[#2f7dc0] text-[14.5px] mb-6 no-underline">
        How to pay with GTBank USSD
      </a>
      <div className="text-[26px] font-bold text-[#1a1a2e] mb-1 tracking-tight">
        *737*33*4*171695#
      </div>
      <div className="text-[13px] text-slate-400 mb-7 cursor-pointer">
        Click to copy
      </div>

      <button
        type="button"
        onClick={onPay}
        disabled={submitting}
        className="w-full border border-slate-200 hover:bg-slate-50 disabled:opacity-60 text-[#1a1a2e] font-semibold text-[15px] py-3.5 rounded-md bg-white mb-4 flex items-center justify-center gap-2"
      >
        {submitting ? <Loader size={16} className="animate-spin" /> : null}
        I've completed the payment
      </button>
      <button
        type="button"
        className="text-slate-500 text-[14.5px] bg-transparent border-none cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
}

function ZapPane({ onPay, submitting }) {
  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=" +
    encodeURIComponent("zap-payment-9748857454");
  return (
    <div className="px-7 py-7 flex flex-col items-center text-center">
      <div className="border border-slate-200 rounded-xl p-4 mb-6">
        <img src={qrUrl} alt="Zap QR code" className="w-[170px] h-[170px]" />
      </div>
      <p className="text-[15px] text-[#1a1a2e] font-medium mb-7 max-w-[260px]">
        Scan the QR code to open Zap and complete this payment
      </p>
      <button
        type="button"
        onClick={onPay}
        disabled={submitting}
        className="w-full border border-slate-200 hover:bg-slate-50 disabled:opacity-60 text-[#1a1a2e] font-semibold text-[15px] py-3.5 rounded-md bg-white mb-5 flex items-center justify-center gap-2"
      >
        {submitting ? <Loader size={16} className="animate-spin" /> : null}
        I've completed the payment
      </button>

      <div className="border-t border-slate-100 w-full mb-5" />

      <div className="flex items-center gap-3 w-full">
        <div className="w-9 h-9 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
          Z
        </div>
        <div className="text-left text-[13.5px] text-slate-500 leading-snug">
          Speed up your checkout with Zap.
          <br />
          <span className="text-[#1a1a2e] font-semibold inline-flex items-center gap-1">
            Download Zap by Paystack <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}

function BankPane({ amount, onPay, submitting }) {
  const [query, setQuery] = useState("");
  const filtered = NIGERIAN_BANKS.filter((b) =>
    b.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="px-7 py-6">
      <h3 className="text-center text-[16px] font-semibold text-[#1a1a2e] mb-5">
        Select your bank to pay {formatNairaShort(amount)}
      </h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for your bank"
        className="w-full border border-slate-200 rounded-md px-3.5 py-2.5 text-[14.5px] outline-none mb-4 focus:border-[#2f7dc0]"
      />
      <div className="max-h-[220px] overflow-y-auto flex flex-col divide-y divide-slate-100">
        {filtered.map((bank) => (
          <button
            key={bank}
            type="button"
            onClick={onPay}
            disabled={submitting}
            className="flex items-center justify-between py-3 text-left text-[14.5px] text-[#1a1a2e] bg-transparent border-none cursor-pointer hover:text-[#2f7dc0] disabled:opacity-60"
          >
            <span className="flex items-center gap-3">
              <Building2 size={16} className="text-slate-400" />
              {bank}
            </span>
            <ChevronRight size={15} className="text-slate-300" />
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-6">
            No banks found
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Paystack-style checkout modal.
 * `onPaymentAction` fires whenever the user triggers the "pay" action on
 * whichever tab is active (Pay, Authenticate, I've sent the money, etc).
 * Wire this to your real verification flow.
 */
function PaystackCheckoutModal({
  email,
  amount,
  onClose,
  onPaymentAction,
  submitting,
}) {
  const [activeTab, setActiveTab] = useState("card");

  const renderPane = () => {
    switch (activeTab) {
      case "card":
        return (
          <CardPane
            amount={amount}
            onPay={onPaymentAction}
            submitting={submitting}
          />
        );
      case "opay":
        return <OpayPane onPay={onPaymentAction} submitting={submitting} />;
      case "transfer":
        return (
          <TransferPane
            amount={amount}
            onPay={onPaymentAction}
            submitting={submitting}
          />
        );
      case "ussd":
        return <UssdPane onPay={onPaymentAction} submitting={submitting} />;
      case "zap":
        return <ZapPane onPay={onPaymentAction} submitting={submitting} />;
      case "bank":
        return (
          <BankPane
            amount={amount}
            onPay={onPaymentAction}
            submitting={submitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/40 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="flex shadow-2xl rounded-lg overflow-hidden">
          <div className="w-[230px] bg-[#f7f7f9] pt-7 pb-6 hidden sm:block">
            <div className="px-6 text-[13px] font-bold tracking-wide text-[#1a1a2e] mb-3">
              PAY WITH
            </div>
            <div className="flex flex-col">
              {CHECKOUT_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative flex items-center gap-3 px-6 py-3 text-left text-[14.5px] bg-transparent border-none cursor-pointer border-t border-slate-200 first:border-t-0 ${
                      isActive
                        ? "text-[#1e9e5b] font-semibold"
                        : "text-[#1a1a2e]"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#1e9e5b]" />
                    )}
                    {tab.badge && (
                      <span className="bg-[#e0364d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {tab.badge}
                      </span>
                    )}
                    {Icon && (
                      <Icon
                        size={16}
                        className={
                          isActive ? "text-[#1e9e5b]" : "text-slate-500"
                        }
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative w-[400px] max-w-[92vw] bg-white">
            <CheckoutHeader email={email} amount={amount} onClose={onClose} />
            <div className="max-h-[70vh] overflow-y-auto">{renderPane()}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-[13.5px] mt-5">
          <Lock size={13} />
          Secured by <span className="font-bold text-[#1a1a2e]">paystack</span>
        </div>
      </div>
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

  // Paystack-style checkout modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Load student data from localStorage only - NO API CALL
  useEffect(() => {
    try {
      let parsedStudent = null;

      const savedStudent = localStorage.getItem("student");
      if (savedStudent) {
        parsedStudent = JSON.parse(savedStudent);
        setStudent(parsedStudent);
        console.log("📋 Loaded student from localStorage:", parsedStudent.name);
      } else {
        console.log("⚠️ No student found in localStorage");
      }

      const savedHostel = localStorage.getItem("veritas_hostel_selection");
      if (savedHostel) {
        const hostelData = JSON.parse(savedHostel);
        console.log(
          "🏨 Loaded hostel selection from localStorage:",
          hostelData,
        );
        if (hostelData.fee) {
          setHostelFee(hostelData.fee);
          console.log("💰 Hostel fee set to:", hostelData.fee);
          return;
        }
      }

      if (parsedStudent?.hostelSelection?.fee) {
        setHostelFee(parsedStudent.hostelSelection.fee);
        console.log(
          "💰 Hostel fee from student object:",
          parsedStudent.hostelSelection.fee,
        );
        return;
      }

      setHostelFee(FALLBACK_HOSTEL_FEE);
      console.log(
        "⚠️ No hostel fee found, using fallback:",
        FALLBACK_HOSTEL_FEE,
      );
    } catch (error) {
      console.error("Error loading student data:", error);
      setHostelFee(FALLBACK_HOSTEL_FEE);
    } finally {
      setLoadingStudent(false);
    }

    const paymentStatus = localStorage.getItem(PAYMENT_STATUS_KEY);
    if (paymentStatus === "success") {
      setPayStatus("success");
    }
  }, []);

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

  // Paystack (react-paystack) configuration — kept for reference / fallback
  const paystackConfig = {
    reference: `veritas_${Date.now()}`,
    email: student?.email || "student@veritas.edu.ng",
    amount: Math.round(50 * 100),
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

  // Opens the custom Paystack-style checkout modal instead of navigating away
  const handlePayStackModal = () => {
    if (payStatus === "verifying" || payStatus === "success") return;
    setError(null);
    setSuccess(null);
    setShowPaymentModal(true);
  };

  // Fires when the user completes the "pay" action on any tab inside the modal.
  // No server verification here — we just mark payment as successful and
  // move the student on to bed space selection.
  const handleModalPaymentAction = () => {
    setModalSubmitting(true);

    // TODO: replace this simulated delay with your real per-method charge call
    // (Paystack charge API for card, transfer, USSD, OPay, Zap, bank respectively)
    // if you later want an actual charge to happen before marking success.
    setTimeout(() => {
      localStorage.setItem(PAYMENT_STATUS_KEY, "success");
      localStorage.setItem("veritas_payment_status", "success");

      setModalSubmitting(false);
      setShowPaymentModal(false);
      setPayStatus("success");
      setSuccess("Payment successful!");

      setTimeout(() => {
        navigate(BED_SPACE_ROUTE);
      }, 1200);
    }, 1800);
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
                </div>

                <div className="flex justify-end px-6 py-5 border-t border-slate-100">
                  <button
                    onClick={handlePayStackModal}
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

      {showPaymentModal && (
        <PaystackCheckoutModal
          email={student?.email || "student@veritas.edu.ng"}
          amount={planAmount}
          submitting={modalSubmitting}
          onClose={() => {
            if (!modalSubmitting) setShowPaymentModal(false);
          }}
          onPaymentAction={handleModalPaymentAction}
        />
      )}

      {isLoading && payStatus !== "verifying" && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <DotSpinner />
        </div>
      )}
    </div>
  );
}
