const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-bioflow-dev-key';
// Don't crash if env var is missing, just won't be able to verify
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'mock-client-id');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
};

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword }
      });

      const token = generateToken(user);
      return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, profileCompleted: user.profileCompleted } });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user);
      return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, profileCompleted: user.profileCompleted } });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async googleLogin(req, res) {
    try {
      const { credential } = req.body;
      
      const audience = process.env.GOOGLE_CLIENT_ID || 'mock-client-id';
      console.log('googleLogin starting verification...');
      console.log('Credential present:', !!credential);
      console.log('Audience being used:', audience);

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: audience
      });
      console.log('Verification successful!');
      const payload = ticket.getPayload();
      const { email, name } = payload;

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: { name, email }
        });
      }

      const token = generateToken(user);
      return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, profileCompleted: user.profileCompleted } });
    } catch (e) {
      console.error("Google verify error details:");
      console.error(e);
      return res.status(401).json({ error: `Invalid Google token: ${e.message}` });
    }
  }
}

// Ensure methods have `this` context bound if they used it, but here we used standalone fn
module.exports = new AuthController();
