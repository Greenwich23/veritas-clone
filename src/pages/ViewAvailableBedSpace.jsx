/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
import { useMemo, useState } from "react";
import {
  LayoutGrid,
  Target,
  CreditCard,
  Home as HomeIcon,
  HelpCircle,
  LogOut,
  Menu,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  User,
  BedDouble,
  Building2,
  Layers,
  Info,
  Wallet2,
} from "lucide-react";
import { STORAGE_KEY, HOSTELS, formatNaira } from "./hostelData";
import { useNavigate } from "react-router-dom";

// Used only if the user opens this page without picking a hostel first.
const FALLBACK_SELECTION = {
  hostelId: "T",
  hostelName: "HOSTEL T",
  category: "Second Floor",
  categorySpaces: 95,
  fee: 204000,
};

function Breadcrumb() {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 pt-6 pb-4">
      <h1 className="text-3xl font-semibold text-slate-800">
        View Available Bed Space
      </h1>
      <span className="text-sm">
        <span className="text-blue-600 font-medium">Dashboard</span>
        <span className="text-slate-400 mx-2">/</span>
        <span className="text-blue-600 font-medium">Select Hostel</span>
        <span className="text-slate-400 mx-2">/</span>
        <span className="text-slate-400">Available Bed Space</span>
      </span>
    </div>
  );
}

function IntroBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-700 to-blue-800 text-white p-6">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-3 mb-2">
        <BedDouble size={22} />
        <h2 className="text-xl font-bold">Available bed spaces</h2>
      </div>
      <p className="relative text-sm text-blue-100 max-w-2xl leading-relaxed">
        Review available bunks for this category before continuing to payment.
        Viewing does not reserve a bed.
      </p>
    </div>
  );
}

function InfoPills({ hostelName, category, availableSpaces, fee }) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <Building2 size={16} className="text-blue-600" />
        <span className="font-semibold">{hostelName}</span>
      </div>
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <Layers size={16} className="text-blue-600" />
        Floor: <span className="font-semibold">{category}</span>
      </div>
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <BedDouble size={16} className="text-blue-600" />
        Available spaces:{" "}
        <span className="font-semibold">{availableSpaces}</span>
      </div>
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <Wallet2 size={16} className="text-blue-600" />
        Price: <span className="font-semibold">{formatNaira(fee)}</span>
      </div>
    </div>
  );
}

function AboutBox({ availableSpaces, alreadyPaid }) {
  return (
    <div className="bg-teal-600 rounded-md p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Info size={18} />
        <p className="font-bold">About available spaces</p>
      </div>
      <p className="text-sm leading-relaxed text-teal-50">
        The{" "}
        <span className="font-bold">Available spaces: {availableSpaces}</span>{" "}
        shown above is the actual number bedspaces available for payment. The
        rooms listed below may be more than this because{" "}
        <span className="font-bold">{alreadyPaid}</span> students have already
        paid for this category but have not yet selected a bed space.
      </p>
    </div>
  );
}

function BunkCard({ room, bunk, position }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-center py-3 px-4">
        <p className="flex items-center justify-center gap-2 font-bold text-white text-[15px]">
          <BedDouble size={16} />
          Room {room}
        </p>
        <p className="text-xs text-blue-200 mt-0.5">Available</p>
      </div>
      <div className="p-4">
        <div className="bg-slate-50 border border-slate-100 rounded-md py-4 text-center">
          <div className="flex justify-center mb-1.5">
            <BedDouble size={16} className="text-blue-600" />
          </div>
          <p className="text-xs text-slate-500">Bunk</p>
          <p className="font-bold text-slate-800 mt-0.5">
            {bunk}, {position}
          </p>
        </div>
      </div>
    </div>
  );
}

// Generates room/bunk cards whose count matches availableSpaces exactly,
// with room numbers increasing (not strictly consecutive) and occasional
// repeated room numbers when a room has more than one free bunk.
function generateBunks(availableSpaces) {
  const bunks = [];
  let roomNumber = 1 + Math.floor(Math.random() * 3);
  let remaining = availableSpaces;

  while (remaining > 0) {
    const bunksInRoom = Math.min(remaining, Math.random() < 0.5 ? 1 : 2);
    for (let b = 1; b <= bunksInRoom; b++) {
      bunks.push({
        room: roomNumber,
        bunk: b,
        position: Math.random() < 0.5 ? "Up" : "Down",
      });
    }
    remaining -= bunksInRoom;
    roomNumber += 1 + Math.floor(Math.random() * 3);
  }

  return bunks;
}

export default function ViewAvailableBedSpace() {
  const [selection] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : FALLBACK_SELECTION;
    } catch (err) {
      console.error("Could not read saved hostel selection:", err);
      return FALLBACK_SELECTION;
    }
  });

  // "Live" spaces still purchasable for this category (can be lower than
  // the category's listed total spaces, since some students may already
  // be mid-payment). Regenerated only when the selection changes.
  const { availableSpaces, alreadyPaid, bunks } = useMemo(() => {
    const total = selection.categorySpaces || 20;
    const live = Math.min(
      total,
      Math.max(5, Math.floor(Math.random() * 25) + 5),
    );
    const paid = Math.max(1, Math.floor(Math.random() * 10));
    return {
      availableSpaces: live,
      alreadyPaid: paid,
      bunks: generateBunks(live),
    };
  }, [selection.hostelId, selection.category]);

  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">
          <Breadcrumb />

          <div className="px-4 md:px-8">
            <IntroBanner />
          </div>

          <div className="px-4 md:px-8 mt-5">
            <InfoPills
              hostelName={selection.hostelName}
              category={selection.category}
              availableSpaces={availableSpaces}
              fee={selection.fee}
            />
          </div>

          <div className="px-4 md:px-8 mt-4">
            <AboutBox
              availableSpaces={availableSpaces}
              alreadyPaid={alreadyPaid}
            />
          </div>

          <div className="px-4 md:px-8 mt-5 flex flex-wrap gap-3">
            <button
              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 font-medium px-5 py-2.5 rounded-md hover:bg-slate-50 transition-colors"
              onClick={() => navigate("/payments/select-hostel")}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md transition-colors">
              Continue to payment plan
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="px-4 md:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bunks.map((b, i) => (
              <BunkCard
                key={i}
                room={b.room}
                bunk={b.bunk}
                position={b.position}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
