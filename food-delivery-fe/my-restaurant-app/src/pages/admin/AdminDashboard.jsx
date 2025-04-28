import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ShopOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';


const { Header, Sider, Content, Footer } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          icon: <UserOutlined />,
          label: 'Profile',
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
          <Link to="/admin-dashboard">
            <div className="text-white text-xl font-bold">
              {collapsed ? 'GA' : 'Global Admin'}
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
            <Link to="/admin-dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<TeamOutlined />}>
            <Link to="/admin-dashboard/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="restaurants" icon={<ShopOutlined />}>
            <Link to="/admin-dashboard/restaurants">Restaurants</Link>
          </Menu.Item>
          <Menu.Item key="analytics" icon={<BarChartOutlined />}>
            <Link to="/admin-dashboard/analytics">Analytics</Link>
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
            <span className="ml-4 text-lg font-semibold">Global Administration</span>
          </div>
          
          <div className="flex items-center">
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="cursor-pointer flex items-center">
                <Avatar icon={<UserOutlined />} />
                <span className="ml-2">{'Admin'}</span>
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
          FoodOrder Global Admin ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;