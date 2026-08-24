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
  RefreshCw,
} from "lucide-react";
import { HOSTELS, formatNaira } from "./hostelData";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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
  const { user, token, loading: authLoading, updateUser } = useAuth();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Create axios instance with auth header
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token || localStorage.getItem("token")}`,
    },
  });

  // Refresh user data from server
  const refreshUserData = async () => {
    try {
      setRefreshing(true);
      const authToken = token || localStorage.getItem("token");
      if (!authToken) return;

      const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data && updateUser) {
        updateUser(response.data);
        console.log("🔄 User data refreshed:", response.data);

        // Clear any cached selection if none exists
        if (!response.data.hostelSelection) {
          localStorage.removeItem("veritas_hostel_selection");
          setSelected(null);
        }
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Check if user already has a hostel selection
  useEffect(() => {
    // First, refresh user data from server to get the latest state
    refreshUserData();
  }, []);

  // Update selected state when user changes
  useEffect(() => {
    if (user?.hostelSelection) {
      setSelected({
        hostelId: user.hostelSelection.hostelId,
        category: user.hostelSelection.category,
      });
    } else {
      setSelected(null);
    }
    setLoading(false);
  }, [user]);

  const handleSelectCategory = async (hostel, category) => {
    // Don't allow if already selected
    if (user?.hostelSelection) {
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
    };

    console.log("📤 Sending selection data:", selectionData);

    try {
      const response = await axiosInstance.post(
        "/api/bed-space/select",
        selectionData,
      );

      console.log("✅ Response received:", response.data);

      if (response.data.selection) {
        setSuccess("Hostel selected successfully!");
        setSelected({ hostelId: hostel.id, category: category.name });

        if (updateUser) {
          updateUser({ hostelSelection: response.data.selection });
        }

        localStorage.setItem(
          "veritas_hostel_selection",
          JSON.stringify({
            hostelId: hostel.id,
            hostelName: hostel.name,
            category: category.name,
            fee: hostel.fee,
          }),
        );

        setTimeout(() => {
          navigate("/payments/view-avaliable-hostels");
        }, 1500);
      }
    } catch (err) {
      console.error("❌ Error selecting hostel:", err);

      // Check if selection was already saved (409 conflict)
      if (err.response?.status === 409) {
        setSuccess(
          "Hostel already selected! Taking you to bed space selection...",
        );
        setSelected({ hostelId: hostel.id, category: category.name });

        localStorage.setItem(
          "veritas_hostel_selection",
          JSON.stringify({
            hostelId: hostel.id,
            hostelName: hostel.name,
            category: category.name,
            fee: hostel.fee,
          }),
        );

        setTimeout(() => {
          navigate("/payments/view-avaliable-hostels");
        }, 1500);
        return;
      }

      // Check if we have a saved selection in localStorage (it worked despite error)
      const savedSelection = localStorage.getItem("veritas_hostel_selection");
      if (savedSelection) {
        setSuccess("Hostel selected! Taking you to bed space selection...");
        setTimeout(() => {
          navigate("/payments/view-avaliable-hostels");
        }, 1500);
        return;
      }

      // Show error but DON'T redirect to login
      setError(
        err.response?.data?.message ||
          "Failed to select hostel. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || refreshing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="text-center">
          <Loader
            size={40}
            className="animate-spin text-blue-600 mx-auto mb-4"
          />
          <p className="text-slate-600">
            {refreshing ? "Refreshing your data..." : "Loading your details..."}
          </p>
        </div>
      </div>
    );
  }

  const hasExistingSelection = !!user?.hostelSelection;

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

          {/* Debug: Show what's in the user object */}
          <div className="px-3 md:px-4 mt-4">
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-gray-600">
              <strong>Debug:</strong> hostelSelection ={" "}
              {user?.hostelSelection
                ? JSON.stringify(user.hostelSelection)
                : "null"}
              <button
                onClick={refreshUserData}
                className="ml-3 text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>
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
                ✅ {success} Redirecting to bed space selection...
              </div>
            </div>
          )}

          {hasExistingSelection && (
            <div className="px-3 md:px-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md px-5 py-4 text-sm font-medium flex items-center gap-2">
                <ShieldCheck size={18} />
                You have already selected a hostel:{" "}
                {user.hostelSelection?.hostelName}
                (Category: {user.hostelSelection?.category})
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
