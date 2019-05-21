// 该项目 ajax url
var ajaxURL = 'https://h5.xhangjia.com/2018/09/easydl/public';

//信息提示
var Core = window['Core'] || {};
Core.CONFIG = {
    TwinkTime: 70, //提示框闪烁时长
    TwinkCount: 3, //提示框闪烁次数
    MsgTimeout: 1000, //minmessage 自动隐藏时间
};

Core.Center = function(box, setting) {
    var mainBox = $(window);;
    var cut = 0,
        t = 0,
        l = 0;
    var cssT = (mainBox.height() - box.height()) / 2.2 + cut + t;
    var cssL = (mainBox.width() - box.width()) / 2 + cut + l;
    if (cssT < 0) {
        cssT = 0;
    }
    if (cssL < 0) {
        cssL = 0;
    }
    var st = document.documentElement.scrollTop || document.body.scrollTop;
    if (st) {
        cssT += st;
    }
    box.css({
        top: cssT,
        left: cssL
    });
}

Core.MinMessage = (function() {
    var _temp = '<div class="popup-hint" style="background-color:rgba(0,0,0,0.7);border-radius:0.3rem;position:fixed;top:9999px;lefe:9999px;z-index:9999999999;display:none;">' +
        '<i class="" rel="type"></i>' +
        '<em class="sl"><b></b></em>' +
        '<span class="desc" style="color:#fff;font-size: 0.8rem;padding: 0.3rem 1rem; line-height: 1.5rem; display:block;" rel="con"></span>' +
        '<em class="sr"><b></b></em>' +
        '</div>';
    var _cache = {
            Type: {
                "suc": "hint-icon hint-suc-m",
                "war": "hint-icon hint-war-m",
                "err": "hint-icon hint-err-m",
                "load": "hint-loader",
            }
        },
        _dom, _timer, timeout = 3000;

    //创建消息DOM
    var create = function(obj) {
        if (!_dom) {
            _dom = $(_temp);
            $(document.body).append(_dom);
        }
        _dom.find("[rel='con']").html(obj.text);
        var icon = _dom.find("[rel='type']");
        for (var k in _cache.Type) {
            icon.removeClass(_cache.Type[k]);
        }
        icon.addClass(_cache.Type[obj.type]);
        _dom.fadeIn(300);
        Core.Center(_dom);
    }

    //隐藏
    var hide = function() {
        if (_timer) {
            window.clearTimeout(_timer);
        }
        if (_dom) {
            _dom.fadeOut(300);
        }
    }

    return {
        Show: function(obj) {
            if (!obj.type) {
                obj.type = "war";
            }
            create(obj);
            if (_timer) {
                window.clearTimeout(_timer);
            }
            if (!obj.timeout) return;
            if (timeout) {
                _timer = window.setTimeout(hide, timeout);
            }
        },
        Hide: function() {
            if (_dom) {
                _dom.fadeOut(300);
            }
        }
    }
})();
/**
 *提示弹窗
 */
(function($, window, undefined) {
    $.extend($, {
        alertTip: function(text, container, timer) {
            if ($.isNumeric(container)) {
                timer = container;
                container = null;
            }
            if (top.window.Core && top.window.Core.MinMessage) {
                top.window.Core.MinMessage.Show({
                    text: text,
                    type: "war",
                    window: container ? { warp: container } : null,
                    timeout: timer || 2000
                });
            } else {
                alert(text);
            }
        },
        showTip: function (text, container) {
            top.window.Core.MinMessage.Show({
                text: text,
                type: "war",
                window: container ? { warp: container } : null
            });
        },
        closeTip: function() {
            top.window.Core.MinMessage.Hide();
        }
    });
}(jQuery, window));


// 判断横屏还是竖屏
function orient() {
    if (window.orientation == 90 || window.orientation == -90) {
        //ipad、iphone竖屏；Andriod横屏
        $("body").attr("id", "landscape");
        return false;
    } else if (window.orientation == 0 || window.orientation == 180) {
        //ipad、iphone横屏；Andriod竖屏
        $("body").attr("id", "portrait");
        return false;
    }
}

var localStorages = {
    Get: function(key){
        if (window.localStorage && window.localStorage['getItem']) {
            if(key){
                return window.localStorage.getItem(key);
            }
        }
    },
    Set: function(key, value){
        if (window.localStorage && window.localStorage['setItem']) {
            if (value && value) {
                return window.localStorage.setItem(key, value);
            }               
        }

    },
    Clear: function(name) {
        if(name){
            window.localStorage.removeItem(name);
        }else{
            window.localStorage.clear();
        }
    }
};

//获取 url 的参数
function getQueryString (name) {
    //获取url中的参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

//判断是否是安卓
function _isAndroid() {
    var u = navigator.userAgent,
        isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端 
        isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 
    if (isAndroid) return true;
    else return false;
}

//图片预加载
function _loadImages(pics, callback, len) {
    len = len || pics.length;
    if (pics.length) {
        var IMG = new Image(),
            picelem = pics.shift();

        if (window._pandaImageLoadArray) {
            window._pandaImageLoadArray = window._pandaImageLoadArray
        } else {
            window._pandaImageLoadArray = [];
        }
        window._pandaImageLoadArray.push(picelem);
        IMG.src = picelem;
        // 从数组中取出对象的一刻，就开始变化滚动条
        _drawLoadProgress(window._pandaImageLoadArray.length / (len * len));
        // 缓存处理
        if (IMG.complete) {
            window._pandaImageLoadArray.shift();
            return _loadImages(pics, callback, len);
        } else {
            // 加载处理
            IMG.onload = function () {
                window._pandaImageLoadArray.shift();
                IMG.onload = null; // 解决内存泄漏和GIF图多次触发onload的问题
            }
            // 容错处理 todo 应该如何处理呢?
            // 目前是忽略这个错误，不影响正常使用
            IMG.onerror = function () {
                window._pandaImageLoadArray.shift();
                IMG.onerror = null;
            }
            return _loadImages(pics, callback, len);
        }
        return;
    }
    if (callback) _loadProgress(callback, window._pandaImageLoadArray.length, len);
}
// 监听实际的加载情况
function _loadProgress(callback, begin, all) {
    var loadinterval = setInterval(function () {
        if (window._pandaImageLoadArray.length != 0 && window._pandaImageLoadArray.length != begin) {
            _drawLoadProgress((begin - window._pandaImageLoadArray.length) / all);
        } else if (window._pandaImageLoadArray.length == 0) {
            _drawLoadProgress(1)
            setTimeout(function () {
                callback.call(window);
            }, 500);
            clearInterval(loadinterval);
        }
    }, 300);
}
function _drawLoadProgress(w) {
    var num = Math.floor(w * 100) >= 100 ? 100 : Math.floor(w * 100) + 1;
    $('.lp-text span').html(num);
}



/**
 * [微信分享]
 * @param  {[type]} shareTitle [分享标题及朋友圈文案]
 * @param  {[type]} shareDesc  [分享描述]
 * @param  {[type]} link       [分享链接]
 */
function wxShare(shareTitle, shareDesc, link , openid) {
    if (!link) { var link = location.href; }
    var uri = window.location.href.split("#")[0];
    $.post("//h5.xhangjia.com/wxapi.php", {
        uri: uri
    }, function (data) {
        data = eval("(" + data + ")");
        var apilist = [
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
        ];

    
        wx.config({
            debug: false,
            appId: data.appid,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: apilist
        });

        wx.ready(function () {

            if( openid ){
                $.get(ajaxURL + '/api/users/'+openid, function(data){
                    var data = data.data;

                    var msg1 = '';
                    if( data.number > 50 ){
                        msg1 = data.nickname+'拍到了'+data.number+'个脑袋，超过了全国'+(data.total-data.rank)+'人！';
                    }else{
                        msg1 = data.nickname+'拍到了不到50个脑袋，超过了全国'+(data.total-data.rank)+'人！';
                    }
                    // 分享给朋友事件绑定
                    wx.onMenuShareAppMessage({
                        title: shareTitle,
                        desc:  msg1,
                        link: link,
                        imgUrl: 'https://img.xhangjia.com/h5/2018/09/1809_srtds/share.jpg',
                        success: function () {

                        }
                    });

                    var msg2 = '';
                    if( data.number > 50 ){
                        msg2 = '请围观：'+data.nickname+'一次拍了'+data.number+'个脑袋';
                    }else{
                        msg2 = '请围观：'+data.nickname+'一次拍了不到50个脑袋';
                    }
                    // 分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: msg2,
                        link: link,
                        imgUrl: 'https://img.xhangjia.com/h5/2018/09/1809_srtds/share.jpg',
                        success: function () {

                        }
                    });
                });
            }else{
                wx.onMenuShareAppMessage({
                    title: shareTitle,
                    desc: shareDesc ,
                    link: link,
                    imgUrl: 'https://img.xhangjia.com/h5/2018/09/1809_srtds/share.jpg',
                    success: function () {

                    }
                });
                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: shareDesc,
                    link: link,
                    imgUrl: 'https://img.xhangjia.com/h5/2018/09/1809_srtds/share.jpg',
                    success: function () {

                    }
                });
            }

        })
    });
}



/**
 * qiniu上传
 * @param base64 字符串
 * @param callback 回调
 * 
 */ 
function getQiniuFile(base64, callback) {
    $.get('http://apihzz.xhangjia.com/api/qn_token', function (data) {
        var qnToken = data.data;

        var qiniuUpload = function (qnToken, files, complete) {
            var progress;
            var subObject = {
                //状态条
                next: function (next) {
                    progress = parseInt(next.total.percent);
                },
                //错误返回
                error: function (error) {
                    $.alertTip(error);
                },
                //完成状态
                complete: complete
            };

            var subscription;
            var observable = qiniu.upload(
                files,
                files.hash,
                qnToken.token,
                {
                    fname: '',
                    params: {},
                    mimeType: null
                },
                {
                    useCdnDomain: true,
                    disableStatisticsReport: false,
                    region: qiniu.region.z1
                });
            //subscribe方法会处理回调
            subscription = observable.subscribe(subObject);
        }

        var convertBase64UrlToBlob = function (urlData) {
            var bytes = window.atob(urlData);        //去掉url的头，并转换为byte
            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            return new Blob( [ab] , { type : 'image/jpeg' });
        }

        //base64数据
        var base64Data = base64.toString().split(',')[1];
        var blob = convertBase64UrlToBlob(base64Data);

        qiniuUpload(qnToken, blob, function (complete) {
            //拼接地址
            var url = 'http://' + qnToken.domain + '/' + complete.key;
            //图片上传
            var img = new Image();
            img.src = url;
            img.onload = function () {
                callback(url);
            }
        });

    })
}




//把微信头像路径转换成同域
function getDomain(weburl){ 
    var urlReg=/http:\/\/([^\/]+)/i; 
    domain = weburl.match(urlReg);
    return ((domain != null && domain.length>0)?domain[0]:"");
}


//photoswipe 初始化函数
function initPhotoSwipeFromDOM(gallerySelector) {
    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for (var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element
            // include only element nodes 
            if (figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');
            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }
            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }
        return items;
    };
    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };
    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if (!clickedListItem) {
            return;
        }
        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }
            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};
        if (hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }
        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };

    var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
        items = parseThumbnailElements(galleryElement);
        // define options (if needed)
        options = {
            history:false,
            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();
                return {
                    x: rect.left,
                    y: rect.top + pageYScroll,
                    w: rect.width
                };
            }
        };
        // PhotoSwipe opened from URL
        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};


/**
 * 分享海报生成
 * @param arg1 拍摄的照片
 * @param arg2 头像照片
 * @param arg3 数据数组：人物、地点、人头数、排名、超越人数
*/
function createSharePic(obj){
    var Scene = spritejs.Scene;
    var Group = spritejs.Group;
    var Label = spritejs.Label;
    var Sprite = spritejs.Sprite;

    var scene = new Scene('#container', {
        resolution: [750, 1334],
    });
    var layer = scene.layer();

    var bgImg = new Image();
    bgImg.src = 'images/ps_bg.jpg?v=1';
    bgImg.onload = function(){
        //背景
        var bgPic = new Sprite(bgImg.src);
        bgPic.attr({
            pos: [0, 0],
            scale: 1,
        });
        //拍摄的照片
        var arg1 = new Sprite(obj.arg1);
        arg1.attr({
            pos: [110, 245],
            scale: 1.155,
        });
        //印章
        var seal = new Sprite('images/ps_01.png');
        seal.attr({
            pos: [463, 555],
            scale: 1,
        });
        //顶部标题
        var titleText = new Label('超越'+obj.arg3[4]+'人的作品');
        titleText.attr({
            pos: [0, 142],
            font: 'bold 36px Arial',
            lineHeight: 50,
            width: 750,
            textAlign: 'center',
            fillColor: '#ff635b',
        });
        //文本
        var arg3Group = new Group();
        arg3Group.attr({
            pos:[270,946]
        })
        //姓名
        var txt1 = new Label(obj.arg3[0]);
        txt1.attr({
            pos: [0, 5],
            font: '30px Arial',
            lineBreak: 'none',
            fillColor: '#ff635b',
        });

        var txt2 = new Label('和TA拍到的');
        txt2.attr({
            pos:[0,50],
            font: '30px Arial',
            lineBreak: 'none',
            fillColor: '#999999',
        });
        //50以内有不一样的文案
        if( obj.arg3[2] > 50 ){
            var txt3 = new Label(obj.arg3[2]+'个脑袋');
            txt3.attr({
                pos:[158,50],
                font: '30px Arial',
                lineBreak: 'none',
                fillColor: '#ff635b',
            });

            var txt5  = new Label('拍照角度和光照都会影响本鸭数脑袋 \n - 结果有误差？上传更多照片帮本大脑更聪明 -');
            txt5.attr({
                pos:[0,1120],
                font: '20px Arial',
                lineBreak: 'none',
                fillColor: '#ff635b',
                lineHeight: 25,
                width: 750,
                textAlign: 'center',
            });
        }else{
            var txt3 = new Label('不到50个有缘人');
            txt3.attr({
                pos:[158,50],
                font: '30px Arial',
                lineBreak: 'none',
                fillColor: '#999999',
            });

            var txt5  = new Label('- 拍不到50个脑袋的，就不要拿给本鸭数了 -');
            txt5.attr({
                pos:[0,1135],
                font: '20px Arial',
                lineBreak: 'none',
                fillColor: '#ff635b',
                lineHeight: 25,
                width: 750,
                textAlign: 'center',
            });
        }
        //地点
        var txt4 = new Label(obj.arg3[1]);
        txt4.attr({
            pos:[35,98],
            font: '24px Arial',
            lineBreak: 'none',
            fillColor: '#525252',
        });
        arg3Group.append(txt1, txt2, txt3, txt4);
        
        //二维码
        var qrPic = new Sprite($('#qrcode img').attr('src'));
        qrPic.attr({
            pos: [603, 1220],
            scale: 1,
            size: [92, 92],
        });

        //红条文案
        var resWord = new Label( $('#word_copy').html() );
        resWord.attr({
            pos:[0,838],
            font: '22px Arial',
            width: 750,
            textAlign: 'center',
            lineBreak: 'none',
            fillColor: '#ffffff',
        });

        //头像加载
        var headImg = new Image();
        headImg.src = obj.arg2;
        headImg.onload = function(){       

            var arg2 = new Sprite(headImg.src);
            arg2.attr({
                pos: [0, 0],
                scale: 1,
                size: [200, 200],
            }); 
            //头像
            var arg2Group = new Group();
            arg2Group.attr({
                anchor: 0,
                scale: 0.62,
                pos: [96, 946],
                size: [200, 200],
                clip: {
                    d: 'm1.5,99.4375c0,-54.696133 44.303867,-99 99,-99c54.696133,0 99,44.303867 99,99c0,54.696133 -44.303867,99 -99,99c-54.696133,0 -99,-44.303867 -99,-99z',
                }
            });
            
            arg2Group.append(arg2);
            layer.append(bgPic, arg1, seal, txt5, arg2Group, arg3Group, qrPic, titleText, resWord);
            // 图片预加载
            var pics = [
                obj.arg1,
                obj.arg2
            ];
            _loadImages(pics, function () {
                var img = new Image();
                img.src = layer.canvas.toDataURL('image/jpeg');
                img.onload = function(){
                    $('#canvasImg').attr('src', img.src);
                }
            });
        }
    }
}   

// 测试用
// createSharePic({
//     arg1: 'images/demo_head2.jpg',
//     arg2: 'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eosQg0XAQxOgzO02ap9KjlxOuzJVs4u4E8c8cRpuiawuH2uQcc33TTXjlrDgSA9pMxxha9csjc6piaQ/132' ,
//     arg3: [ '刘备' , '桃园' , 100 , 20 , 8 ]
// });




/**
 * 获取排行榜数据
 * listbox 装li的
 * */ 
function getUserList(box,listbox){
    var per_page = 10;
    var page = 0;
    var pageSwitch = true;
    var rank = 0;
    $(listbox).html('');
    var scrollAdd = function(){
        if( pageSwitch ){
            page++;
            pageSwitch = false;
            $.get(ajaxURL + '/api/users/records?per_page='+per_page+'&page='+page, function(data){
                if(data.status==200){
                    pageSwitch = true;
                    var data = data.data;
                    var html ='';
                    for( var i in data ){
                        // data[i].rank
                        html += '<li class="clearfix"><div class="fl p5l-01">'+(rank+=1)+'</div><div class="fl p5l-02"><div class="fl p5l-02-h"><img src="'+data[i].headimgurl+'"></div><div class="fl p5l-02-t">'+data[i].nickname+'</div></div><div class="fl p5l-03">'+( data[i].number > 50 ? data[i].number : '50以内' )+'</div><div class="fl p5l-04"><div class="fr p5l-04-h"><figure><a href="'+data[i].picture+'" data-size="460x460" itemprop="contentUrl"><img src="'+data[i].picture+'"></a></figure></div><div class="fr p5l-04-t">'+data[i].location+'</div></div></li>';
                    }
                    $(listbox).append(html);
                    if( data.length < 10 ){
                        pageSwitch = false;
                        $(listbox).append('<li class="list-last">没有更多数据咯~</li>');
                    }
                }else{
                    $.alertTip(data.message);
                }
            });
        }
    }
    scrollAdd();
    $(box).unbind('scroll');
    $(box).on('scroll',function(){
        if ( $(box).scrollTop() >= $(listbox).height() - $(box).height() -5 ) {
            scrollAdd();
        }
    });
}
//根据openid 获取用户信息
function getUserMsg(openid){
    $.get(ajaxURL + '/api/users/'+openid, function(data){
        if(data.status==200){
            var data = data.data;
            $('.headimgurlo').attr('src',data.headimgurl);
            $('.nameTexto').html(data.nickname);
            $('.addressTexto').html(data.location);
            // $('.peopleNumo').html(data.number);   
            if( data.number > 50 ){
                $('.people-texto').html('拍到了<span class="peopleNumo">'+data.number+'</span>个有缘人的脑袋');
            }else{
                $('.people-texto').html('拍到了不到50个有缘人的脑袋');
            }
            $('.rankingo').html(data.rank);
            $('.beyond').html(data.total-data.rank);//超越人数
        }else{
            $.alertTip(data.message);
        }
    });
}


//随机范围数
function rd(n,m){
    var c = m-n+1; 
    return Math.floor(Math.random() * c + n);
}
/**
 * 结果页文案
 * @param id openid
 * @param num 人头数
 * */ 
function resultText(id,num){
    var txt = '';
    if( num > 300 ){
        var txtArr = ['恭喜!此景点人流量帮你完成了一次完美挤压瘦身!','欢迎来到我的朋友圈看“人山人”海','这么挤，你一定狠抗压吧!'];
        txt = txtArr[rd(0,2)];
    }else if(num > 199){
        var txtArr = ['真正的猛士，敢于在黄金周勇敢走出家门!','运气不算太差，至少在榜单排名上可以说是很优秀了','摩拳擦掌就是每移动一米，就要摩擦10个人的手掌'];
        txt = txtArr[rd(0,2)];
    }else if(num > 150){
        var txtArr = ['曾经跨过山和大海，却跨不过人山人海','拍脑袋吉尼斯记录入围作品','有缘千里来相会之你在我对面却被人流冲散'];
        txt = txtArr[rd(0,2)];
    }else if(num > 99){
        var txtArr = ['大家好，介绍一下这是旅游认识的百来号兄弟','珍惜眼前的人从众海，毕竟万里相见的缘分不易','你选的景点人多到可以称得上世界第九大奇迹了!'];
        txt = txtArr[rd(0,2)];
    }else if(num > 80){
        var txtArr = ['激动，马上就可以集齐108个兄弟了','这么多人选搭讪成功率一定高!把握好时机少年!','仿佛下一秒，就要踩到前面人的脚'];
        txt = txtArr[rd(0,2)];
    }else if(num > 50){
        var txtArr = ['茫茫人海不过百，要不你再举高点试试?','这是一条靠镜头人数称霸的朋友圈','如果有背景乐，可以一起为祖国蹦个“庆生迪”了!'];
        txt = txtArr[rd(0,2)];
    }else if(num > 10){
        txt = '巧妙躲过国庆黄金周高峰人流量的旅行王者';
    }else if(num > 5){
        txt = '没有人山人海吵吵闹闹，就这样安安静静，挺好';
    }else if(num > 2){
        txt = '人这么少的地方都被找到了，真是个小机灵鬼';
    }else if(num > 0){
        txt = '如果不是约好的熟人，这缘分可以加个好友了';
    }else{
        txt = '风光无限好，只是没有人?????';
    }
    $('#word_copy').html(txt);
    wxShare('拍脑袋王者争霸赛', '已设置分享', 'https://h5.xhangjia.com/2018/09/1809_srtds/index.html?openid='+id+'&personNum='+num, id);
}


//获取openid 和 personNum 人头数
var OPENID = getQueryString('openid');    
var personNum = getQueryString('personNum');

// 所有逻辑函数
var allStartFun = function(wxInfo){

    //是否存在openid ，如果存在执行openid操作 
    if( OPENID ){
        $('body').addClass('openid');
        getUserMsg(OPENID);
        getUserList('.p5ic-c2','.p5icc-list2');
        // 结果页文案
        resultText(OPENID,personNum);
    }else{
        // 初始分享
        wxShare('拍脑袋王者争霸赛', '朋友圈拍脑袋大赛报名通知，请带摄影作品参赛', 'https://h5.xhangjia.com/2018/09/1809_srtds/index.html');
    }

    //头像URL地址转换
    var domains = getDomain(wxInfo.headimgurl);
    wxInfo.headimgurl = wxInfo.headimgurl.replace(domains,'https://h5.xhangjia.com/wechat_image');
    
    // 在页面中显示头像
    $('.headimgurl').attr('src',wxInfo.headimgurl);
    $('#name').val(wxInfo.nickname);

    //用户变化屏幕方向时调用
    orient();
    $(window).bind('orientationchange', function (e) {
        orient();
    });

    //第二页人物逐渐增加
    var p2Person = function(){
        var pnum = $('.pani-pic').length;
        var timer = setInterval(function(){
            if( pnum < 0){
                clearInterval(timer);
                return;
            }
            if( pnum == 24 ){
                $('.pad-26, .pad-27').fadeIn(1000,function(){
                    $('.pad-31').fadeIn(500,function(){
                        $('.pad-duck-wrap').addClass('duck-ani');
                        var t2 = setTimeout(function(){
                            $('.pad-duck-wrap').addClass('duck-ani2');
                            clearTimeout(t2);
                        },3000);
                    });
                });
            }

            $('.pani-pic').eq(pnum--).fadeIn(500);
        },100);
    }

    
    //视频元素
    var video = document.getElementById('videoALL'),
        clientWidth = $(window).width(),
        clientHeight = $(window).height();
    var isend = false, ispass = true;
    var scaleSize =  ((clientWidth - 360 ) / clientWidth) + 1;

    var videoPause = function(){
        ispass = false;
        video.pause();

        //显示第二页，及动画播放
        $('.page1').fadeOut(50);
        $('.page2').fadeIn(300);
        var timer = setTimeout(function(){
            $('.page2').addClass('page-ani');
            p2Person();
            clearTimeout(timer);
        },500);
    }

    //视频播放中
    video.addEventListener('timeupdate', function(e) {
        isend = true;
        if (this.currentTime >= 17 && ispass) {
            videoPause();
        }
    });
    //视频播放结束
    video.addEventListener('ended', function(e) { });
    //跳过
    $('#video_jump').on('click',function(){
        videoPause();
    });


    // 图片预加载
    var cdnPrev='https://img.xhangjia.com/h5/2018/09/1809_srtds/';
    var pics = [
        cdnPrev + 'p2_01.png',
        cdnPrev + 'p2_02.png',
        cdnPrev + 'p2_03.png',
        cdnPrev + 'p2_04.png',
        cdnPrev + 'p2_bg.jpg',
        cdnPrev + 'p2_f01.png',
        cdnPrev + 'p2_f02.png',
        cdnPrev + 'p2_f03.png',
        cdnPrev + 'p2_f04.png',
        cdnPrev + 'p2_f05.png',
        cdnPrev + 'p2_f06.png',
        cdnPrev + 'p2_p01.png',
        cdnPrev + 'p2_p02.png',
        cdnPrev + 'p2_p03.png',
        cdnPrev + 'p2_p04.png',
        cdnPrev + 'p2_p05.png',
        cdnPrev + 'p2_p06.png',
        cdnPrev + 'p2_p07.png',
        cdnPrev + 'p2_p08.png',
        cdnPrev + 'p2_p09.png',
        cdnPrev + 'p2_p10.png',
        cdnPrev + 'p2_p11.png',
        cdnPrev + 'p2_p12.png',
        cdnPrev + 'p2_p13.png',
        cdnPrev + 'p2_p14.png',
        cdnPrev + 'p2_p15.png',
        cdnPrev + 'p2_p16.png',
        cdnPrev + 'p2_p17.png',
        cdnPrev + 'p2_p18.png',
        cdnPrev + 'p2_p19.png',
        cdnPrev + 'p2_p20.png',
        cdnPrev + 'p2_p21.png',
        cdnPrev + 'p2_p22.png',
        cdnPrev + 'p2_p23.png',
        cdnPrev + 'p2_p24.png',
        cdnPrev + 'p2_p25.png',
        cdnPrev + 'p2_p26.png',
        cdnPrev + 'p2_p27.png',
        cdnPrev + 'p2_p28.png',
        cdnPrev + 'p2_p29.png',
        cdnPrev + 'p3_01.png',
        cdnPrev + 'p3_02.png',
        cdnPrev + 'p3_03.png',
        cdnPrev + 'p3_04.png',
        cdnPrev + 'p3_05.png',
        cdnPrev + 'p3_06.png',
        cdnPrev + 'p3_07.png',
        cdnPrev + 'p3_08.png',
        cdnPrev + 'p4_01.png',
        cdnPrev + 'p4_02.png',
        cdnPrev + 'p4_03.png',
        cdnPrev + 'p4_04.png',
        cdnPrev + 'p4_05.png',
        cdnPrev + 'p4_06.png',
        cdnPrev + 'p4_07.png',
        cdnPrev + 'p4_08.png',
        cdnPrev + 'p4_09.png',
        cdnPrev + 'p4_10.png',
        cdnPrev + 'p4_11.png',
        cdnPrev + 'p4_12.jpg',
        cdnPrev + 'p4_13.png',
        cdnPrev + 'p4_ts01.png',
        cdnPrev + 'p4_ts02.png',
        cdnPrev + 'p4_bg.jpg',
        cdnPrev + 'p5_01.png',
        cdnPrev + 'p5_02.png',
        cdnPrev + 'p5_03.png',
        cdnPrev + 'p5_04.png',
        cdnPrev + 'p5_05.png',
        cdnPrev + 'p5_06.png',
        cdnPrev + 'p5_07.png',
        cdnPrev + 'p5_08.png',
        cdnPrev + 'p5_09.png',
        cdnPrev + 'p5_10.png',
        cdnPrev + 'ps_01.png',
        cdnPrev + 'ps_bg.jpg',
    ];
    _loadImages(pics, function(){
        // console.log('加载完毕...');
        $('.loading').fadeOut(300);

        // 如果有OPENID 直接播放音乐
        if( OPENID ){
            autoPlayMusic();
        }else{
            $('.page1').fadeIn(300);
            videoLoad();

            // 测试用
            // $('.page2').fadeIn(300);
            // $('.page2').addClass('page-ani');
            // p2Person();
        }
    });

    //视频加载
    function videoLoad () {
        $('.videobox').css({
            'width': 360 + 'px',
            'height': 868 + 'px',
            'position': 'absolute',
            'left': '50%',
            'top': '50%',
            'margin-left': '-180px',
            'margin-top': '-434px',
            'transform-origin': 'center center',
            'transform': 'scale('+scaleSize+')'
        });
        video.play();
        $('.page1').on('touchstart', function() { 
            if(!isend){
                video.play(); 
                return false;
            } 
        });        
        if (_isAndroid()) {
            $('#playVideo').fadeIn();
            $('body').addClass('android');
        }
    }
    
    if( !OPENID ){
        //首页视频部分
        document.addEventListener("WeixinJSBridgeReady", function () {
            autoPlayMusic();
            //微信就绪视频即播放
            video.play();
        }, false);
    }
    $('#playVideo').on('click',function(){
        video.play();
        isend = true;
        $(this).fadeOut();
        return false;
    });

    /** page2 start **/ 
    //报名参赛
    $('#p2_btn').on('click',function(){
        $('.page2').fadeOut(300);
        $('.page3').fadeIn(300).addClass('page-ani');
    });
    /** page2 end **/


    /** page3 start **/
    //把生成的图片上传给后端拿用户信息
    var getNumAndRank = function (person_num, person_img) {
        var form = new FormData();
        form.append("openid", wxInfo.openid);
        form.append("headimgurl", wxInfo.headimgurl);
        form.append("number", person_num);
        form.append("picture", person_img);
        form.append("nickname", $('#name').val());
        form.append("location", $('#address').val());

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": ajaxURL+"/api/users/records",
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Cache-Control": "no-cache",
                "Postman-Token": "bf950a50-228b-4cb9-8ff8-b9d3078030b1"
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }

        $.ajax(settings).done(function (data) {
            $.closeTip();
            var data = JSON.parse(data);
            if (data.status == 200) {
                var data = data.data;

                //获取openid拼接到url里面
                var openid = data.openid;
                var url = '';
                if( window.location.href.indexOf('?') != -1 ){
                    url = window.location.href.split('?')[0];
                }else{
                    url = window.location.href;
                }
                var openidUrl = url+'?openid='+openid+'&personNum='+person_num;
                
                //如果已经存在二维码才执行该函数
                var hasQrCode = function(){
                    $('.page4').fadeIn(300).addClass('page-ani');
                    $('.page-clip').fadeOut(50);
                    $('#upFile')[0].value = '';
                    //页面需要显示的内容
                    $('#clipPic').attr('src', person_img);
                    $('.nameText').html($('#name').val());
                    $('.addressText').html($('#address').val());
                    $('.p4ic05-ltgt').hide();
                    //50以内有不一样的文案        
                    if( person_num > 50 ){
                        $('.people-text').html('和TA拍到的<span><i class="peopleNum">'+person_num+'</i>个脑袋</span>');
                        $('.people-text2').html('拍到了<span class="peopleNum">'+person_num+'</span>个有缘人的脑袋');

                        $('.p4ic05-gt').show();
                    }else{
                        $('.people-text').html('和TA拍到的不到50个有缘人');
                        $('.people-text2').html('拍到了不到50个有缘人的脑袋');

                        $('.p4ic05-lt').show();
                    }

                    $('.ranking').html(data.rank);
                    $('.beyond').html(data.total-data.rank);//超越人数
                    createSharePic({
                        arg1: person_img,
                        arg2: wxInfo.headimgurl ,
                        arg3: [ $('#name').val() , $('#address').val() , person_num , data.rank , data.total-data.rank ]
                    });
                    //并设置结果页文案
                    resultText(openid, person_num);
                }

                // 如果存在就不再去生成了
                if( $('#qrcode img').get(0) ){
                    hasQrCode();                    
                    return;
                }

                var qrcode = new QRCode('qrcode', {
                    text: openidUrl,
                    width: 92,
                    height: 92,
                    colorDark : '#000000',
                    colorLight : '#ffffff'
                });

                var timer = setInterval(function(){
                    if( $('#qrcode img').get(0) ){
                        hasQrCode();
                        clearInterval(timer);
                    }
                },100);
            } else {
                $.alertTip(data.message);
            }
        });

    }

    $('#clipArea').height($(window).height() - $('.pc-btn').height());
    // 图片截取
    new PhotoClip('#clipArea', {
        size: [460 / 1.7, 460 / 1.7],
        outputSize: [460, 460],
        file: '#upFile',
        ok: '#clipBtn',
        lrzOption:{
            // quality:0.1
        },
        loadStart: function () {
            $.showTip('加载中，请稍后...');
        },
        loadComplete: function () {
            $('.page3').fadeOut(300);
            $('.page-clip').fadeIn(300);
            $.closeTip();
        },
        done: function (dataURL) {

            // 调检测人流量统计
            $.showTip('上传中，请稍后...');
            $.post(ajaxURL + '/api/aibaidu/body/num', {
                image: dataURL.toString().split(',')[1]
            }).success(function (data) {
                if (data.status == 200 ){
                    var data = data.data;
                    //等待转换的图片加载完才传给后端
                    var img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = data.uri.replace('img.xhangjia.com','xhangjia.oss-cn-shenzhen.aliyuncs.com');
                    img.onload = function(){
                        getNumAndRank(data.person_num, this.src);
                    }
                }else{
                    $.alertTip(data.message);
                }
            });
        },
        fail: function (msg) {
            $.alertTip(msg);
        }
    });
    //截取图片取消
    $('#cancelBtn').on('click',function(){
        $('#upFile')[0].value = '';
        $('.page-clip').fadeOut(300);
        $('.page3').fadeIn(300);
    });

    //上传照片
    $('#p3_btn').on('click',function(){
        var nameVal = $('#name').val();
        var addressVal = $('#address').val();
        //不能为空
        if ( !nameVal || !addressVal ){
            $.alertTip('姓名和拍摄地点不能为空哦');
            return;
        }
        //反黄判断
        if( $.inArray( nameVal, KEYWORDS ) != -1 ){
            $.alertTip('姓名不能输入敏感文字哦');
            return;
        }
        if( $.inArray( addressVal, KEYWORDS ) != -1 ){
            $.alertTip('拍摄地点不能输入敏感文字哦');
            return;
        }
        $('#upFile').click();        
    });
    /** page3 end **/



    /** page4 start **/
    //图片预览
    initPhotoSwipeFromDOM('.photoswipe');

    //再拍一次
    $('#p4_btn1').on('click',function(){
        $('.page3').fadeIn(300);
        $('.page3').addClass('page-ani');
        $('.page4').removeClass('page-ani');
    });

    //小贴士
    $('#p4_btn4').on('click',function(){
        $('.ts-page').fadeIn(300);
    });
    $('.ts-icon').on('click',function(){
        $('.ts-page').fadeOut(300);
    });

    //排行榜
    $('#p4_btn2').on('click',function(){
        $('.page4').fadeOut(300);
        $('.page5').fadeIn(300).addClass('page-ani');
        getUserList('.p5ic-c1','.p5icc-list1');
    });
    /** page4 end **/


    /** page5 start **/
    //回看结果
    $('#p5_btn1').on('click',function(){
        $('.page4').fadeIn(300);
    });
    //四处秀榜
    $('#p5_btn2').on('click',function(){
        $('.share-page').fadeIn(300);
    });
    $('.share-page').on('click',function(){
        $('.share-page').fadeOut(300);
    });
    /** page5 end **/

    /** page6 start **/
    $('#p5_btn4').on('click',function(){
        $('.page1').fadeIn(300);
        videoLoad();
        $('#playVideo').hide();
        $('.page6').fadeOut(200);
    });
    /** page6 end **/


    

    // 音乐自动播放
    var music = document.getElementById("Music");
    // 音乐播放
    function autoPlayMusic() {
        // 自动播放音乐效果，解决浏览器或者APP自动播放问题
        function musicInBrowserHandler() {
            musicPlay(true);
            document.body.removeEventListener('touchstart', musicInBrowserHandler);
        }
        document.body.addEventListener('touchstart', musicInBrowserHandler);
        // 自动播放音乐效果，解决微信自动播放问题
        function musicInWeixinHandler() {
            musicPlay(true);
            document.addEventListener("WeixinJSBridgeReady", function () {
                musicPlay(true);
            }, false);
            document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
        }
        document.addEventListener('DOMContentLoaded', musicInWeixinHandler);
        musicInBrowserHandler();
        musicInWeixinHandler();
    }
    function musicPlay(isPlay) {
        if (isPlay && music.paused) {
            music.play();
        }
        if (!isPlay && !music.paused) {
            music.pause();
        }
    }
    //因为加了视频，需要点击一下触发音频播放
    $('.page2 , #video_jump').on('click',function(){
        console.log('触发ios播放音频');
        musicPlay(true);
    });
    
    //音乐播放与关闭
    $(".music_icon").on("touchstart", function () {
        if ($(this).hasClass("mute")) {
            $(this).removeClass("mute");
            music.play();
        } else {
            $(this).addClass("mute");
            music.pause();
        }
        return false;
    });


}




$(function() {



    // 测试数据
    var wxInfo = {
        "openid": "o47Fa0mp9SRTf3eiKmqWm69BjG_8",
        "nickname": "齐齐",
        "sex": 0,
        "language": "zh_CN",
        "city": "梅州",
        "province": "广东",
        "country": "CN",
        "headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eosQg0XAQxOgzO02ap9KjlxOuzJVs4u4E8c8cRpuiawuH2uQcc33TTXjlrDgSA9pMxxha9csjc6piaQ/132",
        "privilege": []
    };
    allStartFun(wxInfo);
    return;


    // // 获取微信用户信息
    // if( OPENID ){
    //     var redirect_uri = 'https://h5.xhangjia.com/2018/09/1809_srtds/index.html?openid='+OPENID+'&personNum='+personNum;
    // }else{
    //     var redirect_uri = 'https://h5.xhangjia.com/2018/09/1809_srtds/index.html';
    // }
    // var oauth2Url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd950f35d1f20806a&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    // if(localStorages.Get("nlpUserInfo")){
    //     var info = JSON.parse(localStorages.Get("nlpUserInfo"));
    //     if(info && info.headimgurl){
    //         allStartFun(info);
    //     }else{
    //         window.location.href = oauth2Url;
    //     }
    // }else{
    //     if (getQueryString("code")) {
    //         var code = getQueryString("code");
    //         $.ajax({
    //             url: 'api/user.php',
    //             type: 'GET',
    //             dataType: 'json',
    //             data: { code: code },
    //             success: function(res) {
    //               if(res.headimgurl){
    //                 localStorages.Set("nlpUserInfo",JSON.stringify(res));
    //                 allStartFun(res);
    //               }else{
    //                 window.location.href = oauth2Url;
    //               }
    //             }                
    //         });
    //     }else{
    //       var info = JSON.parse(localStorages.Get("nlpUserInfo"));
    //       if(info && info.headimgurl){
    //         allStartFun(info);
    //       }else{
    //         window.location.href = oauth2Url;
    //       }
    //     }
    // }


});




