import { useState, useEffect } from 'react';
import { BuildingOfficeIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

// Dummy data for testing
const dummyRestaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    address: "123 Main St, New York",
    status: "active",
    orders: [
      {
        id: "ORD-001",
        customer: "John Doe",
        items: [
          { name: "Margherita Pizza", quantity: 2, price: 12.99 },
          { name: "Garlic Bread", quantity: 1, price: 4.99 }
        ],
        total: 30.97,
        status: "pending",
        createdAt: "2024-03-15T10:30:00Z"
      },
      {
        id: "ORD-002",
        customer: "Jane Smith",
        items: [
          { name: "Pepperoni Pizza", quantity: 1, price: 14.99 },
          { name: "Coke", quantity: 2, price: 2.99 }
        ],
        total: 20.97,
        status: "preparing",
        createdAt: "2024-03-15T11:15:00Z"
      }
    ]
  },
  {
    id: 2,
    name: "Burger King",
    address: "456 Oak Ave, Los Angeles",
    status: "active",
    orders: [
      {
        id: "ORD-003",
        customer: "Mike Johnson",
        items: [
          { name: "Whopper", quantity: 1, price: 8.99 },
          { name: "Fries", quantity: 2, price: 3.99 }
        ],
        total: 16.97,
        status: "ready",
        createdAt: "2024-03-15T11:45:00Z"
      }
    ]
  }
];

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState(dummyRestaurants);
  const [expandedRestaurant, setExpandedRestaurant] = useState(null);

  // In a real application, this would fetch data from the API
  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/api/admin/restaurants', {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       });
  //       const data = await response.json();
  //       setRestaurants(data);
  //     } catch (error) {
  //       console.error('Error fetching restaurants:', error);
  //     }
  //   };
  //   fetchRestaurants();
  // }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const toggleRestaurant = (restaurantId) => {
    setExpandedRestaurant(expandedRestaurant === restaurantId ? null : restaurantId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Restaurant Header */}
              <div 
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => toggleRestaurant(restaurant.id)}
              >
                <div className="flex items-center space-x-4">
                  <BuildingOfficeIcon className="h-8 w-8 text-gray-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{restaurant.name}</h2>
                    <p className="text-sm text-gray-500">{restaurant.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {restaurant.orders.length} {restaurant.orders.length === 1 ? 'Order' : 'Orders'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    restaurant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.status}
                  </span>
                </div>
              </div>

              {/* Orders List */}
              {expandedRestaurant === restaurant.id && (
                <div className="border-t border-gray-200">
                  <div className="p-6 space-y-4">
                    {restaurant.orders.map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order.id}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Customer: {order.customer}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                          <ul className="space-y-2">
                            {order.items.map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <span className="text-gray-600">
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-gray-900">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {restaurant.orders.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No orders found for this restaurant</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {restaurants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No restaurants found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;