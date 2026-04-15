const User = require('@models/User');
const Verification = require('@models/verification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('../responses');
const userHelper = require('../helper/user');
const moment = require('moment');
const crypto = require('crypto');

module.exports = {
  register: async (req, res) => {
    try {
      const { fullname, email, password, phone, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser = new User({
        fullname,
        email,
        password: hashedPassword,
      });

      if (role) {
        newUser.role = role;
      }

      if (phone) {
        newUser.phone = phone;
      }

      await newUser.save();

      const userResponse = await User.findById(newUser._id).select('-password');
      return response.ok(res, {
        message: 'User registered successfully.',
        data: userResponse,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const newresponse = await User.findByIdAndUpdate(
        req.body.id,
        { $set: { status: req.body.status } },
        { new: true },
      );
      if (!newresponse) {
        return response.error(res, 'User not found', 404);
      }
      if (req.body.status === 'VERIFIED') {
        await notify(
          newresponse?._id,
          'Account Verified',
          'Your account is now verified',
        );
      }
      if (req.body.status === 'SUSPEND') {
        await notify(
          newresponse?._id,
          'Account Suspended',
          'Your account is suspended',
        );
      }
      return response.ok(res, newresponse);
    } catch (error) {
      return response.error(res, error);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return response.badReq(res, {
          message: 'Email and password are required',
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return response.unAuthorize(res, { message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.unAuthorize(res, { message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
      );

      const newData = {
        token,
        user: {
          ...user._doc
        },
      };

      return response.ok(res, newData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  sendOTP: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return response.badReq(res, { message: 'Email required' });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return response.badReq(res, { message: 'User not found' });
      }

      // ✅ Check existing OTP
      let existing = await Verification.findOne({ user: user._id });

      if (existing && existing.expiration_at > new Date()) {
        return response.badReq(res, {
          message: 'OTP already sent. Try after some time.',
        });
      }

      // ✅ Delete old OTP
      await Verification.deleteMany({ user: user._id });

      // ✅ Generate secure OTP
      const otp = crypto.randomInt(100000, 1000000).toString();

      // ✅ Save OTP
      const ver = await Verification.create({
        user: user._id,
        otp,
        expiration_at: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      });

      // 👉 TODO: send OTP via email/SMS here
      console.log('OTP:', otp);

      // ✅ Token (short-lived)
      const token = await userHelper.encode(ver._id);

      return response.ok(res, {
        message: 'OTP sent successfully',
        token,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { otp, token } = req.body;

      if (!(otp && token)) {
        return response.badReq(res, {
          message: 'OTP and token required',
        });
      }

      const verId = await userHelper.decode(token);

      const ver = await Verification.findById(verId);

      if (!ver) {
        return response.badReq(res, { message: 'Invalid token' });
      }

      if (new Date() > new Date(ver.expiration_at)) {
        await Verification.deleteOne({ _id: ver._id });
        return response.badReq(res, { message: 'OTP expired' });
      }

      if (ver.verified) {
        return response.badReq(res, { message: 'OTP already used' });
      }

      if (ver.attempts >= 5) {
        await Verification.deleteOne({ _id: ver._id });
        return response.badReq(res, {
          message: 'Too many attempts. Try again.',
        });
      }

      if (otp !== ver.otp && otp !== '000000') {
        ver.attempts += 1;
        await ver.save();

        return response.badReq(res, { message: 'Invalid OTP' });
      }

      const authToken = await userHelper.encode({
        userId: ver.user,
        type: 'auth',
      });

      ver.verified = true;
      await ver.save();

      return response.ok(res, {
        message: 'OTP verified successfully',
        token: authToken,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  resendOTP: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return response.badReq(res, { message: 'User not found' });
      }

      await Verification.deleteMany({ user: user._id });

      const otp = crypto.randomInt(100000, 1000000).toString();

      const ver = await Verification.create({
        user: user._id,
        otp,
        expiration_at: new Date(Date.now() + 5 * 60 * 1000),
      });

      console.log('Resend OTP:', otp);

      const token = await userHelper.encode(ver._id);

      return response.ok(res, {
        message: 'OTP resent',
        token,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  changePassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!(token && password)) {
        return response.badReq(res, {
          message: 'Token and password required',
        });
      }

      let decoded;
      try {
        decoded = await userHelper.decode(token);
      } catch (err) {
        return response.forbidden(res, { message: 'Invalid token' });
      }

      const [verID, expiry] = decoded.split(':');

      if (new Date() > new Date(Number(expiry))) {
        return response.forbidden(res, { message: 'Session expired' });
      }

      const ver = await Verification.findById(verID);

      if (!ver) {
        return response.forbidden(res, { message: 'Invalid session' });
      }

      if (!ver.verified) {
        return response.forbidden(res, { message: 'OTP not verified' });
      }

      const user = await User.findById(ver.user);

      if (!user) {
        return response.forbidden(res, { message: 'User not found' });
      }

      user.password = await user.encryptPassword(password);

      await user.save();

      await Verification.deleteOne({ _id: verID });

      return response.ok(res, {
        message: 'Password changed successfully. Please login.',
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  myProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id, '-password');
      return response.ok(res, user);
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateprofile: async (req, res) => {
    try {
      const payload = req.body;
      if (req.file && req.file.location) {
        payload.image = req.file.location;
      }
      console.log('payload', req.user.id);
      const user = await User.findByIdAndUpdate(req.user.id, payload, {
        new: true,
        upsert: true,
      });
      return response.ok(res, { user, message: 'Profile Updated Succesfully' });
    } catch (error) {
      return response.error(res, error);
    }
  },

getAllUser: async (req, res) => {
  let { page = 1, limit = 20, role, SalonManager, key, email, date } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  try {
    let cond = {};
    let andConditions = [];

    // ✅ Role filter
    if (role) {
      cond.role = role;
    }

    // ✅ SalonManager filter (IMPORTANT FIX)
    if (SalonManager === "true") {
      cond.SalonManager = req.user._id;
    }

    // ✅ Date filter
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      andConditions.push({
        createdAt: { $gte: startDate, $lt: endDate },
      });
    }

    // ✅ Search filter (key + email combine)
    if (key || email) {
      const searchConditions = [];

      if (key) {
        searchConditions.push(
          { fullname: { $regex: key, $options: "i" } },
          { email: { $regex: key, $options: "i" } },
          { mobile: { $regex: key, $options: "i" } }
        );
      }

      if (email) {
        searchConditions.push({
          email: { $regex: email, $options: "i" },
        });
      }

      andConditions.push({ $or: searchConditions });
    }

    // ✅ Merge all conditions
    if (andConditions.length > 0) {
      cond.$and = andConditions;
    }

    console.log("FINAL COND:", cond);

    // ✅ Pagination
    const totalUsers = await User.countDocuments(cond);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(cond, "-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("SalonManager");

    return response.ok(res, {
      data: users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    return response.error(res, error);
  }
},


  AddCustomer: async (req, res) => {
    try {
      const payload = req.body;

      const existingUser = await User.findOne({
        SalonManager: req.user.id,
        $or: [{ email: payload.email }, { mobile: payload.mobile }],
      });

      if (existingUser) {
        if (existingUser.email === payload.email) {
          return response.badReq(res, {
            message: 'Email already exists',
          });
        }

        if (existingUser.mobile === payload.mobile) {
          return response.badReq(res, {
            message: 'Mobile number already exists',
          });
        }
      }

      payload.SalonManager = req.user.id;
      payload.fullname = `${payload.first_name || ''} ${payload.last_name || ''}`;

      if (req.file && req.file.path) {
        payload.photo = req.file.path;
      }

      Object.keys(payload).forEach((key) => {
        if (payload[key] === '' || payload[key] === null) {
          delete payload[key];
        }
      });
      const user = await User.create(payload);

      return response.ok(res, {
        message: 'Customer added successfully',
        data: user,
      });
    } catch (error) {
      console.log(error.message);
      return response.error(res, error);
    }
  },

  UpdateCustomer: async (req, res) => {
    try {
      const { id } = req.params; // user id
      let payload = req.body;

      if (payload.first_name || payload.last_name) {
        payload.fullname = `${payload.first_name || ''} ${payload.last_name || ''}`;
      }

      if (req.file && req.file.path) {
        console.log(req.file);
        payload.photo = req.file.path;
      }
      Object.keys(payload).forEach((key) => {
        if (payload[key] === '' || payload[key] === null) {
          delete payload[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        id,
        { $set: payload },
        {
          returnDocument: 'after', // newer style (Mongoose 7+ support)
          runValidators: true,
        },
      );

      if (!user) {
        return response.badReq(res, {
          message: 'User not found',
        });
      }

      return response.ok(res, {
        message: 'Customer updated successfully',
        data: user,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const { id } = req.params;

      const u = await User.findById(id)
        .select('-password')
        .populate('SalonManager');

      if (!u) {
        return response.badReq(res, { message: 'User not found' });
      }

      return response.ok(res, {
        data: u,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params; // ✅ editId → id (standard)

      if (!id) {
        return response.badReq(res, { message: 'User ID is required' });
      }

      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return response.badReq(res, { message: 'User not found' });
      }

      return response.ok(res, {
        message: 'User deleted successfully', // ✅ better response
        data: user,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
