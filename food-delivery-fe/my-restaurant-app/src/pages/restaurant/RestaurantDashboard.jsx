import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, notification } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Sider, Content, Footer } = Layout;

const RestaurantDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order received', unread: true },
    { id: 2, message: 'Order #1234 is ready for pickup', unread: true }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const notificationMenu = (
    <Menu
      items={notifications.map((item, index) => ({
        key: String(item.id),
        label: (
          <div 
            className={`${item.unread ? 'font-bold' : ''}`}
            onClick={() => markNotificationRead(item.id)}
          >
            {item.message}
          </div>
        )
      }))}
      footer={
        <div className="p-2 text-center">
          <a href="#" className="text-blue-500">View all notifications</a>
        </div>
      }
    />
  );

  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          icon: <UserOutlined />,
          label: <Link to="/restaurant-dashboard/profile">Profile</Link>,
        },
        {
          key: '2',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: () => {
            logout();
            navigate('/login');
          },
        },
      ]}
    />
  );

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        className="shadow-md"
      >
        <div className="flex justify-center py-4">
          <Link to="/restaurant-dashboard">
            <div className="text-white text-xl font-bold">
              {collapsed ? 'FO' : 'FoodOrder Admin'}
            </div>
          </Link>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname.split('/')[2] || 'dashboard']}
          defaultSelectedKeys={['dashboard']}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/restaurant-dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="orders" icon={<FileTextOutlined />}>
            <Link to="/restaurant-dashboard/orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="menu" icon={<ShopOutlined />}>
            <Link to="/restaurant-dashboard/menu">Menu</Link>
          </Menu.Item>
          <Menu.Item key="profile" icon={<UserOutlined />}>
            <Link to="/restaurant-dashboard/profile">Restaurant Profile</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      
      <Layout>
        <Header className="bg-white p-0 flex items-center justify-between px-4 shadow-sm">
          <div className="flex items-center">
            {collapsed ? (
              <MenuUnfoldOutlined
                className="text-xl cursor-pointer"
                onClick={() => setCollapsed(!collapsed)}
              />
            ) : (
              <MenuFoldOutlined
                className="text-xl cursor-pointer"
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
          </div>
          
          <div className="flex items-center">
            <Dropdown overlay={notificationMenu} placement="bottomRight">
              <Badge count={unreadCount} className="mr-4 cursor-pointer">
                <BellOutlined style={{ fontSize: '18px' }} />
              </Badge>
            </Dropdown>
            
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="cursor-pointer flex items-center">
                <Avatar icon={<UserOutlined />} />
                <span className="ml-2">{ 'Restaurant'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="m-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <Outlet />
          </div>
        </Content>
        
        <Footer className="text-center">
          FoodOrder Restaurant Dashboard ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default RestaurantDashboard;