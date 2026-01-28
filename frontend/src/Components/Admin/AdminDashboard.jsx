import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  // Placeholder stats - in real app, fetch from API
  const stats = [
    { 
      title: 'Total Products', 
      value: '156', 
      icon: FiPackage, 
      color: 'amber',
      link: '/admin/products'
    },
    { 
      title: 'Total Orders', 
      value: '1,247', 
      icon: FiShoppingBag, 
      color: 'blue',
      link: '/admin/orders'
    },
    { 
      title: 'Total Users', 
      value: '3,892', 
      icon: FiUsers, 
      color: 'green',
      link: '/admin/users'
    },
    { 
      title: 'Revenue', 
      value: '$48,295', 
      icon: FiDollarSign, 
      color: 'purple',
      link: '/admin/orders'
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      amber: 'bg-amber-500/20 text-amber-400',
      blue: 'bg-blue-500/20 text-blue-400',
      green: 'bg-green-500/20 text-green-400',
      purple: 'bg-purple-500/20 text-purple-400',
    };
    return colors[color] || colors.amber;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <stat.icon size={24} />
                </div>
                <FiArrowRight className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <p className="text-gray-400 text-sm mt-4">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/product/new"
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <FiPackage className="text-amber-400" />
              </div>
              <span className="text-white">Add New Product</span>
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FiPackage className="text-blue-400" />
              </div>
              <span className="text-white">View All Products</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FiShoppingBag className="text-green-400" />
              </div>
              <span className="text-white">Manage Orders</span>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FiUsers className="text-purple-400" />
              </div>
              <span className="text-white">Manage Users</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
              <Link to="/admin/orders" className="text-amber-400 text-sm hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                    <div>
                      <p className="text-white text-sm">Order #12345{index}</p>
                      <p className="text-gray-500 text-xs">2 items • $99.00</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    Delivered
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Top Products</h2>
              <Link to="/admin/products" className="text-amber-400 text-sm hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                    <div>
                      <p className="text-white text-sm">Product Name {index + 1}</p>
                      <p className="text-gray-500 text-xs">{50 - index * 10} sold</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <FiTrendingUp size={14} />
                    <span>{15 + index * 5}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
