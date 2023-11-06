const admin = require("firebase-admin");
const db = admin.firestore();

module.exports.controller = (app) => {
  app.get("/:restaurantId", async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;

      const querySnapshot = await db
        .collection("menus")
        .where("restaurantId", "==", restaurantId)
        .get();

      const data = [];
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        item.id = doc.id;
        data.push(item);
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/:restaurantId/:menuIds", async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const menuIds = req.params.menuIds.split(",");
      
      const data = [];

      for (const menuId of menuIds) {
        const querySnapshot = await db
          .collection("categories")
          .where("restaurantId", "==", restaurantId)
          .where("menuId", "==", menuId)
          .get();

        querySnapshot.forEach((doc) => {
          const categoryData = doc.data();
          categoryData.id = doc.id;
          data.push(categoryData);
        });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.post("/products/:restaurantId", async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const { categoryIds } = req.body;

    const data = [];

    for (const category of categoryIds) {
      const { menuId, id } = category;
      const querySnapshot = await db
        .collection("products")
        .where("restaurantId", "==", restaurantId)
        .where("menuId", "==", menuId)
        .where("categoryId", "==", id)
        .get();

      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

};
