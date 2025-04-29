import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/restaurant-dashboard" },
    {
      name: "Restaurant Management",
      icon: BuildingStorefrontIcon,
      path: "/menu-management",
    },
    { name: "Orders", icon: ShoppingBagIcon, path: "/orders" },
    { name: "Customers", icon: UserGroupIcon, path: "/customers" },
    { name: "Reports", icon: ChartBarIcon, path: "/reports" },
    { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
  ];

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div
      className={`bg-gray-800 text-white ${
        collapsed ? "w-16" : "w-64"
      } transition-width duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <span className="text-xl font-bold">RestaurantMS</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-700"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 ${
                  isActive(item.path)
                    ? "bg-indigo-700 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <item.icon
                  className={`h-6 w-6 ${collapsed ? "mx-auto" : "mr-3"}`}
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          className={`flex items-center text-gray-300 hover:text-white ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
