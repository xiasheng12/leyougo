//搜索模块
const express=require('express')
//创建路由对象
const router=express.Router()
//搜索处理模块
const searchHandler=require('../router_handler/search')

router.get('/getsearchgoodstille',searchHandler.getsearchgoodstille)

module.exports=router