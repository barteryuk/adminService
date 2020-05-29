const mongoose = require("mongoose");

const assert = require("assert");
const Admin = require("../api/admin.dao");

const dummyAdmin = {
  email: "dummyAdmin@mail.com",
  password: 1,
};

describe("Checking documents", () => {
  before((done) => {
    mongoose.connect("mongodb://localhost/adminServiceTestDB", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error"));
    db.once("open", () => {
      console.log("We are connected to adminServiceTestDB!");
      done();
    });
  });

  it("creates a admin", (done) => {
    const newAdmin = new Admin(dummyAdmin);
    newAdmin.save().then(() => {
      assert(!newAdmin.isNew);
      done();
    });
  });

  it("Validation Error : email must be unique", (done) => {
    const newAdmin = new Admin(dummyAdmin);
    newAdmin.save((err) => {
      if (err.code === 11000) {
        return done();
      }
    });
  });

  it("Validation Error : email must be filled", (done) => {
    const newAdmin = new Admin({
      password: 1,
    });
    newAdmin.save((err) => {
      if (err.errors.email.properties.message === "Email is required") {
        return done();
      }
    });
  });

  it("Validation Error : email format must be valid", (done) => {
    const newAdmin = new Admin({
      email: "dummyAdmin",
      password: 1,
    });
    newAdmin.save((err) => {
      if (
        err.errors.email.properties.message ===
        "dummyAdmin is not a valid email"
      ) {
        return done();
      }
    });
  });

  it("Validation Error : password must be filled", (done) => {
    const newAdmin = new Admin({
      email: "dummyAdmin@mail.com",
    });
    newAdmin.save((err) => {
      if (err.errors.password.properties.message === "Password is required") {
        return done();
      }
    });
  });

  it("finds all admin", (done) => {
    Admin.find().then(() => {
      done();
    });
  });

  it("finds admin with the email of dummyAdmin@mail.com", (done) => {
    Admin.findOne(dummyAdmin).then((admin) => {
      assert(dummyAdmin.email === "dummyAdmin@mail.com");
      done();
    });
  });

  function assertHelper(statement, done) {
    statement
      .then(() => Admin.find({}))
      .then((admins) => {
        assert(admins.length === 1);
        assert(admins[0].email === "dummyAdmin2@mail.com");
        done();
      });
  }

  // validation error : admin must be unique
  // it("sets and saves admin using an instance", (done) => {
  //   console.log(done);
  //   dummyAdmin.set("email", "dummyAdmin2@mail.com");
  //   assertHelper(dummyAdmin.save(), done);
  // });

  // it("update admins using instance", (done) => {
  //   assertHelper(dummyAdmin.update({ email: "dummyAdmin2@mail.com" }), done);
  // });

  // it("update all matching admins using model", (done) => {
  //   assertHelper(
  //     Admin.update(
  //       { email: "dummyAdmin@mail.com" },
  //       { email: "dummyAdmin2@mail.com" }
  //     ),
  //     done
  //   );
  // });

  it("update one admin using model", (done) => {
    assertHelper(
      Admin.findOneAndUpdate(
        { email: "dummyAdmin@mail.com" },
        { email: "dummyAdmin2@mail.com" }
      ),
      done
    );
  });

  it("update one admin with id using model", (done) => {
    assertHelper(
      Admin.findByIdAndUpdate(dummyAdmin._id, {
        email: "dummyAdmin2@mail.com",
      }),
      done
    );
  });

  // it("removes a admin using its instance", (done) => {
  //   dummyAdmin
  //     .remove()
  //     .then(() => Admin.findOne({ email: "dummyAdmin@mail.com" }))
  //     .then((admin) => {
  //       assert(admin === null);
  //       done();
  //     });
  // });

  it("removes multiple admins", (done) => {
    Admin.deleteMany()
      .then(() => Admin.findOne({ email: "dummyAdmin@mail.com" }))
      .then((admin) => {
        assert(admin === null);
        done();
      });
  });

  it("removes a admin", (done) => {
    Admin.findOneAndDelete({ email: "dummyAdmin@mail.com" })
      .then(() => Admin.findOne({ email: "dummyAdmin@mail.com" }))
      .then((admin) => {
        assert(admin === null);
        done();
      });
  });

  it("removes a admin using id", (done) => {
    Admin.findByIdAndDelete(dummyAdmin._id)
      .then(() => Admin.findOne({ email: "dummyAdmin@mail.com" }))
      .then((admin) => {
        assert(admin === null);
        done();
      });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });
});
