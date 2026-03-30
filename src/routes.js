const authRoutes = require('@routes/authRoutes');
const locationRoutes = require('@routes/locationRoutes');
const resourceRoutes = require('@routes/resourceRoutes');

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/location', locationRoutes);
  app.use('/resource', resourceRoutes);
};
