//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
let userInfo
App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    checkSession({ success, error }) {
      if (userInfo) {
        return success && success({
          userInfo
        })
      }
      wx.checkSession({
        success: () => {
          this.getUserInfo({ success, error })
        },
        fail: () => {
          error && error()
        }
      })
    },
    login({ success, error }){
      wx.getSetting({
        success:res=>{
          console.log(res)
          // console.log(res.authSetting['scope.userInfo']);
          if (res.authSetting['scope.userInfo'] === false) {
            console.log("false")
            wx.showModal({
              title: '提示',
              content: '请授权我们获取您的用户信息',
              showCancel: false,
              success: () => {
                wx.openSetting({
                  success: res => {
                    console.log("model")
                    console.log(res)
                    if (res.authSetting['scope.userInfo'] === true) {
                      
                      this.doQcloudLogin({ success, error })
                    }
                  }
                })
              }
            })
          } else {
            this.doQcloudLogin({ success, error })
          }
        }
      })
     
    },
    
  doQcloudLogin({ success, error }){
    qcloud.login({
      success: result=>{
        console.log("doQcloudLogin-result")
        console.log(result)
        if(result){
          userInfo= result
          success && success({
            userInfo
          })
        }else{
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          this.getUserInfo({ success, error })
        }
      },
      fail:()=>{
        error && error()
      }
    })
  },
    getUserInfo({ success, error }){
      if (userInfo) return userInfo
      qcloud.request({
        url: config.service.user,
        login : true,
        success : rusult=>{
          let data = rusult.data
          if (!data.code){
            userInfo = data.data
            success && success({
              userInfo
            })
          }else{
            error && error()
          }
        },
        fail: ()=>{
          error && error()
        }
      })
    }
})