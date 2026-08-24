import React, { useState } from "react";
import {
  LayoutGrid,
  Target,
  CreditCard,
  Home as HomeIcon,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Receipt,
  Wallet,
  FileText,
  History,
  Banknote,
  ClipboardCheck,
} from "lucide-react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutGrid,
    page: "/dashboard",
  },
  {
    label: "Academics",
    icon: Target,
    expandable: true,
    page: "/academics",
  },
  {
    label: "Finance",
    icon: CreditCard,
    expandable: true,
  },
  {
    label: "Accomodation",
    icon: HomeIcon,
    page: "/payments/view-avaliable-hostels",
  },
  {
    label: "Inquiries",
    icon: HelpCircle,
    badge: "New",
    page: "/inquiries",
  },
];

const financeItems = [
  {
    label: "Pay Tuition Fee",
    icon: Receipt,
    page: "/payments/select-hostel",
  },
  {
    label: "Pay Other Fees",
    icon: Banknote,
    page: "/payments/other-payment",
  },
  {
    label: "RRR History",
    icon: History,
    page: "/payments/rrr-history",
  },
  {
    label: "Paystack History",
    icon: History,
    page: "/payments/paystack-history",
  },
  {
    label: "Payment History",
    icon: ClipboardCheck,
    page: "/payments/payment-history",
  },
  {
    label: "Clearance Form",
    icon: FileText,
    page: "/payments/clearance",
    badge: "New",
  },
  {
    label: "Credit Form",
    icon: FileText,
    page: "/payments/credit",
    badge: "New",
  },
  {
    label: "Fund Wallet",
    icon: Wallet,
    page: "/payments/wallet",
    badge: "New",
  },
];

function Sidebar({ isCollapsed, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [financeOpen, setFinanceOpen] = useState(
    location.pathname.startsWith("/payments"),
  );

  const isFinanceActive = location.pathname.startsWith("/payments");

  return (
    <aside
      className={`
        hidden md:flex flex-col
        bg-[#343a40]
        text-slate-200
        transition-all duration-300
        ${isCollapsed ? "w-20" : "w-57"}
        shrink-0
      `}
    >
      <div
        className={`
          flex items-center gap-3 px-5 h-16
          border-b border-slate-700/60
          ${isCollapsed ? "justify-center" : ""}
        `}
      >
        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden ring-2 ring-emerald-500/40 shrink-0">
          <img
            src="https://admission.veritas.edu.ng/ui/dist/img/vuna.png"
            alt="Veritas University"
            className="w-full h-full object-cover"
          />
        </div>

        {!isCollapsed && (
          <span className="font-light text-[18px] tracking-wide text-white">
            Veritas E-Campus
          </span>
        )}
      </div>

      <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
        {navItems.map(({ label, icon: Icon, expandable, badge, page }) => {
          const isActive =
            label === "Finance" ? isFinanceActive : location.pathname === page;

          return (
            <React.Fragment key={label}>
              <button
                type="button"
                className={`
                    w-full flex items-center gap-3
                    px-5 py-3
                    text-[15px]
                    transition-colors
                    ${isCollapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-slate-700/60 text-white border-l-4 border-emerald-500"
                        : "text-slate-300 hover:bg-slate-700/40 border-l-4 border-transparent"
                    }
                  `}
                title={isCollapsed ? label : ""}
                onClick={() => {
                  if (label === "Finance") {
                    setFinanceOpen((prev) => !prev);
                  } else if (page) {
                    navigate(page);
                  }
                }}
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
                      <>
                        {label === "Finance" ? (
                          financeOpen ? (
                            <ChevronDown size={15} className="opacity-80" />
                          ) : (
                            <ChevronRight size={15} className="opacity-80" />
                          )
                        ) : (
                          <ChevronRight size={15} className="opacity-70" />
                        )}
                      </>
                    )}
                  </>
                )}
              </button>

              {label === "Finance" && financeOpen && !isCollapsed && (
                <div className="bg-[#2d3237] border-l border-slate-700/50">
                  {financeItems.map(
                    ({
                      label: subLabel,
                      icon: SubIcon,
                      page: subPage,
                      badge: subBadge,
                    }) => {
                      const subActive = location.pathname === subPage;

                      return (
                        <button
                          key={subLabel}
                          type="button"
                          onClick={() => navigate(subPage)}
                          className={`
                                w-full
                                flex items-center
                                gap-3
                                text-white
                                pl-12 pr-4 py-2.5
                                text-[13px]
                                transition-colors
                                ${
                                  subActive
                                    ? "bg-slate-600/60 text-white"
                                    : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                                }
                              `}
                        >
                          <SubIcon size={16} className="shrink-0" />

                          <span className="flex-1 text-left">{subLabel}</span>

                          {subBadge && (
                            <span className="text-[9px] font-semibold bg-red-500 text-white px-1.5 py-0.5 rounded">
                              {subBadge}
                            </span>
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="px-5 py-4 border-t border-slate-700/60">
        <button
          type="button"
          className={`
            w-full flex items-center gap-3
            text-[15px] text-slate-300
            hover:text-white
            ${isCollapsed ? "justify-center" : ""}
          `}
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
