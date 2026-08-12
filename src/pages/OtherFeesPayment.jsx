/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  CreditCard,
  ClipboardList,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Breadcrumb() {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 pt-6 pb-4">
      <h1 className="text-3xl font-semibold text-slate-800">
        Other Fees Payment
      </h1>
      <span className="text-sm">
        <span className="text-blue-600 font-medium">Dashboard</span>
        <span className="text-slate-400 mx-2">/</span>
        <span className="text-slate-400">Other Fees</span>
      </span>
    </div>
  );
}

function IntroBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-700 to-blue-800 text-white p-6">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-3 mb-2">
        <CreditCard size={22} />
        <h2 className="text-xl font-bold">Pay other fees</h2>
      </div>
      <p className="relative text-sm text-blue-100 max-w-2xl leading-relaxed">
        Select a fee category and session to generate payment. Use Outstanding
        Tuition Fee when settling a tuition debt balance.
      </p>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none border border-slate-300 rounded-md px-4 py-3 text-slate-600 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronLeft
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 text-slate-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

export default function OtherFeesPayment() {
  const [feeCategory, setFeeCategory] = useState("Carryover Course");
  const [quantity, setQuantity] = useState("1");
  const [session, setSession] = useState("2026/2027");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto">
          <Breadcrumb />

          <div className="px-4 md:px-8">
            <IntroBanner />
          </div>

          <div className="px-4 md:px-8 mt-7 flex items-center gap-2">
            <ClipboardList size={18} className="text-blue-600" />
            <h3 className="font-semibold text-slate-800 text-[17px]">
              Payment processing
            </h3>
          </div>
          <div className="h-px bg-slate-200 mx-4 md:mx-8 mt-3" />

          <div className="px-4 md:px-8 py-6 w-[100%]">
            <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-8">
              <SelectField
                label="Fee category"
                value={feeCategory}
                onChange={(e) => setFeeCategory(e.target.value)}
                options={[
                  "Carryover Course",
                  "Outstanding Tuition Fee",
                  "Hostel Fee",
                  "Late Registration",
                  "Miscellaneous Dues",
                ]}
              />
              <SelectField
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                options={["1", "2", "3", "4", "5"]}
              />
              <SelectField
                label="Session"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                options={["2026/2027", "2025/2026", "2024/2025"]}
              />

              <div className="flex justify-end pt-2">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors">
                  Continue
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
