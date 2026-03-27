const Location = require('@models/location');
const response = require('../responses');

module.exports = {

  createLocation: async (req, res) => {
    try {
      const userId = req.user.id;
      const location = await Location.create({
        ...req.body,
        user: userId,
      });
  
      return response.ok(res, {
        message: 'Location created successfully',
        data: location,
      });
    } catch (error) {
       

      return response.error(res, error);
    }
  },

  
  updateLocation: async (req, res) => {
    try {
      const { id } = req.params;

      const location = await Location.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!location) {
        return response.badReq(res, { message: 'Location not found' });
      }

      return response.ok(res, {
        message: 'Location updated successfully',
        data: location,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ GET ALL (user wise)
  getAllLocations: async (req, res) => {
    try {
      const userId = req.user.id;

      const locations = await Location.find({ user: userId }).sort({
        createdAt: -1,
      });

      return response.ok(res, {
        message: 'Locations fetched successfully',
        data: locations,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ GET BY ID
  getLocationById: async (req, res) => {
    try {
      const { id } = req.params;

      const location = await Location.findById(id);

      if (!location) {
        return response.badReq(res, { message: 'Location not found' });
      }

      return response.ok(res, {
        message: 'Location fetched successfully',
        data: location,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ DELETE
  deleteLocation: async (req, res) => {
    try {
      const { id } = req.params;

      const location = await Location.findByIdAndDelete(id);

      if (!location) {
        return response.badReq(res, { message: 'Location not found' });
      }

      return response.ok(res, {
        message: 'Location deleted successfully',
        data: location,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
