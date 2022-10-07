//商品分类处理接口函数
const fs=require('fs')
const path=require('path')
//导入数据库操作模块 
const db=require('../mysql/index')
//获取商品分类信息接口
exports.getgoods=(req,res)=>{
    const body = req.query
    const getsql='SELECT * FROM pyg.categories where goodsname=?'
    db.query(getsql,[body.goodsname],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //等于0说明没有数据或获取失败
        if (results.length === 0) return res.cc('获取商品信息失败，请稍后重试')
        // console.log(results);
        res.send({
            status:0,
            goods:results,
            message:'获取商品信息成功！'
        })
    })
}
//获取单个商品信息接口
exports.getonegoods=(req,res)=>{
    const body = req.query
    const getsql='SELECT * FROM pyg.categories where goodstille=? and shopname=?'
    db.query(getsql,[body.goodstille,body.shopname],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //等于0说明没有数据或获取失败
        if (results.length === 0) return res.cc('获取商品信息失败，请稍后重试')
        // console.log(results);
        res.send({
            status:0,
            goods:results,
            message:'获取商品信息成功！'
        })
    })
}
//上架商品信息分类接口
exports.postgoods=(req,res)=>{
    // const rs=fs.readFileSync(req.file.path)
    // const base64=rs.toString('base64')
    // const dir=path.join(__dirname,'../',req.file.path)
    // const base64=fs.readFileSync(dir,'base64')
    // console.log(base64);
    console.log(req.files);
    // const goodsimg='../../api_server/'+req.file.path.replace(/\\/g,'/')
    // const goodsimg='data:'+req.file.mimetype+';base64,'+base64
    // console.log(goodsimg);
    let goodsImgs=[]
    for(let i=0;i<req.files.length;i++){
        let rs=fs.readFileSync(req.files[i].path)
        let base64=rs.toString('base64')
        let goodsimg='data:'+req.files[i].mimetype+';base64,'+base64
        goodsImgs.push(goodsimg)
    }
    goodsimgs=goodsImgs.join("@")
    const body=JSON.parse(req.body.goods)
    console.log(body);
    // console.log(body);
    // console.log(goodsimgs);
    // console.log(goodsimgs===goodsimgs.toString());
    const postsql='insert into pyg.categories(goodsname,goodspricenow,goodsimg,Payment,goodspriceold,goodstille,shopname,goodsnr) value(?,?,?,?,?,?,?,?)'
    
    // res.cc('ok',0)
    db.query(postsql,[body.goodsname,body.goodspricenow,goodsimgs,body.Payment,body.goodspriceold,body.goodstille,body.shopname,body.goodsnr],(err,results)=>{
         //数据库使用失败则打印错误消息
         if(err) return res.send({status:1,message:err.message})
         //没有添加成功
         if(results.affectedRows!==1){
            return res.cc('上架失败，请重试')
        }
        res.cc('上架成功！',0)
    })
}
