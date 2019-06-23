//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    personalized:[],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onLoad: function () {
    var that=this;
    wx.request({
      url: 'http://localhost:3000/personalized',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var personalizeds=[];
        for(var i=0;i<6;i++){
           personalizeds[i]= res.data.result[i]
        }
       
        that.setData({
          personalized: personalizeds
        })

      }
    })
    //367   143

    wx.request({
      url: 'http://localhost:3000/banner?type=2',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.banners[0].pic)
        var imgs=[];
        for(var i=0;i<9;i++){
          imgs[i]=res.data.banners[i].pic
        }
        // console.log(imgUrl)
        that.setData({
          imgUrls: res.data.banners,
        })

      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
bindBanner:function(e){
  if(!this.isEmpty(e.currentTarget.dataset.id)){
  wx.navigateTo({
    url: '../play/play?id=' + e.currentTarget.dataset.id,
  })
  }
},
  isEmpty: function (obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  },
  selectplaylist:function(e){
    wx.navigateTo({
      url: '../playlist/playlist?playid=' + e.currentTarget.dataset.playid,
    })
  }
})
