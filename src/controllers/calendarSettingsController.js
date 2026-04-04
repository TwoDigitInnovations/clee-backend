const CalendarSettings = require('@models/CalendarSettings');
const response = require('../responses');

module.exports = {
 
  getCalendarSettings: async (req, res) => {
    try {
      let settings = await CalendarSettings.findOne({
        SalonManager: req.user.id,
      });

     
      if (!settings) {
        settings = await CalendarSettings.create({
          SalonManager: req.user.id,
        });
      }

      return response.ok(res, {
        data: settings,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

 
  updateCalendarSettings: async (req, res) => {
    try {
      console.log('=== Update Calendar Settings ===');
      console.log('User ID:', req.user?.id);
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      
      const payload = req.body;

      let settings = await CalendarSettings.findOne({
        SalonManager: req.user.id,
      });

      console.log('Existing settings found:', !!settings);

      if (!settings) {
        payload.SalonManager = req.user.id;
        console.log('Creating new settings...');
        settings = await CalendarSettings.create(payload);
        console.log('New settings created');
      } else {
        console.log('Updating existing settings...');
        settings = await CalendarSettings.findOneAndUpdate(
          { SalonManager: req.user.id },
          { $set: payload },
          { new: true, runValidators: true },
        );
        console.log('Settings updated');
      }

      return response.ok(res, {
        message: 'Calendar settings updated successfully',
        data: settings,
      });
    } catch (error) {
      console.error('ERROR in updateCalendarSettings:', error.message);
      console.error('Stack:', error.stack);
      return response.error(res, error);
    }
  },

  
  addCancellationReason: async (req, res) => {
    try {
      const { reason } = req.body;

      if (!reason || reason.trim() === '') {
        return response.badReq(res, { message: 'Reason is required' });
      }

      const settings = await CalendarSettings.findOneAndUpdate(
        { SalonManager: req.user.id },
        { $push: { cancellationReasons: reason } },
        { new: true, upsert: true },
      );

      return response.ok(res, {
        message: 'Cancellation reason added successfully',
        data: settings,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },


  removeCancellationReason: async (req, res) => {
    try {
      const { reason } = req.body;

      const settings = await CalendarSettings.findOneAndUpdate(
        { SalonManager: req.user.id },
        { $pull: { cancellationReasons: reason } },
        { new: true },
      );

      if (!settings) {
        return response.badReq(res, { message: 'Settings not found' });
      }

      return response.ok(res, {
        message: 'Cancellation reason removed successfully',
        data: settings,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

 
  addAppointmentStatus: async (req, res) => {
    try {
      const { name, color, enabled } = req.body;

      if (!name || !color) {
        return response.badReq(res, { message: 'Name and color are required' });
      }

      const settings = await CalendarSettings.findOneAndUpdate(
        { SalonManager: req.user.id },
        {
          $push: {
            appointmentStatuses: {
              name,
              color,
              enabled: enabled || false,
            },
          },
        },
        { new: true, upsert: true },
      );

      return response.ok(res, {
        message: 'Appointment status added successfully',
        data: settings,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

 
  updateAppointmentStatus: async (req, res) => {
    try {
      const { statusId } = req.params;
      const { name, color, enabled } = req.body;

      const updateFields = {};
      if (name) updateFields['appointmentStatuses.$.name'] = name;
      if (color) updateFields['appointmentStatuses.$.color'] = color;
      if (enabled !== undefined) updateFields['appointmentStatuses.$.enabled'] = enabled;

      const settings = await CalendarSettings.findOneAndUpdate(
        {
          SalonManager: req.user.id,
          'appointmentStatuses._id': statusId,
        },
        { $set: updateFields },
        { new: true },
      );

      if (!settings) {
        return response.badReq(res, { message: 'Status not found' });
      }

      return response.ok(res, {
        message: 'Appointment status updated successfully',
        data: settings,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },


  removeAppointmentStatus: async (req, res) => {
    try {
      const { statusId } = req.params;

      const settings = await CalendarSettings.findOneAndUpdate(
        { SalonManager: req.user.id },
        { $pull: { appointmentStatuses: { _id: statusId } } },
        { new: true },
      );

      if (!settings) {
        return response.badReq(res, { message: 'Settings not found' });
      }

      return response.ok(res, {
        message: 'Appointment status removed successfully',
        data: settings,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
