/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Layers,
  Info,
  Wallet2,
  CheckCircle2,
  Check,
  X,
  User,
  Users,
  AlertTriangle,
} from "lucide-react";
import { STORAGE_KEY, HOSTELS, formatNaira } from "./hostelData";
import { useNavigate } from "react-router-dom";

// Used only if the user opens this page without picking a hostel first.
const FALLBACK_SELECTION = {
  hostelId: "T",
  hostelName: "HOSTEL T",
  category: "Third Floor",
  categorySpaces: 95,
  fee: 395000,
  // Optional — only used once a bed space is confirmed. Fall back to
  // sensible demo values if your hostel data doesn't carry these yet.
  gender: "Male",
  capacity: 4,
};

// ============================================================
// Shared with TuitionAccommodationFee.jsx — used only as a fast local
// cache. The real answer to "has this student paid?" is fetched from
// the backend below, since localStorage can be edited by the student.
// ============================================================
const PAYMENT_STATUS_KEY = "veritas_payment_status";
const SELECTED_BED_KEY = "veritas_selected_bed_space";

// TODO: point this at whatever route actually renders
// TuitionAccommodationFee in your router config.
const PAYMENT_ROUTE = "/payments/payment-plan";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// TODO: adjust to however your app actually stores the auth token.
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function Breadcrumb() {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 pt-6 pb-4">
      <h1 className="text-3xl font-semibold text-slate-800">
        Select Bed Space
      </h1>
      <span className="text-sm">
        <span className="text-blue-600 font-medium">Dashboard</span>
        <span className="text-slate-400 mx-2">/</span>
        <span className="text-slate-400">Accommodation</span>
      </span>
    </div>
  );
}

function IntroBanner({ isConfirmed }) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-700 to-blue-800 text-white p-6">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-3 mb-2">
        {isConfirmed ? <CheckCircle2 size={22} /> : <BedDouble size={22} />}
        <h2 className="text-xl font-bold">
          {isConfirmed ? "Your selected bed space" : "Available bed spaces"}
        </h2>
      </div>
      <p className="relative text-sm text-blue-100 max-w-2xl leading-relaxed">
        {isConfirmed
          ? "Your hostel allocation is confirmed below. This selection cannot be changed."
          : "Review available bunks for this category before continuing to payment. Viewing does not reserve a bed."}
      </p>
    </div>
  );
}

function InfoPills({
  hostelName,
  category,
  fee,
  isConfirmed,
  availableSpaces,
  gender,
  capacity,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <Building2 size={16} className="text-blue-600" />
        Hostel: <span className="font-semibold">{hostelName}</span>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
        <Layers size={16} className="text-blue-600" />
        Floor: <span className="font-semibold">{category}</span>
      </div>

      {isConfirmed ? (
        <>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
            <User size={16} className="text-blue-600" />
            Gender: <span className="font-semibold">{gender}</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
            <Users size={16} className="text-blue-600" />
            Capacity: <span className="font-semibold">{capacity}</span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-700">
          <BedDouble size={16} className="text-blue-600" />
          Available spaces:{" "}
          <span className="font-semibold">{availableSpaces}</span>
        </div>
      )}

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

function AlreadySelectedBar({ onDismiss }) {
  return (
    <div className="bg-teal-600 rounded-md px-5 py-4 text-white flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <Info size={18} className="shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed font-semibold">
          You have already selected a bed space.
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

function PaymentRequiredNotice({ onGoToPayment }) {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-5 py-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-3 items-start">
        <Info size={18} className="shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed">
          You need to complete your tuition and accommodation payment before you
          can select a bed space. You can still browse what's available below.
        </p>
      </div>
      <button
        onClick={onGoToPayment}
        className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
      >
        Go to payment
      </button>
    </div>
  );
}

function ErrorBar({ message, onDismiss }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-5 py-4 flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed font-medium">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-red-400 hover:text-red-600"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function BunkCard({
  room,
  bunk,
  position,
  isSelected,
  selectable,
  isSubmitting,
  onSelect,
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-center py-3 px-4">
        <p className="flex items-center justify-center gap-2 font-bold text-white text-[15px]">
          <BedDouble size={16} />
          Room {room}
        </p>

        {isSelected ? (
          <span className="inline-block mt-1 text-[11px] font-semibold bg-green-500/90 text-white px-2 py-0.5 rounded-full">
            Selected
          </span>
        ) : (
          <p className="text-xs text-blue-200 mt-0.5">Available</p>
        )}
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

        {isSelected ? (
          <button
            disabled
            className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 text-white font-medium py-2.5 rounded-md cursor-default"
          >
            <Check size={16} />
            Booked
          </button>
        ) : selectable ? (
          <button
            onClick={onSelect}
            disabled={isSubmitting}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-md transition-colors"
          >
            {isSubmitting ? "Booking..." : "Select"}
          </button>
        ) : null}
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
  const navigate = useNavigate();

  const [selection] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : FALLBACK_SELECTION;
    } catch (err) {
      console.error("Could not read saved hostel selection:", err);
      return FALLBACK_SELECTION;
    }
  });

  // Seeded from localStorage for an instant first paint, then overwritten
  // by the backend once loadStatus() below resolves.
  const [paymentConfirmed, setPaymentConfirmed] = useState(
    () => localStorage.getItem(PAYMENT_STATUS_KEY) === "success",
  );

  const [selectedBed, setSelectedBed] = useState(() => {
    try {
      const saved = localStorage.getItem(SELECTED_BED_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error("Could not read saved bed space selection:", err);
      return null;
    }
  });

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [noticeVisible, setNoticeVisible] = useState(true);

  // Available spaces mirrors exactly what was shown on the Select Hostel
  // page for this category, so the number stays consistent across pages.
  // "alreadyPaid" is just flavor text for the info box and doesn't affect
  // the available count or the number of bunk cards rendered.
  const {
    availableSpaces,
    alreadyPaid,
    bunks: generatedBunks,
  } = useMemo(() => {
    const live = selection.categorySpaces || 20;
    const paid = Math.max(1, Math.floor(Math.random() * 10));
    return {
      availableSpaces: live,
      alreadyPaid: paid,
      bunks: generateBunks(live),
    };
  }, [selection.hostelId, selection.category]);

  // Kept in state (rather than just the memo above) so a "bunk just taken"
  // conflict from the backend can remove that one card without having to
  // regenerate the whole list.
  const [bunks, setBunks] = useState(generatedBunks);

  useEffect(() => {
    setBunks(generatedBunks);
  }, [generatedBunks]);

  // On mount: ask the backend what's actually true — has this student
  // paid, and have they already booked a bunk — rather than trusting
  // whatever's cached in localStorage.
  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      setCheckingStatus(true);

      try {
        const [selectionRes, statusRes] = await Promise.all([
          fetch(`${API_BASE}/api/bed-space/me`, {
            headers: { ...getAuthHeaders() },
          }),
          fetch(`${API_BASE}/api/paystack/payment-status`, {
            headers: { ...getAuthHeaders() },
          }),
        ]);

        const selectionData = await selectionRes.json();
        const statusData = await statusRes.json();

        if (cancelled) return;

        if (selectionData?.selection) {
          setSelectedBed(selectionData.selection);
          localStorage.setItem(
            SELECTED_BED_KEY,
            JSON.stringify(selectionData.selection),
          );
        }

        if (typeof statusData?.verified === "boolean") {
          setPaymentConfirmed(statusData.verified);
          localStorage.setItem(
            PAYMENT_STATUS_KEY,
            statusData.verified ? "success" : "pending",
          );
        }
      } catch (err) {
        // Backend unreachable — fall back to whatever localStorage had
        // so the page still works during local development.
        console.error(
          "Could not confirm payment/bed status with backend:",
          err,
        );
      } finally {
        if (!cancelled) setCheckingStatus(false);
      }
    }

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectBed = async (bunk) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/bed-space/select`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          hostelId: selection.hostelId,
          hostelName: selection.hostelName,
          category: selection.category,
          room: bunk.room,
          bunk: bunk.bunk,
          position: bunk.position,
          fee: selection.fee,
        }),
      });

      const data = await res.json();

      if (res.status === 201 && data.selection) {
        setSelectedBed(data.selection);
        localStorage.setItem(SELECTED_BED_KEY, JSON.stringify(data.selection));
        return;
      }

      if (res.status === 409 && data.selection) {
        // Student already had a selection (e.g. opened this page in two
        // tabs and booked in the other one) — just adopt it.
        setSelectedBed(data.selection);
        localStorage.setItem(SELECTED_BED_KEY, JSON.stringify(data.selection));
        return;
      }

      if (res.status === 409 && data.conflict) {
        // Someone else just took this exact room+bunk — drop it from the
        // list so the student picks a different card.
        setBunks((prev) =>
          prev.filter((b) => !(b.room === bunk.room && b.bunk === bunk.bunk)),
        );
        setErrorMessage(data.message || "That bunk was just taken.");
        return;
      }

      if (res.status === 403) {
        setPaymentConfirmed(false);
        setErrorMessage(
          data.message ||
            "Payment must be verified before selecting a bed space.",
        );
        return;
      }

      setErrorMessage(
        data.message || "Could not save your bed space selection.",
      );
    } catch (err) {
      console.error("selectBedSpace request failed:", err);
      setErrorMessage("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConfirmed = Boolean(selectedBed);
  const canSelect = paymentConfirmed && !isConfirmed && !checkingStatus;
  const visibleBunks = isConfirmed ? [selectedBed] : bunks;

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans overflow-y-auto">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1">
          <Breadcrumb />

          <div className="px-4 md:px-8">
            <IntroBanner isConfirmed={isConfirmed} />
          </div>

          {errorMessage && (
            <div className="px-4 md:px-8 mt-5">
              <ErrorBar
                message={errorMessage}
                onDismiss={() => setErrorMessage(null)}
              />
            </div>
          )}

          {!checkingStatus && !paymentConfirmed && !isConfirmed && (
            <div className="px-4 md:px-8 mt-5">
              <PaymentRequiredNotice
                onGoToPayment={() => navigate(PAYMENT_ROUTE)}
              />
            </div>
          )}

          <div className="px-4 md:px-8 mt-5">
            <InfoPills
              hostelName={selection.hostelName}
              category={selection.category}
              fee={selection.fee}
              isConfirmed={isConfirmed}
              availableSpaces={availableSpaces}
              gender={selection.gender || "Male"}
              capacity={selection.capacity || 4}
            />
          </div>

          {isConfirmed ? (
            noticeVisible && (
              <div className="px-4 md:px-8 mt-4">
                <AlreadySelectedBar onDismiss={() => setNoticeVisible(false)} />
              </div>
            )
          ) : (
            <div className="px-4 md:px-8 mt-4">
              <AboutBox
                availableSpaces={availableSpaces}
                alreadyPaid={alreadyPaid}
              />
            </div>
          )}

          {!isConfirmed && (
            <div className="px-4 md:px-8 mt-5 flex flex-wrap gap-3">
              <button
                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 font-medium px-5 py-2.5 rounded-md hover:bg-slate-50 transition-colors"
                onClick={() => navigate("/payments/select-hostel")}
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          )}

          <div className="px-4 md:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleBunks.map((b, i) => (
              <BunkCard
                key={i}
                room={b.room}
                bunk={b.bunk}
                position={b.position}
                isSelected={isConfirmed}
                selectable={canSelect}
                isSubmitting={isSubmitting}
                onSelect={() => handleSelectBed(b)}
              />
            ))}
          </div>

          {isConfirmed && (
            <div className="px-4 md:px-8 pb-6">
              <div className="bg-white border border-slate-200 border-dashed rounded-md px-5 py-4 flex gap-3 text-sm text-slate-600">
                <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold">Confirmed:</span> Your hostel,
                  room, and bed space are shown above. This allocation is final
                  and cannot be changed from this page.
                </p>
              </div>
            </div>
          )}

          <footer className="text-center text-sm text-slate-500 font-medium py-4 border-t border-slate-200">
            Copyright &copy; Veritas University Abuja 2026.
          </footer>
        </main>
      </div>
    </div>
  );
}
