//商品分类模块
const express=require('express')
//创建路由对象
const router=express.Router()
//购物车路由处理模块
const goodsHandler=require('../router_handler/goods')

const multer=require('multer')

// 设置保存路径和文件名
const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        // 设置文件存储路径
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb) {
        // 设置文件名
        // Math.round(Math.random() *1E9)是生成一个整数部分9位数的随机数，再取整
        // let fileData = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, file.fieldname + "-" + file.originalname)
    },
})

const upload = multer({
    storage: storage
})

//获取商品分类接口
router.get('/getgoods',goodsHandler.getgoods)
//获取单个商品信息接口
router.get('/getonegoods',goodsHandler.getonegoods)
//上架商品接口
router.post('/postgoods',upload.array('girlclothing'),goodsHandler.postgoods)



module.exports=router