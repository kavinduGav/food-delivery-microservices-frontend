import { useState } from "react";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  QueueListIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, Outlet, useLocation } from "react-router-dom";

const SidebarLink = ({ to, icon: Icon, text, active }) => (
  <Link
    to={to}
    className={`flex items-center p-3 rounded-md transition-colors ${
      active
        ? "bg-indigo-500 text-white"
        : "text-gray-600 hover:bg-indigo-100 hover:text-indigo-700"
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span className="font-medium">{text}</span>
  </Link>
);

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine active link based on current route
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2" />
            <h1 className="text-xl font-bold text-indigo-600">RestaurantHub</h1>
          </div>
          <button
            className="p-1 rounded-md lg:hidden hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Sidebar links */}
        <nav className="p-4 space-y-2">
          <SidebarLink
            to="/dashboard"
            icon={HomeIcon}
            text="Dashboard"
            active={isActive("/dashboard")}
          />
          <SidebarLink
            to="/orders"
            icon={ClipboardDocumentListIcon}
            text="Orders"
            active={isActive("/orders")}
          />
          <SidebarLink
            to="/menu-items"
            icon={QueueListIcon}
            text="Menu Items"
            active={isActive("/menu-items")}
          />
          <SidebarLink
            to="/profile"
            icon={UserIcon}
            text="Profile"
            active={isActive("/profile")}
          />
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            className="flex items-center w-full p-3 text-red-600 rounded-md hover:bg-red-50"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <button
            className="p-1 rounded-md lg:hidden hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6 text-gray-500" />
          </button>
          <div className="flex items-center ml-auto">
            <span className="mr-4 text-sm text-gray-700">Welcome, Chef</span>
            <div className="w-8 h-8 overflow-hidden rounded-full bg-indigo-100">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
