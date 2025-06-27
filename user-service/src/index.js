const { sequelize } = require('./models');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');

const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('User Service is running...');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
sequelize.sync({ alter: true }).then(() => {
    console.log('User model synced to database.');
  });