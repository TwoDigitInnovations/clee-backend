const automationRules = require('../models/automationRules');
const Template = require('../models/TemplateLibrary');
const Service = require('../models/Services');
const response = require('../responses');

const controller = {
  createRules: async (req, res) => {
    try {
      const payload = req.body;

      if (!payload.templateId) {
        return response.badReq(res, { message: 'Template is required' });
      }

      const template = await Template.findById(payload.templateId);
      if (!template) {
        return response.badReq(res, { message: 'Invalid template' });
      }

      if (payload.selectedServices?.length) {
        const validServices = await Service.find({
          _id: { $in: payload.selectedServices },
        });

        if (validServices.length !== payload.selectedServices.length) {
          return response.badReq(res, { message: 'Invalid services' });
        }
      }

      const message = await automationRules.create({
        templateId: payload.templateId,
        user: req.user?._id,
        selectedServices: payload.selectedServices || [],
        addAllServices: payload.addAllServices,
        whenToSend: payload.whenToSend,
        viaEmail: payload.viaEmail,
        viaSMS: payload.viaSMS,
        newClientsOnly: payload.newClientsOnly,
      });

      return response.ok(res, {
        message: 'Message config created',
        data: message,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllRuless: async (req, res) => {
    try {
      const data = await automationRules
        .find()
        .populate('templateId')
        .populate('user')
        .populate('selectedServices');

      return response.ok(res, {
        message: 'Fetched successfully',
        data,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getRulesById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await automationRules
        .findById(id)
        .populate('templateId', 'name subject')
        .populate('user', 'fullname email')
        .populate('selectedServices', 'name price');

      if (!data) {
        return response.badReq(res, { message: 'Not found' });
      }

      return response.ok(res, {
        message: 'Fetched successfully',
        data,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateRules: async (req, res) => {
    try {
      const { id } = req.params;

      const updated = await automationRules.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updated) {
        return response.badReq(res, { message: 'Not found' });
      }

      return response.ok(res, {
        message: 'Updated successfully',
        data: updated,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ Delete
  deleteRules: async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await automationRules.findByIdAndDelete(id);

      if (!deleted) {
        return response.badReq(res, { message: 'Not found' });
      }

      return response.ok(res, {
        message: 'Deleted successfully',
        data: deleted,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};

module.exports = controller;
