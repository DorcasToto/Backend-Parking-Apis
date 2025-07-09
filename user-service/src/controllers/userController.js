const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const userWithoutPassword = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. Check if user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // 2. Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // 3. Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // 4. Return user + token
      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
  
    } catch (error) {
      console.error('❌ Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
const getMyProfile = async (req, res) => {
    try {
      const { id, name, email, role } = req.user;
      res.status(200).json({ id, name, email, role });
    } catch (err) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  
  
module.exports = { registerUser, loginUser,getMyProfile };
