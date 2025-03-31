const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// /**
//  * @swagger
//  * tags:
//  *   - name: Create Individual Records
//  *     description: Creating Records
//  */

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Category:
//  *       type: object
//  *       properties:
//  *         id:
//  *           type: integer
//  *           description: The unique identifier for the category.
//  *         name:
//  *           type: string
//  *           description: The name of the category.
//  *         slug:
//  *           type: string
//  *           description: The slug of the category.
//  *         parentId:
//  *           type: integer
//  *           description: The ID of the parent category, if any.
//  *         isActive:
//  *           type: boolean
//  *           description: Whether the category is active or not.
//  *         level:
//  *           type: integer
//  *           description: The level of the category in the hierarchy.
//  *
//  * /category/insert/:
//  *   post:
//  *     tags:
//  *       - Create Individual Records
//  *     summary: Create a new category
//  *     description: This route allows you to create a new category by providing the necessary information like name, slug, parentId, isActive, and level.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 description: The name of the category.
//  *               slug:
//  *                 type: string
//  *                 description: The slug for the category.
//  *               parentId:
//  *                 type: integer
//  *                 description: The ID of the parent category (if applicable).
//  *               isActive:
//  *                 type: boolean
//  *                 description: Whether the category is active or not.
//  *                 default: false
//  *               level:
//  *                 type: integer
//  *                 description: The level of the category in the hierarchy.
//  *                 default: 0
//  *     responses:
//  *       201:
//  *         description: Category created successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Category'
//  *       500:
//  *         description: Error creating category.
//  */

router.post("/category/insert/", async (req, res) => {
  try {
    const { name, slug, parentId, isActive, level } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        parentId,
        isActive: isActive || false,
        level: level || 0,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating category" });
  }
});

router.post("/category/bulk-insert", async (req, res) => {
  try {
    const categories = req.body.categories; // Expecting an array of objects

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const result = await prisma.category.createMany({
      data: categories,
      skipDuplicates: true, // Avoid duplicate errors
    });

    res
      .status(201)
      .json({ message: "Categories inserted successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error inserting categories" });
  }
});

router.post("/category/upsert/:id", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id); // Extract the category ID from URL parameter
    const { name, slug, parentId, isActive, level } = req.body;

    // Validate input data
    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId }, // Match the category by ID
      data: {
        name, // New name, if provided
        slug, // New slug, if provided
        parentId, // New parentId, if provided
        isActive, // New isActive, if provided
        level, // New level, if provided
      },
    });

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating category" });
  }
});

router.post("/category/upsert", async (req, res) => {
  try {
    const { name, slug, parentId, isActive, level } = req.body;

    // Upsert operation based on unique fields (name and slug)
    const upsertedCategory = await prisma.category.upsert({
      where: {
        name: name,
      },
      update: {
        name, // This will not update since name and slug are unique
        slug, // This will not update since name and slug are unique
        parentId,
        isActive,
        level,
      },
      create: {
        name,
        slug,
        parentId,
        isActive,
        level,
      },
    });

    res.status(200).json({
      message: "Category upserted successfully",
      category: upsertedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error upserting category" });
  }
});

router.post("/category/update-many", async (req, res) => {
  try {
    const { names, parentId, isActive, level } = req.body;

    // Ensure names is an array and has values
    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: "Invalid names input" });
    }

    const updatedCategories = await prisma.category.updateMany({
      where: {
        name: { in: names }, // Update all categories where the name is in the provided list
      },
      data: {
        parentId,
        isActive,
        level,
      },
    });

    res.status(200).json({
      message: "Categories updated successfully",
      updatedCount: updatedCategories.count, // Number of records updated
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating categories" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, slug, isActive, level, products } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        isActive,
        level,
        products: {
          create: products, // Insert related products
        },
      },
      include: { products: true },
    });

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/products", async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      description,
      isDigital,
      isActive,
      price,
      stockQuantity,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        categoryId,
        name,
        slug,
        description,
        isDigital,
        isActive,
        price,
        stock: {
          create: {
            quantity: stockQuantity || 0,
            lastCheckedAt: new Date(),
          },
        },
      },
      include: { stock: true },
    });

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/users/orders", async (req, res) => {
  try {
    // Destructuring the request body to extract the necessary fields
    const { username, email, password, products } = req.body;

    // Step 1: Create a new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password, // Be sure to hash the password before storing it in production
      },
    });

    // Step 2: Create the order for the user
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderProducts: {
          create: products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
      },
      include: { orderProducts: true }, // Include the created order products in the response
    });

    // Step 3: Send back the response with user and order details
    res.json({
      user,
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    // Ensure the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Optionally, handle related records (e.g., check for products or child categories)
    // If you want to delete a category along with its associated products, for example, you can cascade delete the related products
    await prisma.category.delete({
      where: { id: categoryId },
      // Optionally, you can add `include` to return the deleted category or related records
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/categories", async (req, res) => {
  try {
    // Extract category IDs from the request body
    const { categoryIds } = req.body;

    // Ensure that categoryIds is an array and not empty
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res
        .status(400)
        .json({ error: "categoryIds must be a non-empty array" });
    }

    // Perform bulk deletion using deleteMany
    const deletedCategories = await prisma.category.deleteMany({
      where: {
        id: {
          in: categoryIds, // Delete categories with the provided IDs
        },
      },
    });

    // If no categories were deleted, return 404
    if (deletedCategories.count === 0) {
      return res.status(404).json({ error: "No categories found to delete" });
    }

    // Return the number of deleted categories
    res.status(200).json({
      message: `${deletedCategories.count} categories deleted successfully`,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
