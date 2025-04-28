import { useState, useEffect } from 'react';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

// Dummy data for testing
const dummyOrders = [
  {
    _id: '1',
    orderNumber: 'ORD-001',
    customer: 'John Doe',
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 12.99 },
      { name: 'Garlic Bread', quantity: 1, price: 4.99 }
    ],
    total: 30.97,
    status: 'pending',
    createdAt: '2024-03-15T10:30:00Z'
  },
  {
    _id: '2',
    orderNumber: 'ORD-002',
    customer: 'Jane Smith',
    items: [
      { name: 'Pepperoni Pizza', quantity: 1, price: 14.99 },
      { name: 'Coke', quantity: 2, price: 2.99 }
    ],
    total: 20.97,
    status: 'preparing',
    createdAt: '2024-03-15T11:15:00Z'
  },
  {
    _id: '3',
    orderNumber: 'ORD-003',
    customer: 'Mike Johnson',
    items: [
      { name: 'Caesar Salad', quantity: 1, price: 8.99 },
      { name: 'Garlic Bread', quantity: 2, price: 4.99 }
    ],
    total: 18.97,
    status: 'ready',
    createdAt: '2024-03-15T11:45:00Z'
  }
];

const OrderManagement = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [loading, setLoading] = useState(false);

  // In a real application, this would fetch data from the API
  // useEffect(() => {
  //   fetchOrders();
  //   // Set up polling to refresh orders every 30 seconds
  //   const interval = setInterval(fetchOrders, 30000);
  //   return () => clearInterval(interval);
  // }, []);

  // const fetchOrders = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/api/orders/restaurant', {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });
  //     const data = await response.json();
  //     setOrders(data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching orders:', error);
  //     setLoading(false);
  //   }
  // };

  const updateOrderStatus = async (orderId, newStatus) => {
    // In a real application, this would update the order status via API
    // try {
    //   const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //     },
    //     body: JSON.stringify({ status: newStatus }),
    //   });

    //   if (response.ok) {
    //     fetchOrders();
    //   }
    // } catch (error) {
    //   console.error('Error updating order status:', error);
    // }

    // For testing UI only
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Orders</h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order.orderNumber}
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
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              <div className="flex space-x-3">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'ready')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Mark as Ready
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement; 