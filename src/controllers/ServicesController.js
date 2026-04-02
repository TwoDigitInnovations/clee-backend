const Service = require('../models/Services');
const Category = require('../models/Category');
const response = require('../responses');

const serviceController = {
  createService: async (req, res) => {
    try {
      const payload = req.body;

      const hours = parseInt(payload.durationH || 0);
      const minutes = parseInt(payload.durationM?.split(':')[1] || 0);

      const totalDuration = hours * 60 + minutes;

      let staffIds = [];
      if (!payload.selectedStaff?.all) {
        staffIds = Object.keys(payload.selectedStaff).filter(
          (key) => payload.selectedStaff[key] && key !== 'all',
        );
      }

      const service = await Service.create({
        name: payload.serviceName,
        description: payload.description,
        category: payload.category,

        priceType: payload.priceType,
        price: Number(payload.price),

        duration: totalDuration,

        tax: payload.tax,
        priceIncludesTax: payload.priceIncludesTax,

        staff: staffIds,

        color: payload.serviceColor,

        onlineBookings: payload.onlineBookings,
        vipOnly: payload.vipOnly,
        isVideoCall: payload.isVideoCall,

        bookingQuestion: payload.bookingQuestion,
        paymentPolicy: payload.paymentPolicy,
        onlinePayment: payload.onlinePayment,
      });

      return response.ok(res, {
        message: 'Service created successfully',
        data: service,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  
  getAllServices: async (req, res) => {
    try {
      const services = await Service.find()
        .populate('category', 'name')
        .sort({ createdAt: -1 });

      return response.ok(res, {
        message: 'Services fetched successfully',
        data: services,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getServiceById: async (req, res) => {
    try {
      const { id } = req.params;

      const service = await Service.findById(id).populate('category', 'name');

      if (!service) {
        return response.badReq(res, { message: 'Service not found' });
      }

      return response.ok(res, {
        message: 'Service fetched successfully',
        data: service,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.category) {
        const categoryExists = await Category.findById(updateData.category);
        if (!categoryExists) {
          return response.badReq(res, { message: 'Invalid category' });
        }
      }

      const updatedService = await Service.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedService) {
        return response.badReq(res, { message: 'Service not found' });
      }

      return response.ok(res, {
        message: 'Service updated successfully',
        data: updatedService,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteService: async (req, res) => {
    try {
      const { id } = req.params;

      const service = await Service.findByIdAndDelete(id);

      if (!service) {
        return response.badReq(res, { message: 'Service not found' });
      }

      return response.ok(res, {
        message: 'Service deleted successfully',
        data: service,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

module.exports = serviceController;
