const express=require('express');
const router=express.Router();

const user=require('../controller/user');

router.post('/add-user',user.addUser);
router.post('/login',user.Login);
router.post('/user-details',user.verifyjwtToken,user.userProfile)

module.exports=router