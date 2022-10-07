//导入表单验证模块
const joi=require('joi')
/**
* string() 值必须是字符串
* alphanum() 值只能是包含 a-zA-Z0-9 的字符串
* min(length) 最小长度
* max(length) 最大长度
* required() 值是必填项，不能为 undefined
* pattern(正则表达式) 值必须符合正则表达式的规则
*/
//手机号验证规则
const phone=joi.string().pattern(/^[1][3,4,5,7,8,9][0-9]{9}$/).required().error(new Error('手机号格式不符合要求'))
exports.register_phoneSchema={
    //表示需要对req.body中的数据进行验证 请求是get就验证query里的值 post 就是body
    query:{
        phone
    }
}
//用户名，密码，邮箱验证规则
const username=joi.string().pattern(/[\u4e00-\u9fa5]/).required().error(new Error('用户名格式不符合要求'))
const password=joi.string().pattern(/^[a-zA-Z]\w{5,17}$/).required().error(new Error('密码格式不符合要求'))
const email=joi.string().pattern(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).required().error(new Error('邮箱格式不符合要求'))
exports.register_user={
    query:{
        username,
        password,
        email,
        phone
    }
}
