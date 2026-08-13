/* eslint-disable no-unused-vars */
// Topbar.jsx
import React from "react";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

function Topbar({ toggleSidebar }) {
  return (
    <header className="fixed top-0 left-57 right-0 z-50 h-16 flex items-center justify-between p-2 bg-green-600 text-white shrink-0">        <div className="flex items-center gap-5">
        <button
          className="p-1 hover:bg-white/10 rounded"
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </button>
        <NavLink to="/">
          <span className="font-medium text-[15px]">Home</span>
        </NavLink>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold tracking-wide text-[15px] hidden sm:block text-white/75 hover:text-white transition-colors duration-300">
          HEZEKIAH YORGI GOWONG
        </span>
        <div className="w-7.5 h-7.5 rounded-[30px] flex items-center justify-center">
          <img
            className="w-full rounded-[50px] object-cover"
            src="https://i.ibb.co/tMvdmvHL/image.png"alt="User Avatar"
          />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
