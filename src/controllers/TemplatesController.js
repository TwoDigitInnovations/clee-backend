const Template = require('../models/TemplateLibrary');

const response = require('../responses');

const templateController = {
  createTemplate: async (req, res) => {
    try {
      const payload = req.body;

      if (!payload.name || !payload.templateType) {
        return response.badReq(res, {
          message: 'Name and template type are required',
        });
      }

      const template = await Template.create({
        user: req.user?.id,
        templateType: payload.templateType,
        name: payload.name,
        items: payload.items || [],
      });

      return response.ok(res, {
        message: 'Template created successfully',
        data: template,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllTemplates: async (req, res) => {
    try {
      const templates = await Template.find({ isDeleted: false })
        .populate('user')
        .sort({ createdAt: -1 });

      return response.ok(res, {
        message: 'Templates fetched successfully',
        data: templates,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getTemplateById: async (req, res) => {
    try {
      const { id } = req.params;

      const template = await Template.findOne({
        _id: id,
        isDeleted: false,
      }).populate('user', 'fullname email');

      if (!template) {
        return response.badReq(res, { message: 'Template not found' });
      }

      return response.ok(res, {
        message: 'Template fetched successfully',
        data: template,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateTemplate: async (req, res) => {
    try {
      const { id } = req.params;

      const updated = await Template.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updated) {
        return response.badReq(res, { message: 'Template not found' });
      }

      return response.ok(res, {
        message: 'Template updated successfully',
        data: updated,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deleteTemplate: async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await Template.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );

      if (!deleted) {
        return response.badReq(res, { message: 'Template not found' });
      }

      return response.ok(res, {
        message: 'Template deleted successfully',
        data: deleted,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  restoreTemplate: async (req, res) => {
    const { id } = req.params;

    const restored = await Template.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );

    return response.ok(res, {
      message: 'Template restored successfully',
      data: restored,
    });
  },
};

module.exports = templateController;
