const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "./uploads/");
  },
  filename: function (req, file, cd) {
    cd(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cd) => {
  //reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cd(null, true);
  } else {
    cd(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

//GET ALL THE PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.json({ message: err });
  }
});

//SUBMIT PRODUCT INFORMATION
router.post("/", upload.array("productImages", 5), async (req, res) => {
  const productImages = [];
  for (let i = 0; i < req.files.length; i++) {
    productImages.push(req.files[i].path);
  }

  const product = new Product({
    sku: req.body.sku,
    quantity: req.body.quantity,
    name: req.body.name,
    image: productImages,
    description: req.body.description,
  });

  try {
    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (err) {
    res.json({ message: err });
  }
});

//SPECIFIC PRODUCT
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.json(product);
  } catch (err) {
    res.json({ message: err });
  }
});

//DELETE SPECIFIC PRODUCT
router.delete("/:productId", async (req, res) => {
  try {
    const removeProduct = await Product.remove({ _id: req.params.productId });
    res.json(removeProduct);
  } catch (err) {
    res.json({ message: err });
  }
});

//UPDATE A PRODUCT DETAILS
router.patch(
  "/:productId",
  upload.array("productImages", 5),
  async (req, res) => {
    const productImages = [];
    for (let i = 0; i < req.files.length; i++) {
      productImages.push(req.files[i].path);
    }

    try {
      const updateProduct = await Product.updateOne(
        { _id: req.params.productId },
        {
          $set: {
            sku: req.body.sku,
            quantity: req.body.quantity,
            productName: req.body.productName,
            productImages: productImages,
            productDescription: req.body.productDescription,
          },
        }
      );
      res.json(updateProduct);
    } catch (err) {
      res.json({ message: err });
    }
  }
);

module.exports = router;
