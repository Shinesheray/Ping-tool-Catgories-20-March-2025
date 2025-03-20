const mongoose = require('mongoose');

const IPSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: Boolean, required: true },
    timestamp: { type: Date, required: true },
    rtt: { type: Number, required: true }, // response time in ms
    category: { type: String, required: true } // Add category field to know which it is that we dealing with
});

// Create the IP model using the defined schema
const IPAddress = mongoose.model('IPAddress', IPSchema);

module.exports = IPAddress;