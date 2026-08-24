/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Loader,
} from "lucide-react";
import { HOSTELS, formatNaira } from "./hostelData";
import { useAuth } from "../context/AuthContext";

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
        Choose an accommodation option to continue. You can select a hostel now
        and complete payment later to secure your bed space.
      </p>
    </div>
  );
}

function InfoPills({ student }) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <VenusAndMars size={16} className="text-blue-600" />
        Gender:{" "}
        <span className="font-semibold">{student?.gender || "Male"}</span>
      </div>
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <ShieldCheck size={16} className="text-blue-600" />
        Hostel selection is confirmed after{" "}
        <span className="font-semibold">successful payment</span>
      </div>
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <ShieldCheck
          size={16}
          className={`${student?.paymentStatus === "success" ? "text-green-600" : "text-yellow-600"}`}
        />
        Payment Status:{" "}
        <span
          className={`font-semibold ${
            student?.paymentStatus === "success"
              ? "text-green-600"
              : "text-yellow-600"
          }`}
        >
          {student?.paymentStatus === "success" ? "✅ Paid" : "⏳ Pending"}
        </span>
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
          is confirmed only upon successful payment. You can select a hostel
          now, but you must complete payment before you can select a specific
          bed space.
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

function HostelCard({ hostel, selected, onSelectCategory, isDisabled }) {
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
            selected?.hostelId === hostel.id
              ? "bg-blue-50 border-blue-200 border-l-blue-600"
              : "bg-blue-50/60 border-blue-100 border-l-blue-600"
          }`}
        >
          <BookOpen size={16} className="text-blue-700" />
          <span className="font-semibold text-blue-900 text-sm">
            {selected?.hostelId === hostel.id
              ? "✅ Selected"
              : "Choose category"}
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
                onClick={() => onSelectCategory(hostel, cat)}
                disabled={isDisabled}
                className={`w-full flex items-center justify-between rounded-md px-4 py-3 border transition-colors ${
                  isSelected
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm">
                    {cat.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Available spaces: {cat.spaces}
                  </p>
                </div>
                {isSelected ? (
                  <span className="text-green-600 text-sm font-semibold">
                    ✓ Selected
                  </span>
                ) : (
                  <ChevronRight size={18} className="text-blue-900" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SelectHostel() {
  const navigate = useNavigate();
  const { user, loading: authLoading, updateUser } = useAuth();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSelection = localStorage.getItem("veritas_hostel_selection");
    if (savedSelection) {
      try {
        const parsed = JSON.parse(savedSelection);
        setSelected({
          hostelId: parsed.hostelId,
          category: parsed.category,
        });
        // Also update user context
        if (user) {
          updateUser({ hostelSelection: parsed });
        }
      } catch (err) {
        console.error("Error parsing saved selection:", err);
      }
    }
    setLoading(false);
  }, []);

  const handleSelectCategory = async (hostel, category) => {
    // Check if already selected in localStorage
    const savedSelection = localStorage.getItem("veritas_hostel_selection");
    if (savedSelection) {
      setError(
        "You have already selected a hostel. You cannot change your selection.",
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const selectionData = {
      hostelId: hostel.id,
      hostelName: hostel.name,
      category: category.name,
      fee: hostel.fee,
      selectedAt: new Date().toISOString(),
    };

    console.log("📤 Saving selection to localStorage:", selectionData);

    try {
      // Save to localStorage
      localStorage.setItem(
        "veritas_hostel_selection",
        JSON.stringify(selectionData),
      );

      // Update user context
      if (updateUser) {
        updateUser({ hostelSelection: selectionData });
      }

      setSuccess("Hostel selected successfully!");
      setSelected({ hostelId: hostel.id, category: category.name });

      // Try to save to backend (optional - don't wait for it)
      try {
        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        await axios.post(
          `${API_BASE_URL}/api/bed-space/select`,
          selectionData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        console.log("✅ Backend updated successfully");
      } catch (backendErr) {
        console.log(
          "⚠️ Backend save failed, but localStorage has the data:",
          backendErr.message,
        );
      }

      // Navigate to bed space selection after a delay
      setTimeout(() => {
        navigate("/payments/view-avaliable-hostels");
      }, 1500);
    } catch (err) {
      console.error("❌ Error selecting hostel:", err);
      setError("Failed to select hostel. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="text-center">
          <Loader
            size={40}
            className="animate-spin text-blue-600 mx-auto mb-4"
          />
          <p className="text-slate-600">Loading your details...</p>
        </div>
      </div>
    );
  }

  const hasExistingSelection = !!localStorage.getItem(
    "veritas_hostel_selection",
  );
  const savedSelection = localStorage.getItem("veritas_hostel_selection");
  const parsedSelection = savedSelection ? JSON.parse(savedSelection) : null;

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">
          <Breadcrumb />

          <div className="px-3 md:px-4">
            <IntroBanner />
          </div>

          <div className="px-3 md:px-4 mt-5">
            <InfoPills student={user} />
          </div>

          <div className="px-3 md:px-4 mt-6">
            <WarningBox />
          </div>

          <div className="px-3 md:px-4 mt-4">
            <InfoBox />
          </div>

          {/* Status Messages */}
          {error && (
            <div className="px-3 md:px-4 mt-4">
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-5 py-4 text-sm font-medium">
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="px-3 md:px-4 mt-4">
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-md px-5 py-4 text-sm font-medium">
                ✅ {success}
              </div>
            </div>
          )}

          {hasExistingSelection && parsedSelection && (
            <div className="px-3 md:px-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md px-5 py-4 text-sm font-medium flex items-center gap-2">
                <ShieldCheck size={18} />
                You have already selected a hostel: {parsedSelection.hostelName}
                (Category: {parsedSelection.category})
              </div>
            </div>
          )}

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
                isDisabled={saving || hasExistingSelection}
              />
            ))}
          </div>

          {/* Loading overlay */}
          {saving && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
                <Loader size={40} className="animate-spin text-blue-600" />
                <p className="text-slate-700 font-medium">
                  Saving your selection...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
