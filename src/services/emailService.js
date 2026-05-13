const postmark = require('postmark');

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

const FROM_EMAIL = 'support@cleverclee.com.au';

const sendBookingConfirmation = async (booking) => {
  const customer = booking.customer || {};
  const customerName = customer.firstName
    ? `${customer.firstName} ${customer.lastName || ''}`.trim()
    : customer.fullname || 'Customer';
  const customerEmail = customer.email;

  if (!customerEmail) return;

  const bookingDate = booking.date
    ? new Date(booking.date).toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const bookingTime = booking.time || 'N/A';

  const staffName =
    booking.staff?.fullname || booking.staff?.name || 'Any Available Staff';

  const servicesList = (() => {
    if (booking.services && booking.services.length > 0) {
      return booking.services
        .map((s) => {
          if (typeof s === 'object') return s.name || 'Service';
          return s;
        })
        .filter(Boolean)
        .join(', ');
    }
    if (booking.service && booking.service.length > 0) {
      return booking.service
        .map((s) => {
          if (typeof s === 'object') return s.name || 'Service';
          return s;
        })
        .filter(Boolean)
        .join(', ');
    }
    return 'N/A';
  })();

  const totalAmount =
    booking.totalAmount != null ? `$${Number(booking.totalAmount).toFixed(2)}` : 'N/A';

  const depositAmount =
    booking.depositAmount && booking.depositAmount > 0
      ? `$${Number(booking.depositAmount).toFixed(2)}`
      : null;

  const status = booking.status || 'Pending';

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f9; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e0e0e0;">
        
        <div style="background-color: #0A4D91; padding: 30px 30px 20px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Booking Confirmation</h1>
          <p style="color: #c8d9f0; margin: 6px 0 0; font-size: 14px;">Thank you for booking with us!</p>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hi <strong>${customerName}</strong>,</p>
          <p style="font-size: 14px; color: #555; line-height: 1.6;">
            Your appointment has been successfully booked. Here are your booking details:
          </p>

          <div style="background-color: #f0f5ff; border-left: 4px solid #0A4D91; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 40%; color: #0A4D91;">Status</td>
                <td style="padding: 8px 0;">${status}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #0A4D91;">Date</td>
                <td style="padding: 8px 0;">${bookingDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #0A4D91;">Time</td>
                <td style="padding: 8px 0;">${bookingTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #0A4D91;">Services</td>
                <td style="padding: 8px 0;">${servicesList}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #0A4D91;">Staff</td>
                <td style="padding: 8px 0;">${staffName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #0A4D91;">Total Amount</td>
                <td style="padding: 8px 0;">${totalAmount}</td>
              </tr>
              ${
                depositAmount
                  ? `<tr>
                <td style="padding: 8px 0; font-weight: bold; color: #0A4D91;">Deposit Paid</td>
                <td style="padding: 8px 0;">${depositAmount}</td>
              </tr>`
                  : ''
              }
              ${
                booking.comments
                  ? `<tr>
                <td style="padding: 8px 0; font-weight: bold; color: #0A4D91;">Notes</td>
                <td style="padding: 8px 0;">${booking.comments}</td>
              </tr>`
                  : ''
              }
            </table>
          </div>

          <p style="font-size: 14px; color: #555; line-height: 1.6;">
            If you need to reschedule or cancel your appointment, please contact us as soon as possible.
          </p>

          <p style="font-size: 14px; color: #555; margin-top: 24px;">
            We look forward to seeing you!<br/>
            <strong style="color: #0A4D91;">The Clee Team</strong>
          </p>
        </div>

        <div style="background-color: #f4f6f9; padding: 16px 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0;">This is an automated confirmation email. Please do not reply to this message.</p>
          <p style="margin: 6px 0 0;">&copy; ${new Date().getFullYear()} Clee. All rights reserved.</p>
        </div>

      </div>
    </div>
  `;

  await client.sendEmail({
    From: FROM_EMAIL,
    To: customerEmail,
    Subject: 'Your Booking Confirmation – Clee',
    HtmlBody: html,
    MessageStream: 'outbound',
  });
};

module.exports = { sendBookingConfirmation };
