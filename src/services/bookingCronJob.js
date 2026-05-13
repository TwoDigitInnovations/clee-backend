const { CronJob } = require('cron');
const Booking = require('@models/Booking');

const formatHistoryDate = () => {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const parseBookingDateTime = (booking) => {
  if (!booking.date) return null;
  const bookingDate = new Date(booking.date);

  if (booking.time) {
    const match = booking.time.toString().match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
    if (match) {
      let hour = parseInt(match[1]);
      const min = parseInt(match[2]);
      const period = match[3]?.toLowerCase();
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
      bookingDate.setHours(hour, min, 0, 0);
    }
  } else if (booking.startHour !== undefined && booking.startHour !== null) {
    bookingDate.setHours(booking.startHour, 0, 0, 0);
  } else {
    bookingDate.setHours(23, 59, 59, 999);
  }

  return bookingDate;
};

const runAutoComplete = async () => {
  try {
    const now = new Date();

    const pastBookings = await Booking.find({
      status: { $in: ['Confirmed', 'Pending', 'pending', 'confirmed'] },
    });

    const toComplete = pastBookings.filter((booking) => {
      const bookingDateTime = parseBookingDateTime(booking);
      return bookingDateTime && bookingDateTime < now;
    });

    for (const booking of toComplete) {
      await Booking.findByIdAndUpdate(booking._id, {
        status: 'Completed',
        $push: {
          history: {
            type: 'amended',
            date: formatHistoryDate(),
            message: 'Appointment completed — automatically marked as Completed after appointment time passed',
            changedBy: 'System',
          },
        },
      });
    }

    if (toComplete.length > 0) {
      console.log(`[Cron] Auto-completed ${toComplete.length} bookings`);
    }
  } catch (err) {
    console.error('[Cron] Error:', err);
  }
};

const startBookingCronJob = () => {
  runAutoComplete();
  // Run every hour
  const job = new CronJob('0 * * * *', runAutoComplete, null, true);
  job.start();
};

module.exports = { startBookingCronJob };
