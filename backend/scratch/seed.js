const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User.model');
const DriverDetail = require('../src/models/DriverDetail.model');
const Ride = require('../src/models/Ride.model');
const Notification = require('../src/models/Notification.model');
const Complaint = require('../src/models/Complaint.model');
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
    vehicle: { model: 'Maruti Suzuki Dzire', number: 'MH 12 AB 3456', type: 'Sedan' },
    documents: { drivingLicense: '/uploads/documents/sample_dl.pdf', aadhaarCard: '/uploads/documents/sample_aadhaar.pdf' }
  },
  {
    name: 'Ganesh Bhosale', email: 'ganesh@driver.com', password: 'Drive@123', phone: '+91 99782 23456', role: 'driver',
    vehicle: { model: 'Tata Nexon', number: 'MH 14 CD 7890', type: 'SUV' },
    documents: { drivingLicense: '/uploads/documents/sample_dl2.pdf' }
  },
  {
    name: 'Suresh Jadhav', email: 'suresh@driver.com', password: 'Drive@123', phone: '+91 98634 34567', role: 'driver',
    vehicle: { model: 'Maruti WagonR', number: 'MH 15 EF 2345', type: 'Mini' },
    documents: {}
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
    await Ride.deleteMany({});
    await Notification.deleteMany({});
    await Complaint.deleteMany({});
    await Coupon.deleteMany({});
    await SystemSetting.deleteMany({});

    console.log('Seeding Admin...');
    const adminUser = await User.create(DUMMY_ADMIN);

    console.log('Seeding Passengers...');
    const createdPassengers = [];
    for (const p of DUMMY_PASSENGERS) {
      const passenger = await User.create(p);
      createdPassengers.push(passenger);
    }

    console.log('Seeding Drivers & details...');
    const createdDrivers = [];
    for (const d of DUMMY_DRIVERS) {
      const user = await User.create({
        name: d.name,
        email: d.email,
        password: d.password,
        phone: d.phone,
        role: d.role
      });
      const driverDetail = await DriverDetail.create({
        userId: user._id,
        verificationStatus: 'approved',
        vehicle: d.vehicle,
        documents: d.documents || {},
        dutyStatus: 'active'
      });
      createdDrivers.push({ user, detail: driverDetail });
    }

    console.log('Seeding Sample Rides...');
    const ride1 = await Ride.create({
      passengerId: createdPassengers[0]._id,
      driverId: createdDrivers[0].user._id,
      pickup: { name: 'Shivaji Nagar Station, Pune', lat: 18.5308, lng: 73.8474 },
      drop: { name: 'Koregaon Park, Pune', lat: 18.5362, lng: 73.8940 },
      originalFare: 180,
      fare: 130,
      discount: 50,
      promoCode: 'CABHUB50',
      vehicleType: 'Sedan',
      distance: 6.5,
      duration: 18,
      status: 'completed',
      otp: '4821',
      rated: true,
      passengerRating: 5,
      passengerFeedback: 'Excellent pilot, very smooth ride!',
      messages: [
        { sender: 'system', text: 'Searching for Sedan drivers near you...' },
        { sender: 'system', text: `Pilot ${createdDrivers[0].user.name} accepted your ride!` },
        { sender: 'passenger', text: 'I am standing near exit gate 2' },
        { sender: 'driver', text: 'Reaching in 2 minutes sir' },
        { sender: 'system', text: 'Ride completed successfully. Thank you!' }
      ]
    });

    const ride2 = await Ride.create({
      passengerId: createdPassengers[1]._id,
      driverId: createdDrivers[1].user._id,
      pickup: { name: 'Viman Nagar, Pune', lat: 18.5679, lng: 73.9143 },
      drop: { name: 'Pune Airport (PNQ)', lat: 18.5793, lng: 73.9089 },
      originalFare: 120,
      fare: 120,
      discount: 0,
      vehicleType: 'SUV',
      distance: 3.2,
      duration: 10,
      status: 'started',
      otp: '7392',
      messages: [
        { sender: 'system', text: 'Searching for SUV drivers near you...' },
        { sender: 'system', text: 'Ride started. OTP verified. Enjoy your journey!' }
      ]
    });

    console.log('Seeding Complaints...');
    await Complaint.create({
      userId: createdPassengers[0]._id,
      rideId: ride1._id,
      description: 'Minor delay due to heavy traffic near Sancheti Hospital junction.',
      status: 'resolved',
      assignedStaff: adminUser.name,
      resolutionDetails: 'Checked traffic conditions. Issued ₹20 wallet compensation voucher.'
    });

    console.log('Seeding Notifications...');
    await Notification.create({
      userId: createdPassengers[0]._id.toString(),
      message: 'Welcome to CabHub Premier! Enjoy ₹50 off using coupon CABHUB50 🚗',
      type: 'success'
    });
    await Notification.create({
      userId: 'all',
      message: 'System Maintenance scheduled for Sunday 2:00 AM - 3:00 AM.',
      type: 'info'
    });

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
