const express = require('express');
const router = express.Router();
const model = require('../models');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const post = await model.Post.findByPk(1)
  res.send(post);
});

module.exports = router;
