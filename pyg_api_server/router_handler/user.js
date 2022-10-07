//导入数据库操作模块
const db=require('../mysql/index')
//导入生成token字符串包
const jwt=require('jsonwebtoken')
//导入配置文件
const config=require('../config')

//注册时填写账号密码邮箱接口 post
exports.register=(req,res)=>{
    const body=req.query
    console.log(body);
    const usersql='select * from pyg.pyg_user where username=? or email=?'
    db.query(usersql,[body.username,body.email],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //判断用户名是否被注册
        if(results.length>0){
            if(results[0].username===body.username){
                return res.cc('该用户名已经被注册过了，可以通过手机号或用户名或邮箱登录')
            }else if(results[0].email===body.email){
                return res.cc('该邮箱已经被注册过了，可以通过手机号或用户名或邮箱登录')
            }
        }
        //根据手机号更新数据
        const appendSql='update pyg.pyg_user set username=?,password=?,email=? where phone=? '
        db.query(appendSql,[body.username,body.password,body.email,body.phone],(err,results)=>{
            //添加失败则打印失败消息
            if(err) res.send({status:1,message:err.message})
            //sql语句执行成功但是数据库行数没有添加也是失败
            if(results.affectedRows!==1){
                return res.cc('注册账号失败，请稍后再试！')
            }
            res.cc('账号注册成功请前往登录！',0)
        })
    })
}
//注册时验证手机号接口 post
exports.register_phone=(req,res)=>{
    const body=req.query
    const phonesql = `select * from pyg.pyg_user where phone=?`
    db.query(phonesql,[body.phone],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        //判断手机号是否被注册
        if(results.length>0&&results[0].username===null){
            return res.cc('该手机号已经被验证过了，但还没有填写账号信息，请填写账号信息完成注册！',0)
        }else if(results.length>0&&results[0].username!==null){
            return res.cc('该手机号已经被验证过了，可以通过手机号登录')
        }
        //添加到数据库
        const appendSql='insert into pyg.pyg_user(phone) values(?)'
        db.query(appendSql,[body.phone],(err,results)=>{
            //添加失败则打印失败消息
            if(err) res.send({status:1,message:err.message})
            //sql语句执行成功但是数据库行数没有添加也是失败
            if(results.affectedRows!==1){
                return res.cc('手机号验证失败，请稍后再试！')
            }
            res.cc('手机号验证成功,请注册账号信息！',0)
            // console.log(results);
        })
    })
    // res.cc('ok',0)
}
//获取验证码接口 get
exports.getcode=(req,res)=>{
    let code = "";
    for(let i=0;i<6;i++){
        code += Math.floor(Math.random()*10);
    }
    // console.log(code);
    res.cc(code,0)
}
//登录接口 get
exports.login=(req,res)=>{
    const body=req.query
    const loginsql='select * from pyg.pyg_user where username=? or email=? or phone=?'
    db.query(loginsql,[body.username,body.username,body.username],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('登录失败！输入的信息错误！')
        //判断密码是否一样
        // console.log(results[0]);
        if(results[0].password===body.password){
            //剔除密码和头像的值
            const user={...results[0],password:'',user_pic:''}
            //生成token字符串
            const tokenStr=jwt.sign(user,config.jwtSecreKey,{
                expiresIn:config.expiresIn,
            })
            res.send({
                status:0,
                message:'登录成功！',
                username:results[0].username,
                password:results[0].password,
                avatar:results[0].user_pic,
                phone:results[0].phone,
                id:results[0].id,
                //为了方便客户端使用token 在服务器端直接拼接上bearer的前缀 bearer后面一定要空格不然后端收不到前端携带的token
                token:'Bearer '+tokenStr,
            })
        }else{
            return res.cc('登录失败！密码错误！')
        }
    })
}
//忘记密码接口 get
exports.forget=(req,res)=>{
    const body=req.query

    const loginsql='select * from pyg.pyg_user where username=? or email=? or phone=?'
    db.query(loginsql,[body.username,body.username,body.username],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('验证失败！输入的信息错误！')

        res.cc('验证成功！',0)
    })
}

//忘记密码的设置新密码接口 post
exports.revise=(req,res)=>{
    const body=req.query
    const loginsql='select * from pyg.pyg_user where username=? or email=? or phone=?'
    db.query(loginsql,[body.username,body.username,body.username],(err,results)=>{
        //数据库使用失败则打印错误消息
        if(err) return res.send({status:1,message:err.message})
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('验证失败！输入的信息错误！')
        if(results[0].password!==body.password){
            //这里用的sql语句会报错 您正在使用安全更新模式，并且您尝试更新没有使用 KEY 列的 WHERE 的表。 要禁用安全模式，请切换 Preferences -> SQL Editor 中的选项并重新连接。要想执行就要关闭安全模式 
            const revisesql='update pyg.pyg_user set password=? where phone=? or username=? or email=?'
            db.query(revisesql,[body.password,body.username,body.username,body.username],(err,results)=>{
                //数据库使用失败则打印错误消息
                if(err) return res.send({status:1,message:err.message})
                // 执行 SQL 语句成功，但是查询到数据条数不等于 1
                if(results.affectedRows!==1){
                    return res.cc('设置失败，请稍后再试！')
                }
                res.cc('设置成功！可以前往登录！',0)
            })
        }else{
            return res.cc('设置的密码与旧密码相同请重新设置')
        } 
    })
    

}
