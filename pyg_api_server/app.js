//导入express模块
const express=require('express')
//创建express服务器实例
const app=express()
//导入解决跨域问题的中间件
const cors=require('cors')
//导入表单验证中间件
const joi = require('@hapi/joi')

//3.开放目录
app.use(express.static(__dirname + '/public'))

//注册为中间件
app.use(cors())
//解析表单数据中间件
app.use(express.urlencoded({ extended: false }))

// app.use(bodyParser.urlencoded({ extended: true }))
// //即可将接受10M大小的body参数
// app.use(bodyParser.json({"limit":"100000kb"}));

//优化res.send()代码在处理函数中，需要多次调用 res.send() 向客户端响应 处理失败 的结果，为了简化代码，可以手动封装一个 res.cc() 函数
app.use((req,res,next)=>{
    //status为0则成功为1则失败 默认设置为1 方便处理失败的结果
    res.cc=function(err,status=1){
        res.send({
            //状态
            status,
            //状态描述 判断err是错误对象还剩字符串
            message:err instanceof Error ? err.message : err,
        })
    }
    next()
})

//解析token的中间件
const expressJWT=require('express-jwt')
//导入解析token的配置文件
const config=require('./config')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({secret:config.jwtSecreKey}).unless({path:[/^\/api/,/^\/goods/,/^\/search/]}))



//导入并注册用户路由模块
const userrouter=require('./router/user')
app.use('/api',userrouter)
//导入并注册购物车路由模块 需要token验证
const shopcart=require('./router/shopcart')
app.use('/shop',shopcart)
//导入并注册商品分类路由模块
const goods=require('./router/goods')
app.use('/goods',goods)
//导入并注册搜索路由模块
const search=require('./router/search')
app.use('/search',search)
//导入并注册搜索路由模块
const usercenter=require('./router/usercenter')
app.use('/usercenter',usercenter)

//错误中间件
app.use(function(err,req,res,next){
    //数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 未知错误
    res.cc(err)
})



//调用app.listen方法启动web服务器
app.listen(3007,()=>{
    console.log('api server running at http://127.0.0.1:3007');
})