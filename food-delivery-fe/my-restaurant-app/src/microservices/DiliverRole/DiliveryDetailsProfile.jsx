import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
//import { getDownloadURL, ref } from 'firebase/storage';
//import { storage } from '../../firebase'; // Adjust the path if needed
import { useReactToPrint } from 'react-to-print';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap Import
import './Css/DiliveryDetailsProfile.css'; // Import your custom CSS file

export default function DiliveryDetailsProfile() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  //const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const componentPDF = useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
     // const response = await fetch(`/api/diliver/getDilivery/${currentUser._id}`);
      const response = await fetch(`/api/diliver/getDilivery`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);

      data.forEach(order => {
        if (order.profilePicture) {
          fetchFirebaseImage(order.profilePicture, 'profilePicture', order._id);
        }
        if (order.alternateProfilePicture) {
          fetchFirebaseImage(order.alternateProfilePicture, 'alternateProfilePicture', order._id);
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // const fetchFirebaseImage = async (imageUrl, field, orderId) => {
  //   const storageRef = ref(storage, imageUrl);
  //   try {
  //     const downloadUrl = await getDownloadURL(storageRef);
  //     setOrders(prevOrders =>
  //       prevOrders.map(order =>
  //         order._id === orderId ? { ...order, [field]: downloadUrl } : order
  //       )
  //     );
  //   } catch (error) {
  //     console.error(`Error fetching image from Firebase for ${field}:`, error);
  //   }
  // };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Total Item Report',
    onBeforeGetContent: () => {
      setIsGeneratingPDF(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsGeneratingPDF(false);
      alert('Data saved in PDF');
    }
  });

  const handleCompleteTask = (taskId) => {
    setOrders(prevTasks =>
      prevTasks.map(task =>
        task._id === taskId ? { ...task, status: 'completed' } : task
      )
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Delivery Information</h2>

      <div ref={componentPDF}>
        {orders.length > 0 ? (
          <div className="table-responsive shadow-lg rounded">
            <table className="table table-striped table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Customer Name</th>
                  <th>Total Amount</th>
                  <th>Created At</th>
                  <th>Payment Status</th>
                  <th>Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customerName}</td>
                    <td>Rs. {order.totalAmount}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.paymentStatus}</td>
                    <td>
                      <div className="d-flex flex-column align-items-center">
                        <Link
                          to={`/update-task/${order._id}`}
                          className="btn btn-outline-primary btn-sm mb-2"
                          onClick={() => handleCompleteTask(order._id)}
                        >
                          Accept
                        </Link>

                        {order.is_deliveryStatus ? (
                          <span className="badge bg-success p-2 rounded-pill" style={{ fontSize: '0.9rem' }}>
                            ✅ Delivery Completed
                          </span>
                        ) : (
                          <span
                            className="badge bg-warning text-dark p-2 rounded-pill animate-pulse"
                            style={{ fontSize: '0.9rem' }}
                          >
                            ⏳ Pending Delivery
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">You have no orders yet!</p>
        )}
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary"
          onClick={generatePDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? 'Generating PDF...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
}
