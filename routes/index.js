const { Router } = require('express');

const router = Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.json({
    title: 'PROFILE ME',
    documentation: "To be announced later..."
  });
});

module.exports = router;
