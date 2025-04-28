import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap Import
import '../DiliverRole/Css/CompleteDiliveryDetails.css'; // Import your CSS file

function CompleteDiliveryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    customerName: "",
    totalAmount: "",
    createdAt: "",
    paymentMethod: "",
    paymentStatus: "",
  });

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await fetch(`/api/diliver/getForupdateDilivery/${id}`);
        const data = await response.json();
        console.log(data);

        if (data.success) {
          const taskData = data.data;
          if (!taskData.createdAt) {
            taskData.createdAt = new Date().toISOString().slice(0, 10); // yyyy-mm-dd format
          }
          setTask(taskData);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };

    fetchTaskData();
  }, [id]);

  const handleUpdate = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to complete this delivery?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, complete it!',
    });

    if (result.isConfirmed) {
      try {
        task.is_deliveryStatus = true;
        const response = await fetch(`/api/diliver/updateDilivery`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: task._id,
            ...task,
            status: 'completed',
          }),
        });

        const data = await response.json();

        if (data.success) {
          await Swal.fire(
            'Completed!',
            'The delivery has been marked as completed.',
            'success'
          );
          navigate('/MyDiliveryDetails');
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'paymentMethod' && value !== '') {
      setTask((prevTask) => ({
        ...prevTask,
        [name]: value,
        paymentStatus: 'Completed',
      }));
    } else {
      setTask((prevTask) => ({
        ...prevTask,
        [name]: value,
      }));
    }
  };
  
  return (
    <div className="container" style={{ marginTop: '15vh' }}>
      <div className="card shadow-lg border-0 rounded">
        <div className="card-body text-center">
          <h2 className="text-center mb-4">
            <span className="delivery-header">
              <i className="bi bi-check-circle"></i> Delivery Completion
            </span>
          </h2>

          {/* Task Details */}
          <div className="mb-4">
            <p><strong>Customer Name:</strong> {task?.customerName}</p>
            <br/>
            <p><strong>Total Amount:</strong> Rs.{task?.totalAmount}.00</p>
            <br/>
            <p><strong>Created At:</strong> {task?.createdAt}</p>
            <br/>
            {/* Updated Payment Status as dropdown */}
            <div className="mb-3 d-flex align-items-center" style={{ marginTop: '20px' }}>
              <label htmlFor="paymentMethod" className="form-label me-3" style={{ minWidth: '140px', textAlign: 'right' }}>
                <strong>Payment Method:</strong>
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="form-select"
                style={{ width: '250px' }} // Adjust width to match other fields
                value={task?.paymentMethod}
                onChange={handleInputChange}
              >
                <option value="">-- Select Payment Method --</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online Transfer">Online Transfer</option>
              </select>
        


            <div className="mb-3 d-flex align-items-center" style={{ marginLeft: '400px' }}>
              <label htmlFor="paymentStatus" className="form-label me-3" style={{ minWidth: '140px', textAlign: 'right' }}>
                <strong>Payment Status:</strong>
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                className="form-select"
                style={{ width: '250px' }} // Adjust width to match other fields
                value={task?.paymentStatus}
                onChange={handleInputChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            </div>
          </div>

          {/* Confirmation Button */}
          <button
            className="btn btn-success btn-lg mt-3"
            onClick={handleUpdate}
          >
            Complete Delivery
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompleteDiliveryDetails;
