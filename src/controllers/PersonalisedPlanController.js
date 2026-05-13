const PersonalisedPlan = require('@models/PersonalisedPlan');
const response = require('../responses');

function parseBody(body) {
  const parsed = { ...body };
  ['services', 'marketing_steps', 'target_clients'].forEach((key) => {
    if (typeof parsed[key] === 'string') {
      try {
        parsed[key] = JSON.parse(parsed[key]);
      } catch {
        parsed[key] = [];
      }
    }
  });
  return parsed;
}

module.exports = {
  createPlan: async (req, res) => {
    try {
      const userId = req.user.id;
      const body = parseBody(req.body);

      const plan = await PersonalisedPlan.create({
        ...body,
        user: userId,
      });

      return response.ok(res, {
        message: 'Personalised plan created successfully',
        data: plan,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllPlans: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status, search } = req.query;

      const filter = { user: userId };
      if (status) filter.status = status;
      if (search) {
        filter.plan_name = { $regex: search, $options: 'i' };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const [plans, total] = await Promise.all([
        PersonalisedPlan.find(filter)
          .populate('target_clients', 'fullname email')
          .populate('services.service_id', 'name price description')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        PersonalisedPlan.countDocuments(filter),
      ]);

      return response.ok(res, {
        message: 'Personalised plans fetched successfully',
        data: {
          plans,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getPlan: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const plan = await PersonalisedPlan.findOne({
        _id: id,
        user: userId,
      })
        .populate('target_clients', 'fullname email')
        .populate('services.service_id', 'name price description');

      if (!plan)
        return response.error(res, { message: 'Personalised plan not found' });

      return response.ok(res, {
        message: 'Personalised plan fetched successfully',
        data: plan,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updatePlan: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const body = parseBody(req.body);

      const plan = await PersonalisedPlan.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: body },
        { new: true, runValidators: true },
      )
        .populate('target_clients', 'fullname email')
        .populate('services.service_id', 'name price description');

      if (!plan)
        return response.error(res, { message: 'Personalised plan not found' });

      return response.ok(res, {
        message: 'Personalised plan updated successfully',
        data: plan,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deletePlan: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const plan = await PersonalisedPlan.findOneAndDelete({
        _id: id,
        user: userId,
      });

      if (!plan)
        return response.error(res, { message: 'Personalised plan not found' });

      return response.ok(res, {
        message: 'Personalised plan deleted successfully',
        data: null,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { status } = req.body;

      if (!['draft', 'active', 'inactive'].includes(status)) {
        return response.error(res, { message: 'Invalid status value' });
      }

      const plan = await PersonalisedPlan.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: { status } },
        { new: true },
      )
        .populate('target_clients', 'fullname email')
        .populate('services.service_id', 'name price description');

      if (!plan)
        return response.error(res, { message: 'Personalised plan not found' });

      return response.ok(res, {
        message: `Personalised plan status updated to ${status}`,
        data: plan,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
