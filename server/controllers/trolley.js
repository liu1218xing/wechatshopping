const DB = require('../utils/db.js')
module.exports={
  add : async ctx=>{
    let user = ctx.state.$wxInfo.userinfo.openId
    let product = ctx.request.body
    let list = await DB.query('SELECT * FROM trolley_user WHERE trolley_user.user = ? and trolley_user.id = ?',[user,product.id])
    if (!list.length){
      await DB.query('insert into trolley_user(id, count, user) values(?,?,?)',[product.id,1,user])
    }else{
      let count = list[0].count + 1
      await DB.query('update trolley_user set count = ? where user =? and id =?', [count,user,product.id])
    }
      ctx.state.data ={}
  },
  list : async ctx =>{
    let user = ctx.state.$wxInfo.userinfo.openId
    ctx.state.data = await DB.query('SELECT * FROM trolley_user LEFT JOIN product ON trolley_user.id = product.id WHERE trolley_user.user = ?', [user])
  },
update : async ctx =>{
  let user = ctx.state.$wxInfo.userinfo.openId
  let trolleyList = ctx.request.body.list || []
  await DB.query('delete from trolley_user where user =?',[user])
  let sql = 'insert into trolley_user(id, count, user) values '
  let param =[]
  let query=[]
  trolleyList.forEach(trolley=>{
    query.push('(?,?,?)')
    param.push(trolley.id)
    param.push(trolley.count)
    param.push(user)
  })
  await DB.query(sql + query.join(', '), param)

}
}