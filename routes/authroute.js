const express = require('express');
const router = express.Router();
const User = require('../models/User')
const auth = require('./routehandler')



router.post('/signup', auth.signup_post);

router.post('/login', auth.login_post);

router.post('/skip', auth.skip_code);

router.post('/admin/add', auth.poster_add);

router.post('/ad/:user/:poster', auth.add_data);

router.get('/info/:username/:id/:admin', auth.info_get);

router.post('/change/password/', auth.change_password);

router.post('/delete/poster/', auth.delete_poster);

module.exports = router;
