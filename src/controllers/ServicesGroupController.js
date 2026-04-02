const ServiceGroup = require("../models/ServicesGroup");
const Service = require("../models/Services");
const Category = require("../models/Category");
const response = require('../responses');

const serviceGroupController = {


  createServiceGroup: async (req, res) => {
    try {
      const { name, description, category, services, allowOnlineBooking } = req.body;

      if (!name) {
        return response.badReq(res, { message: "Service group name is required" });
      }

      if (category) {
        const catExists = await Category.findById(category);
        if (!catExists) {
          return response.badReq(res, { message: "Invalid category" });
        }
      }

      if (services && services.length > 0) {
        const validServices = await Service.find({ _id: { $in: services } });
        if (validServices.length !== services.length) {
          return response.badReq(res, { message: "Some services are invalid" });
        }
      }

      const group = await ServiceGroup.create({
        name,
        description,
        category,
        services,
        allowOnlineBooking,
      });

      return response.ok(res, {
        message: "Service group created successfully",
        data: group,
      });

    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ Get All Service Groups
  getAllServiceGroups: async (req, res) => {
    try {
      const groups = await ServiceGroup.find()
        .populate("category", "name")
        .populate("services", "name price duration");

      return response.ok(res, {
        message: "Service groups fetched successfully",
        data: groups,
      });

    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ Get Single Service Group
  getServiceGroupById: async (req, res) => {
    try {
      const { id } = req.params;

      const group = await ServiceGroup.findById(id)
        .populate("category", "name")
        .populate("services", "name price duration");

      if (!group) {
        return response.badReq(res, { message: "Service group not found" });
      }

      return response.ok(res, {
        message: "Service group fetched successfully",
        data: group,
      });

    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ Update Service Group
  updateServiceGroup: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, category, services, allowOnlineBooking } = req.body;

      // validate category
      if (category) {
        const catExists = await Category.findById(category);
        if (!catExists) {
          return response.badReq(res, { message: "Invalid category" });
        }
      }

      // validate services
      if (services && services.length > 0) {
        const validServices = await Service.find({ _id: { $in: services } });
        if (validServices.length !== services.length) {
          return response.badReq(res, { message: "Some services are invalid" });
        }
      }

      const updatedGroup = await ServiceGroup.findByIdAndUpdate(
        id,
        { name, description, category, services, allowOnlineBooking },
        { new: true }
      );

      if (!updatedGroup) {
        return response.badReq(res, { message: "Service group not found" });
      }

      return response.ok(res, {
        message: "Service group updated successfully",
        data: updatedGroup,
      });

    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ Delete Service Group
  deleteServiceGroup: async (req, res) => {
    try {
      const { id } = req.params;

      const group = await ServiceGroup.findByIdAndDelete(id);

      if (!group) {
        return response.badReq(res, { message: "Service group not found" });
      }

      return response.ok(res, {
        message: "Service group deleted successfully",
        data: group,
      });

    } catch (error) {
      return response.error(res, error);
    }
  },

};

module.exports = serviceGroupController;
