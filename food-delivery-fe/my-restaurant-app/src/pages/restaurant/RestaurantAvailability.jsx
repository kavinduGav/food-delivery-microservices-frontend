import { useState } from "react";

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

export default RestaurantAvailability;
