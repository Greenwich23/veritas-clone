/* eslint-disable no-unused-vars */
// StudentDashboard.jsx
import React, { useState } from "react";
import { Zap, Loader, User, LogOut } from "lucide-react";
import {
  Printer,
  FileText,
  Banknote,
  ClipboardList,
  History,
  BarChart3,
  CreditCard as CardIcon,
  BookOpen,
  MessageSquare,
  BedDouble,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Profile Card Component
function ProfileCard({ student }) {
  return (
    <div className="rounded-lg bg-gradient-to-r from-slate-700 to-blue-800 text-white py-10 px-7 flex items-center gap-5 shadow-sm">
      <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex-shrink-0 bg-white/20 flex items-center justify-center">
        <img src="https://i.ibb.co/WNDMjRX0/download.jpg" alt="" />
      </div>
      <div>
        <h2 className="text-xl font-bold leading-tight text-[1.45rem]">
          {student?.name || "Student Name"}
        </h2>
        <p className="text-sm text-blue-100 mt-1">
          {student?.regNo || "VUG/CSC/XX/XXXX"}
        </p>
        <p className="text-sm text-blue-100 mt-[5px]">
          {student?.department || "Computer Science"} &middot; 2025/2026
        </p>
        {/* <p className="text-sm text-blue-100 mt-[2px]">
          Payment Status:{" "}
          <span
            className={`font-semibold ${
              student?.paymentStatus === "success"
                ? "text-green-300"
                : student?.paymentStatus === "pending"
                  ? "text-yellow-300"
                  : "text-red-300"
            }`}
          >
            {student?.paymentStatus === "success"
              ? "Paid ✓"
              : student?.paymentStatus === "pending"
                ? "Pending"
                : "Not Paid"}
          </span>
        </p> */}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <p className="text-[11px] tracking-wider text-slate-400 font-medium">
        {label.toUpperCase()}
      </p>
      <p className="font-bold text-slate-800 text-[0.9rem] mt-1">{value}</p>
    </div>
  );
}

// Quick Link Card Component
function QuickLinkCard({ icon: Icon, color, title, subtitle, page }) {
  const navigate = useNavigate();
  return (
    <button
      className="text-left border bg-white rounded-lg border-slate-300 p-3 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
      onClick={() => page && navigate(`/${page}`)}
    >
      <div
        className={`w-11 h-11 rounded-md ${color} flex items-center justify-center mb-4`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <p className="font-semibold text-slate-800 text-[0.9rem] leading-snug">
        {title}
      </p>
      <p className="text-sm text-slate-500 mt-1 leading-snug text-[0.75rem]">
        {subtitle}
      </p>
    </button>
  );
}

// Quick Links Data
const quickLinks = [
  {
    icon: Printer,
    color: "bg-slate-800",
    title: "Print Clearance Form",
    subtitle: "Bursary clearance (print 2 copies)",
    page: "",
  },
  {
    icon: FileText,
    color: "bg-orange-600",
    title: "Print Credit Form",
    subtitle: "Debt recovery credit form",
    page: "",
  },
  {
    icon: Banknote,
    color: "bg-emerald-700",
    title: "Pay Tuition Fee",
    subtitle: "Tuition & hostel payment",
    page: "payments/select-hostel",
  },
  {
    icon: ClipboardList,
    color: "bg-teal-600",
    title: "Pay Other Fees",
    subtitle: "Dues, forms & miscellaneous",
    page: "payments/other-payment",
  },
  {
    icon: History,
    color: "bg-sky-700",
    title: "Payment History",
    subtitle: "Receipts & past payments",
    page: "/payments/payment-history",
  },
  {
    icon: BarChart3,
    color: "bg-sky-700",
    title: "RRR History",
    subtitle: "Pending Remita references",
    page: "",
  },
  {
    icon: CardIcon,
    color: "bg-sky-700",
    title: "Paystack History",
    subtitle: "Pending & completed checkouts",
    page: "",
  },
  {
    icon: BookOpen,
    color: "bg-sky-700",
    title: "Course Registration",
    subtitle: "Register or view courses",
    page: "",
  },
  {
    icon: MessageSquare,
    color: "bg-sky-700",
    title: "Unofficial Transcript",
    subtitle: "View academic record",
    page: "",
  },
  {
    icon: BedDouble,
    color: "bg-sky-700",
    title: "Select Bed Space",
    subtitle: "Select bed space",
    page: "payments/view-avaliable-hostels",
  },
  {
    icon: HelpCircle,
    color: "bg-sky-700",
    title: "Inquires",
    subtitle: "who to contact for help",
    page: "",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Get dynamic stats based on user data
  const getStudentStats = () => {
    return [
      { label: "Current Level", value: user?.level || "300" },
      { label: "Studentship", value: "Active" },
      { label: "Session", value: "2025/2026" },
      { label: "Department", value: user?.department || "Computer Science" },
    ];
  };

  // If user is null (not logged in), redirect to login
  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const studentStats = getStudentStats();

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 md:px-4 pt-3 pb-4">
            <h1 className="text-[25px] font-normal text-slate-800 font-extrabold">
              Student Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">Dashboard</span>
              {/* <button
                onClick={logout}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                <LogOut size={16} />
                Logout
              </button> */}
            </div>
          </div>

          {/* Profile Card */}
          <div className="px-4 md:px-2">
            <ProfileCard student={user} />
          </div>

          {/* Stats Cards */}
          <div className="px-4 md:px-2 mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {studentStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Quick Links */}
          <div className="px-4 md:px-4 mt-7 flex items-center gap-2">
            <Zap size={18} className="text-blue-600 fill-blue-600" />
            <h3 className="font-semibold text-slate-800 text-[17px]">
              Quick links
            </h3>
          </div>
          <div className="h-px bg-slate-200 mx-4 md:mx-8 mt-3" />

          <div className="px-4 md:px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {quickLinks.map((q) => (
              <QuickLinkCard key={q.title} {...q} />
            ))}
          </div>

          {/* Footer */}
          <footer className="text-center text-sm text-slate-500 font-medium py-4 border-t border-slate-200">
            Copyright &copy; Veritas University Abuja 2026.
          </footer>
        </main>
      </div>
    </div>
  );
}
