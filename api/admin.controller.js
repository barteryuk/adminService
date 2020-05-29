const Admins = require("./admin.dao");
const { decryptPass } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

exports.create = (req, res, next) => {
  const { email, password } = req.body;
  const newAdmin = {
    email,
    password,
  };

  Admins.create(newAdmin, (err, admin) => {
    if (err) {
      // return res.json({ error: err });
      return next(err);
    } else {
      return res.status(201).json(admin);

      // return res.status(201).json({
      //   admin,
      //   message: "Admin created successfully",
      // });
    }
  });
};

exports.findAll = (req, res, next) => {
  Admins.get({}, (err, admins) => {
    if (err) {
      return next(err);
    } else {
      return res.status(200).json(admins);

      // return res.status(200).json({
      //   admins,
      // });
    }
  });
};

exports.findOne = (req, res, next) => {
  console.log("ke findOne");
  Admins.getByName({ email: req.params.email }, (err, admin) => {
    if (err) {
      return next(err);
    } else {
      return res.status(200).json(admin);

      // if (admin.length === 0) {
      //   return res.status(404).json({
      //     admin,
      //     message: "Admin not found",
      //   });
      // } else {
      //   return res.status(200).json({
      //     admin,
      //     message: "Admin found",
      //   });
      // }
    }
  });
};

exports.put = (req, res, next) => {
  const { email, password } = req.body;
  const updateAdmin = {
    email,
    password,
  };

  Admins.update({ _id: req.params.id }, updateAdmin, (err, admin) => {
    // Admins.updateOne({ _id: req.params.id }, updateAdmin, (err, admin) => {
    if (err) {
      return next(err);
    } else {
      return res.status(200).json(admin);
      // if (admin === null) {
      //   return res.status(404).json({
      //     admin,
      //     message: "Admin not found",
      //   });
      // } else {
      //   return res.status(200).json({
      //     admin,
      //     message: "Admin updated successfully",
      //   });
      // }
    }
  });
};

exports.delete = (req, res, next) => {
  Admins.delete({ _id: req.params.id }, (err, admin) => {
    // Admins.deleteOne({ _id: req.params.id }, (err, admin) => {
    if (err) {
      return next(err);
    } else {
      return res.status(200).json(admin);

      // if (admin === null) {
      //   return res.status(404).json({
      //     admin,
      //     message: "Admin not found",
      //   });
      // } else {
      //   return res.status(200).json({
      //     admin,
      //     message: "Admin deleted successfully",
      //   });
      // }
    }
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const payload = { email, password };
  Admins.getByName({ email: payload.email }, (err, [found]) => {
    if (found) {
      let compare = decryptPass(payload.password, found.password);
      if (compare) {
        let { _id, email } = found;
        let foundPayload = { _id, email };
        let token = generateToken(foundPayload);
        return res.status(200).json({
          access_token: token,
        });
      } else {
        return next({ code: 400, message: "Invalid Admin / Password" });
      }
    } else {
      return next({ code: 404, message: "Admin not found" });
    }
  });
};
