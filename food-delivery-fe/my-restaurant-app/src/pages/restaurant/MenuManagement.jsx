import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeSlashIcon,
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";
import RestaurantAvailability from "./RestaurantAvailability";

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState({ field: "name", direction: "asc" });
  const [notification, setNotification] = useState(null);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isAvailable: true,
  });

  // Available categories
  const categories = ["veg", "non veg"];

  // Fetch menu items
  const fetchMenuItems = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/api/restaurants/my-menu-items",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }

      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setIsError(true);

      // For demo purposes, load dummy data if API fails
      setMenuItems([
        {
          _id: "680ef7925bd490702cd486aa",
          name: "Chicken Pepperoni Pizza",
          description: "12-inch large pizza",
          price: 3200,
          category: "non veg",
          restaurant: "680ef67a5bd490702cd486a5",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDRyP35ewXjn7Sw56sBT9_yBoFdBxn7WwFlw&s",
          isAvailable: true,
          createdAt: "2025-04-28T03:35:46.343Z",
          updatedAt: "2025-04-28T03:35:46.343Z",
          __v: 0,
        },
        {
          _id: "680ef79e5bd490702cd486ad",
          name: "Beef Pepperoni Pizza",
          description: "12-inch large pizza",
          price: 3800,
          category: "non veg",
          restaurant: "680ef67a5bd490702cd486a5",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDRyP35ewXjn7Sw56sBT9_yBoFdBxn7WwFlw&s",
          isAvailable: true,
          createdAt: "2025-04-28T03:35:58.518Z",
          updatedAt: "2025-04-28T03:35:58.518Z",
          __v: 0,
        },
        {
          _id: "680ef7ff5bd490702cd486b0",
          name: "Margherita Pizza",
          description: "12-inch large pizza, vegetarian",
          price: 2450,
          category: "veg",
          restaurant: "680ef67a5bd490702cd486a5",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1bdKKaTySsc4t8ahzTXQIG87Ls_J8ph907w&s",
          isAvailable: true,
          createdAt: "2025-04-28T03:37:35.740Z",
          updatedAt: "2025-04-28T03:37:35.740Z",
          __v: 0,
        },
        {
          _id: "680ef8245bd490702cd486b3",
          name: "Garlic Bread",
          description: "Freshly baked bread with garlic butter",
          price: 950,
          category: "veg",
          restaurant: "680ef67a5bd490702cd486a5",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_3fYZi6iSJYMsGIXFHR4dy4nzYLj4tLwZfw&s",
          isAvailable: false,
          createdAt: "2025-04-28T03:38:12.123Z",
          updatedAt: "2025-04-28T03:38:12.123Z",
          __v: 0,
        },
        {
          _id: "680ef8425bd490702cd486b6",
          name: "Caesar Salad",
          description:
            "Fresh romaine lettuce with Caesar dressing and croutons",
          price: 1499,
          category: "veg",
          restaurant: "680ef67a5bd490702cd486a5",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQKp_haaL8ctgCW-hEFGxasPYTJZT2TnR9vg&s",
          isAvailable: true,
          createdAt: "2025-04-28T03:38:42.890Z",
          updatedAt: "2025-04-28T03:38:42.890Z",
          __v: 0,
        },
        {
          _id: "680ef8605bd490702cd486b9",
          name: "Chocolate Mousse Cake",
          description: "Rich chocolate mousse with a crunchy biscuit base",
          price: 1299,
          category: "veg",
          restaurant: "680ef67a5bd490702cd486a5",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDtNJCwni0cMGTUvxwzP66QgmUt2A6xIVqgA&s",
          isAvailable: true,
          createdAt: "2025-04-28T03:39:12.450Z",
          updatedAt: "2025-04-28T03:39:12.450Z",
          __v: 0,
        },
        {
          _id: "680ef87d5bd490702cd486bc",
          name: "Sparkling Water",
          description: "500ml bottle of premium sparkling water",
          price: 499,
          category: "veg",
          restaurant: "680ef67a5bd490702cd486a5",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJZD3SccxQ_GYs4vKxwvBtl3Ldk29G-btXDA&s",
          isAvailable: false,
          createdAt: "2025-04-28T03:39:41.712Z",
          updatedAt: "2025-04-28T03:39:41.712Z",
          __v: 0,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Add/Edit menu item
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.price || !formData.category) {
      setNotification({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Convert price from dollars to cents for the API
      const updatedFormData = {
        ...formData,
        price: Math.round(parseFloat(formData.price) * 100),
      };

      if (editingItem) {
        // Update existing item
        const response = await fetch(
          `http://localhost:5001/api/restaurants/my-menu-items/${editingItem._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedFormData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update menu item");
        }

        // For demo purposes, update in local state
        setMenuItems(
          menuItems.map((item) =>
            item._id === editingItem._id
              ? { ...item, ...updatedFormData }
              : item
          )
        );

        setNotification({
          type: "success",
          message: "Menu item updated successfully",
        });
      } else {
        // Create new item
        const response = await fetch(
          "http://localhost:5001/api/restaurants/menu-items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedFormData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create menu item");
        }

        // Get the newly created item from response
        const newItem = await response.json();

        // For demo purposes, add to local state with a generated ID and additional fields
        const simulatedNewItem = {
          _id: String(Date.now()),
          ...updatedFormData,
          restaurant: "680ef67a5bd490702cd486a5", // Current restaurant ID
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        };

        setMenuItems([...menuItems, simulatedNewItem]);

        setNotification({
          type: "success",
          message: "Menu item added successfully",
        });
      }

      // Reset form and close modal
      setIsModalOpen(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        isAvailable: true,
      });
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving menu item:", error);
      setNotification({
        type: "error",
        message: error.message || "Failed to save menu item. Please try again.",
      });
    }
  };

  // Delete menu item
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5001/api/restaurants/my-menu-items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete menu item");
      }

      // Remove from local state
      setMenuItems(menuItems.filter((item) => item._id !== itemId));

      setNotification({
        type: "success",
        message: "Menu item deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      setNotification({
        type: "error",
        message:
          error.message || "Failed to delete menu item. Please try again.",
      });
    }
  };

  // Toggle availability
  const toggleAvailability = async (itemId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5001/api/restaurants/my-menu-items/${itemId}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isAvailable: !currentStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update availability");
      }

      // Update in local state
      setMenuItems(
        menuItems.map((item) =>
          item._id === itemId ? { ...item, isAvailable: !currentStatus } : item
        )
      );

      setNotification({
        type: "success",
        message: `Item ${!currentStatus ? "available" : "unavailable"} now`,
      });
    } catch (error) {
      console.error("Error toggling availability:", error);
      setNotification({
        type: "error",
        message:
          error.message || "Failed to update availability. Please try again.",
      });
    }
  };

  // Handle editing an item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: (item.price / 100).toFixed(2), // Convert cents to dollars for display
      category: item.category,
      image: item.image || "",
      isAvailable: item.isAvailable,
    });
    setIsModalOpen(true);
  };

  // Handle adding a new item
  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Filter menu items
  const filteredMenuItems = menuItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "available") return item.isAvailable;
    if (filter === "unavailable") return !item.isAvailable;
    return item.category === filter;
  });

  // Sort menu items
  const sortedMenuItems = [...filteredMenuItems].sort((a, b) => {
    const fieldA =
      sort.field === "price"
        ? a[sort.field]
        : String(a[sort.field]).toLowerCase();
    const fieldB =
      sort.field === "price"
        ? b[sort.field]
        : String(b[sort.field]).toLowerCase();

    if (sort.direction === "asc") {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  // Handle sort change
  const handleSortChange = (field) => {
    setSort((prevSort) => ({
      field,
      direction:
        prevSort.field === field && prevSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Calculate unique categories from menu items
  const uniqueCategories = [...new Set(menuItems.map((item) => item.category))];

  // Dismiss notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          <button
            onClick={handleAddItem}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Menu Item
          </button>
        </div>

        {/* Restaurant Availability */}
        <div className="mb-6">
          <RestaurantAvailability />
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-4 p-4 rounded-md flex items-center ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircleIcon className="h-5 w-5 mr-2" />
            ) : (
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            )}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-auto">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
            <span className="mr-2">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-md px-3 py-1.5"
            >
              <option value="all">All Items</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchMenuItems}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowPathIcon className="h-5 w-5 mr-1" />
            Refresh
          </button>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu items...</p>
          </div>
        )}

        {isError && !isLoading && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            <p className="font-medium">
              There was an error loading your menu items.
            </p>
            <p>We've loaded some sample data for demonstration purposes.</p>
          </div>
        )}

        {/* Menu Items Table */}
        {!isLoading && sortedMenuItems.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("name")}
                  >
                    <div className="flex items-center">
                      <span>Name</span>
                      {sort.field === "name" && (
                        <ArrowsUpDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("category")}
                  >
                    <div className="flex items-center">
                      <span>Category</span>
                      {sort.field === "category" && (
                        <ArrowsUpDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("price")}
                  >
                    <div className="flex items-center">
                      <span>Price(LKR)</span>
                      {sort.field === "price" && (
                        <ArrowsUpDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedMenuItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500">
                            <span>No img</span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.price}.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          toggleAvailability(item._id, item.isAvailable)
                        }
                        className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                          item.isAvailable
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Available
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="h-4 w-4 mr-1" />
                            Unavailable
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sortedMenuItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No menu items found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter !== "all"
                ? "Try changing your filter or"
                : "Get started by"}{" "}
              adding a new menu item.
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddItem}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Menu Item
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Item Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category*
                    </label>
                    <select
                      name="category"
                      id="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price*
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      id="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        id="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isAvailable"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Item is available
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingItem ? "Update Item" : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItems;
