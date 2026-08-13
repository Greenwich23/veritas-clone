/* eslint-disable no-unused-vars */
// Sidebar.jsx
import React from "react";
import {
  LayoutGrid,
  Target,
  CreditCard,
  Home as HomeIcon,
  HelpCircle,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, active: true, page: "" },
  { label: "Academics", icon: Target, expandable: true, page: "academics" },
  { label: "Finance", icon: CreditCard, expandable: true, page: "payments" },
  { label: "Accomodation", icon: HomeIcon, page: "accomodation" },
  { label: "Inquiries", icon: HelpCircle, badge: "New", page: "inquiries" },
];

// eslint-disable-next-line no-unused-vars
function Sidebar({ isCollapsed, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#343a40] text-slate-200 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-57"
      } shrink-0`}
    >
      <div
        className={`flex items-center gap-3 px-5 h-16 border-b border-slate-700/60 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden ring-2 ring-emerald-500/40 shrink-0">
          <img
            src="https://admission.veritas.edu.ng/ui/dist/img/vuna.png"
            alt=""
          />
        </div>
        {!isCollapsed && (
          <span className="font-light text-[18px] tracking-wide text-white hover:text-white transition-colors duration-300">
            Veritas E-Campus
          </span>
        )}
      </div>

      <nav className="flex-1 py-3">
        {navItems.map(
          ({ label, icon: Icon, active, expandable, badge, page }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-5 py-3 text-[15px] transition-colors ${
                isCollapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-slate-700/60 text-white border-l-4 border-emerald-500"
                  : "text-slate-300 hover:bg-slate-700/40 border-l-4 border-transparent"
              }`}
              title={isCollapsed ? label : ""}
              onClick={() => navigate(`/${page}`)}
            >
              <Icon size={18} className="shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{label}</span>
                  {badge && (
                    <span className="text-[10px] font-semibold bg-red-500 text-white px-1.5 py-0.5 rounded">
                      {badge}
                    </span>
                  )}
                  {expandable && (
                    <ChevronLeft size={14} className="opacity-70" />
                  )}
                </>
              )}
            </button>
          ),
        )}
      </nav>

      <div className="px-5 py-4 border-t border-slate-700/60">
        <button
          className={`w-full flex items-center gap-3 text-[15px] text-slate-300 hover:text-white ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
