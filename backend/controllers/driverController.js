const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

// @desc Get available rides (for drivers)
// @route GET /api/drivers/available-rides
exports.getAvailableRides = async (req, res) => {
    try {
        const rides = await Ride.find({ status: 'requested' }).populate('passenger', 'name');
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Accept a ride
// @route PUT /api/drivers/accept-ride/:rideId
exports.acceptRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.rideId);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        if (ride.status !== 'requested') return res.status(400).json({ message: 'Ride already taken or cancelled' });

        ride.driver = req.user._id;
        ride.status = 'accepted';
        await ride.save();

        // Update driver status
        await Driver.findByIdAndUpdate(req.user._id, { status: 'on-ride' });

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update ride status
// @route PUT /api/drivers/update-ride/:rideId
exports.updateRideStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const ride = await Ride.findById(req.params.rideId);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        ride.status = status;
        if (status === 'started') ride.startTime = Date.now();
        if (status === 'completed') {
            ride.endTime = Date.now();
            await Driver.findByIdAndUpdate(req.user._id, { status: 'active' });
        }

        await ride.save();
        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
