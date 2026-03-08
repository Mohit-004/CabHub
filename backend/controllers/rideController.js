const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

// @desc Request a ride
// @route POST /api/rides/request
exports.requestRide = async (req, res) => {
    try {
        const { pickupLocation, dropLocation, fare } = req.body;
        const passengerId = req.user._id;

        const ride = await Ride.create({
            passenger: passengerId,
            pickupLocation,
            dropLocation,
            fare
        });

        // In a real app, we would emit a socket event to nearby drivers here
        // For simulation, we'll inform that ride is requested
        res.status(201).json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get ride details
// @route GET /api/rides/:id
exports.getRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate('passenger', 'name phone')
            .populate('driver', 'name phone vehicle');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get user ride history
// @route GET /api/rides/history/user
exports.getUserHistory = async (req, res) => {
    try {
        const rides = await Ride.find({ passenger: req.user._id }).sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc Estimate ride fare
// @route POST /api/rides/estimate
exports.estimateRide = async (req, res) => {
    try {
        const { distance } = req.body; // Assume client sends distance in km for now

        if (!distance) {
            return res.status(400).json({ message: 'Distance is required' });
        }

        const rates = {
            Mini: 10,  // $/km
            Sedan: 15,
            SUV: 25
        };

        const estimates = Object.keys(rates).map(type => ({
            type,
            fare: Math.round(distance * rates[type]),
            eta: Math.round(5 + Math.random() * 10) // Mock ETA in minutes
        }));

        res.json(estimates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
