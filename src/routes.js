const authRoutes = require('@routes/authRoutes');
const locationRoutes = require('@routes/locationRoutes');

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/location', locationRoutes)

};
