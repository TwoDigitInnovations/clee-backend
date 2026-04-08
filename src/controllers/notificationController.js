const NotificationTemplate = require('../models/NotificationTemplate');
const NotificationSettings = require('../models/NotificationSettings');
const notificationService = require('../services/notificationService');

const getTemplates = async (req, res) => {
  try {
    console.log('User ID:', req.user?.id);
    const templates = await NotificationTemplate.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });
    console.log('Templates found:', templates.length);
    res.json(templates);
  } catch (error) {
    console.error('Error in getTemplates:', error);
    res.status(500).json({ message: error.message });
  }
};

const getTemplateById = async (req, res) => {
  try {
    const template = await NotificationTemplate.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTemplate = async (req, res) => {
  try {
    const template = new NotificationTemplate({
      ...req.body,
      createdBy: req.user.id
    });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const template = await NotificationTemplate.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const template = await NotificationTemplate.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSettings = async (req, res) => {
  try {
    console.log('Getting settings for user:', req.user?.id);
    let settings = await NotificationSettings.findOne({ userId: req.user.id });
    if (!settings) {
      console.log('Creating new settings');
      settings = new NotificationSettings({ userId: req.user.id });
      await settings.save();
    }
    console.log('Settings found/created');
    res.json(settings);
  } catch (error) {
    console.error('Error in getSettings:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateStaffSettings = async (req, res) => {
  try {
    let settings = await NotificationSettings.findOne({ userId: req.user.id });
    if (!settings) {
      settings = new NotificationSettings({ userId: req.user.id });
    }
    settings.staffNotifications = { ...settings.staffNotifications, ...req.body };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEmailSettings = async (req, res) => {
  try {
    let settings = await NotificationSettings.findOne({ userId: req.user.id });
    if (!settings) {
      settings = new NotificationSettings({ userId: req.user.id });
    }
    settings.emailSettings = { ...settings.emailSettings, ...req.body };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSMSSettings = async (req, res) => {
  try {
    let settings = await NotificationSettings.findOne({ userId: req.user.id });
    if (!settings) {
      settings = new NotificationSettings({ userId: req.user.id });
    }
    settings.smsSettings = { ...settings.smsSettings, ...req.body };
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendTestNotification = async (req, res) => {
  try {
    const { templateId, recipientData } = req.body;
    const result = await notificationService.processNotification(templateId, recipientData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getSettings,
  updateStaffSettings,
  updateEmailSettings,
  updateSMSSettings,
  sendTestNotification
};
