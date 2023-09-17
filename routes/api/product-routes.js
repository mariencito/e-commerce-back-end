const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products and include their associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one product by its `id` and include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag },
      ],
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    // If there are associated tagIds in the request, create ProductTag associations
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update a product by its `id`
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updatedProduct[0]) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }

    // If there are associated tagIds in the request, update ProductTag associations
    if (req.body.tagIds && req.body.tagIds.length) {
      // First, remove existing associations for this product
      await ProductTag.destroy({ where: { product_id: req.params.id } });

      // Next, create new associations based on the updated tagIds
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete one product by its `id`
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id },
    });

    if (!deletedProduct) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }

    // Also remove associated ProductTag associations
    await ProductTag.destroy({ where: { product_id: req.params.id } });

    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;