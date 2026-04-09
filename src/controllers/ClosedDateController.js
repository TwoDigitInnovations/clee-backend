const ClosedDate = require('../models/CloseDates');
const response = require('../responses');

const closedDateController = {
  createClosedDate: async (req, res) => {
    try {
      const { description, end_date, start_date } = req.body;

      if (!start_date || !end_date) {
        return response.badReq(res, {
          message: 'Start and End date are required',
        });
      }

      if (new Date(end_date) < new Date(start_date)) {
        return response.badReq(res, {
          message: 'End date cannot be before start date',
        });
      }

      const data = await ClosedDate.create({
        user: req.user?.id,
        startDate: start_date,
        endDate: end_date,
        description,
      });

      return response.ok(res, {
        message: 'Closed date added successfully',
        data,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllClosedDates: async (req, res) => {
    try {
      const data = await ClosedDate.find({ isDeleted: false })
        .populate('user', 'fullname email')
        .sort({ startDate: 1 });

      return response.ok(res, {
        message: 'Closed dates fetched successfully',
        data,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ Get Single
  getClosedDateById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await ClosedDate.findOne({ _id: id, isDeleted: false });

      if (!data) {
        return response.badReq(res, {
          message: 'Closed date not found',
        });
      }

      return response.ok(res, {
        message: 'Closed date fetched successfully',
        data,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ Update
  updateClosedDate: async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.body;

      if (startDate && endDate) {
        if (new Date(endDate) < new Date(startDate)) {
          return response.badReq(res, {
            message: 'End date cannot be before start date',
          });
        }
      }

      const updated = await ClosedDate.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updated) {
        return response.badReq(res, {
          message: 'Closed date not found',
        });
      }

      return response.ok(res, {
        message: 'Closed date updated successfully',
        data: updated,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ Delete
  deleteClosedDate: async (req, res) => {
    try {
      const { id } = req.params;

      if (!deleted) {
        return response.badReq(res, {
          message: 'Closed date not found',
        });
      }

      const deleted = await ClosedDate.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );

      return response.ok(res, {
        message: 'Closed date deleted successfully',
        data: deleted,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

module.exports = closedDateController;
