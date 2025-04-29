import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Sidebar from "./Sidebar";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
   const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
         const response = await fetch(
         `http://localhost:5001/api/restaurants/${id}`,
         {
           //!changed port===============
           method: "GET",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
           },
          }
          );
       const data = await response.json();
       setRestaurant(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError("Failed to load restaurant details");
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const response = await fetch(
        `http://localhost:5001/api/restaurants/${id}/verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

     // setRestaurant((prev) => ({ ...prev, verified: true }));
      setVerifying(false);
    } catch (err) {
      console.error("Error verifying restaurant:", err);
      setError("Failed to verify restaurant");
      setVerifying(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Restaurant Details
            </h1>
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back to Dashboard
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading restaurant details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : restaurant ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {restaurant.name}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Restaurant ID: {restaurant._id}
                  </p>
                </div>
                <div className="flex items-center">
                  {restaurant.verified ? (
                    <div className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleVerify}
                      disabled={verifying}
                      className="flex items-center text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md disabled:bg-indigo-300"
                    >
                      {verifying ? "Verifying..." : "Verify Restaurant"}
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Restaurant Image
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <div className="h-48 w-64 overflow-hidden rounded-md">
                        <img
                          src={
                            restaurant.image ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </dd>
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-1 text-gray-400" />
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {restaurant.address}
                    </dd>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <PhoneIcon className="h-5 w-5 mr-1 text-gray-400" />
                      Contact Number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {restaurant.phone}
                    </dd>
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <StarIcon className="h-5 w-5 mr-1 text-gray-400" />
                      Rating
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {restaurant.rating > 0
                        ? restaurant.rating
                        : "No ratings yet"}
                    </dd>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Availability Status
                    </dt>
                    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          restaurant.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {restaurant.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </dd>
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-1 text-gray-400" />
                      Created At
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatDate(restaurant.createdAt)}
                    </dd>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Last Updated
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatDate(restaurant.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Restaurant not found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RestaurantDetail;
