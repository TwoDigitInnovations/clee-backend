const Package = require('@models/Packages');
const response = require('../responses');

function parseBody(body) {
  const parsed = { ...body };
  ['specific_services', 'any_service_item'].forEach((key) => {
    if (typeof parsed[key] === 'string') {
      try {
        parsed[key] = JSON.parse(parsed[key]);
      } catch {
        parsed[key] = key === 'any_service_item' ? null : [];
      }
    }
  });

  ['price_includes_tax', 'expiry_date_reminder', 'status'].forEach((key) => {
    if (parsed[key] !== undefined)
      parsed[key] = parsed[key] === 'true' || parsed[key] === true;
  });
  return parsed;
}

module.exports = {
  createPackage: async (req, res) => {
    try {
      const userId = req.user.id;
      const body = parseBody(req.body);

      console.log(req.file);
      
      const pkg = await Package.create({
        ...body,
        user: userId,
        photo: req.file ? req.file.path : null,
      });

      return response.ok(res, {
        message: 'Package created successfully',
        data: pkg,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllPackages: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status, search } = req.query;

      const filter = { user: userId };
      if (status !== undefined) filter.status = status === 'true';
      if (search) {
        filter.$or = [
          { package_name: { $regex: search, $options: 'i' } },
          { sku_handle: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const [packages, total] = await Promise.all([
        Package.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Package.countDocuments(filter),
      ]);

      return response.ok(res, {
        message: 'Packages fetched successfully',
        data: {
          packages,
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

  getPackage: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const pkg = await Package.findOne({ _id: id, user: userId });
      if (!pkg) return response.error(res, { message: 'Package not found' });

      return response.ok(res, {
        message: 'Package fetched successfully',
        data: pkg,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  updatePackage: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const body = parseBody(req.body);

      if (req.file) body.photo = req.file ? req.file.path : null;

      const pkg = await Package.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: body },
        { new: true, runValidators: true },
      );

      if (!pkg) return response.error(res, { message: 'Package not found' });

      return response.ok(res, {
        message: 'Package updated successfully',
        data: pkg,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  deletePackage: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const pkg = await Package.findOneAndDelete({ _id: id, user: userId });
      if (!pkg) return response.error(res, { message: 'Package not found' });

      return response.ok(res, {
        message: 'Package deleted successfully',
        data: null,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const pkg = await Package.findOne({ _id: id, user: userId });
      if (!pkg) return response.error(res, { message: 'Package not found' });

      pkg.status = !pkg.status;
      await pkg.save();

      return response.ok(res, {
        message: `Package ${pkg.status ? 'activated' : 'deactivated'} successfully`,
        data: pkg,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
