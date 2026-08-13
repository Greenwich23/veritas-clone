/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Receipt,
  HelpCircle as HelpIcon,
  CreditCard,
} from "lucide-react";
import { STORAGE_KEY, STUDENT, formatNaira, todayISO } from "./feeData";
import { useNavigate } from "react-router-dom";

const FALLBACK_SELECTION = {
  feeCategory: "Carryover Course",
  quantity: 1,
  session: "2026/2027",
  amount: 10000,
  totalAmount: 10000,
  paymentType: "Carryover Course",
  initiatedDate: todayISO(),
};

function Breadcrumb() {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 pt-6 pb-4">
      <h1 className="text-3xl font-semibold text-slate-800">
        Payment Analysis
      </h1>
      <span className="text-sm">
        <span className="text-blue-600 font-medium">Dashboard</span>
        <span className="text-slate-400 mx-2">/</span>
        <span className="text-slate-400">Other Fee</span>
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
        <h2 className="text-xl font-bold">Other Fee Checkout</h2>
      </div>
      <p className="relative text-sm text-blue-100 max-w-2xl leading-relaxed">
        Confirm the fee details below, then pay with Wallet, Remita, or
        Paystack.
      </p>
    </div>
  );
}

// Updated SummaryRow with proper vertical line
function SummaryRow({ leftLabel, leftValue, rightLabel, rightValue }) {
  return (
    <div className="grid grid-cols-2 border-b-2 border-slate-300 last:border-b-0">
      {/* Left Column with vertical border */}
      <div className="grid grid-cols-2 px-5 py-4 border-r-2 border-slate-300">
        <span className="font-semibold text-blue-900 text-[15px]">
          {leftLabel}
        </span>
        <span className="text-slate-600 text-[15px]">{leftValue}</span>
      </div>
      {/* Right Column - no vertical border */}
      <div className="grid grid-cols-2 px-5 py-4">
        <span className="font-semibold text-blue-900 text-[15px]">
          {rightLabel}
        </span>
        <span className="text-slate-600 text-[15px]">{rightValue}</span>
      </div>
    </div>
  );
}

export default function PaymentAnalysis() {
  const [selection, setSelection] = useState(FALLBACK_SELECTION);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSelection(JSON.parse(saved));
    } catch (err) {
      console.error("Could not read saved fee selection:", err);
    }
  }, []);

  const rows = [
    {
      leftLabel: "Name",
      leftValue: STUDENT.name,
      rightLabel: "Reg No",
      rightValue: STUDENT.regNo,
    },
    {
      leftLabel: "Email",
      leftValue: STUDENT.email,
      rightLabel: "Phone No",
      rightValue: STUDENT.phone,
    },
    {
      leftLabel: "Amount",
      leftValue: formatNaira(selection.amount),
      rightLabel: "Payment Type",
      rightValue: selection.paymentType,
    },
    {
      leftLabel: "Quantity",
      leftValue: selection.quantity,
      rightLabel: "Total Amount",
      rightValue: formatNaira(selection.totalAmount),
    },
    {
      leftLabel: "Session",
      leftValue: selection.session,
      rightLabel: "Initiated Date",
      rightValue: selection.initiatedDate,
    },
  ];

  const navigate = useNavigate();

  return (
    <>
      <Breadcrumb />

      <div className="px-4 md:px-8">
        <IntroBanner />
      </div>

      <div className="px-4 md:px-8 mt-5">
        <button className="flex items-center gap-2 text-blue-600 border border-blue-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-50 transition-colors">
          <HelpIcon size={16} />
          Help
        </button>
      </div>

      <div className="px-4 md:px-8 py-6 flex-1">
        <div className="bg-white rounded-lg border-2 border-slate-300">
          <div className="flex items-center justify-between px-5 py-4 border-b-2 border-slate-300">
            <h3 className="font-bold text-blue-900 text-[16px]">
              Initiated Payment Summary
            </h3>
            <button
              className="flex items-center gap-2 text-red-500 border border-red-300 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-red-50 transition-colors"
              onClick={() => navigate("/payments/other-payment")}
            >
              <ArrowLeft size={14} />
              Prev
            </button>
          </div>

          <div>
            {rows.map((row, index) => (
              <SummaryRow key={index} {...row} />
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-3 px-5 py-5">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md transition-colors">
              Pay with Remita
              <ArrowRight size={16} />
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-md transition-colors">
              Pay with Paystack
              <CreditCard size={16} />
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center text-sm text-slate-500 font-medium py-4 border-t border-slate-200">
        Copyright &copy; Veritas University Abuja 2026 .
      </footer>
    </>
  );
}
