// pages/trolley/trolley.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trolleyList: [], // 购物车商品列表
    trolleyCheckMap: [], // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: true, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选
  },
  sumPrice(){
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let trolleyAccount=0
    console.log(trolleyCheckMap)
    for (let i = 0, len = trolleyList.length;i<len;i++){
      if (trolleyCheckMap[trolleyList[i].id]){
        trolleyAccount += trolleyList[i].count * trolleyList[i].price
      }
    }
    this.setData({
      trolleyAccount
    })
  },
  onTapCheckSingle(event){
    let trolleyCheckMap = this.data.trolleyCheckMap
    let checkId = event.currentTarget.dataset.id
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyAccount = this.data.trolleyAccount
    trolleyCheckMap[checkId] = !trolleyCheckMap[checkId]
    let checkCount=0
    let trolleyList = this.data.trolleyList
    trolleyCheckMap.forEach(check=>{
      checkCount = check ? checkCount + 1 : checkCount
    })
    // console.log(checkCount, trolleyList.length)
    if (checkCount === trolleyList.length) {
      isTrolleyTotalCheck = true
    }else{
      isTrolleyTotalCheck = false
    }
    // console.log(event)
    // console.log(trolleyCheckMap)
    trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)
    this.setData({
      trolleyCheckMap,
      isTrolleyTotalCheck,
      trolleyAccount
    })
  },
  onTapCheckTotal(event){
    let trolleyCheckMap = this.data.trolleyCheckMap
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyList = this.data.trolleyList
    let trolleyAccount = 0
    isTrolleyTotalCheck = !isTrolleyTotalCheck
    trolleyList.forEach(product => {
      trolleyCheckMap[product.id] = isTrolleyTotalCheck
    })
    trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)
    this.setData({
      isTrolleyTotalCheck,
      trolleyCheckMap,
      trolleyAccount
    })
  },
  calcAccount(trolleyList, trolleyCheckMap){
    let account=0
    trolleyList.forEach(product=>{
      account = trolleyCheckMap[product.id] ? account + product.price * product.count : account
    })
    return account
  },
  getRolleyList(){
    qcloud.request({
      url: config.service.TrolleyList,
      login: true,
      success:result=>{
        let data = result.data
        let tempTrolleyCheckMap=[]
        let tempTrolleyAccount =0
        if (!data.code){
          console.log(data)
          this.setData({
            trolleyList: data.data
          })
        }else
        {
          wx.showToast({
            icon: 'none',
            title: '获取购车商品数据失败',
          })
        }
      },
      fail:()=>{
        wx.hideLoading()
        wx.showToast({
          icon:'none',
          title: '下载购车商品数据失败',
        })
      }
    })
  },
  onTapLogin() {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        this.getRolleyList()
        this.sumPrice()
      }
    })
  },
  onTapEdit(event){
    let isTrolleyEdit = this.data.isTrolleyEdit

    if (isTrolleyEdit) {
      this.updateTrolley()
    } else {
      this.setData({
        isTrolleyEdit: !isTrolleyEdit
      })
    }
   
  },
  adjustTrolleyProductCount(event){
    let trolleyList = this.data.trolleyList
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyAccount = this.data.trolleyAccount
    let dataset =event.currentTarget.dataset
    let adjustType = dataset.type
    let productId = dataset.id
    let product
    let index
    for (index = 0; index < trolleyList.length;index++ ){
      if (trolleyList[index].id===productId){
        product = trolleyList[index]
        break
      }
    }
    if (product){
      if(adjustType==='add'){
        product.count++
      }else{
        if (product.count <=1){
          delete trolleyCheckMap[productId]
          trolleyList.splice(index, 1)
        }else{
          product.count--
        }
      }
      console.log(trolleyList)
      trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)
     
      this.setData({
        trolleyList,
        trolleyCheckMap,
        trolleyAccount
      })
    } 
  },
  updateTrolley(){
    let trolleyList = this.data.trolleyList
  qcloud.request({
    url:config.service.updateTrolley,
    login:true,
    method:'POST',
    data:{
      list: trolleyList
    },
    success:result=>{
      wx.showToast({
        title: 'success',
      })
    },
    fail:error=>{
      console.log(error)
      wx.showToast({
        icon:'none',
        title: 'fail',
      })
    }
    
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkSession({
      success:({userInfo})=>{
        this.setData({
          userInfo
        })
        this.getRolleyList()
        this.sumPrice()
      }
     
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})