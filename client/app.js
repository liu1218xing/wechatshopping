//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
let userInfo
App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    checkSession({ success, error }) {
      console.log("appuserInfo")
      console.log(userInfo)
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
      qcloud.login({
        success : result=>{
          if (result){
            userInfo= result
            success && success({
              userInfo
            })
          }else{
            this.getUserInfo({ success, error })
          }
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