const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{},
  },
  getProduct(id){
    wx.showLoading({
      title: '商品数据加载中...',
    })
    console.log(config.service.productDetail + id);
    qcloud.request({
      url:config.service.productDetail+id,
      success:result=>{
        wx.hideLoading()
        let data = result.data
        if(!data.code){
        this.setData({
          product:data.data
        })
        }else{
          setTimeout(()=>{
            wx.navigateBack()
          },2000)
        }
        console.log(data);
      },
      fail:()=>{
        wx.hideLoading()
        setTimeout(()=>{
          wx.navigateBack()
        },2000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProduct(options.id)
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