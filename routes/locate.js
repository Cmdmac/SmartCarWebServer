const express = require('express');
const router = express.Router();


router.get('/get', function(req, res, next) {
    res.send({code: 200, msg: 'success', location: globalLocation});
});

module.exports = router;
