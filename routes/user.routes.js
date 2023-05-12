const router = require('express').Router();
const userController = require('../controller/user.controller');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
        //console.log(file);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+'-'+Date.now()+'myimg'+path.extname(file.originalname));
    }
})

const maxSize = 1*1024*1024;

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
            cb(null, true)
        }else {
            cb(null, false);
            return cb(new Error('only jpg and png allowed'));
        }
    },
    limits: maxSize
})


router.get('/', userController.showIndexPage);
router.get('/user-login', userController.showUserLoginPage);
router.get('/user-register', userController.showUserRegister);
router.get('/contact',userController.userBlogAuth, userController.showContactPage);
router.get('/managepost',userController.userBlogAuth, userController.managePost)
//user-blog-page
router.get('/user-blog',userController.userBlogAuth, userController.getBlogUserPage);
router.get('/user-blog-table',userController.userBlogAuth, userController.showUserBlogtable);
router.get('/logout', userController.userLogout);

router.post('/post-user-register', upload.single('profilePicture'), userController.postUserRegister);
router.post('/post-user-login', userController.postLoginForm);
router.post('/post-blog-form', upload.single('image'), userController.postBlogForm);
router.post('/send-mail', userController.sendMail);
router.post('/comment', userController.sendComment);


router.get('/view-post/:slug', userController.viewPostPage);



//blog writing and posting 






module.exports=router;