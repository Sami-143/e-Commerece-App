const mongoose = require('mongoose');

  const connectDatabase = ()=>{
    return mongoose.connect('mongodb+srv://samiullahglotar420:malikecomerceappsami@ecommerce.jkzlt.mongodb.net/')
      .then(() => console.log('Connected to MongoDB Atlas'))
      .catch((err) => console.error('MongoDB Atlas connection error:', err));
  }

module.exports = connectDatabase;
