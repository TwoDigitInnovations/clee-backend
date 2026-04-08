const NotificationTemplate = require('../models/NotificationTemplate');
const NotificationSettings = require('../models/NotificationSettings');

class NotificationService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const nodemailer = require('nodemailer');
        this.transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        console.log('Nodemailer transporter initialized successfully');
      } else {
        console.log('SMTP credentials not found - email sending will be simulated');
      }
    } catch (error) {
      console.log('Nodemailer not available - email sending will be simulated');
    }
  }

  async sendEmail(to, subject, html, settings = {}) {
    try {
      if (!this.transporter) {
        console.log(`[SIMULATED] Email to ${to}: ${subject}`);
        return { success: true, messageId: `simulated-${Date.now()}`, simulated: true };
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html
      };

      if (settings.bccEmail) {
        mailOptions.bcc = settings.bccEmail;
      }

      if (settings.replyEmail) {
        mailOptions.replyTo = settings.replyEmail;
      }

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendSMS(to, message) {
    try {
      console.log(`[SIMULATED] SMS to ${to}: ${message}`);
      return { success: true, messageId: `sms-${Date.now()}`, simulated: true };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  replacePlaceholders(template, data) {
    let message = template;
    const placeholders = {
      'BUSINESS_NAME': data.businessName || 'Your Business',
      'FIRST_NAME': data.firstName || '',
      'LAST_NAME': data.lastName || '',
      'LOCATION_NAME': data.locationName || '',
      'LOCATION_TELEPHONE': data.locationTelephone || '',
      'STAFF_NAME_FIRST': data.staffFirstName || '',
      'STAFF_NAME_LAST': data.staffLastName || '',
      'BOOKING_DATE_TIME': data.bookingDateTime || '',
      'BOOKING_DATE': data.bookingDate || '',
      'BOOKING_TIME': data.bookingTime || '',
      'BOOKING_ADDRESS': data.bookingAddress || ''
    };

    Object.keys(placeholders).forEach(key => {
      message = message.replace(new RegExp(key, 'g'), placeholders[key]);
    });

    return message;
  }

  async processNotification(templateId, recipientData) {
    try {
      const template = await NotificationTemplate.findById(templateId);
      if (!template || template.status !== 'ACTIVE') {
        return { success: false, error: 'Template not found or inactive' };
      }

      const message = this.replacePlaceholders(template.messageText, recipientData);

      if (template.channel === 'Email') {
        const settings = await NotificationSettings.findOne({ userId: template.createdBy });
        return await this.sendEmail(
          recipientData.email,
          `Appointment ${template.type}`,
          message,
          settings?.emailSettings || {}
        );
      } else {
        return await this.sendSMS(recipientData.phone, message);
      }
    } catch (error) {
      console.error('Notification processing failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NotificationService();
