const admin = require("firebase-admin");

module.exports.controller = (app) => {
  app.post("/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await admin.auth().createUser({
        email,
        password,
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

module.exports.controller = (app) => {
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email)
      const user = await admin.auth().getUserByEmail(email);
      res.status(200).json(user);
    } catch (error) {
        console.log(error)
      res.status(404).json({ error: error.message });
    }
  });
};
