const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User.model');
const DriverDetail = require('../src/models/DriverDetail.model');
const Coupon = require('../src/models/Coupon.model');
const SystemSetting = require('../src/models/SystemSetting.model');

dotenv.config({ path: '../.env' }); // Look for env in parent

const DUMMY_PASSENGERS = [
  { name: 'Priya Deshmukh', email: 'priya@example.com', password: 'Pass@1234', phone: '+91 98230 45678', walletBalance: 1200, role: 'passenger' },
  { name: 'Amit Jadhav', email: 'amit@example.com', password: 'Pass@1234', phone: '+91 97654 32100', walletBalance: 850, role: 'passenger' },
  { name: 'Sneha Kulkarni', email: 'sneha@example.com', password: 'Pass@1234', phone: '+91 96211 78934', walletBalance: 2000, role: 'passenger' },
  { name: 'Rahul Patil', email: 'rahul@example.com', password: 'Pass@1234', phone: '+91 99870 12345', walletBalance: 500, role: 'passenger' }
];

const DUMMY_DRIVERS = [
  {
    name: 'Santosh Mane', email: 'santosh@driver.com', password: 'Drive@123', phone: '+91 99881 12345', role: 'driver',
    vehicle: { model: 'Maruti Suzuki Dzire', number: 'MH 12 AB 3456', type: 'Sedan' }
  },
  {
    name: 'Ganesh Bhosale', email: 'ganesh@driver.com', password: 'Drive@123', phone: '+91 99782 23456', role: 'driver',
    vehicle: { model: 'Tata Nexon', number: 'MH 14 CD 7890', type: 'SUV' }
  },
  {
    name: 'Suresh Jadhav', email: 'suresh@driver.com', password: 'Drive@123', phone: '+91 98634 34567', role: 'driver',
    vehicle: { model: 'Maruti WagonR', number: 'MH 15 EF 2345', type: 'Mini' }
  }
];

const DUMMY_ADMIN = {
  name: 'CabHub Director',
  email: 'admin@cabhub.com',
  password: 'admin123',
  phone: '+91 90000 00000',
  role: 'admin'
};

const DUMMY_COUPONS = [
  { code: 'CABHUB50', discountType: 'fixed', value: 50, description: '₹50 flat off on your ride' },
  { code: 'WELCOME10', discountType: 'percent', value: 10, maxDiscount: 40, description: '10% off up to ₹40' },
  { code: 'BUMPER20', discountType: 'percent', value: 20, maxDiscount: 80, description: '20% off up to ₹80' }
];

const DUMMY_SETTINGS = [
  { key: 'base_fare', value: 50 },
  { key: 'per_km_rate', value: 15 },
  { key: 'surge_multiplier', value: 1.0 },
  { key: 'commission_percent', value: 15 }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/cabhub';
    console.log('Connecting to database:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log('Clearing old collections...');
    await User.deleteMany({});
    await DriverDetail.deleteMany({});
    await Coupon.deleteMany({});
    await SystemSetting.deleteMany({});

    console.log('Seeding Admin...');
    await User.create(DUMMY_ADMIN);

    console.log('Seeding Passengers...');
    for (const p of DUMMY_PASSENGERS) {
      await User.create(p);
    }

    console.log('Seeding Drivers & details...');
    for (const d of DUMMY_DRIVERS) {
      const user = await User.create({
        name: d.name,
        email: d.email,
        password: d.password,
        phone: d.phone,
        role: d.role
      });
      await DriverDetail.create({
        userId: user._id,
        verificationStatus: 'approved',
        vehicle: d.vehicle,
        dutyStatus: 'active'
      });
    }

    console.log('Seeding Coupons...');
    for (const c of DUMMY_COUPONS) {
      await Coupon.create(c);
    }

    console.log('Seeding System Settings...');
    for (const s of DUMMY_SETTINGS) {
      await SystemSetting.create(s);
    }

    console.log('Seeding completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
