const cors = require('cors');

const corsOptions = {
    origin: 'https://espike-frontend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    credentials: true
};

module.exports = cors(corsOptions);
//trabalhar o server/app js