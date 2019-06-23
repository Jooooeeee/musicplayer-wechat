// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchHot: ['孤单心事'],
    songs: [],
    ishidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: 'http://localhost:3000/search/hot',
      header: {
        'content-type': 'applicaiton/json'
      },
      success: function(res) {
        var searchHots = [];
        console.log(res.data.result)
        for (var i = 0; i < 10; i++) {
          searchHots[i] = res.data.result.hots[i].first
        }

        that.setData({
          searchHot: searchHots
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  searchBtn: function(e) {
    var that = this;
    if (!that.isEmpty(e.detail.value)){
      wx.request({
        url: 'http://localhost:3000/search?keywords=' + e.detail.value,
        header: {
          'content-type': 'applicaiton/json'
        },
        success: function(res) {
          console.log(res.data.result.songs[0].name)
          that.setData({
            songs: res.data.result.songs,
            ishidden: true
          })
        }
      })
    }else{
      that.setData({
        ishidden: false
      })
    }

  },
  selectsong: function(e) {

    var that = this;
    var imgurl
    wx.request({
      url: 'http://localhost:3000/song/detail?ids='+e.currentTarget.dataset.id,
      header:{
        'content-type': 'applicaiton/json'
      },
      success: function (res) {
        imgurl=res.data.songs[0].al.picUrl
      }
    })
    var app=getApp();
    var song={};
    song.id=e.currentTarget.dataset.id;
    song.artists = e.currentTarget.dataset.artists;
    song.name = e.currentTarget.dataset.name;
    song.picUrl=imgurl;
    app.globalData.songlist.push(song)
    wx.navigateTo({
      url: '../play/play?id=' + e.currentTarget.dataset.id,
    })
  },
  //判断字符是否为空的方法
  isEmpty: function(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  }
})