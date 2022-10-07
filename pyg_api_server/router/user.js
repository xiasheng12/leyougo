//用户路由模块
const express=require('express')
//创建路由对象
const router=express.Router()
//用户路由处理模块
const userHandler=require('../router_handler/user')
//导入验证表单数据的中间件
const expressJoi=require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { register_phoneSchema , register_user,login_user} = require('../schema/user')



router.post('/register',expressJoi(register_user),userHandler.register)

router.post('/register_phone',expressJoi(register_phoneSchema),userHandler.register_phone)

router.get('/login',userHandler.login)

router.get('/getcode',userHandler.getcode)

router.get('/forget',userHandler.forget)

router.post('/revise',userHandler.revise)
//向外暴露
module.exports=router