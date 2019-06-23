// pages/playlist/playlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     songs:[],
     playlistName:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: 'http://localhost:3000/playlist/detail?id='+options.playid,
      header: {
        'content-type': 'applicaiton/json'
      },
      success: function (res) {
        that.setData({
          songs: res.data.playlist.tracks,
          playlistName:res.data.playlist.name
        })
       
      }
    })

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

  },
  selectsong:function(e){
    var that = this;
    var app = getApp();
    var song = {};
    song.id = e.currentTarget.dataset.id;
    song.artists = e.currentTarget.dataset.artists;
    song.name = e.currentTarget.dataset.name;
    song.picUrl = e.currentTarget.dataset.img;
    app.globalData.songlist.push(song)
    wx.navigateTo({
      url: '../play/play?id=' + e.currentTarget.dataset.id,
    })
  }
})