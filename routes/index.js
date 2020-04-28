const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');

console.log("Router loaded");

router.get('/api/movies/:id',movieController.getOMDb);
router.get('/api/movies', movieController.getFromJson);


module.exports = router;