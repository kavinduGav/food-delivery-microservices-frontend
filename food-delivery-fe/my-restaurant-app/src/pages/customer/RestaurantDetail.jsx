import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { signOut } from '../../utils/auth';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    // Validate the ID format
    if (!id || typeof id !== 'string' || id.length !== 24) {
      setError('Invalid restaurant ID');
      setLoading(false);
      return;
    }

    const fetchRestaurantData = async () => {
      try {
        // Fetch restaurant details
        const restaurantResponse = await fetch(`http://localhost:5001/api/restaurants/${id}`);
        if (!restaurantResponse.ok) {
          if (restaurantResponse.status === 404) {
            throw new Error('Restaurant not found');
          }
          throw new Error('Failed to fetch restaurant details');
        }
        const restaurantData = await restaurantResponse.json();
        setRestaurant(restaurantData);

        // Fetch menu items
        const menuResponse = await fetch(`http://localhost:5001/api/restaurants/${id}/menu-items`);
        if (!menuResponse.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const menuData = await menuResponse.json();
        setMenuItems(menuData);

       
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id, navigate]);

  const addToCart = async (item) => {
    try {
      const response = await fetch('http://localhost:5002/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          menuItemId: item._id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/signin');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch('http://localhost:5002/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          menuItemId: itemId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/signin');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart');
      }

      const updatedCart = await response.json();
      if (updatedCart.message === 'Cart is now empty') {
        setCart(null);
      } else {
        setCart(updatedCart);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/signin');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove item from cart');
      }

      const updatedCart = await response.json();
      if (updatedCart.message === 'Cart is now empty') {
        setCart(null);
      } else {
        setCart(updatedCart);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/signin');
          return;
        }
        throw new Error('Failed to clear cart');
      }

      setCart(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          restaurant: cart.restaurant,
          items: cart.items.map(item => ({
            menuItem: item.menuItem,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: cart.totalAmount,
          deliveryAddress: "default",
          paymentMethod: "cash" // You can add payment method selection later
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/signin');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }


      const order = await response.json();
      console.log(order);
      
      // Clear the cart after successful order
      await clearCart();
      
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading restaurant details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
        <button
          onClick={() => navigate('/restaurants')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Restaurant not found</div>
        <button
          onClick={() => navigate('/restaurants')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 h-48">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>{restaurant.rating} ★</span>
                <span className="mx-2">•</span>
                <span>{restaurant.deliveryTime}</span>
                <span className="mx-2">•</span>
                <span>{restaurant.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Menu */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
            <div className="grid gap-6">
              {menuItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow p-4 flex gap-4">
                  <div className="w-24 h-24">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">${item.price}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                {cart && cart.items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {!cart ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add items to get started</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cart.items.map((item) => (
                      <div key={item.menuItem} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => updateQuantity(item.menuItem, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="mx-2 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menuItem, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.menuItem)}
                            className="mt-1 text-xs text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">${cart.totalAmount.toFixed(2)}</span>
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      disabled={checkoutLoading || !cart || cart.items.length === 0}
                      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                        checkoutLoading || !cart || cart.items.length === 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {checkoutLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail; 