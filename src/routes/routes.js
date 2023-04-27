const express=require('express')
const router=express.Router()
const {api}=require('../controllers/apiController')
// console.log(api)
router.get('/api',api)


module.exports=router