const mongoose = require('mongoose');

const markerSchema = new mongoose.Schema({
    ocurrenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ocurrence', // Certifique-se de que "Ocurrence" é o nome correto do modelo
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Marker', markerSchema);
