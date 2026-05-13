const Service = require('../models/Services');
const Category = require('../models/Category');
const response = require('../responses');

const serviceController = {
  createService: async (req, res) => {
    try {
      const payload = req.body;

      if (!payload.serviceName || !payload.serviceName.trim()) {
        return response.badReq(res, { message: 'Service name is required' });
      }

      if (!payload.category) {
        return response.badReq(res, { message: 'Category is required' });
      }

      const categoryExists = await Category.findById(payload.category);
      if (!categoryExists) {
        return response.badReq(res, { message: 'Invalid category' });
      }

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
        description: payload.description || '',
        category: payload.category,

        priceType: payload.priceType || 'Fixed price',
        price: Number(payload.price) || 0,

        duration: totalDuration,

        tax: payload.tax || 'GST',
        priceIncludesTax: payload.priceIncludesTax !== undefined ? payload.priceIncludesTax : true,

        staff: staffIds,

        color: payload.serviceColor || '#319795',

        onlineBookings: payload.onlineBookings !== undefined ? payload.onlineBookings : true,
        vipOnly: payload.vipOnly || false,
        isVideoCall: payload.isVideoCall || false,

        pancakePricing: payload.pancakePricing || [],
        availableAddons: payload.availableAddons || [],

        bookingQuestion: payload.bookingQuestion || '',
        bookingQuestionRequired: payload.bookingQuestionRequired || 'Online and via calendar',

        depositType: payload.depositType || 'full',
        depositPercentage: payload.depositPercentage || 50,
        depositAmount: payload.depositAmount || '',

        paymentPolicy: payload.paymentPolicy || 'default',
        onlinePayment: payload.onlinePayment || 'default',
      });

      return response.ok(res, {
        message: 'Service created successfully',
        data: service,
      });
    } catch (error) {
      console.error('Service creation error:', error);
      return response.error(res, error);
    }
  },

  getAllServices: async (req, res) => {
    try {
      const services = await Service.find()
        .populate('category')
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
      const payload = req.body;

      const updateData = {};

     
      if (payload.serviceName) {
        updateData.name = payload.serviceName;
      }

      // ✅ Description
      if (payload.description) {
        updateData.description = payload.description;
      }

      // ✅ Category validation
      if (payload.category) {
        const categoryExists = await Category.findById(payload.category);
        if (!categoryExists) {
          return response.badReq(res, { message: 'Invalid category' });
        }
        updateData.category = payload.category;
      }

      // ✅ Price
      if (payload.priceType) updateData.priceType = payload.priceType;
      if (payload.price !== undefined) updateData.price = Number(payload.price);

      // ✅ Duration (same logic as create)
      if (payload.durationH || payload.durationM) {
        const hours = parseInt(payload.durationH || 0);
        const minutes = parseInt(payload.durationM?.split(':')[1] || 0);
        updateData.duration = hours * 60 + minutes;
      }

      // ✅ Tax
      if (payload.tax) updateData.tax = payload.tax;
      if (payload.priceIncludesTax !== undefined)
        updateData.priceIncludesTax = payload.priceIncludesTax;

      // ✅ Staff
      if (payload.selectedStaff) {
        let staffIds = [];

        if (!payload.selectedStaff?.all) {
          staffIds = Object.keys(payload.selectedStaff).filter(
            (key) => payload.selectedStaff[key] && key !== 'all',
          );
        }

        updateData.staff = staffIds;
      }

      if (payload.pancakePricing !== undefined) {
        updateData.pancakePricing = payload.pancakePricing;
      }

      if (payload.availableAddons !== undefined) {
        updateData.availableAddons = payload.availableAddons;
      }

      if (payload.bookingQuestionRequired !== undefined) {
        updateData.bookingQuestionRequired = payload.bookingQuestionRequired;
      }

      if (payload.depositType !== undefined) {
        updateData.depositType = payload.depositType;
      }

      if (payload.depositPercentage !== undefined) {
        updateData.depositPercentage = payload.depositPercentage;
      }

      if (payload.depositAmount !== undefined) {
        updateData.depositAmount = payload.depositAmount;
      }

      const directFields = [
        'serviceColor',
        'onlineBookings',
        'vipOnly',
        'isVideoCall',
        'bookingQuestion',
        'paymentPolicy',
        'onlinePayment',
      ];

      directFields.forEach((field) => {
        if (payload[field] !== undefined) {
          if (field === 'serviceColor') {
            updateData.color = payload[field];
          } else {
            updateData[field] = payload[field];
          }
        }
      });

      // 🔥 Update
      const updatedService = await Service.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true },
      );

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

  getMostPopularServices: async (req, res) => {
    try {
      const services = await Service.find()
        .populate('category')
        .sort({ createdAt: -1 });

      const popularServices = services.filter(service => {
        return service.pancakePricing?.some(combo => combo.mostPopular === true);
      });

      return response.ok(res, {
        message: 'Most popular services fetched successfully',
        data: popularServices,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

module.exports = serviceController;
