//导入数据库操作模块
const db=require('../mysql/index')
const fs=require('fs')
exports.setuser=(req,res)=>{
    let rs=fs.readFileSync(req.file.path)
    let base64=rs.toString('base64')
    let avatar='data:'+req.file.mimetype+';base64,'+base64
    const body=JSON.parse(req.body.formLabelAlign)
    const selectsql='SELECT * FROM pyg.pyg_user where password=? and email=?'
    db.query(selectsql,[body.pass,body.email],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //等于0说明没有数据或获取失败
        if (results.length === 0) return res.cc('获取商品信息失败，请稍后重试')

        const updatesql='update pyg.pyg_user set username=?,user_pic=? where password=? and email=?'

        db.query(updatesql,[body.name,avatar,body.pass,body.email],(err,results)=>{
            //数据库使用失败则打印错误消息
            if(err) return res.send({status:1,message:err.message})

            if(results.affectedRows!==1){
                return res.cc('更新失败，请重试')
            }
            res.cc('更新成功！返回主页刷新即可',0)
        })
    })
}

exports.addaddress=(req,res)=>{
    // console.log(req.query);
    const body=req.query
    if(body.moren==='true'){
        console.log('有设默认地址');
        const selectallsql='SELECT * FROM pyg.address where id=?'
        db.query(selectallsql,[body.id],(err,results)=>{
            //数据库使用失败则打印错误消息
            if(err) return res.send({status:1,message:err.message})
            if (results.length === 0){
                console.log('没数据');
                const addsql='insert into pyg.address(id,address,username,phone,xxaddress,moren) value(?,?,?,?,?,?)'
                db.query(addsql,[body.id,body.address,body.username,body.phone,body.xxaddress,body.moren],(err,results)=>{
                     //数据库使用失败则打印错误消息
                    if(err) return res.send({status:1,message:err.message})
                    if(results.affectedRows!==1){
                        return res.cc('添加失败，请重试')
                    }
                    res.cc('添加成功！',0)
                })
            }else if(results.length !== 0){
                console.log('有数据');
                for(let i=0;i<results.length;i++){
                    let bd=(({address, username,phone,xxaddress}) => ({address, username,phone,xxaddress}))(body)
                    let { id, moren, ...re }=results[i]
                    console.log(bd,re);
                    if(isObjectValueEqualNew(bd,re)) return res.cc('保存失败！此地址已存在！')
                    console.log(isObjectValueEqualNew(bd,re));
                    console.log(results[i]);
                    if(results[i].moren==='true'){
                        console.log(body);
                        const updatesql='update pyg.address set moren=? where id=? and address=? and username=? and phone=? and xxaddress=?'
                        console.log(results[i]);
                        db.query(updatesql,['false',body.id,results[i].address,results[i].username,results[i].phone,results[i].xxaddress],(err,results)=>{
                            //数据库使用失败则打印错误消息
                            if(err) return res.send({status:1,message:err.message})
                            console.log(results);
                            if(results.affectedRows!==1){
                                return res.cc('添加时修改默认地址失败，请重试')
                            }
                            const addsql='insert into pyg.address(id,address,username,phone,xxaddress,moren) value(?,?,?,?,?,?)'
                            db.query(addsql,[body.id,body.address,body.username,body.phone,body.xxaddress,body.moren],(err,results)=>{
                                //数据库使用失败则打印错误消息
                                if(err) return res.send({status:1,message:err.message})
                                if(results.affectedRows!==1){
                                    return res.cc('添加失败，请重试')
                                }
                                res.cc('添加成功！',0)
                            })
                        })
                    }
                }
                let result=results.every(function(value){
                    return value.moren=='false'
                })
                console.log(result);
                if(result){
                    const addsql='insert into pyg.address(id,address,username,phone,xxaddress,moren) value(?,?,?,?,?,?)'
                    db.query(addsql,[body.id,body.address,body.username,body.phone,body.xxaddress,body.moren],(err,results)=>{
                        //数据库使用失败则打印错误消息
                        if(err) return res.send({status:1,message:err.message})
                        if(results.affectedRows!==1){
                            return res.cc('添加失败，请重试')
                        }
                        res.cc('添加成功！',0)
                    })
                }
            }
        })
    }else{
        const selectsql='SELECT * FROM pyg.address where id=? and address=? and username=? and phone=? and xxaddress=? '
        db.query(selectsql,[body.id,body.address,body.username,body.phone,body.xxaddress],(err,results)=>{
            //数据库使用失败则打印错误消息
            if(err) return res.send({status:1,message:err.message})
            //results.length不等于0说名已经有了不能重新添加
            if (results.length === 0){
                const addsql='insert into pyg.address(id,address,username,phone,xxaddress,moren) value(?,?,?,?,?,?)'
                db.query(addsql,[body.id,body.address,body.username,body.phone,body.xxaddress,body.moren],(err,results)=>{
                     //数据库使用失败则打印错误消息
                    if(err) return res.send({status:1,message:err.message})
                    if(results.affectedRows!==1){
                        return res.cc('添加失败，请重试')
                    }
                    res.cc('添加成功！',0)
                })
            }else{
                return res.cc('保存失败！此地址已存在！')
            }
        })
    }
    
    
}
//判断两个对象是否相等
function isObjectValueEqualNew(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
      return false;
    }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i]

      var propA = a[propName]
      var propB = b[propName]
      if ((typeof (propA) === 'object')) {
        if (this.isObjectValueEqualNew(propA, propB)) {
          return true
        } else {
          return false
        }
      } else if (propA !== propB) {
        return false
      } else {
        //
      }
    }
    return true
  }

exports.getaddress=(req,res)=>{
    // console.log(req.query);
    const body=req.query
    const selectsql='SELECT * FROM pyg.address where id=?'
    db.query(selectsql,[body.id],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        if (results.length === 0) return res.cc('还未添加收货地址！')
        // console.log(results);
        let arr=[]
        for(let i=0;i<results.length;i++){
            if(results[i].moren==='true'){
                arr.unshift(results[i])
            }else{
                arr.push(results[i])
            }
        }
        res.send({
            status:0,
            message:'获取全部地址成功！',
            address:arr
        })
    })
}

exports.deleteaddress=(req,res)=>{
    // console.log(req.query);
    const body=req.query
    const deletesql='delete from pyg.address where id=? and address=? and username=? and phone=? and xxaddress=? '
    db.query(deletesql,[body.id,body.address,body.username,body.phone,body.xxaddress],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        if(results.affectedRows!==1){
            return res.cc('删除失败')
        }
        res.cc('删除地址成功！',0)
    })
}

exports.reviseaddress=(req,res)=>{
    console.log(req.query);
    let newaddress=JSON.parse(req.query.newdata)
    let oldaddress=JSON.parse(req.query.olddata)
    newaddress.moren=''+newaddress.moren
    console.log(newaddress,oldaddress);
    const updatesql='update pyg.address set id=? ,address=? , username=? , phone=? , xxaddress=? , moren=? where id=? and address=? and username=? and phone=? and xxaddress=? and moren=?'
    db.query(updatesql,[newaddress.id,newaddress.address,newaddress.username,newaddress.phone,newaddress.xxaddress,newaddress.moren,oldaddress.id,oldaddress.address,oldaddress.username,oldaddress.phone,oldaddress.xxaddress,oldaddress.moren],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        if(results.affectedRows!==1) return res.cc('修改失败')
        res.cc('修改成功！',0)
    })
}

exports.setdefaultaddress=(req,res)=>{
    // console.log(req.query);
    const body=req.query
    const selectallsql='SELECT * FROM pyg.address where id=?'
    db.query(selectallsql,[body.id],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //等于0说明没有数据或获取失败
        if (results.length === 0) return res.cc('数据库没有数据')
        for(let i=0;i<results.length;i++){
            if(results[i].moren==='true'){
                const updatesql='update pyg.address set moren=? where id=? and address=? and username=? and phone=? and xxaddress=?'
                db.query(updatesql,['false',body.id,results[i].address,results[i].username,results[i].phone,results[i].xxaddress],(err,results)=>{
                    //数据库使用失败则打印错误消息
                    if(err) return res.send({status:1,message:err.message})
                    if(results.affectedRows!==1){
                        return res.cc('添加时修改默认地址失败，请重试')
                    }
                })
            }
        }
        const updatesql='update pyg.address set moren=? where id=? and address=? and username=? and phone=? and xxaddress=?'
        db.query(updatesql,['true',body.id,body.address,body.username,body.phone,body.xxaddress],(err,results)=>{
            //数据库使用失败则打印错误消息
            if(err) return res.send({status:1,message:err.message})
            if(results.affectedRows!==1) return res.cc('设置默认地址失败')
            res.cc('设置默认地址成功！',0)
        })
    })
}

//提交订单
exports.postorder=(req,res)=>{
    // console.log(req.body);
    const body=JSON.parse(req.body.address)
    const a=JSON.parse(req.body.goods)
    // console.log(body);
    // console.log(a);
    const selectsql='SELECT * FROM pyg.order where id=? and address=? and username=? and phone=? and xxaddress=? and shopname=? and goodstille=? and goodsprice=? and goodspricenow=? and goodssum=? and goodsimg=? and goodsnr=? and ispay=?'
    db.query(selectsql,[a.id,body.address,body.username,body.phone,body.xxaddress,a.shopname,a.goodstille,a.price,a.goodspricenow,a.goodssum,a.goodsimg,a.goodsnr,body.ispay,body.ordercode],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //等于0说明没有数据或获取失败
        if (results.length !== 0) return res.cc('有订单了')
        const addsql='insert into pyg.order(id,address,username,phone,xxaddress,shopname,goodstille,goodsprice,goodspricenow,goodssum,goodsimg,goodsnr,ispay,addtime,ordernumber) value(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        db.query(addsql,[a.id,body.address,body.username,body.phone,body.xxaddress,a.shopname,a.goodstille,a.price,a.goodspricenow,a.goodssum,a.goodsimg,a.goodsnr,body.ispay,body.posttime,body.ordercode],(err,results)=>{
            //数据库使用失败则打印错误消息
            if(err) return res.send({status:1,message:err.message})
            //等于0说明没有数据或获取失败
            if(results.affectedRows!==1) return res.cc('添加订单失败')
            res.cc('添加成功！',0)
        })
    })
}

//获取订单
exports.getorder=(req,res)=>{
    const body=req.query
    const selectsql='SELECT * FROM pyg.order where id=? '
    db.query(selectsql,[body.id],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //等于0说明没有数据或获取失败
        if (results.length === 0) return res.cc('没有订单')
        // console.log(results);
        let order=[]
        for(let i=0;i<results.length;i++){
            order.push(results[i])
        }
        res.send({
            status:0,
            message:'获取订单成功！',
            order:order
        })
    })
}

//订单付款成功
exports.paysuccess=(req,res)=>{
    console.log(req.query);
    const body=req.query
    const selectsql='SELECT * FROM pyg.order where ordernumber=? '
    db.query(selectsql,[body.ordernumber],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //等于0说明没有数据或获取失败
        if (results.length === 0) return res.cc('未找到此订单')
        let x=0
        let y=results.length
        for(let i=0;i<results.length;i++){
            const updatesql='update pyg.order set ispay=? where id=? and address=? and username=? and phone=? and xxaddress=? and shopname=? and goodstille=? and goodsprice=? and goodspricenow=? and goodssum=? and goodsimg=? and goodsnr=? and addtime=? and ordernumber=?'
            db.query(updatesql,['1',results[i].id,results[i].address,results[i].username,results[i].phone,results[i].xxaddress,results[i].shopname,results[i].goodstille,results[i].goodsprice,results[i].goodspricenow,results[i].goodssum,results[i].goodsimg,results[i].goodsnr,results[i].addtime,results[i].ordernumber],(err,results)=>{

                //数据库使用失败则打印错误消息
                if(err) return res.send({status:1,message:err.message})
                //等于0说明没有数据或获取失败
                if(results.changedRows===0) return  
                x+=1
                if(x==y){
                    res.cc('修改订单成功！',0)
                }
                   
            })
        }
       
    })
}
