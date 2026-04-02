const User = require('@models/User');
const response = require('../responses');

module.exports = {
  createStaff: async (req, res) => {
    try {
      const payload = req.body;

      payload.SalonManager = req.user.id;
      payload.fullname = payload.name;

      Object.keys(payload).forEach((key) => {
        if (payload[key] === '' || payload[key] === null) {
          delete payload[key];
        }
      });

      const staff = await User.create({
        ...payload,
        role: 'staff',
      });

      return response.ok(res, {
        message: 'Staff created successfully',
        data: staff,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  getAllStaff: async (req, res) => {
    try {
      const staffList = await User.find({
        SalonManager: req.user.id,
        role: 'staff',
      }).sort({ createdAt: -1 });

      return response.ok(res, {
        message: 'Staff list fetched successfully',
        data: staffList,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  updateStaff: async (req, res) => {
    try {
      const { id } = req.params;
      const payload = req.body;

      payload.fullname = payload.name;

      Object.keys(payload).forEach((key) => {
        if (payload[key] === '' || payload[key] === null) {
          delete payload[key];
        }
      });

      const updatedStaff = await User.findOneAndUpdate(
        {
          _id: id,
          SalonManager: req.user.id,
          role: 'staff',
        },
        payload,
        { new: true },
      );

      if (!updatedStaff) {
        return response.notFound(res, 'Staff not found');
      }

      return response.ok(res, {
        message: 'Staff updated successfully',
        data: updatedStaff,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  deleteStaff: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedStaff = await User.findOneAndDelete({
        _id: id,
        SalonManager: req.user.id,
        role: 'staff',
      });

      if (!deletedStaff) {
        return response.notFound(res, 'Staff not found');
      }

      return response.ok(res, {
        message: 'Staff deleted successfully',
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  getStaffById: async (req, res) => {
    try {
      const { id } = req.params;

      const staff = await User.findOne({
        _id: id,
        SalonManager: req.user.id,
        role: 'staff',
      });

      if (!staff) {
        return response.notFound(res, 'Staff not found');
      }

      return response.ok(res, {
        message: 'Staff fetched successfully',
        data: staff,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
