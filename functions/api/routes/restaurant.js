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

    const productsByCategory = {};

    for (const category of categoryIds) {
      const { menuId, id } = category;

      const categorySnapshot = await db
        .collection("categories")
        .where("restaurantId", "==", restaurantId)
        .where("menuId", "==", menuId)
        .where("status", "==", true)
        .orderBy('position', 'asc')
        .get();

      let categoryName = "Categoría Desconocida"; 
      if (!categorySnapshot.empty) {
        categoryName = categorySnapshot.docs[0].data().name;
      }

      const querySnapshot = await db
        .collection("products")
        .where("restaurantId", "==", restaurantId)
        .where("menuId", "==", menuId)
        .where("categoryId", "==", id)
        .where("status", "==", true)
        .orderBy('position', 'asc')
        .get();

      const categoryProducts = [];
      querySnapshot.forEach((doc) => {
        categoryProducts.push(doc.data());
      });

      console.log(categoryProducts)

      productsByCategory[id] = { categoryName, categoryProducts };
    }

    const orderedProducts = [];
    for (const categoryId in productsByCategory) {
      orderedProducts.push({
        categoryId,
        categoryName: productsByCategory[categoryId].categoryName,
        products: productsByCategory[categoryId].categoryProducts,
      });
    }

    res.status(200).json(orderedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


};
