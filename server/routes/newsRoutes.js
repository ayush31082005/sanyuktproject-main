const express = require('express');
const router = express.Router();
const { getAllNews, addNews, deleteNews, updateNews } = require('../controllers/newsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getAllNews);
router.post('/add', protect, adminOnly, upload.single('image'), addNews);
router.put('/:id', protect, adminOnly, upload.single('image'), updateNews);
router.delete('/:id', protect, adminOnly, deleteNews);


module.exports = router;
