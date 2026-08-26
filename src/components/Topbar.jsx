/* eslint-disable no-unused-vars */
// Topbar.jsx
import React from "react";
import { Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

function Topbar({ toggleSidebar, isCollapsed, onMobileMenuClick }) {
  const navigate = useNavigate();
  return (
    <header className="h-16 flex items-center justify-between px-4 bg-green-600 text-white shrink-0 w-full">
      <div className="flex items-center gap-5">
        {/* Hamburger menu - works on both desktop and mobile */}
        <button
          className="p-1 hover:bg-white/10 rounded transition-colors"
          onClick={onMobileMenuClick || toggleSidebar}
        >
          <Menu size={22} />
        </button>
        <NavLink to="/">
          <span
            className="font-medium text-[15px] hover:text-white/80 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Home
          </span>
        </NavLink>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold tracking-wide text-[13px] sm:text-[15px] hidden sm:block text-white/80 hover:text-white transition-colors duration-300 truncate max-w-[120px] md:max-w-[200px]">
          Panan Peter Ezekiel
        </span>
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img
            className="w-full h-full object-cover"
            src="https://i.ibb.co/WNDMjRX0/download.jpg"
            alt="User Avatar"
          />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
