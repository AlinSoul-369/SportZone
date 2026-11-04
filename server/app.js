const path = require('path');
const express = require('express');
const cors = require('cors'); 
const app = express();


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/SportZone', require('./routes/userRoutes.js'));
app.use('/api/SportZone', require('./routes/productRoutes.js'));
app.use('/api/SportZone', require('./routes/cartRoutes.js'));
app.use('/api/SportZone', require('./routes/matchRoutes.js'));
app.use('/api/SportZone', require('./routes/expectRoutes.js'));
app.use('/api/SportZone', require('./routes/reserveRoutes.js'));

app.get('/', (req, res) => {
  res.send('SportZone API is running');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;