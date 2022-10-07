//导入数据库操作模块
const db=require('../mysql/index')
const fs=require('fs')
const path=require('path')
//获取购物车内容接口
exports.cart=(req,res)=>{
    const body=req.query
    const getsql='SELECT * FROM pyg.shopcart where id=? group by addtime'
    db.query(getsql,[body.id],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //等于0说明没有数据或获取失败
        if (results.length === 0) return res.cc('获取购物车信息失败，请稍后重试')
        // console.log(results);
        res.send({
            status:0,
            goods:results,
            message:'获取购物车信息成功！'
        })
    })
}
//添加商品到购物车接口
exports.postcart=(req,res)=>{
    //通过multer中间件获取到图片路径然后用fs给转换成base64 再存入数据库
    const rs=fs.readFileSync(req.file.path)
    const base64=rs.toString('base64')
    const goodsimg='data:'+req.file.mimetype+';base64,'+base64
    const body=JSON.parse(req.body.goods)
    const selectsql='SELECT * FROM pyg.shopcart where id=? and shopname=? and goodstille=? and goodspriceold=? and goodspricenow=? and goodsimg=? and goodsnr=?'
    db.query(selectsql,[body.id,body.shopname,body.goodstille,body.goodspriceold,body.goodspricenow,goodsimg,(body.checkboxGroup1+'@'+body.color)],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //找到则更新购买数量
        if (results.length !== 0){
            let sum=parseInt(body.goodssum)+parseInt(results[0].goodssum)
            const updatedsql='update pyg.shopcart set goodssum=? ,addtime=? where id=? and shopname=? and goodstille=? and goodspriceold=? and goodspricenow=? and goodsimg=? and goodsnr=?'
            db.query(updatedsql,[sum,body.addtime,body.id,body.shopname,body.goodstille,body.goodspriceold,body.goodspricenow,goodsimg,(body.checkboxGroup1+'@'+body.color),body.addtime],(err,results)=>{
                //数据库使用失败则打印错误消息
                if(err) return res.send({status:1,message:err.message})
                //没有更新成功
                if(results.affectedRows!==1){
                    return res.cc('更新失败，请重试')
                }
                res.cc('添加到购物车成功！',0)
            })
        }else{
            const postsql='insert into pyg.shopcart(id,shopname,goodstille,goodspriceold,goodspricenow,goodssum,goodsimg,goodsnr,addtime) value(?,?,?,?,?,?,?,?,?)'
            db.query(postsql,[body.id,body.shopname,body.goodstille,body.goodspriceold,body.goodspricenow,body.goodssum,goodsimg,(body.checkboxGroup1+'@'+body.color),body.addtime],(err,results)=>{
                //数据库使用失败则打印错误消息
                if(err) return res.send({status:1,message:err.message})
                //没有添加成功
                if(results.affectedRows!==1){
                return res.cc('加入购物车失败！请重试')
            }
            res.cc('添加到购物车成功！',0)
            })
        }
    })
    
}
//修改购物车数量接口
exports.reviseshopcart=(req,res)=>{
    const body=JSON.parse(req.query.goods)
    const selectsql='SELECT * FROM pyg.shopcart where id=? and shopname=? and goodstille=? and goodspriceold=? and goodspricenow=? and goodsnr=?'
    db.query(selectsql,[body.id,body.shopname,body.goodstille,body.goodspriceold,body.goodspricenow,body.goodsnr],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //没找到这条商品
        if(results.length === 0){
            return res.cc('修改失败！未找到商品信息')
        }
        const updatedsql='update pyg.shopcart set goodssum=? where id=? and shopname=? and goodstille=? and goodspriceold=? and goodspricenow=? and goodsnr=?'
        db.query(updatedsql,[body.goodssum,body.id,body.shopname,body.goodstille,body.goodspriceold,body.goodspricenow,body.goodsnr],(err,results)=>{
             //数据库使用失败则打印错误消息
            if(err) return res.send({status:1,message:err.message})
            if(results.affectedRows!==1)
            return res.cc('修改失败！更新失败')
            res.cc('修改数量成功',0)
        })
    })
}
//购物车删除商品接口
exports.deletegoods=(req,res)=>{
    let x=0
    for(let i=0;i<req.query.goods.length;i++){
        // console.log(JSON.parse(req.query.goods[i]));
        const body = JSON.parse(req.query.goods[i])
        if(body.goodsnr.indexOf('@')==-1){
            body.goodsnr=body.goodsnr.join('@')
        }
        const deletesql='delete from pyg.shopcart where id=? and shopname=? and goodstille=? and goodspriceold=? and goodspricenow=? and goodssum=? and goodsnr=?'
        db.query(deletesql,[body.id,body.shopname,body.goodstille,body.goodspriceold,body.goodspricenow,body.goodssum,body.goodsnr],(err,results)=>{
            //数据库使用失败则打印错误消息
            if(err){
                res.send({status:1,message:err.message})
            }else if(results.affectedRows!==1){
                res.cc('删除失败！删除失败')
            }else{
                x+=1
                if(x===req.query.goods.length){
                    res.cc('删除成功！',0)
                }
            }
        })
    }
}