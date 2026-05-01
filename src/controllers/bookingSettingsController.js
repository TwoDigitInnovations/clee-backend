const BookingSettings = require('@models/BookingSettings');
const response = require('../responses');

module.exports = {
 
  getBookingSettings: async (req, res) => {
    try {
      let settings = await BookingSettings.findOne({
        SalonManager: req.user.id,
      });

     
      if (!settings) {
        settings = await BookingSettings.create({
          SalonManager: req.user.id,
        });
      }

      return response.ok(res, {
        data: settings,
      });
    } catch (error) {
      console.error('Error fetching booking settings:', error);
      return response.error(res, error);
    }
  },

  
  saveBookingSettings: async (req, res) => {
    try {
      const payload = req.body;

      let settings = await BookingSettings.findOne({
        SalonManager: req.user.id,
      });

      if (!settings) {
       
        payload.SalonManager = req.user.id;
        settings = await BookingSettings.create(payload);
      } else {
     
        settings = await BookingSettings.findOneAndUpdate(
          { SalonManager: req.user.id },
          { $set: payload },
          { new: true, runValidators: true },
        );
      }

      return response.ok(res, {
        message: 'Booking settings saved successfully',
        data: settings,
      });
    } catch (error) {
      console.error('Error saving booking settings:', error);
      return response.error(res, error);
    }
  },
};
