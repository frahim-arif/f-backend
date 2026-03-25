// const Category = require("../../models/category.model");

// // ✅ Create a new category
// exports.create = async (req, res) => {
//   try {
//     const { name, description } = req.body;
//     const category = new Category({ name, description });
//     await category.save();
//     res.status(201).json({ success: true, message: "Category created", data: category });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ View all categories
// exports.view = async (req, res) => {
//   try {
//     const categories = await Category.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: categories });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Get single category details
// exports.details = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);
//     if (!category) return res.status(404).json({ success: false, message: "Category not found" });
//     res.status(200).json({ success: true, data: category });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Update category
// exports.update = async (req, res) => {
//   try {
//     const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json({ success: true, message: "Category updated", data: category });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Change category status
// exports.changeStatus = async (req, res) => {
//   try {
//     const { id, status } = req.body;
//     const category = await Category.findByIdAndUpdate(id, { status }, { new: true });
//     res.status(200).json({ success: true, message: "Status updated", data: category });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ✅ Delete category
// exports.destroy = async (req, res) => {
//   try {
//     const { id } = req.body;
//     await Category.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: "Category deleted" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
