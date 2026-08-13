import { useState } from "react";
import {
  ChevronRight,
  Building2,
  Users2,
  Layers,
  AlertTriangle,
  Info,
  BedDouble,
  VenusAndMars,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

// Demo data — in the real app this would come from your backend
// (hostel list, fees, per-floor/wing categories, and live space counts).
const HOSTELS = [
  {
    id: "C",
    name: "HOSTEL C",
    type: "Male hostel",
    fee: 168000,
    capacity: 6,
    categories: [{ name: "HOSTEL C", spaces: 38 }],
  },
  {
    id: "D",
    name: "HOSTEL D",
    type: "Male hostel",
    fee: 168000,
    capacity: 6,
    categories: [{ name: "HOSTEL D", spaces: 48 }],
  },
  {
    id: "E",
    name: "HOSTEL E",
    type: "Male hostel",
    fee: 168000,
    capacity: 6,
    categories: [{ name: "HOSTEL E", spaces: 89 }],
  },
  {
    id: "F",
    name: "HOSTEL F",
    type: "Male hostel",
    fee: 168000,
    capacity: 6,
    categories: [{ name: "HOSTEL F", spaces: 26 }],
  },
  {
    id: "I",
    name: "HOSTEL I",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [{ name: "HOSTEL I", spaces: 54 }],
  },
  {
    id: "J",
    name: "HOSTEL J",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [{ name: "HOSTEL J", spaces: 61 }],
  },
  {
    id: "K",
    name: "HOSTEL K",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [{ name: "HOSTEL K", spaces: 61 }],
  },
  {
    id: "L",
    name: "HOSTEL L",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [{ name: "HOSTEL L", spaces: 61 }],
  },
  {
    id: "M",
    name: "HOSTEL M",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [
      { name: "Ground Floor", spaces: 51 },
      { name: "First Floor", spaces: 76 },
    ],
  },
  {
    id: "R",
    name: "HOSTEL R",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [
      { name: "Ground Floor", spaces: 109 },
      { name: "First Floor", spaces: 95 },
      { name: "Second Floor", spaces: 135 },
    ],
  },
  {
    id: "S",
    name: "HOSTEL S",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [
      { name: "Ground Floor", spaces: 182 },
      { name: "First Floor", spaces: 242 },
    ],
  },
  {
    id: "T",
    name: "HOSTEL T",
    type: "Male hostel",
    fee: 204000,
    capacity: 6,
    categories: [
      { name: "First Floor", spaces: 61 },
      { name: "Second Floor", spaces: 95 },
      { name: "Third Floor", spaces: 135 },
    ],
  },
];

function formatNaira(value) {
  return `₦${Number(value).toLocaleString("en-NG")}`;
}

function Breadcrumb() {
  return (
    <div className="flex items-center justify-between px-2 md:px-4 pt-6 pb-4">
      <h1 className="text-3xl font-semibold text-slate-800">Select Hostel</h1>
      <span className="text-sm">
        <span className="text-blue-600 font-medium">Dashboard</span>
        <span className="text-slate-400 mx-2">/</span>
        <span className="text-blue-600 font-medium">Payments</span>
        <span className="text-slate-400 mx-2">/</span>
        <span className="text-slate-400">Select Hostel</span>
      </span>
    </div>
  );
}

function IntroBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-700 to-blue-800 text-white p-6">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-3 mb-2">
        <Building2 size={22} />
        <h2 className="text-xl font-bold">Select your hostel</h2>
      </div>
      <p className="relative text-sm text-blue-100 max-w-2xl leading-relaxed">
        Choose an accommodation option to continue with tuition fee payment.
        Your hostel is confirmed only after successful payment.
      </p>
    </div>
  );
}

function InfoPills() {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <VenusAndMars size={16} className="text-blue-600" />
        Gender: <span className="font-semibold">Male</span>
      </div>
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <ShieldCheck size={16} className="text-blue-600" />
        Hostel confirmed only after{" "}
        <span className="font-semibold">successful payment</span>
      </div>
    </div>
  );
}

function WarningBox() {
  return (
    <div className="bg-white border-2 border-dashed border-slate-300 py-5 px-1 rounded-md">
      <div className="flex gap-3">
        <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700 leading-relaxed">
          <span className="font-semibold">Important:</span> Your hostel choice
          is confirmed only upon successful payment. If payment is not completed
          on the same day the RRR is generated, the selected hostel is{" "}
          <span className="font-semibold">not guaranteed</span> and may be
          reassigned to another available hostel.
        </p>
      </div>
    </div>
  );
}

function InfoBox() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-md p-5 border-dashed">
      <div className="flex gap-3">
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
          <Info size={14} className="text-white" />
        </div>
        <div className="text-sm text-slate-700 leading-relaxed space-y-3">
          <p className="font-semibold text-slate-800">
            PA-ETOS Hostel Accommodation Notice
          </p>
          <p>
            PA-ETOS is a private hostel. Bed spaces are{" "}
            <span className="font-semibold">not allocated on this portal</span>.
            Students who select PA-ETOS are expected to have already reserved
            accommodation with the PA-ETOS Administration Office{" "}
            <span className="font-semibold">before</span> paying tuition fees on
            the portal.
          </p>
          <p>
            Selecting PA-ETOS during this payment does{" "}
            <span className="font-semibold">not guarantee</span> a hostel place
            in any way.
          </p>
        </div>
      </div>
    </div>
  );
}

function HostelCard({ hostel, selected, onSelectCategory }) {
  const isMultiOption = hostel.categories.length > 1;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-center py-4 px-4">
        <p className="font-bold text-white tracking-wide">{hostel.name}</p>
        <p className="text-xs text-blue-200 mt-0.5">{hostel.type}</p>
      </div>

      <div className="p-5">
        <p className="text-[11px] tracking-wider text-slate-400 font-medium">
          HOSTEL FEE
        </p>
        <p className="text-2xl font-bold text-slate-800 mt-1">
          {formatNaira(hostel.fee)}
        </p>

        <div className="h-px bg-slate-200 my-4" />

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600">
            <Users2 size={14} className="text-blue-600" />
            Capacity {hostel.capacity}
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600">
            <Layers size={14} className="text-blue-600" />
            {hostel.categories.length} option
            {isMultiOption ? "s" : ""}
          </span>
        </div>

        <div
          className={`flex items-center gap-2 rounded-md px-4 py-2.5 mb-3 border border-l-4 ${
            selected
              ? "bg-blue-50 border-blue-200 border-l-blue-600"
              : "bg-blue-50/60 border-blue-100 border-l-blue-600"
          }`}
        >
          <BookOpen size={16} className="text-blue-700" />
          <span className="font-semibold text-blue-900 text-sm">
            Choose category
          </span>
        </div>

        <div className="space-y-2">
          {hostel.categories.map((cat) => {
            const isSelected =
              selected?.hostelId === hostel.id &&
              selected?.category === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(hostel.id, cat.name)}
                className={`w-full flex items-center justify-between rounded-md px-4 py-3 border transition-colors ${
                  isSelected
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm">
                    {cat.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Available spaces: {cat.spaces}
                  </p>
                </div>
                <ChevronRight size={18} className=" text-blue-900" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SelectHostel() {
  const [selected, setSelected] = useState({
    hostelId: "E",
    category: "HOSTEL E",
  });

  const handleSelectCategory = (hostelId, category) => {
    setSelected({ hostelId, category });
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1">
          <Breadcrumb />

          <div className="px-3 md:px-4">
            <IntroBanner />
          </div>

          <div className="px-3 md:px-4 mt-5">
            <InfoPills />
          </div>

          <div className="px-3 md:px-4 mt-6">
            <WarningBox />
          </div>

          <div className="px-3 md:px-4 mt-4">
            <InfoBox />
          </div>

          <div className="px-3 md:px-4 mt-7 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BedDouble size={18} className="text-blue-600" />
              <h3 className="font-semibold text-slate-800 text-[17px]">
                Available hostels
              </h3>
            </div>
            <span className="text-sm text-slate-400">
              Select a floor or wing category to continue
            </span>
          </div>

          <div className="px-2 md:px-2 py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOSTELS.map((hostel) => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                selected={selected}
                onSelectCategory={handleSelectCategory}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
