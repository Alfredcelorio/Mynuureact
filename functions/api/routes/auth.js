const admin = require("firebase-admin");

module.exports.controller = (app) => {
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await admin.auth().getUserByEmail(email);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

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

  app.post("/findUserByEmailAndId", async (req, res) => {
    try {
      const { email, id } = req.body;

      const usersRef = admin.firestore().collection("restaurants");
      const querySnapshot = await usersRef.where("email", "==", email).get();

      let foundUser = [];

      querySnapshot.forEach((doc) => {
        const item = doc.data();
        item.id = doc.id;
        foundUser.push(item);
      });

      const filterUser = foundUser.filter((item) => item.id === id)

      if (filterUser) {
        res.status(200).json(filterUser);
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

};
