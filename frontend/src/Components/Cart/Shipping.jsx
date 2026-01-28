import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../../Redux/cartSlice';
import { FiMapPin, FiPhone, FiMap, FiHome, FiArrowRight, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'Pakistan',
  'China',
  'Japan',
];

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    address: shippingInfo.address || '',
    city: shippingInfo.city || '',
    state: shippingInfo.state || '',
    country: shippingInfo.country || '',
    pinCode: shippingInfo.pinCode || '',
    phoneNo: shippingInfo.phoneNo || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.address || !formData.city || !formData.state || !formData.country || !formData.pinCode || !formData.phoneNo) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.phoneNo.length < 10) {
      toast.error('Phone number must be at least 10 digits');
      return;
    }

    dispatch(saveShippingInfo(formData));
    navigate('/payment');
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
              <FiCheck />
            </div>
            <span className="ml-2 text-green-400 font-medium hidden sm:block">Cart</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-amber-500 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
              2
            </div>
            <span className="ml-2 text-amber-400 font-medium hidden sm:block">Shipping</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-gray-700 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
              3
            </div>
            <span className="ml-2 text-gray-400 font-medium hidden sm:block">Payment</span>
          </div>
          <div className="w-8 sm:w-16 h-1 bg-gray-700 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
              4
            </div>
            <span className="ml-2 text-gray-400 font-medium hidden sm:block">Confirm</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Shipping Details</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Address */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                <FiHome className="inline mr-2" />
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  <FiMapPin className="inline mr-2" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  <FiMap className="inline mr-2" />
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Pin Code & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Pin Code</label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="Pin Code"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  <FiPhone className="inline mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-xl transition-colors mt-6"
            >
              Continue to Payment
              <FiArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
