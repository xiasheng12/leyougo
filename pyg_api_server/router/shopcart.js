//购物车模块
const express=require('express')
//创建路由对象
const router=express.Router()

const multer=require('multer')
//购物车路由处理模块
const shopcartHandler=require('../router_handler/shopcart')
// 设置保存路径和文件名
const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        // 设置文件存储路径
        cb(null, './public/shopcart')
    },
    filename: function(req, file, cb) {
        // 设置文件名
        // Math.round(Math.random() *1E9)是生成一个整数部分9位数的随机数，再取整
        // let fileData = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, file.fieldname + "-" + file.originalname)
    },
})
const shopcart = multer({
    storage: storage
})
//获取购物车商品内容
router.get('/cart',shopcartHandler.cart)
//添加到购物车内容
router.post('/postcart',shopcart.single('goodsimg'),shopcartHandler.postcart)
//修改购物车商品数量
router.post('/reviseshopcart',shopcartHandler.reviseshopcart)
//购物车删除商品接口
router.get('/deletegoods',shopcartHandler.deletegoods)


module.exports=router