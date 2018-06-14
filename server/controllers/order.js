const DB = require('../utils/db.js')
module.exports={
  /**
   * 创建订单
   */
  add: async ctx =>{
    let user =  ctx.state.$wxInfo.userinfo.openId
    let productList = ctx.request.body.list || []
    let isInstantBuy = !!ctx.request.body.isInstantBuy
    //插入订单至order_user表
    let order = await DB.query('insert into order_user(user) values (?)',[user])
    let orderId = order.insertId
    // let sql='INSERT INTO order_product （order_id,product_id,count）VALUES '
    let sql = 'INSERT INTO order_product (order_id, product_id, count) VALUES '
    let param=[]
    let query =[]
    let needToDelQuery = []
    let needToDelIds = []

    productList.forEach(product=>{
      query.push('(?,?,?)')
      param.push(orderId)
      param.push(product.id)
      param.push(product.count || 1)

      needToDelQuery.push('?')
      needToDelIds.push(product.id)
    })

    await DB.query(sql + query.join(', '),param)

    if (!isInstantBuy){
      await DB.query('delete from trolley_user where trolley_user.id in (' + needToDelQuery.join(', ') +') and trolley_user.user = ?',[...needToDelIds,user])
     
    }
    ctx.state.data = await DB.query('SELECT * from order_product where order_id=? ', [orderId])
  },
  list: async ctx=>{
    let user = ctx.state.$wxInfo.userinfo.openId
    let list = await DB.query('SELECT order_user.id as `id` ,order_user.user as `user`,order_user.create_time as `create_time`,order_product.product_id AS  `product_id`,product.image AS  `image`,product.name AS  `name`,product.price AS  `price`,product.source AS  `source` FROM `order_user`  ,`order_product` ,`product`   WHERE order_user.id = order_product.order_id  and product.id = order_product.product_id and order_user.user= ? order by order_product.product_id', [user])
     // 将数据库返回的数据组装成页面呈现所需的格式
    let ret = []
    let cacheMap = {}
    let block = []
    let id = 0
    list.forEach(order => {
      if (!cacheMap[order.id]) {
        block = []
        ret.push({
          id: ++id,
          list: block
        })

        cacheMap[order.id] = true
      }

      block.push(order)
    })

    ctx.state.data = ret
  },
}