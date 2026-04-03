const authRoutes = require('@routes/authRoutes');
const locationRoutes = require('@routes/locationRoutes');
const resourceRoutes = require('@routes/resourceRoutes');
const categoryRoutes = require('@routes/categoryRoutes');
const staffRoutes = require('@routes/staffRoutes');
const serviceRoutes = require('@routes/servicesRoutes');
const serviceGroupRoutes = require('@routes/servicesGroupRoutes');
const priceTierRoutes = require('@routes/PriceTierRoutes');
const bookingRoutes = require('@routes/bookingRoutes');
const waitlistRoutes = require('@routes/waitlistRoutes');

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/location', locationRoutes);
  app.use('/resource', resourceRoutes);
  app.use('/category', categoryRoutes);
  app.use('/staff', staffRoutes);
  app.use('/services', serviceRoutes);
  app.use('/service-groups', serviceGroupRoutes);
  app.use('/price-tiers', priceTierRoutes);
  app.use('/booking', bookingRoutes);
  app.use('/waitlist', waitlistRoutes);

};
