//导入数据库操作模块 
const db=require('../mysql/index')

exports.getsearchgoodstille=(req,res)=>{
    console.log(req.query[0]);
    const body=req.query[0]
    const selectsql='SELECT * FROM pyg.categories'
    db.query(selectsql,[body],(err,results)=>{
        if(err) return res.send({status:1,message:err.message})
        if (results.length === 0) return res.cc('获取商品信息失败，没有商品')
        let searcharr=[]
        for(let i=0;i<results.length;i++){
            // console.log(results[i].goodstille,results[i].goodsname,results[i].shopname);
        
            if(results[i].goodstille.indexOf(body)!=-1 || results[i].goodsname.indexOf(body)!=-1 || results[i].shopname.indexOf(body)!=-1){
                searcharr.push(results[i])
                console.log(results[i],'匹配成功的');
            }else{
                console.log('不成功');
            }
        }
        res.send({
            status:0,
            searcharr,
            message:'搜索成功'
        })
    })
}