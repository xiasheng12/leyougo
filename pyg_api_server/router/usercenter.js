//用户路由模块
const express=require('express')
//创建路由对象
const router=express.Router()
//用户路由处理模块
const usercenterHandler=require('../router_handler/usercenter')

const multer=require('multer')

// 设置保存路径和文件名
const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        // 设置文件存储路径
        cb(null, './public/usercenter')
    },
    filename: function(req, file, cb) {
        // 设置文件名
        // Math.round(Math.random() *1E9)是生成一个整数部分9位数的随机数，再取整
        // let fileData = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, file.fieldname + "-" + file.originalname)
    },
})
const usercenter = multer({
    storage: storage
})
//更换头像和用户名
router.post('/setuser',usercenter.single('avatar'),usercenterHandler.setuser)
//添加收货地址
router.post('/addaddress',usercenterHandler.addaddress)
//获取收货地址
router.get('/getaddress',usercenterHandler.getaddress)
//移除地址
router.get('/deleteaddress',usercenterHandler.deleteaddress)
//修改地址
router.post('/reviseaddress',usercenterHandler.reviseaddress)
//设置默认地址
router.get('/setdefaultaddress',usercenterHandler.setdefaultaddress)
//提交订单
router.post('/postorder',usercenter.single('goods','address'),usercenterHandler.postorder)
//获取订单
router.get('/getorder',usercenterHandler.getorder)
//付款成功
router.get('/paysuccess',usercenterHandler.paysuccess)
module.exports=router