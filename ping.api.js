const express = require('express');
const cors = require('cors');
const ping = require('net-ping');
const IPAddress = require('./models/IP');
const { body, validationResult } = require('express-validator'); // this section is part of version 2 where I validate the connection for the adding 

const router = express.Router();

// Enable CORS
router.use(cors());
router.use(express.json());

// Create a net-ping session
const session = ping.createSession();

// Function to ping an IP address
const pingIP = (ipAddress) => {
    return new Promise((resolve) => {
        session.pingHost(ipAddress, (error, target, sent, rcvd) => {
            const ms = rcvd - sent; // Calculate the round-trip time
            if (error) {
                resolve({ ipAddress: target, alive: false, rtt: ms }); // IP is unreachable
            } else {
                resolve({ ipAddress: target, alive: true, rtt: ms }); // IP is reachable
            }
        });
    });
};

// 🟢 **POST route to add a new IP address**
router.post('/ping', [
    body('ipAddress').isIP().withMessage('Invalid IP address'),
    body('name').isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
    body('category').isIn(['client', 'NNS', 'hardware', 'wireless', 'fibre']).withMessage('Invalid category')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { ipAddress, name, category } = req.body;

    try {
        // Use net-ping to check if the IP is reachable
        const response = await pingIP(ipAddress);

        // Create and save a new IP record
        const newIPAddress = new IPAddress({
            ipAddress,
            name,
            status: response.alive,
            timestamp: new Date(),
            rtt: response.rtt,
            category
        });

        await newIPAddress.save();

        res.status(201).json({ message: 'IP address added successfully', data: newIPAddress });
    } catch (error) {
        console.error('Error adding IP address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 🟢 **POST route to ping an existing IP and update its status**
router.post('/ping/ping-only', async (req, res) => {
    const { ipAddress } = req.body;

    try {
        const response = await pingIP(ipAddress);

        // Find the IP in the database
        const ip = await IPAddress.findOne({ ipAddress });

        if (!ip) {
            return res.status(404).json({ status: 'error', message: 'IP address not found' });
        }

        // Update status and timestamp
        ip.status = response.alive;
        ip.timestamp = new Date(); // Update the timestamp
        ip.rtt = response.rtt; // Update the round-trip time
        await ip.save();

        res.status(200).json({ status: 'success', message: 'Ping successful', data: ip });
    } catch (error) {
        console.error('Error performing ping:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// 🟢 **GET route to retrieve all IP addresses**
router.get('/ping', async (req, res) => {
    try {
        const ipAddresses = await IPAddress.find().sort({ timestamp: -1 });
        res.json(ipAddresses);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 🟢 **GET route to retrieve a specific IP by ID**
router.get('/ping/getIP/:id', async (req, res) => {
    try {
        const ip = await IPAddress.findById(req.params.id);
        if (!ip) {
            return res.status(404).json({ message: 'IP address not found' });
        }
        res.json(ip);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 🟢 **GET route to ping all IPs and update their status**
router.get('/ping/ping-all', async (req, res) => {
    try {
        const ipAddresses = await IPAddress.find();

        // Ping each IP and update status
        const pingResults = await Promise.all(
            ipAddresses.map(async (ip) => {
                const response = await pingIP(ip.ipAddress);
                ip.status = response.alive;
                ip.timestamp = new Date(); // Update the timestamp
                ip.rtt = response.rtt; // Update the round-trip time
                await ip.save();
                return { ipAddress: ip.ipAddress, status: response.alive ? 'success' : 'failure', rtt: response.rtt };
            })
        );

        res.status(200).json({ status: 'success', data: pingResults });
    } catch (error) {
        console.error('Error pinging all IP addresses:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// 🟢 **GET route to ping all IPs in a specific category and update their status**
router.get('/ping/ping-category/:category', async (req, res) => {
    try {
        const ipAddresses = await IPAddress.find({ category: req.params.category });

        // Ping each IP and update status
        const pingResults = await Promise.all(
            ipAddresses.map(async (ip) => {
                const response = await pingIP(ip.ipAddress);
                ip.status = response.alive;
                ip.timestamp = new Date(); // Update the timestamp
                ip.rtt = response.rtt; // Update the round-trip time
                await ip.save();
                return { ipAddress: ip.ipAddress, status: response.alive ? 'success' : 'failure', rtt: response.rtt };
            })
        );

        res.status(200).json({ status: 'success', data: pingResults });
    } catch (error) {
        console.error('Error pinging IP addresses in category:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// 🟢 **DELETE route to delete an IP address**
router.delete('/ping/delete/:id', async (req, res) => {
    try {
        await IPAddress.findByIdAndDelete(req.params.id);
        res.json({ message: 'IP address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 🟢 **PUT route to update an IP address**
router.put('/ping/update/:id', async (req, res) => {
    try {
        const updatedIP = await IPAddress.findByIdAndUpdate(
            req.params.id,
            { ipAddress: req.body.ipAddress, name: req.body.name, category: req.body.category }, // Include category in the update
            { new: true }
        );

        res.json(updatedIP);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;