import { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  StarIcon,
  ClockIcon,
  UsersIcon,
 // TrendingUp,
} from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

// Static data for dashboard metrics
const dashboardData = {
  totalOrders: 156,
  totalEarnings: 3250.75,
  totalReviews: 95,
  averageRating: 4.7,
  totalCustomers: 112,
  totalMenuItems: 32,
  monthlyEarnings: [
    { month: "Jan", earnings: 1200 },
    { month: "Feb", earnings: 1500 },
    { month: "Mar", earnings: 2000 },
    { month: "Apr", earnings: 1800 },
    { month: "May", earnings: 2100 },
    { month: "Jun", earnings: 2400 },
    { month: "Jul", earnings: 2200 },
    { month: "Aug", earnings: 2800 },
    { month: "Sep", earnings: 2600 },
    { month: "Oct", earnings: 3000 },
    { month: "Nov", earnings: 3200 },
    { month: "Dec", earnings: 3250 },
  ],
  categoryPerformance: {
    labels: ["Pizza", "Pasta", "Salads", "Drinks", "Desserts"],
    data: [40, 25, 15, 10, 10],
  },
  popularItems: [
    { name: "Margherita Pizza", orders: 35 },
    { name: "Pepperoni Pizza", orders: 28 },
    { name: "Pasta Carbonara", orders: 22 },
    { name: "Caesar Salad", orders: 18 },
    { name: "Tiramisu", orders: 15 },
  ],
  recentOrders: [
    {
      id: "ORD-001",
      customer: "John Doe",
      date: "2025-04-29",
      total: 35.99,
      status: "completed",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      date: "2025-04-29",
      total: 28.75,
      status: "preparing",
    },
    {
      id: "ORD-003",
      customer: "Alex Johnson",
      date: "2025-04-28",
      total: 42.5,
      status: "pending",
    },
    {
      id: "ORD-004",
      customer: "Michael Brown",
      date: "2025-04-28",
      total: 19.99,
      status: "completed",
    },
  ],
};

// Chart configuration
const revenueChartConfig = {
  data: {
    labels: dashboardData.monthlyEarnings.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Revenue",
        data: dashboardData.monthlyEarnings.map((item) => item.earnings),
        borderColor: "rgb(79, 70, 229)",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Monthly Revenue",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  },
};

const categoryChartConfig = {
  data: {
    labels: dashboardData.categoryPerformance.labels,
    datasets: [
      {
        data: dashboardData.categoryPerformance.data,
        backgroundColor: [
          "rgba(79, 70, 229, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Sales by Category (%)",
        font: {
          size: 16,
        },
      },
    },
  },
};

const popularItemsChartConfig = {
  data: {
    labels: dashboardData.popularItems.map((item) => item.name),
    datasets: [
      {
        label: "Number of Orders",
        data: dashboardData.popularItems.map((item) => item.orders),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        barThickness: 18,
      },
    ],
  },
  options: {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Most Popular Items",
        font: {
          size: 16,
        },
      },
    },
  },
};

// Dashboard Components
const StatCard = ({ icon: Icon, title, value, trend, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend && (
      <div className="flex items-center text-sm">
        <StarIcon className="w-4 h-4 mr-1 text-green-500" />
        <span className="text-green-500 font-medium">{trend}</span>
        <span className="text-gray-500 ml-1">vs last month</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's a summary of your restaurant's performance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ShoppingBagIcon}
            title="Total Orders"
            value={dashboardData.totalOrders}
            trend="+12.5%"
            color="bg-indigo-600"
          />
          <StatCard
            icon={CurrencyDollarIcon}
            title="Total Earnings"
            value={`$${dashboardData.totalEarnings.toLocaleString()}`}
            trend="+8.2%"
            color="bg-green-600"
          />
          <StatCard
            icon={StarIcon}
            title="Reviews"
            value={`${dashboardData.totalReviews} (${dashboardData.averageRating}★)`}
            trend="+5.7%"
            color="bg-amber-500"
          />
          <StatCard
            icon={UsersIcon}
            title="Customers"
            value={dashboardData.totalCustomers}
            trend="+15.3%"
            color="bg-blue-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Line
              data={revenueChartConfig.data}
              options={revenueChartConfig.options}
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <Doughnut
              data={categoryChartConfig.data}
              options={categoryChartConfig.options}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Bar
              data={popularItemsChartConfig.data}
              options={popularItemsChartConfig.options}
            />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {order.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {order.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        ${order.total}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "preparing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <a
                href="/orders"
                className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
              >
                View all orders
              </a>
            </div>
          </div>
        </div>

        {/* Restaurant Availability */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Restaurant Availability</h2>
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-sm text-gray-700">
                Last updated: Today at 9:00 AM
              </span>
            </div>
          </div>
          <RestaurantAvailability />
        </div>
      </div>
    </div>
  );
};

// Restaurant Availability Component
const RestaurantAvailability = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const toggleAvailability = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/api/restaurants/my-restaurant/availability",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isOpen: !isOpen,
          }),
        }
      );

      if (response.ok) {
        setIsOpen(!isOpen);
      } else {
        console.error("Failed to update restaurant availability");
      }
    } catch (error) {
      console.error("Error updating restaurant availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-900">Restaurant Status</p>
        <p className="text-sm text-gray-500">
          Control whether your restaurant is accepting orders
        </p>
      </div>
      <div className="flex items-center">
        <span
          className={`mr-3 font-medium ${
            isOpen ? "text-green-600" : "text-red-600"
          }`}
        >
          {isOpen ? "Open" : "Closed"}
        </span>
        <button
          onClick={toggleAvailability}
          disabled={isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isOpen ? "bg-indigo-600" : "bg-gray-200"
          }`}
        >
          <span className="sr-only">Toggle availability</span>
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              isOpen ? "translate-x-6" : "translate-x-1"
            } ${isLoading ? "opacity-75" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
