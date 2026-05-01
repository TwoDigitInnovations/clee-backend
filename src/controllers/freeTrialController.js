const FreeTrialSetup = require('../models/FreeTrialSetup');
const response = require('../responses');

module.exports = {
  getSetup: async (req, res) => {
    try {
      let setup = await FreeTrialSetup.findOne({ user: req.user.id });
      if (!setup) {
        setup = await FreeTrialSetup.create({ user: req.user.id });
      }
      return response.ok(res, { data: setup });
    } catch (err) {
      return response.error(res, err);
    }
  },

  saveProfile: async (req, res) => {
    try {
      const { providerType, businessName, displayName, bio, website, instagram } = req.body;

      const updateData = {
        providerType,
        businessName,
        displayName,
        bio,
        website,
        instagram,
        completedSteps: 1,
      };

      if (req.file && req.file.path) {
        updateData.logo = req.file.path;
      }

      const setup = await FreeTrialSetup.findOneAndUpdate(
        { user: req.user.id },
        { $set: updateData },
        { new: true, upsert: true }
      );

      return response.ok(res, { message: 'Profile saved successfully', data: setup });
    } catch (err) {
      return response.error(res, err);
    }
  },

  saveBranding: async (req, res) => {
    try {
      const { primaryColor, accentColor, streetAddress, suburb, state, postcode, businessPhone, bookingEmail } = req.body;

      const setup = await FreeTrialSetup.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: {
            primaryColor,
            accentColor,
            streetAddress,
            suburb,
            state,
            postcode,
            businessPhone,
            bookingEmail,
            completedSteps: 2,
          },
        },
        { new: true, upsert: true }
      );

      return response.ok(res, { message: 'Branding saved successfully', data: setup });
    } catch (err) {
      return response.error(res, err);
    }
  },

  saveServices: async (req, res) => {
    try {
      const { serviceCategories, services, depositOption, depositAmount } = req.body;

      const setup = await FreeTrialSetup.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: {
            serviceCategories,
            services,
            depositOption,
            depositAmount,
            completedSteps: 3,
          },
        },
        { new: true, upsert: true }
      );

      return response.ok(res, { message: 'Services saved successfully', data: setup });
    } catch (err) {
      return response.error(res, err);
    }
  },

  saveStaff: async (req, res) => {
    try {
      const { staff } = req.body;

      const setup = await FreeTrialSetup.findOneAndUpdate(
        { user: req.user.id },
        { $set: { staff, completedSteps: 4 } },
        { new: true, upsert: true }
      );

      return response.ok(res, { message: 'Staff saved successfully', data: setup });
    } catch (err) {
      return response.error(res, err);
    }
  },

  saveScheduling: async (req, res) => {
    try {
      const { openingHours, bookingSettings } = req.body;

      const setup = await FreeTrialSetup.findOneAndUpdate(
        { user: req.user.id },
        { $set: { openingHours, bookingSettings, completedSteps: 5 } },
        { new: true, upsert: true }
      );

      return response.ok(res, { message: 'Scheduling saved successfully', data: setup });
    } catch (err) {
      return response.error(res, err);
    }
  },

  completeSetup: async (req, res) => {
    try {
      const { selectedPlan, payoutAccountName, payoutAbn, payoutBsb, payoutAccountNumber } = req.body;

      const setup = await FreeTrialSetup.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: {
            selectedPlan,
            payoutAccountName,
            payoutAbn,
            payoutBsb,
            payoutAccountNumber,
            completedSteps: 6,
            isCompleted: true,
          },
        },
        { new: true, upsert: true }
      );

      return response.ok(res, { message: 'Setup completed successfully', data: setup });
    } catch (err) {
      return response.error(res, err);
    }
  },
};
