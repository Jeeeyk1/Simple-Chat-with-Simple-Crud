const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ msg: "Incorrect email ", status: false, user });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(password + " plain text and " + user.password);
    if (!isPasswordValid)
      return res.json({
        msg: "Incorrect email or Password",
        status: false,
      });

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};
module.exports.findAllUser = async (req, res, next) => {
  try {
    const users = await User.find().select([
      "email",
      "username",
      "password",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
module.exports.deletUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const users = await User.deleteOne({ _id: userId });
    return res.json({
      message: `User with id ${userId} is successfully deleted ${users}`,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
module.exports.editUser = async (req, res, next) => {
  const { email, username, password } = req.body;
  const bcryptedPass = await bcrypt.hash(password, 10);
  try {
    if (!username) {
      const validate = await User.findById({ _id: req.params.id });
      const user = await User.findByIdAndUpdate(
        { _id: req.params.id },
        { email, username: validate.username, password: bcryptedPass }
      );
      return res.json({ user, status: true });
    }
    if (!password) {
      const validate = await User.findById({ _id: req.params.id });
      const user = await User.findByIdAndUpdate(
        { _id: req.params.id },
        { email, username, password: validate.password }
      );
      return res.json({ user, status: true });
    }
    if (!email) {
      const validate = await User.findById({ _id: req.params.id });
      const user = await User.findByIdAndUpdate(
        { _id: req.params.id },
        { email: validate.email, username, password: bcryptedPass }
      );
      return res.json({ user, status: true });
    }
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { email, username, password: bcryptedPass }
    );
    return res.json({ user, status: true });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
