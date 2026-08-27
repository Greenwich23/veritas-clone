import React, { useState, useEffect, useRef } from "react";
import {
  X,
  CreditCard,
  Landmark,
  Building2,
  Grid3x3,
  Copy,
  Check,
  Lock,
  Smartphone,
  ChevronRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// CONFIG / MOCK DATA
// ---------------------------------------------------------------------------

const CHECKOUT = {
  email: "vug/csc/23/9680@nas...",
  amount: 2191350, // naira, used on Card / OPay / USSD / Zap panes
  transferAmount: 2190150, // paystack adds/subtracts small variance on transfer, matches screenshot
  bankName: "Paystack MFB",
  accountNumber: "9748857454", // Updated account number
  ussdCode: "*737*33*4*171695#",
  ussdBank: "GTBank's 737",
  crest:
    "https://public-files-paystack-prod.s3.eu-west-1.amazonaws.com/integration-logos/lm6hgcgkeij4c78aog56.png",
};

const naira = (n) => "NGN " + n.toLocaleString("en-NG");

const TABS = [
  { key: "zap", label: "Zap", icon: null, badge: "NEW" },
  { key: "card", label: "Card", icon: CreditCard },
  { key: "transfer", label: "Transfer", icon: Landmark },
  { key: "bank", label: "Bank", icon: Building2 },
  { key: "ussd", label: "USSD", icon: Grid3x3 },
  { key: "opay", label: "OPay", icon: null },
];

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

// ---------------------------------------------------------------------------
// SMALL SHARED PIECES
// ---------------------------------------------------------------------------

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
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

function ModalHeader({ onClose }) {
  return (
    <>
      <div className="flex items-start justify-between px-7 pt-6 pb-4">
        <img
          src="https://public-files-paystack-prod.s3.eu-west-1.amazonaws.com/integration-logos/lm6hgcgkeij4c78aog56.png"
          alt="merchant"
          className="w-9 h-9 rounded"
        />
        <div className="text-right">
          <div className="text-[13px] text-slate-400">{CHECKOUT.email}</div>
          <div className="text-[15px] text-slate-600">
            Payid{" "}
            <span className="text-[#1e9e5b] font-bold">
              {naira(CHECKOUT.amount)}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
      >
        <X size={18} />
      </button>
      <div className="border-b border-slate-100" />
    </>
  );
}

// ---------------------------------------------------------------------------
// PANES
// ---------------------------------------------------------------------------

function CardPane() {
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
        className="w-full border border-[#2f7dc0] rounded-md px-3.5 py-3 text-[15px] text-slate-400 placeholder:text-slate-300 outline-none mb-4 tracking-wider"
      />

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-[11px] font-semibold tracking-wide text-slate-400 mb-1.5">
            CARD EXPIRY
          </label>
          <input
            type="text"
            placeholder="MM / YY"
            className="w-full border border-slate-200 rounded-md px-3.5 py-3 text-[15px] text-slate-400 placeholder:text-slate-300 outline-none"
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
            className="w-full border border-slate-200 rounded-md px-3.5 py-3 text-[15px] text-slate-400 placeholder:text-slate-300 outline-none"
          />
        </div>
      </div>

      <button className="w-full bg-[#4fae6f] hover:bg-[#3f9c5f] text-white font-semibold text-[15px] py-3.5 rounded-md">
        Pay {naira(CHECKOUT.amount)}
      </button>
    </div>
  );
}

function OpayPane() {
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
      <button className="w-full bg-[#4fae6f] hover:bg-[#3f9c5f] text-white font-semibold text-[15px] py-3.5 rounded-md">
        Authenticate
      </button>
    </div>
  );
}

function TransferPane() {
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
        Transfer {naira(CHECKOUT.transferAmount)} to PAYSTACK CHECKOUT
      </h3>

      <div className="bg-slate-50 rounded-lg p-5 flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] tracking-wide text-slate-400 uppercase mb-1">
              Bank Name
            </div>
            <div className="text-[17px] font-semibold text-[#1a1a2e]">
              {CHECKOUT.bankName}
            </div>
          </div>
          <button className="text-[13px] text-slate-500 hover:text-slate-700 bg-transparent border-none cursor-pointer mt-1">
            CHANGE BANK
          </button>
        </div>
        <CopyField label="Account Number" value={CHECKOUT.accountNumber} />
        <CopyField label="Amount" value={naira(CHECKOUT.transferAmount)} />
      </div>

      <div className="border-t border-dashed border-slate-200 my-6" />

      <p className="text-[14.5px] text-slate-500 leading-relaxed mb-6">
        Search for{" "}
        <strong className="text-slate-600">{CHECKOUT.bankName}</strong> in your
        bank app. This account is for this transaction only and expires in{" "}
        <span className="text-emerald-500 font-semibold">
          {mm}:{ss}
        </span>
      </p>

      <button className="w-full border border-slate-200 hover:bg-slate-50 text-[#1a1a2e] font-semibold text-[15px] py-3.5 rounded-md bg-white">
        I've sent the money
      </button>
    </div>
  );
}

function UssdPane() {
  return (
    <div className="px-7 py-8 flex flex-col items-center text-center">
      <div className="w-9 h-9 rounded-md bg-[#8fe3b0] flex items-center justify-center text-[#1a5c37] font-bold text-lg mb-6">
        *#
      </div>
      <p className="text-[16px] font-semibold text-[#1a1a2e] mb-3 max-w-[300px]">
        Dial the code below to complete this transaction with{" "}
        {CHECKOUT.ussdBank}
      </p>
      <a href="#" className="text-[#2f7dc0] text-[14.5px] mb-6 no-underline">
        How to pay with GTBank USSD
      </a>
      <div className="text-[26px] font-bold text-[#1a1a2e] mb-1 tracking-tight">
        {CHECKOUT.ussdCode}
      </div>
      <div className="text-[13px] text-slate-400 mb-7 cursor-pointer">
        Click to copy
      </div>

      <button className="w-full border border-slate-200 hover:bg-slate-50 text-[#1a1a2e] font-semibold text-[15px] py-3.5 rounded-md bg-white mb-4">
        I've completed the payment
      </button>
      <button className="text-slate-500 text-[14.5px] bg-transparent border-none cursor-pointer">
        Cancel
      </button>
    </div>
  );
}

function ZapPane() {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(
    "zap-payment-" + CHECKOUT.accountNumber,
  )}`;
  return (
    <div className="px-7 py-7 flex flex-col items-center text-center">
      <div className="border border-slate-200 rounded-xl p-4 mb-6">
        <img src={qrUrl} alt="Zap QR code" className="w-[170px] h-[170px]" />
      </div>
      <p className="text-[15px] text-[#1a1a2e] font-medium mb-7 max-w-[260px]">
        Scan the QR code to open Zap and complete this payment
      </p>
      <button className="w-full border border-slate-200 hover:bg-slate-50 text-[#1a1a2e] font-semibold text-[15px] py-3.5 rounded-md bg-white mb-5">
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

function BankPane() {
  const [query, setQuery] = useState("");
  const filtered = NIGERIAN_BANKS.filter((b) =>
    b.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="px-7 py-6">
      <h3 className="text-center text-[16px] font-semibold text-[#1a1a2e] mb-5">
        Select your bank to pay {naira(CHECKOUT.amount)}
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
            className="flex items-center justify-between py-3 text-left text-[14.5px] text-[#1a1a2e] bg-transparent border-none cursor-pointer hover:text-[#2f7dc0]"
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

// ---------------------------------------------------------------------------
// MODAL
// ---------------------------------------------------------------------------

function PaystackModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("card");

  const renderPane = () => {
    switch (activeTab) {
      case "card":
        return <CardPane />;
      case "opay":
        return <OpayPane />;
      case "transfer":
        return <TransferPane />;
      case "ussd":
        return <UssdPane />;
      case "zap":
        return <ZapPane />;
      case "bank":
        return <BankPane />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="flex shadow-2xl rounded-lg overflow-hidden">
          {/* LEFT: PAY WITH sidebar */}
          <div className="w-[230px] bg-[#f7f7f9] pt-7 pb-6 hidden sm:block">
            <div className="px-6 text-[13px] font-bold tracking-wide text-[#1a1a2e] mb-3">
              PAY WITH
            </div>
            <div className="flex flex-col">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
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

          {/* RIGHT: active pane */}
          <div className="relative w-[400px] max-w-[92vw] bg-white">
            <ModalHeader onClose={onClose} />
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

// ---------------------------------------------------------------------------
// DEMO WRAPPER (so this file runs standalone)
// ---------------------------------------------------------------------------

export default function PaystackCheckoutDemo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#2f7dc0] hover:bg-[#2569a8] text-white font-medium px-6 py-3 rounded-md"
        >
          Pay Tuition Fee
        </button>
      )}
      {open && <PaystackModal onClose={() => setOpen(false)} />}
    </div>
  );
}
