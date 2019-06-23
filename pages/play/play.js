// pages/play/play.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textsrc: 'Hope',
    currentposition: '00:00',
    allposition: '3:15',
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    lyrics: '暂无歌词',
    currentIndex222:0,
    pauseStatus:true,
    slidervalue:0,
    listShow:false,
    slibermax:195,
songurl:"http://m10.music.126.net/20190525183805/463262472bd341c4df88d8d30ab8c2b4/ymusic/2376/b324/e00f/9229a1fa76eb129aa5dd780bd2ca6c51.mp3",
    picUrl:"https://p2.music.126.net…=/109951163311376025.jpg",
    listshow:true,
    audioList:[],
    audioIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    
    var that = this;
    var backgroundAudioManager=wx.getBackgroundAudioManager()
    that.setData({
      songid: options.id,
    })
    
    var songid = that.data.songid
    wx.request({
      url: 'http://localhost:3000/lyric?id='+songid,
        header: {
          'content-type': 'applicaiton/json'
        },
        success: function(res) {
          console.log(res.data.lrc.lyric)
            that.setData({
              lyrics: that.sliceNull(that.parseLyric(res.data.lrc.lyric))
            })
        }
      })
    wx.request({
      url: 'http://localhost:3000/song/url?id=' + songid,
      header: {
        'content-type': 'applicaiton/json'
      },
      success: function (res) {
        console.log(res.data.data[0].url)
        that.setData({
          songurl: res.data.data[0].url
        })
      }
    })
    wx.request({
      url: 'http://localhost:3000/song/detail?ids=' + songid,
      header: {
        'content-type': 'applicaiton/json'
      },
      success: function (res) {
        console.log(res.data.songs[0].al.picUrl)
        that.setData({
          picUrl: res.data.songs[0].al.picUrl,
          textsrc: res.data.songs[0].name

        })
      }
    })


     
    backgroundAudioManager.onTimeUpdate(function() {
      var slibermax = backgroundAudioManager.duration;
      var allposition = slibermax;
      var allmin = Math.floor(allposition / 60)
      var allmis = parseInt(allposition % 60);
      console.log(allmis)
      allmin = ('00' + allmin).slice(-2);
      allmis = ('00' + allmis).slice(-2);
      allposition = allmin + ":" + allmis;

      //进度条时间
      var curtime = Math.round(backgroundAudioManager.currentTime)
      var slidervalue = curtime;
      var curmin = Math.floor(curtime / 60);
      var curmis = curtime % 60;
      console.log(curmis)
      curmin = ('00' + curmin).slice(-2);
      curmis = ('00' + curmis).slice(-2)
      curtime = curmin + ":" + curmis;
      that.setData({
        currentposition: curtime,
        slidervalue: slidervalue,
        slibermax: slibermax,
        allposition: allposition,
      })
        if (that.data.currentIndex222 >= 6) { //超过6行开始滚动
          that.setData({
            marginTop: (that.data.currentIndex222 - 6) * 20
          })
        }
        // 文稿对应行颜色改变
        if (that.data.currentIndex222 != that.data.lyrics.length - 1) { //
          var j = 0;
          for (var j = that.data.currentIndex222; j < that.data.lyrics.length; j++) {
            // 当前时间与前一行，后一行时间作比较， j:代表当前行数
            if (that.data.currentIndex222 == that.data.lyrics.length - 2) {
              //最后一行只能与前一行时间比较
              if (parseFloat(backgroundAudioManager.currentTime) > parseFloat(that.data.lyrics[that.data.lyrics.length - 1][0])) {
                that.setData({
                  currentIndex222: that.data.lyrics.length - 1
                })
                return;
              }
            } else {
              if (parseFloat(backgroundAudioManager.currentTime) > parseFloat(that.data.lyrics[j][0]) && parseFloat(backgroundAudioManager.currentTime) < parseFloat(that.data.lyrics[j + 1][0])) {
                that.setData({
                  currentIndex222: j
                })
                return;
              }
            }
          }
        }
      
      });

   
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
  parseLyric: function(text) {
    var result = [];
    var lines = text.split('\n'), //切割每一行
      pattern = /\[\d{2}:\d{2}.[0-9]+\]/g;//用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
    //去掉不含时间的行
    while (!pattern.test(lines[0])) {
      lines = lines.slice(1);
    };
    //上面用'\n'生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
      //提取出时间[xx:xx.xx]
      var time = v.match(pattern),
        //提取歌词
        value = v.replace(pattern, '');
      // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
      time.forEach(function(v1, i1, a1) {
        //去掉时间里的中括号得到xx:xx.xx
        var t = v1.slice(1, -1).split(':');
        //将结果压入最终数组
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
      });
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function(a, b) {
      return a[0] - b[0];
    });
    return result;
  },
  //去除空白
  sliceNull: function(lrc) {
    var result = []
    for (var i = 0; i < lrc.length; i++) {
      if (lrc[i][1] == "") {} else {
        result.push(lrc[i]);
      }
    }
    return result;
  },
  bindTapPlay:function(){
   // 

    if(this.data.pauseStatus===true){
      this.play();
      this.setData({ pauseStatus: false })
    } else {
      wx.pauseBackgroundAudio()
      this.setData({ pauseStatus: true })
    }
  },
  play(){
    var that=this
    wx.playBackgroundAudio({
      dataUrl:that.data.songurl,
      coverImgUrl:that.data.picUrl
    })
  },
  bindTapChoose: function (e) {
    console.log('bindTapChoose')
    console.log(e)
    this.setData({
      songid: e.currentTarget.dataset.id,
      audioIndex: parseInt(e.currentTarget.id, 10),
      listshow: true
    })

    this.onLoad()
  },
  //判断字符是否为空的方法
  isEmpty: function (obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  },
  bindlist:function(){
    this.setData({
      
    })
  }
})