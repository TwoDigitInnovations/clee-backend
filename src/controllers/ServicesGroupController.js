const ServiceGroup = require('../models/ServicesGroup');
const Service = require('../models/Services');
const Category = require('../models/Category');
const response = require('../responses');

const serviceGroupController = {
  createServiceGroup: async (req, res) => {
    try {
      const {
        name,
        description,
        category,
        services,
        allowOnlineBooking,
        ...rest
      } = req.body;

      if (!name) {
        return response.badReq(res, {
          message: 'Service group name is required',
        });
      }

      if (category) {
        const catExists = await Category.findById(category);
        if (!catExists) {
          return response.badReq(res, { message: 'Invalid category' });
        }
      }

      let serviceIds = [];

      if (services && services.length > 0) {
        serviceIds = services.map((s) => s.service);

        const validServices = await Service.find({
          _id: { $in: serviceIds },
        });
        console.log('validServices', validServices);
        console.log('validServices', serviceIds);
        console.log('validServices', validServices.length);
        console.log('Services', serviceIds.length);
        if (validServices.length !== serviceIds.length) {
          return response.badReq(res, {
            message: 'Some services are invalid',
          });
        }
      }

      const group = await ServiceGroup.create({
        name,
        description,
        category,
        services: services,
        allowOnlineBooking,
        ...rest,
      });

      return response.ok(res, {
        message: 'Service group created successfully',
        data: group,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllServiceGroups: async (req, res) => {
    try {
      const groups = await ServiceGroup.find()
        .populate('category', 'name')
        .populate('services', 'name price duration');

      return response.ok(res, {
        message: 'Service groups fetched successfully',
        data: groups,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getServiceGroupById: async (req, res) => {
    try {
      const { id } = req.params;

      const group = await ServiceGroup.findById(id)
        .populate('category', 'name')
        .populate('services', 'name price duration');

      if (!group) {
        return response.badReq(res, { message: 'Service group not found' });
      }

      return response.ok(res, {
        message: 'Service group fetched successfully',
        data: group,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateServiceGroup: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        category,
        services,
        allowOnlineBooking,
        ...rest
      } = req.body;

      if (category) {
        const catExists = await Category.findById(category);
        if (!catExists) {
          return response.badReq(res, { message: 'Invalid category' });
        }
      }

      let formattedServices = [];

      if (services && services.length > 0) {
        const serviceIds = services.map((s) => s.id);

        const validServices = await Service.find({
          _id: { $in: serviceIds },
        });

        if (validServices.length !== serviceIds.length) {
          return response.badReq(res, {
            message: 'Some services are invalid',
          });
        }

        formattedServices = services.map((s) => ({
          service: s.id,
          name: s.name,
          duration: s.duration,
          paddingBefore: s.paddingBefore,
          paddingAfter: s.paddingAfter,
          cost: s.cost,
          overridePrice: s.overridePrice,
        }));
      }

      const updateData = {
        ...(name && { name }),
        ...(description && { description }),
        ...(category && { category }),
        ...(services && { services: formattedServices }),
        ...(typeof allowOnlineBooking !== 'undefined' && {
          allowOnlineBooking,
          ...rest,
        }),
      };

      const updatedGroup = await ServiceGroup.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );

      if (!updatedGroup) {
        return response.badReq(res, { message: 'Service group not found' });
      }

      return response.ok(res, {
        message: 'Service group updated successfully',
        data: updatedGroup,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteServiceGroup: async (req, res) => {
    try {
      const { id } = req.params;

      const group = await ServiceGroup.findByIdAndDelete(id);

      if (!group) {
        return response.badReq(res, { message: 'Service group not found' });
      }

      return response.ok(res, {
        message: 'Service group deleted successfully',
        data: group,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

module.exports = serviceGroupController;
