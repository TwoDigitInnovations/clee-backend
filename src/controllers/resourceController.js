const Resource = require('@models/Resource');
const response = require('../responses');

module.exports = {

  createResource: async (req, res) => {
    try {
      const userId = req.user.id;
      const resource = await Resource.create({
        ...req.body,
        user: userId,
      });
  
      return response.ok(res, {
        message: 'Resource created successfully',
        data: resource,
      });
    } catch (error) {
       

      return response.error(res, error);
    }
  },

  
  updateResource: async (req, res) => {
    try {
      const { id } = req.params;

      const resource = await Resource.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!resource) {
        return response.badReq(res, { message: 'Resource not found' });
      }

      return response.ok(res, {
        message: 'Resource updated successfully',
        data: resource,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ GET ALL (user wise)
  getAllResources: async (req, res) => {
    try {
      const userId = req.user.id;

      const resources = await Resource.find({ user: userId }).sort({
        createdAt: -1,
      });

      return response.ok(res, {
        message: 'Resources fetched successfully',
        data: resources,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ GET BY ID
  getResourceById: async (req, res) => {
    try {
      const { id } = req.params;

      const resource = await Resource.findById(id);

      if (!resource) {
        return response.badReq(res, { message: 'Resource not found' });
      }

      return response.ok(res, {
        message: 'Resource fetched successfully',
        data: resource,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  // ✅ DELETE
  deleteResource: async (req, res) => {
    try {
      const { id } = req.params;

      const resource = await Resource.findByIdAndDelete(id);

      if (!resource) {
        return response.badReq(res, { message: 'Resource not found' });
      }

      return response.ok(res, {
        message: 'Resource deleted successfully',
        data: resource,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
