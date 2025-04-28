import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LoginPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { email, password } = values;
    setError('');
    
    try {
      // This would be your actual login API call
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Redirect based on role
      switch (data.role) {
        case 'restaurant_admin':
          navigate('/restaurant-dashboard');
          break;
        case 'customer':
          navigate('/restaurants');
          break;
        case 'global_admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/restaurants');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full shadow-lg rounded-lg">
        <div className="p-4">
          <Title level={2} className="text-center mb-6">Login</Title>
          
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}
          
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Email" 
              />
            </Form.Item>
            
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
              />
            </Form.Item>
            
            <Form.Item className="mb-0">
              <div className="flex items-center justify-between">
                <Button 
                  type="primary" 
                  htmlType="submit"
                  className="bg-blue-500 hover:bg-blue-700"
                >
                  Sign In
                </Button>
                <a
                  className="font-bold text-sm text-blue-500 hover:text-blue-800"
                  href="/signup"
                >
                  Create an account
                </a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;