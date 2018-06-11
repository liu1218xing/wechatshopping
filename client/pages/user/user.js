// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      nickName:"优达学院",
      avatarUrl:"",  //头像URL

    }, 
  },
onTapAddress(){
  wx.showToast({
    icon:'none',
    title: '此功能未开放',
  })
},
onTapKf(){
  wx.showToast({
    icon:"none",
    title: '此功能未开放',
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.userInfo)
    
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