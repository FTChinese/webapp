//申明各种Global变量
var _currentVersion = 1150; //当前的版本号
var _localStorage = 0;
var exp_times = Math.round(new Date().getTime() / 1000) + 86400;
var username;
var ori;
var touchstartx;
var touchendx;
var cs;
var lateststory = '';
var pmessage;
var latestunix;
var commentfolder = '';
var bgMode = '';
var fontPreference = 'medium';
var allstories = [];
var osVersion;
var connectInternet = 'no';
var uaString = navigator.userAgent || navigator.vendor || '';
var osVersionMore = '';
var useFTScroller = 0;
var nativeVerticalScroll = false;
var noFixedPosition = 0;
var unusedEntryIndex;
var requestTime;
var successTime;
var screenWidth;
var screenHeight;
var gInGesture = false;
var startFreeze;
var fixedContent;
var headHeight;
var fStatus = 0;
var ftScrollerTop = 0;
var gHomeAPIRequest;
var gHomeAPISuccess;
var gHomeAPIFail;
var gDeviceType = '';
var gStartPageTemplate; 
var gStartPageAPI = true;
var gHomePageStorageKey = 'homePage';
var gNewStoryStorageKey = 'homepage';
var gAppName = 'Web App';
var gStartStatus = "";
var gPullRefresh = false;
var gVerticalScrollOpts;
var gOnlineAPI = false;
var gSpecial = false;
var gDeviceId = "";
var gShowStatusBar = 0;
var gHomePageIsLatest = true; //The latest home page is displayed
var gCurrentStoryId = '';
var gNoticeAdded = false;
var gStartPageStorage = '';
var cg1 = '(not set)';
var gPrefix = {};//存储有关浏览器css前缀的变量
// test the home page with a different html template
var homeFileName = (window.location.href.indexOf('nexthometest') >= 0) ? 'nexthometest': 'nexthome';
var fullScreenAdPara = (window.location.href.indexOf('useNativeLaunchAd') >= 0 && Math.random() < 0) ? '&noFullScreenAd': '';


//开机的时候检查屏幕宽度，以便节约流量
//我们的基本假设是，不管横屏还是竖屏，只要宽度小于700，那就是手机；否则就是平板
//为了减少资源消耗，在屏幕Resize和Rotate的时候，只是向GA发出流量统计数据，而不做可能消耗资源的操作
screenWidth = $(window).width();
screenHeight = $(window).height();

if (screenWidth >= 700) {
    gStartPageTemplate = '/index.php/ft/channel/phonetemplate.html?channel='+homeFileName+fullScreenAdPara+'&screentype=wide&';
} else {
    gStartPageTemplate = '/index.php/ft/channel/phonetemplate.html?channel='+homeFileName+fullScreenAdPara+'&';
}
// console.log (gStartPageTemplate);

var gApiUrl = {
    //'a10001':'',
    'efforts':0,
    'a10001':'/index.php/jsapi/get_new_story?rows=25&',
    //'a10001':'/m/new_story.json',
    'a10003':'/eaclient/apijson.php',
    'a10007':'/eaclient/apijson.php',
    'aBackUp':'/eaclient/apijson.php'
};
var gPostMethod='POST';
var gApi001Method = 'GET';
var gHomePageVideo = '/index.php/ft/channel/phonetemplate.html?channel=homepagevideo&';
var gSkyZ = '/index.php/ft/channel/phonetemplate.html?channel=skyZ&';
var giPadVideo = '/index.php/ft/channel/ipadvideo.html?';
var gGetLastUpdateTime = '/index.php/jsapi/get_last_updatetime?';
var gHotStory = '/index.php/jsapi/hotstory/1days?';
var gWebRoot = '';
var gIconImage = 'http://i.ftimg.net/picture/8/000045768_piclink.jpg';
var gSpecialAnchors = [];
var gTagData = [];
var gIsInSWIFT = false;

if (window.location.href.indexOf('isInSWIFT')>=0) {
    gIsInSWIFT = true;
}
//在本地测试
if (window.location.hostname === 'localhost' || window.location.hostname.indexOf('192.168') === 0 || window.location.hostname.indexOf('10.113') === 0 || window.location.hostname.indexOf('127.0') === 0) {
    gApiUrl.a10001 = 'api/ea001.json';
    gApiUrl.a10003 = 'api/ea003.json';
    gApiUrl.a10007 = 'api/ea007.json';
    gApiUrl.aBackUp = 'api/ea001-backup.json';
    gPostMethod = 'GET';
    gHomePageVideo = 'api/homepagevideo.tpl?';
    gSkyZ = 'api/skyZ.tpl?';
    giPadVideo = 'api/ipadvideo.tpl?';
    gGetLastUpdateTime = 'api/get_last_updatetime.json?';
    gHotStory = 'api/hotstory.json?';
    gWebRoot = 'http://m.ftchinese.com';
    if (screenWidth >= 700) {
        gStartPageTemplate = 'api/homecontentwide.html?';
    } else {
        gStartPageTemplate = 'api/homecontent.html?';
    }
}

//选择模板
if (typeof window.gCustom === "object") {
    if (typeof window.gCustom.template === "string") {
        gStartPageTemplate = window.gCustom.template;
    }
    if (typeof window.gCustom.startapi === "boolean") {
        gStartPageAPI = window.gCustom.startapi;
    }
    if (typeof window.gCustom.appname === "string") {
        gAppName = window.gCustom.appname;
    }
    if (typeof window.gCustom.homePageStorageKey === "string") {
        gHomePageStorageKey = window.gCustom.homePageStorageKey;
    }
    if (typeof window.gCustom.newStoryStorageKey === "string") {
        gNewStoryStorageKey = window.gCustom.newStoryStorageKey;
    }
    if (typeof window.gCustom.pullRefresh === "boolean" && window.gCustom.pullRefresh === true) {
        gPullRefresh = true;
    }
}

gVerticalScrollOpts = {
    scrollingX: false,
    bouncing:gPullRefresh,
    snapping: false,
    scrollbars: true,
    scrollBoundary: 8,
    updateOnChanges: true,
    updateOnWindowResize: true,
    windowScrollingActiveFlag: "gFTScrollerActive"
};

//gNowView是指目前显示的Div，可能为fullbody, storyview, adview或channel
var scrollHeight=0, scrollOverlay=0, readingid, langmode="ch", hist = [], pageStarted=0;
var thisday;
var thed;
var themi;
var thed;
var gNowView = 'fullbody';
 

var sectionScroller, theScroller, storyScroller, channelScroller, thenavScroller, shareScroller, introScroller, sectionScrollerX=0;
//长假的时候上特刊，请注意下面的代码中月份要减去一个，比如2012年10月1日，是20120901，然后查找get_story_by_tag那一行，进行下一步修改
var longholiday = 0;
//if (thed >= '20130109' && thed <= '20130112') {longholiday = 1};

var thisdayunix; //今天的Unix时间戳
var expiredayunix; //3 * 30 * 24 * 60 * 60; //本地存储过期日(三个月)的unix时间戳

//把所有的Ajax requests都放在一个数组里面，如果因为网络不好，用户要求直接转到离线阅读，则立即abort所有requests
var requests = [], countInsert=[];
//网页的地址
var gAppRoot=window.location.href;
var _popstate=1;//如果是点击浏览器的前进后退按钮，则为1
gAppRoot=gAppRoot.replace(/^.*\.com\//g,"").replace(/(\.html).*$/g,"$1").replace(/(\.php).*$/g,"$1").replace(/\#.*$/g,'');


//如果是在阅读过程中因为点击广告等原因离开Web App，则在10分钟内重新打开程序，立即回到刚刚在读的文章
var actionTimeStamp;
var actionUrl="";
var actionScroll=0;

//如果网址中有wechatShare，则强制调用iOS原生SDK分享
var iOSShareWechat = 0;
if (JSON.parse) {$.parseJSON = JSON.parse;}




//functions
function updateTimeStamp() {
    thisday = new Date();
    themi = thisday.getHours() * 10000 + thisday.getMinutes() * 100;
    thed = thisday.getFullYear() * 10000 + thisday.getMonth() * 100 + thisday.getDate();
    themi=thed*1000000+themi;
    thisdayunix = Math.round(thisday.getTime() / 1000);
    expiredayunix = thisdayunix + 7776000;
    actionTimeStamp=Math.round(thisday.getTime() / 1000);
}

//Start the App
function startpage() {
    var savedhomepage;
    updateTimeStamp();
    gStartStatus = "startpage start";
    try {
        updateStartStatus('running startpage');
    } catch (ignore) {

    }
    var k;
    var oneday = '';
    var ccode = getpvalue(window.location.href,"utm_campaign") || "";
    if (ccode !== "") {
        setCookie("ccode", ccode, '', '/', '.ftchinese.com');
    }
    username = getCookie('USER_NAME') || '';
    langmode = getCookie('langmode') || 'ch';
    if (historyAPI()==true) {
        k=location.href;
        window.history.replaceState(null, null, gAppRoot + "#/home");
        window.history.pushState(null, null, k);
    }
    try {
        window.tracker = new FTCTracker();
        //console.log (tracker);
    }catch(err){
        //console.log (err);
        trackErr(err, "FTCTracker");
    }
    if (useFTScroller===0) {window.scrollTo(0, 0);}
    //从网络获取数据的情况，判断其网络连接的好坏

    try {
        ipadstorage.init();
    } catch(err) {
        trackErr(err, "ipadStorage");
    }
    document.body.className = 'fullbody';
    gNowView = 'fullbody';
    try {
        gStartPageStorage = localStorage.getItem(gHomePageStorageKey) || '';
        _localStorage=1;
        //loadFromLocalStorage(gStartPageStorage);
    } catch (err) {
        gStartPageStorage = "";
        _localStorage=0;
    }
    if (isOnline() === 'no' && gStartPageStorage === '') {
        $('#startstatus').html('您没有联网');
        setTimeout(function(){
            loadHomePage('start');
        },2000);
    } else {
        loadHomePage('start');
    }
    //if user use wifi, download the latest 25 stories
    if (window.gConnectionType !== 'data' && window.gConnectionType !== 'no') {
        setTimeout(function () {
            downloadStories('start');
        }, 1000);
    }

    try{
        if (_localStorage===1 && localStorage.getItem(gNewStoryStorageKey)) {
            savedhomepage = localStorage.getItem(gNewStoryStorageKey);
            loadStoryData(savedhomepage);
        }
    } catch (ignore) {
        
    }

    requestTime = new Date().getTime();
    //gStartStatus = "startpage get_last_updatetime";
    $.get(gGetLastUpdateTime + requestTime, function(data) {
        lateststory = data;
    });
    setInterval(function() {
        requestTime = new Date().getTime();
        $.get(gGetLastUpdateTime + requestTime, function(data) {
            if (lateststory !== data) {
                loadHomePage('refresh');
                if (window.gConnectionType !== 'data' && window.gConnectionType !== 'no') {
                    downloadStories('refresh');
                }
            }
            lateststory = data;
            connectInternet="yes";
            setTimeout(function(){
                connectInternet="unknown";
            },299000);
        });
        checkbreakingnews();
    },100000);
    if (isOnline()=="possible") {checkbreakingnews();}

    autoPrefix();
    
    if(osVersion.indexOf("Android")<0){
         initSwipeGesture();
    }
   
    //Delegate Click Events for Any New Development
    //gStartStatus = "startpage inline-video-container";
    $('body').on('click','.inline-video-container',function(){
        var videoId = $(this).attr('video-url') || $(this).attr('id') || $(this).attr('vsource') || '';
        var videoTitle = $(this).attr('title') || '视频';
        var cmsId = $(this).attr('vid') || '';
        var cmsImage = $(this).attr('image') || gIconImage;
        if (videoId!=='') {
            if (videoId.indexOf('http')<0 && videoId.indexOf('/')>=0) {
                videoId = 'http://v.ftimg.net/' + videoId;
            }
            watchVideo(videoId, videoTitle, cmsId, videoTitle, cmsImage);
        }
    });
    $('body').on('click', '.outbound-link', function(){
        ga('send','event','Outbound Link in App', 'click', $(this).attr('href') + '/' + window.location.href);
    });
    $('body').on('click', '.iap-channel', function(){
        var iapAction = $(this).attr('iap-action');
        var iapTitle = $(this).attr('iap-title') || $(this).html() || 'FT中文网';
        if (iapAction) {
            displayProducts(window.iapProducts, iapAction, iapTitle);
        }
    });
    /*
    $('body').on('click', '.iap-item', function(){
        var productId = this.getAttribute('product-id') || '';
        showProductDetail(productId);



        // var targetTag = e.target.tagName.toLowerCase();
        // var targetClassName = e.target.className;
        // if (targetTag !== 'button' || targetClassName.indexOf('iap-detail')>=0) {
        //     // MARK: - open detail for iap
        //     //var productId = this.getAttribute('product-id') || '';
        //     //showProductDetail(productId);
        // }
    });
    */
    //openning a page in an iframe is not viable for now in iPhone native app
    /*
    $('body').on('click', '#special-container a, .open-in-iframe', function(){
        var url = $(this).attr('href');
        var title = $(this).find('.headline').eq(0).html() || '';
        var lead = $(this).find('.lead').eq(0).html();
        showchannel(url,title,0,true,lead);
        //showSlide(url,title,0, 'interactive', true);
        return false;
    });
    */
    //click navOverlay to close navigation
    $('body').on('click', '#navOverlay', function(e){
        var k = e.target.id;
        if (typeof k !== 'undefined' && k === 'navOverlay') {
            closeOverlay();
            $(".channelNavButton").removeClass("open");
        }
    });
    //gStartStatus = "startpage end";
    //Delegate Click on Home Page
    $("body").on("click",".track-click",function(){
        var eventCategory,eventAction,eventLabel;
        eventCategory = "Phone App";
        eventAction = "Click";
        eventLabel = $(this).attr("eventLabel") || "";
        if (eventLabel !== "") {
            ga('send','event',eventCategory, eventAction, eventLabel);
        }
    });
    
    //Window Oriention Change event
    try {
    window.addEventListener("orientationchange", function() {
        httpspv(gDeviceType + '/rotate');
    }, false);
    }catch(ignore){

    }
    
    if (gShowStatusBar == 1) {
        $("html").addClass("show-status-bar");
    }

    // if it's a native iOS app, the app should not display pop up ad
    // if (gIsInSWIFT === true) {
    //     $('#pop-ad').addClass('done');
    //     console.log ('no pop up ad');
    // }
}

function loadFromLocalStorage(startpageStorage) {
    $('#homecontent').html(startpageStorage);
}

/*not working
function removeStartCover() {
    if (location.href.indexOf("-2014.html")>=0 && osVersion.indexOf("ios")>=0) {
        if ($("#remove-cover").length === 0) {
            $("body").append("<div id=remove-cover></div>");
            $("#remove-cover").html("<iframe frameborder=0  marginheight=0 marginwidth=0 frameborder=0 scrolling=no width=1 height=1 src=/m/204.php?iOSAppIsLoaded></iframe>");
        }
    }
}
*/

function fillContent(loadType) {
    //gStartStatus = "fillContent start";
    var ua=navigator.userAgent || navigator.vendor || "";
    var searchnote = '输入关键字查找文章';
    var mpdata;
    var hcdata;
    var message = {};
    var hashURI = location.hash || "";
    var _channel_name;
    var _channel_title;
    var theTimeStamp = new Date();
    var lastActionTime;
    var thestoryId;
    var parts;
    filloneday('');
    $('.closestory,.back,.backbutton').unbind().bind('click',function() {histback();});
	
    //广告点击打开iframe
    adclick();

    //从广告返回主页或文章页
    $('.adback').click(function() { closead();});

    //频道页和其他直接载入HTML的页面
    $('.channel').unbind().bind("click",function() {
        pageStarted=1;
        _popstate=0;
        showchannel($(this).attr('url'), $(this).html(), ($(this).hasClass('require-log-in') == true) ? 1 : 0);
    });


    //进入其他Webapp // each(function() {$(this)
    $('.webapp').click(function() { gotowebapp($(this).attr('url'));});

    //导航栏标红首页
    $('.navigation .home').addClass('on');
    
    //首页滑动处理
    setTimeout(function(){addHomeScroller();},10);
    
    //导航栏滑动处理
    navScroller($("#fullbody"));
    
    //文章页不能默认上下
    if (useFTScroller==1 && nativeVerticalScroll === false) {
        document.getElementById('fullbodycontainer').addEventListener('touchmove', function(e) {
            e.preventDefault();
        });
    } else if (nativeVerticalScroll === true) {
        document.getElementById('contentRail').addEventListener('touchmove', function(e) {
            e.preventDefault();
        }); 
    }


    //给用户的提示
    if (!!pmessage) {$('.bodynote').append(pmessage);} else {$('.bodynote').hide();}
    $('#searchtxt').val(searchnote);
    $('#searchtxt').focus(function() {
        var it = $(this);
        it.css('color', '#000');
        if (it.val() == searchnote) {
            it.val('');
        }  
    });

    $('#searchtxt').blur(function() {
        var it = $(this);
        it.css('color', '#666');
        if (it.val() == '') {
            it.val(searchnote);
        }
    });

    //是否已经登陆
    checkLogin();

    //读者发表评论
    $('#addnewcomment').click(function() {
        var usenickname = $('#name').attr('checked') == true ? 1 : 0;
        $(this).attr('value', '正在发布中...');
        $(this).attr('disabled', true);
        $.ajax({
            type: 'POST',
            url: commentfolder + '/add',
            data: {storyid: $('#cstoryid').val(), talk: $('#Talk').val(), use_nickname: usenickname, NickName: $('#nick_name').val()+osVersionMore} ,
            success: function(data) {
                if (data != 'yes') {
                    alert('抱歉,现在我们的网站可能出现了一些小故障.您的留言可能没有发表成功,请您稍后再重新尝试发表一次。');
                    return;
                }
                alert('感谢您的参与，您的评论内容已经发表成功。审核后就会立即显示!');
                $('#addnewcomment').val('提交评论').attr('disabled', false);
                $('#Talk').val('');
            },
            error: function() {
                alert('很抱歉。由于您与 FT 网络之间的连接发生故障,发表评论失败. 请稍后再重新尝试提交.');
                $('#addnewcomment').attr('value', '提交评论').attr('disabled', false);
                return;
            }
        });

    });

    //查看旧刊的日历
    
    if (typeof loadType === 'string' && /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/i.test(loadType)) {
        //var parts ='04/03/2014'.split('/');
        parts = loadType.split('-');
        thisday = new Date(parts[0],parts[1]-1,parts[2]); 
        //thisday = new Date(loadType);
        //$('#o-connection-status').html(loadType);
    } else {
        thisday = new Date();
    }
    updatecalendar(thisday, 0);
    //如果是iPhone上的Mobile Safari打开，则显示添加到主屏幕的提示
    if (_localStorage==0) {
        turnonOverlay('storageSetting');
    } else if (/safari/i.test(ua) && /ios/i.test(osVersion) && iOSShareWechat===0) {
        turnonOverlay('addHome');
    } else if (/baidu|micromessenger/i.test(ua)) {
        turnonOverlay('downloadNative');
    } else if ((ua.indexOf('Android 2') !== -1 || ua.indexOf('Android 3') !== -1) && (getvalue('yourDevice')==null)) {//如果是比较老的安卓手机，则提示用旧版程序或手机站     
        turnonOverlay('yourDevice');
        savevalue('yourDevice',1);
    }


    if (historyAPI()==true) {
        window.addEventListener("popstate", function() {
            
            //alert ('_popstate: ' + _popstate + "; pageStarted: " + pageStarted +  ' url: ' + location.href);
            
            if (pageStarted === 1) {
                _popstate=1;
                jumpToPage();
            }
            pageStarted=1;
            _popstate=0;
            
        });
    }

    //反馈意见
    $("#homepageEmail").attr("href","mailto:ftchinese.feedback@gmail.com?subject=Feedback about FTC Web App - from home page&body=%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A%0D%0A    ====%0A%0D%0A%0D%0ATechnical information:%0D%0A%0D%0AUser-agent: "+ua+"%0D%0A%0D%0AResources version: "+_currentVersion+"%0D%0A%0D%0AScreen Mode: "+$(window).width()+"X"+$(window).height()+"%0D%0A%0D%0Amy URL: " + location.href);
    
    //点击设置的背景则关闭设置菜单
    $(".overlay").unbind().bind("click",function(e){
        //console.log ($(this).attr('class'));
        if ($(this).hasClass("always-on")===true) {
            return false;
        }
       	if (/\b(cell)\b/.test(e.target.className)) {
            if ($(this).hasClass('close-self-only')===true) {
                $(this).removeClass('on');
            } else {
                closeOverlay();
            }
        }
    });

    //获取读者的字号偏好
	if (getvalue("fontPreference") && getvalue("fontPreference")!=null && getvalue("fontPreference")!="") {
		fontPreference=getvalue("fontPreference");
	}
	$("#fullbodycontainer").attr("class",fontPreference);
	$(".fontpreferences div").unbind().bind("click",function(){
		$(".fontpreferences div").removeClass("-selected");
		$(this).addClass("-selected");
		fontPreference=$(this).attr("id");
	});
	$(".fontpreferences div").removeClass("-selected");
	$(".fontpreferences ."+fontPreference).addClass("-selected");
    $("#currentFont").html($("#"+fontPreference).html());

    //获取读者对背景色的偏好
    if (getvalue("bgMode") && getvalue("bgMode")!=null && getvalue("bgMode")!="") {
        bgMode=getvalue("bgMode");
        if (bgMode==null || bgMode=="") {
            bgMode="";
        }
		$("html").removeClass("white").removeClass("pink").removeClass("night").addClass(bgMode);
        $("#"+bgMode).addClass("-selected");
	}
    
    if (location.href.indexOf("android")>0) {
        if (gNoticeAdded === false) {
            gNoticeAdded = true;
            $('#setting .nightreading').after('<div class="nightreading notificationOn" id="notification"><strong>通知</strong><span class="displayvalue" onclick="switchNotification()"><span class="ui-toggle"><span class="ui-toggle-button2"></span><span class="ui-toggle-label ui-toggle-label-on">开</span><span class="ui-toggle-label ui-toggle-label-off">关</span></span></span></div>');
        }
        $('#setting .description').remove();
        if (window.ftjavacriptapp !== undefined) {
            if (ftjavacriptapp.is_push()=='0') {
                ftjavacriptapp.set_push('0');
                $("#notification").addClass('notificationOn');
            } else {
                ftjavacriptapp.set_push('1');
                $("#notification").removeClass('notificationOn');
            }
        }
    }
    //点击文章页底部可以翻页
    //This is potentially confusing to users, turn it off
    //It also increases the chance of triggering Apple's Webkit bug
    //WebKit: -[WKContentView(WKInteraction) _addShortcut:] + 336

    // $("#storyScroller").unbind().bind("click",function(e){
    //     var k=e.clientY, h, x=e.clientX, w=$(window).width(), doScroll=0;
    //     h = (typeof storyScroller === 'object' && useFTScroller === 1) ? $(this).innerHeight() : $(window).height()-45;
    //     if (k>0 && h>50 && (typeof storyScroller === 'object' || useFTScroller===0 || nativeVerticalScroll === true)) {
    //         if (k/h>0.8) {
    //             h=h-40;
    //             doScroll=1;
    //         } else if (k/h<0.2) {
    //             h=-h+40;
    //             doScroll=1;
    //         } else if (x/w<0.2 && !/\b(link)\b/.test(e.target.className) && noFixedPosition==1) {
    //             histback();
    //             return false;
    //         }
    //         //alert (k + "/" + h + "/" + doScroll);
    //         if (doScroll===1) {
    //             if (useFTScroller===1) {
    //                 if (nativeVerticalScroll === true) {
    //                     $('#storyScroller').animate({ scrollTop: this.scrollTop + h }, '500');
    //                 } else {
    //                     storyScroller.scrollBy(0,h,500);    
    //                 }
    //             } else {
    //                 $('html,body').animate({ scrollTop: window.pageYOffset + h }, '300');
    //             }
    //         }
    //     }
    // });
    
    //如果不是原生应用，隐藏到App Store的链接
    if (location.href.indexOf("phoneapp.html")<0 || osVersion.indexOf("ios")<0) {
        $(".nativeButton").hide();
    }
	
	//点击分享文本框全选
	$('input[type="text"].paste,textarea.paste').off().on('keypress focus click',function(){
        var l=$(this).val().length;
        if (l<1) {l=1;}
		$(this).get(0).selectionStart=0;
		$(this).get(0).selectionEnd=l;
        if ($(this).attr("id")=="shareMobile") {
            $("#openWeChat").show();
        }
        if (osVersion.indexOf("ios")<0){
            $("#openWeChat").removeAttr("class").removeAttr("href");
        }
	});

    //热门文章
    if (isOnline()=="no" && _localStorage===1) {        
        mpdata = getvalue('smostpopular');
        fillArticles(mpdata, 'popoular');
        hcdata = getvalue('mostcomment');
        fillArticles(hcdata, 'comment');
    }else{
        //十大热门文章
        $.get(gHotStory + themi, function(data) {
            fillArticles(data, 'popoular');
            try {
                localStorage.removeItem('smostpopular');
                saveLocalStorage('smostpopular', data);
            } catch (ignore) {
            
            }
        });
        message.head = {};
        // 评论最多文章
        message.head.transactiontype = '10003';
        message.head.source = 'web';
        message.body = {};
        message.body.ielement = {};
        message.body.ielement.days = 7;

        $.ajax({
            method: gPostMethod,
            url: gApiUrl.a10003,
            data: JSON.stringify(message),
            dataType: "json"
        }).done(function(data, textStatus) {
            if (textStatus == 'success' && data.body.oelement.errorcode === 0) {
                var hotdata = JSON.stringify(data.body.odatalist);
                fillArticles(data.body.odatalist, 'comment');
                localStorage.removeItem('mostcomment');
                saveLocalStorage('mostcomment', hotdata);
            }
        }).fail(function(jqXHR){
            trackErr(message.head.transactiontype, "Most Commented");
        });
    }
    
    //点击刷新
    // $(".loadingStory").unbind().bind("click",function(){
    //     refresh();
    // });

    //iOS原生应用分享功能
    if (gIsInSWIFT === true) {
        $('#shareButton, #shareButton2').attr('onclick','').wrap('<a id="iOSAction"></a>');
        $('#video-share').attr('onclick','').wrap('<a id="iOS-video-action"></a>');
    }

    //跳到页面
    if (hashURI.indexOf("story/")>=0) {
        pageStarted=1;
        _popstate=0;
        readstory(hashURI.replace(/^.*story\//g, ""));
    } else if (hashURI.indexOf("channel/")>0) {
        _popstate=0;
        _channel_name = hashURI.slice(1).replace("channel/", "").replace(/&title=.*$/g,"").replace(/\/+/g,"/");
        _channel_title= decodeURIComponent(getpvalue(hashURI,"title"));
        if (_channel_title=="") {_channel_title="FT中文网";}
        showchannel (_channel_name,_channel_title);
    } else {        
        actionTimeStamp=Math.round(theTimeStamp.getTime() / 1000);
        lastActionTime=getvalue("actionTimeStamp") || 0;
        lastActionTime=parseInt(lastActionTime,10);
        actionUrl=getvalue("actionUrl") || "";
        if (lastActionTime!="" && lastActionTime!=0 && actionTimeStamp-lastActionTime<10*60 && actionUrl.indexOf("storypage/")>=0) {
            savevalue("actionUrl","");
            savevalue("actionTimeStamp",actionTimeStamp);
            thestoryId=actionUrl.replace(/^.*storypage\//g, "");
            _popstate=0;
            readstory(thestoryId);
        }
    }
    //设定右栏滚动的上限和下限
    freezeCheck();
    freezeRail();
    //禁止长按按钮弹出默认的选择框
        //禁止长按按钮弹出默认的选择框
    $('#fullbody,#channelview,#contentRail,#navOverlay').disableSelection();
    //gStartStatus = "fillContent end";


    // 特别报导
    // 这段代码直接放到模版里面了
    /*
    gSpecialAnchors = [];
    if ($(".specialanchor").length>0) {
        $('.specialanchor').each(function(){
            var adId = $(this).attr('adid') || '';
            var sTag = $(this).attr('tag') || '';
            var sTitle = $(this).attr('title') || '';
            gSpecialAnchors.push({
                "tag": sTag,
                "title": sTitle,
                "adid": adId
            });
        });
    }
    */
}



function freezeRail() {
    if (screenWidth>=700 && screenHeight>=400 && noFixedPosition===0 && osVersion.indexOf("Android2")<0) {
        if (useFTScroller===0) {
            $(window).unbind("scroll").bind("scroll", function(){
                freezeScroll();
            });
        }
    }
}

function freezeScroll() {
    var wst, wstBottom, fullHeight, fixedHeight, fullBottom, n, f, i, fOverflow, footerShow, fixedContentShow, fBottomShow;
    if (startFreeze < 0 || screenWidth < 700 || screenHeight < 400) {return;}
    if (useFTScroller===0) {
        wst = $(window).scrollTop();
    } else {
        wst = ftScrollerTop;
    }

    
    gNowView = document.body.className;
    n = $("#" + gNowView);
    f = n.find(".fixed-content").eq(0);
    i = document.getElementById(gNowView+"Inner");
    screenHeight = $(window).height();
    fullHeight = n.outerHeight();
    fixedHeight = f.outerHeight();
    wstBottom = wst + screenHeight - startFreeze - fixedHeight; 
    fullBottom = wst + screenHeight - fullHeight; 
    fOverflow = (fixedHeight > screenHeight - 60- headHeight) ? true : false;
    footerShow = (fullBottom > -42) ? true : false; 
    fixedContentShow = (wst > startFreeze - 14) ? true : false; 
    fBottomShow = (wstBottom > 60) ? true : false; 
    if (useFTScroller===0){
        if (fOverflow === true && footerShow === true && fStatus !== 3) {
            fStatus = 3; 
            i.className = "f3 inner";
        } else if (fOverflow === true && footerShow === false && fBottomShow === true && fStatus !== 2) {
            fStatus = 2; 
            i.className = "f2 inner";
        } else if (fOverflow === false && fixedContentShow ===true && fStatus !== 1) {
            fStatus = 1; 
            i.className = "f1 inner";
        } else if ((fixedContentShow === false || fBottomShow === false) && fStatus !== 0) {
            fStatus = 0;
            i.className = "inner";
        }
    } else {
        if (gNowView === "storyview" && document.getElementById("storyviewRail")) {
            if (wstBottom >= fullHeight && fStatus !== 1) {
                fStatus = 1; 
                document.getElementById("storyviewRail").className = "right-rail-fix on";
                i.className = "f1 inner";
            } else if (wstBottom < fullHeight && fStatus !== 0) {
                fStatus = 0;
                document.getElementById("storyviewRail").className = "right-rail-fix";
                i.className = "inner";
            }
        }
    }
    
    //$('#tip').html("wst=" + wst + ", startFreeze = " + startFreeze + ", fixedHeight = " + fixedHeight + ", screenHeight = " + screenHeight + ", wst + screenHeight - startFreeze - fixedHeight = " + wstBottom + ", fullHeight: " + fullHeight + "wst + screenHeight - fullHeight: " + fullBottom + ", headHeight: " + headHeight + ", fStatus: " + fStatus).addClass('on');
}

function freezeCheck() {
    screenHeight = $(window).height();
    screenWidth = $(window).width();
    if (screenWidth>=700 && screenHeight>=400 && noFixedPosition===0 && osVersion.indexOf("Android")<0) {
        var n,c,c1,r,r1;
        gNowView = document.body.className;
        n = $("#" + gNowView).eq(0);
        c = n.find(".fixed-content");
        r = n.find(".layout-a_region-4 .inner");
        r1 = r.eq(0);
        if (c.length>0) {
            c1 = c.eq(0);
            startFreeze = c1.offset().top - n.offset().top;
            headHeight = c1.parent().offset().top;
            if (r.length>0 && c1.outerHeight()>=r1.outerHeight()) {startFreeze = -1;}
            //c1.css({'position':'static'});
            fStatus = 0;
            r1.attr("id",gNowView+"Inner").attr("class","inner");
        } else {
            startFreeze = -1;
            headHeight = 0; 
        }
    }
    if (document.getElementById("storyviewRail")) {document.getElementById("storyviewRail").className = "right-rail-fix";fStatus = 0;}
}



//在获取到当天的文章JSON数据接口后，根据文章的priority，配图情况，以及其他信息，将它们插入到版面中，生成类似报纸的效果
/*
function fillPage(thedata) {
    gStartStatus = "fillPage start";
    //遍历接口的所有文章，根据其属性将其插入相应位置
    var jsondata, cover1 = 0,  todaystamp,  storytotalnum = 0, longheadline, shortheadline, longlead, shortlead, coverImg, cauthor, tag, genre, topic, industry, priority, byline, onhomepage = 0, iconImg, bigButton, portraitImg="", errorMessage="", jsonHeadPosition, jsonWrong, specialTag="", specialTitle="";
    var dataStatus = 'unknown';
    //var backupAPIDate;
    countInsert=[];
    
	//如果返回数据长度不足1000，说明此次返回的数据根本就不对，跳出函数
	if (thedata.length<1000){return;}
    thedata = checkhttps(thedata) || "";
    try {
        jsonHeadPosition = thedata.indexOf('{"head"');
        if (jsonHeadPosition>0) {//如果返回的数据前有服务器返回的乱码（参见jsoneerror.html），则先去除它
            jsonWrong = thedata.substring(0,100);
            thedata = thedata.slice(jsonHeadPosition);
            if (gOnlineAPI === true) {
                trackErr(jsonWrong, "wrong jsondata live");
            } else {
                trackErr(jsonWrong, "wrong jsondata cache");
            }
        }
        jsondata = $.parseJSON(thedata);
    }catch(err){
        thedata = thedata.substring(0,22);
        if (gOnlineAPI === true) {
            trackErr(err + "." + thedata, "fillPage jsondata");
            dataStatus = 'online error';
        } else {
            trackErr(err + "." + thedata, "fillPage jsondata cache");
            dataStatus = 'cache error';
        }
    }


	//清空这个数据
	thedata="";
    thisday = new Date();
	thisdayunix = Math.round(thisday.getTime() / 1000);

    //如果第一次在线获取的数据返回错误
    //则先尝试备份的API
    //再尝试当天文章的API
    if (dataStatus === 'online error') {

        if (gApiUrl.efforts === 0) {
            gApiUrl.efforts = 1;
            gApiUrl.a10001 = gApiUrl.aBackUp;
            //console.log ('try backup api: ' + gApiUrl.efforts);
            filloneday();
        } else if (gApiUrl.efforts === 1){
            gApiUrl.efforts = 2;
            backupAPIDate = thisday.getFullYear() + '/' + (thisday.getMonth() + 1) + '/' + thisday.getDate();
            //console.log (backupAPIDate + ' First API Wrong, you should get the backup one!');
            filloneday(backupAPIDate);
        }
    }

	//检查数据格式是否符合标准
    if (!jsondata || jsondata.length <= 1 || dataStatus === 'error') {
        return;
	}
    
    try {
        if (jsondata.body.odatalist.length>=0) {
            jsondata = jsondata.body.odatalist;
        } else {   
            ga('send','event', 'CatchError', 'API Error', '{errorcode: "' + jsondata.body.oelement.errorcode + '", host: "' + location.host + '"}');
            fa('send','event', 'CatchError', 'API Error', '{errorcode: "' + jsondata.body.oelement.errorcode + '", host: "' + location.host + '"}');
        }
    } catch (ignore) {
        //alert (ignore.toString());
    }

    //根据最新一条新闻的Pubdate确定出版时间
    latestunix = jsondata[0].pubdate;
    todaystamp = unixtochinese(jsondata[0].pubdate, 0);
    todaystamp += ' 出版 | 刷新';
    $('#datestamp').html(todaystamp);
    
    gSpecialAnchors = [];
    if ($(".specialanchor").length>0) {
        $('.specialanchor').each(function(){
            var adId = $(this).attr('adid') || '';
            var sTag = $(this).attr('tag') || '';
            var sTitle = $(this).attr('title') || '';
            gSpecialAnchors.push({
                "tag": sTag,
                "title": sTitle,
                "adid": adId
            });
        });
    }

    // 首页至少要有20篇文章，而且昨天午后出版的文章也要上首页
    $.each(jsondata, function(entryIndex, entry) {
        var inserted = false;
        allstories[entry.id] = entry;
        //60*60*22 = 79200
        if (((entry.last_publish_time && thisdayunix - entry.last_publish_time < 79200) || storytotalnum < 20 || (entry.pubdate && latestunix == entry.pubdate) || longholiday === 1) && (!entry.customlink)) {
            onhomepage = 1;
            storytotalnum += 1;
            //console.log ("Show: " + entry.cheadline + ":" + (thisdayunix - entry.last_publish_time));
        } else {
			onhomepage = 0;
            //console.log ("Remove: " + entry.cheadline + ":" + (thisdayunix - entry.last_publish_time));
		}

        //分析每条文章的各字段内容
        if (onhomepage === 1) {
            longheadline = entry.cheadline || ''; 
            shortheadline = entry.cheadline || entry.cskylineheadline || ''; 
            longlead = entry.clongleadbody || entry.cshortleadbody || entry.cskylinetext || ''; 
            shortlead = entry.cskylinetext || entry.cshortleadbody || entry.clongleadbody || ''; 
            cauthor = (entry.cauthor||'').replace(/,/g, '、') || ''; 
			tag=entry.tag || '';
            genre = entry.genre || '';
            topic = entry.topic || '';
            industry = entry.industry || '';
			priority = entry.priority || 99;
            byline = entry.cbyline_description || '';
            byline = byline.replace(/作者[：:]/g, '').replace(/英国《金融时报》(.+)/g, 'FT$1') + ' ' + cauthor + ' ' + (entry.cbyline_status || '');
			shortlead=shortlead.replace(/。$/g,"");
            if (byline.length > 20 && byline.indexOf('英国《金融时报》') >= 0) {
                byline = byline.replace(/英国《金融时报》 /g, '').replace(/英国《金融时报》/g, 'FT').replace(/为FT撰稿/g, '');
            }
            if (byline.toLowerCase().indexOf('lex专栏') >= 0) {
                byline = byline.replace(/英国《金融时报》/g, '');
            }
            shortheadline = shortheadline.replace(/[Ll][Ee][Xx]专栏[：:]/g, '')
            //    .replace(/分析[：:]/g, '').replace(/特写[：:]/g, '')
                .replace(/中国国开行/g, '国开行').replace(/工商银行/g, '工行')
                .replace(/建设银行/g, '建行').replace(/农业银行/g, '农行').replace(/通用电气/g, 'GE')
                .replace(/FT社评[：:]/g,'');
            if (entry.story_pic.icon) {
                iconImg='<div class="icon image"><figure><img class="app-image" src="'+entry.story_pic.icon+'"></figure></div>';
            } else {
                iconImg='';
            }

            bigButton=entry.story_pic.cover || entry.story_pic.bigbutton || '';
            if (bigButton !== '') {
                bigButton = '<div class="image bigbutton"><figure><img class="app-image" src="'+bigButton+'"></figure></div>';
            } else if (entry.story_pic.other  || entry.story_pic.smallbutton) {
                bigButton = entry.story_pic.other  || entry.story_pic.smallbutton;
                portraitImg = (tag.indexOf('插图')>=0) ? ' portrait-image' : '';
                bigButton = '<div class="image bigbutton' + portraitImg + '"><figure><img class="app-image" src="'+bigButton+'"></figure></div>';
            } else if (entry.story_pic.skyline !== undefined && entry.story_pic.skyline !== '') {
                bigButton = entry.story_pic.skyline;
                bigButton = '<div class="bigbutton skyline-image image"><figure><img class="app-image" src="'+bigButton+'"></figure></div>';
            }
            //console.log ("cover1: " + cover1);
            //先处理Cover Story
            if ((priority >= 1 && priority <= 10 && (cover1===0 || thisdayunix - entry.last_publish_time < 79200)) || (cover1===0 && entry.story_pic.cover)) {
				if (entry.story_pic.cover) {
                    //alert (coverImg);
                    coverImg = entry.story_pic.cover;
					coverImg = '<div class="coverIMG image"><figure><img class="app-image" src="' + coverImg + '"></figure></div>';
				} else if (entry.story_pic.smallbutton || entry.story_pic.other) {
                    coverImg=entry.story_pic.smallbutton || entry.story_pic.other;
                    if (gIsInSWIFT === true) {
                        coverImg=resizeImg(coverImg,600);
                    }
                    //coverImg='<div class="coverIMG image imageloaded"><figure style="background-image:url('+ entry.story_pic.cover +')"></figure></div>';
					coverImg='<div class="coverIMG image"><figure><img class="app-image" src="' + coverImg + '"></figure></div>';
				} else {
					coverImg='';
				}
                coverImg=saveImgSize(coverImg);
                insertCover('coveranchor',cover1,entry.id,shortheadline,coverImg,iconImg,longlead);
                cover1 = cover1+1;
            } else {                
                if ($(".specialanchor").length>0) {
                    $('.specialanchor').each(function(index){
                        var specialanchorId = 'specialanchor' + index;
                        var adId = $(this).attr('adid') || '';
                        specialTag = $(this).attr('tag') || '';
                        specialTitle = $(this).attr('title') || '';

                        if ((tag.indexOf(specialTag) >= 0)) {
                            $(this).attr('id', specialanchorId);
                            insertArticle('special',specialanchorId,'\/index.php\/ft\/tag\/'+ specialTag +'?i=2',specialTitle,entry.id,shortheadline,iconImg,longlead,bigButton);
                            inserted = true;
                        } 
                    });
                }
                if (inserted === true) {

                    //if it is already inserted as a specia report, do nothing
                } else if (genre.indexOf('news') >= 0 && genre.indexOf('analysis') < 0 && genre.indexOf('comment') < 0 && genre.indexOf('feature') < 0 && longheadline.indexOf("分析") !== 0) {
                    insertArticle('news','newsanchor','news','新闻',entry.id,shortheadline,iconImg,shortlead,bigButton);
                } else if ((longheadline.indexOf('媒体札记') >= 0 || tag.indexOf('媒体札记') >= 0) && $('#mediaanchor').length>0) {
                    insertArticle('media','mediaanchor','\/index.php\/ft\/channel\/phonetemplate.html?column=007000006','媒体札记',entry.id,shortheadline,iconImg,longlead,bigButton);
                } else if (topic.indexOf('people') >= 0 && genre.indexOf('letter') < 0) {
                    insertArticle('people','peopleanchor','people','人物',entry.id,shortheadline,iconImg,longlead,bigButton);
                } else if (topic.indexOf('politics') >= 0 && genre.indexOf('letter') < 0) {
                    insertArticle('politics','politicsanchor','politics','政治与政策',entry.id,shortheadline,iconImg,longlead,bigButton);
                } else if ((topic.indexOf('markets') >= 0 || topic.indexOf('economy') >= 0 || industry.indexOf('finance')>=0) && genre.indexOf('letter') < 0) {
                    insertArticle('economy','economyanchor','economymarkets','经济与金融',entry.id,shortheadline,iconImg,longlead,bigButton);
                } else if ((topic.indexOf('business') >= 0 || topic.indexOf('management') >= 0) && genre.indexOf('letter') < 0) {
                    insertArticle('business','businessanchor','businessmanagement','商业与管理',entry.id,shortheadline,iconImg,longlead,bigButton);
                } else if ((topic.indexOf('society') >= 0 || topic.indexOf('culture') >= 0) && genre.indexOf('letter') < 0) {
                    insertArticle('society','societyanchor','societyculture','社会与文化',entry.id,shortheadline,iconImg,longlead,bigButton);
                } else if ((topic.indexOf('lifestyle') >= 0 || topic.indexOf('travel') >= 0) && genre.indexOf('letter') < 0) {
                    insertArticle('lifestyle','lifestyleanchor','lifestyle','生活时尚',entry.id,shortheadline,iconImg,longlead,bigButton);
                } else if (topic.indexOf('book') >= 0 && genre.indexOf('letter') < 0) {
                    insertArticle('book','bookanchor','book','读书',entry.id,shortheadline,iconImg,longlead,bigButton);
                } else if (genre.indexOf('letter') >= 0) {
                    insertArticle('letter','letteranchor','letter','读者有话说',entry.id,shortheadline,iconImg,longlead,bigButton);
                } else if (tag.indexOf('50ideas')>=0){
                    insertArticle('ideas','ideaanchor','/index.php/ft/tag/50ideas?i=2','50个塑造今日商业世界的观念',entry.id,shortheadline,iconImg,longlead,bigButton);
                } else  {
                    insertArticle('more','moreanchor','','更多',entry.id,shortheadline,iconImg,longlead,bigButton);
                }
            }
        } else {
			delete window.allstories[entry.id];
		}
        unusedEntryIndex = entryIndex;
    });

    //点击story阅读全文
    addstoryclick();
	removeBrokenIMG();

    //display app images when loaded
    showAppImage('fullbody');
    
    //检查用户是不是长时间没有获得新内容
    try {
        if (lateststory != "" && gOnlineAPI === true) {
            lateststory = parseInt(lateststory, 10);
            if (lateststory - latestunix > 86400) { //difference larger than 1 day
                errorMessage = (lateststory - latestunix)/86400;
                errorMessage = "Delay: " + errorMessage + " days. ";
                trackErr(errorMessage, "API Delay");
            }
        }
    } catch (ignore) {
    
    }
    gOnlineAPI = false;
    gStartStatus = "fillPage end";
}
*/

function showAppImage(ele) {
    $('#' + ele + ' .image>figure>img').each(function() {
        var imgUrl = this.src || '';
        if (this.complete) {
            showThisImage($(this), imgUrl);
            // this image already loaded
            // do whatever you would do when it was loaded
        } else {
            $(this).load(function() {
                showThisImage($(this), imgUrl);
            });
        }
        //console.log (imgUrl);
    }); 
}

function showThisImage(ele, imgUrl) {
    //ele.parent().css('background-image', 'url(' +imgUrl + ')');
    ele.parent().parent().addClass('imageloaded').removeClass('image').html('<img src="'+ imgUrl + '">');
    //ele.parent().parent();
}

/*
//插入头版文章
function insertCover(insertID,insertCount,entryId,shortheadline,coverImg,iconImg,insertLead) {
    var firstBigButton = '';
    var iconCode=iconImg;
    if (insertCount==0) {
        $('#'+insertID).append('<div class="story oneStory first-child topStory track-click" eventLabel="'+insertID + ': ' + insertCount +'" storyid="' + entryId + '"><div class="cover headline narrow-screen">' + shortheadline + '</div>' + coverImg + '<div class="cover headline wide-screen">' + shortheadline + '</div><div class=lead>'+insertLead+'</div></div>');
    } else {
        if (screenWidth>=700 && coverImg!="") {
            firstBigButton=coverImg.replace(/coverIMG image/g,'coverIMG middle-screen image');
            iconCode=iconCode.replace(/icon image/g,'icon mobile-screen image');
        }
        $('#'+insertID).append('<div class="story oneStory track-click" eventLabel="'+insertID + ': ' + insertCount +'" storyid="' + entryId + '"><div class="headline narrow-screen more-cover">' + shortheadline + '</div>' + firstBigButton + '<div class="cover headline wide-screen">' + shortheadline + '</div>' + iconCode + '<div class=lead>'+insertLead+'</div></div>');
    }
}

//插入下面的文章
function insertArticle(insertCountProp,insertID,channelLink,channelTitle,entryId,shortheadline,iconImg,shortlead,bigButton) {
    var currentInsert=countInsert[insertCountProp],firstChild='',sectionTitle='',channelURL=channelLink,channelOnClick="",storyTopBreak="",firstBigButton="",headlineNarrow="",headlineWide='<div class="headline">' + shortheadline + '</div>';
    if (currentInsert === undefined) {
        currentInsert = 0;
    }
    if (channelURL.indexOf("/")<0 && channelURL!=""){
        channelURL='/index.php/ft/channel/phonetemplate.html?channel='+channelURL;
    }
    if (channelURL!=""){
        channelOnClick=' onclick=\'showchannel(\"' + channelURL + '\",\"'+channelTitle+'\");\'';
    }
    if (currentInsert === 0) {
        firstChild=' first-child';
        sectionTitle='<a class="section"' + channelOnClick + '><span>'+channelTitle+'</span></a>';
        storyTopBreak='first-break ';
        if (screenWidth>=700) {
            firstBigButton=bigButton;
            firstChild = firstChild + ' hasBigButton';
            headlineNarrow='<div class="headline narrow-screen">' + shortheadline + '</div>';
            headlineWide='<div class="headline wide-screen">' + shortheadline + '</div>';
            if (shortlead.length<=50) {
                firstBigButton = firstBigButton.replace(/bigbutton/g,'bigbutton height-limit-96');
            }
        }
    }
    if (currentInsert % 2 ===0) {
        firstChild = firstChild + " grid-1-2";
        storyTopBreak=storyTopBreak + "break-1-2";
        $('#'+insertID).removeClass("even-item").addClass("odd-item");
    } else {
        firstChild = firstChild + " grid-2-2";
        storyTopBreak=storyTopBreak + "break-2-2";
        $('#'+insertID).removeClass("odd-item").addClass("even-item");
    }
    storyTopBreak='<div class="'+storyTopBreak+'"></div>';
    $('#'+insertID).append(sectionTitle + storyTopBreak + '<div class="story oneStory'+firstChild+' track-click"  eventLabel="'+ insertID + ': ' + currentInsert +'" storyid="' + entryId + '"><div class=storyInner>'+ headlineNarrow + firstBigButton+ headlineWide + iconImg + '<div class=lead>'+shortlead+'</div></div></div>');
    //console.log (firstBigButton);
    countInsert[insertCountProp] = currentInsert + 1;
    gStartStatus = "fillPage end";
}
*/


//获取某一天的所有文章
function filloneday(onedaydate) {
    //gStartStatus = "filloneday start";
    var apiurl;
    var loadcontent;
    var savedhomepage;
    var uaStringFillPage;
    //clearfields();
    
    //更新首页上的视频与互动部分
    /*
    if (typeof window.gCustom === "object") {
        if (typeof window.gCustom.fetchItems === "object") {
            $.each(window.gCustom.fetchItems, function(i,v) {
                fetchItem(v.url+themi, v.storage, v.wrapper);
                unusedEntryIndex = i;
            });
        }
    } else if (!onedaydate || onedaydate == 'newyear') {
        fetchItem(gHomePageVideo+themi, 'homepagevideo', '#homepageVideo');
    }
    */
    /*
    if (gStartPageAPI === true) {
        if (onedaydate != '' && onedaydate != null) {
            loadcontent='加载' + onedaydate.replace(/([0-9]{4})\-([0-9]+)\-([0-9]+)/g, '$1年$2月$3日')+'文章';
            apiurl = '/index.php/jsapi/get_last_publish_story?day='+ onedaydate + '&';
        } else {
            //apiurl = '/index.php/jsapi/get_new_story?rows=30&';
            apiurl = gApiUrl.a10001;
            try{
                if (_localStorage===1 && localStorage.getItem(gNewStoryStorageKey)) {
                    savedhomepage = localStorage.getItem(gNewStoryStorageKey);
                    clearfields();
                    fillPage(savedhomepage);
                    if (isOnline()=="possible") {
                        loadcontent='检查最新的文章';
                    }
                    else {
                        get_allimgdata_from_offline_db();
                    }
                } else {
                    loadcontent='加载最新的文章';
                }
            }catch(err){
                loadcontent='加载最新的文章';
            }
        }
        if (isOnline()=="possible") {
            $(".loadingStory").html('<div id="homeload"><div class="cell loadingStatus">'+loadcontent+'</div><div class="cell right"><div class="progresscontainer" style="width:auto;"><div id="homeprogressbar" class="progressbar standardprogressbar uses3d progressbg structureprogress" style="width:0%"></div></div></div></div>');
            $("#homeprogressbar").animate({width:"10%"},300,function(){
                
                var message = {};
                message.head = {};
                message.head.transactiontype = '10001';
                message.head.source = 'web';
                message.body = {};
                message.body.ielement = {};
                message.body.ielement.num = 30;
                gHomeAPIRequest = new Date().getTime();

                $.ajax({
                    method: gApi001Method,
                    url: apiurl + '?' + themi,
                    //data: JSON.stringify(message),
                    dataType: 'text'
                })
                    .done(function(data) {
                        gHomeAPISuccess = new Date().getTime();
                        var timeSpent = gHomeAPISuccess - gHomeAPIRequest;
                        ga('send', 'timing', 'App', 'API Request', timeSpent, 'Home Stories');
                        if (data.length <= 300) {
                            return;
                        }
                        clearfields();
                        //console.log (data);
                        gOnlineAPI = true;
                        fillPage(data);
                        saveoneday(onedaydate, data);
                        notifysuccess();
                        if (ipadstorage) {
                            setTimeout(function() {
                                ipadstorage.droptable();
                                //save_allimg_to_offline_db();
                            },10000);
                        }
                    }).fail(function(jqXHR){
                        gOnlineAPI = false;
                        gHomeAPIFail = new Date().getTime();
                        var timeSpent = gHomeAPIFail - gHomeAPIRequest;
                        trackFail(message.head.transactiontype + ":" + jqXHR.status + "," + jqXHR.statusText + "," + timeSpent, "Latest News");
                    });

                $('.video').remove();
                $.get(giPadVideo+ onedaydate + themi, function(data) {
                    if (data != null && data != '') {
                        data = checkhttps(data);
                        $('#videocoveranchor').html(data);
                    }	
                });
            });
        } else {
            $(".loadingStory").html('<div id="homeload"><div class="cell loadingStatus"></div><div class="cell right"><a class="button light-btn">刷新</a></div></div>');
            notifysuccess();
        }
    }
    */
    setTimeout(function(){
        httpspv(gDeviceType + '/homepage');
    }, 2000);
    
    uaStringFillPage=navigator.userAgent || navigator.vendor || "";
    if (typeof window.ft_android_id === "string") {
        gDeviceId = window.ft_android_id;
    }
    $("#storytotalnum").html("版本："+_currentVersion+gDeviceId).unbind().bind("click",function(){
        $(this).html(uaStringFillPage);
    });
    //gStartStatus = "filloneday end";
}

function saveoneday(onedaydate, data) {
    if (!onedaydate) {
        data = checkhttps(data);
        try {
            localStorage.removeItem(gNewStoryStorageKey);
            saveLocalStorage(gNewStoryStorageKey, data);
        } catch (ignore) {
        
        }
    }
}

function notifysuccess() {
    if (typeof latestunix === 'string') {
    var todaystamp = unixtochinese(latestunix, 0);
        $('#homeload .loadingStatus').html(todaystamp + " 出版");
    }
    // if ($("#homeprogressbar").length>0) {
    //     $("#homeprogressbar").animate({width:"100%"}, 1500, function(){
    //         $('#homeload .right').html('<a class="button light-btn">刷新</a>');
    //         $('#homeload').unbind();
    //     });
    // }
}

/*
function clearfields() {
    notifysuccess();
    $('#datestamp').empty();
    $('#fullbody .toempty').empty();
}
*/

function jumpToPage(){
    var hashURI = location.hash || "", _channel_name, _channel_title, k;
    if (hashURI.indexOf("story/")>=0) {
        k=hashURI.replace(/^.*story\//g, "");
        if (document.body.className != 'storyview' || readingid!=k) {
            readstory(k);
        }
    } else if (hashURI.indexOf("channel/")>0) {
        _channel_name = hashURI.slice(1).replace("channel/", "").replace(/&title=.*$/g,"").replace(/\/+/g,"/");
        _channel_title= decodeURIComponent(getpvalue(hashURI,"title"));
        if (_channel_title=="") {_channel_title="FT中文网";}
        showchannel (_channel_name,_channel_title);
    } else {
        backhome();
    }
    _popstate=0;
    
}






function loadStoryData(data) {
    var jsonHeadPosition;
    var jsonWrong;
    var jsondata;
    var dataStatus = 'unknown';
    var thedata = data;
    try {
        updateStartStatus('running loadStoryData');
    } catch (ignore) {

    }
    //gStartStatus = 'loading story data';
    //如果返回数据长度不足1000，说明此次返回的数据根本就不对，跳出函数
    if (thedata.length<1000){return;}
    thedata = checkhttps(thedata) || "";
    try {
        jsonHeadPosition = thedata.indexOf('{"head"');
        if (jsonHeadPosition>0) {//如果返回的数据前有服务器返回的乱码（参见jsoneerror.html），则先去除它
            jsonWrong = thedata.substring(0,100);
            thedata = thedata.slice(jsonHeadPosition);
            if (gOnlineAPI === true) {
                trackErr(jsonWrong, "wrong jsondata live");
            } else {
                trackErr(jsonWrong, "wrong jsondata cache");
            }
        }
        jsondata = $.parseJSON(thedata);
    } catch(err) {
        thedata = thedata.substring(0,22);
        if (gOnlineAPI === true) {
            trackErr(err + "." + thedata, "fillPage jsondata");
            dataStatus = 'online error';
        } else {
            trackErr(err + "." + thedata, "fillPage jsondata cache");
            dataStatus = 'cache error';
        }
    }
    try {
        if (jsondata.body.odatalist.length>=0) {
            jsondata = jsondata.body.odatalist;
        } else {   
            ga('send','event', 'CatchError', 'API Error', '{errorcode: "' + jsondata.body.oelement.errorcode + '", host: "' + location.host + '"}');
            fa('send','event', 'CatchError', 'API Error', '{errorcode: "' + jsondata.body.oelement.errorcode + '", host: "' + location.host + '"}');
        }
    } catch (ignore) {
        //alert (ignore.toString());
    }

    $.each(jsondata, function(entryIndex, entry) {
        allstories[entry.id] = entry;
        //console.log (entry);
    });
}

function showDateStamp() {
    var ele = $('#homeload .loadingStatus');
    var myStamp = ele.attr('data-pubdate');
    ele.html(myStamp);
}

function downloadStories(downloadType) {
    var apiurl;
    var loadcontent;
    var savedhomepage;
    var uaStringFillPage;
    var todaystamp;
    var loadingBarContent = '';
    var message;
    var connectionType = window.gConnectionType || 'unknown connection';
    try {
        updateStartStatus('running downloadStories');
    } catch (ignore) {

    }
    if (gStartPageAPI === true) {
        $('#homeload .loadingStatus').html('下载文章供离线阅读...');
        apiurl = gApiUrl.a10001;
        message = {};
        message.head = {};
        message.head.transactiontype = '10001';
        message.head.source = 'web';
        message.body = {};
        message.body.ielement = {};
        message.body.ielement.num = 30;
        gHomeAPIRequest = new Date().getTime();
        ga('send', 'event', 'App API 10001', 'Request', connectionType);
        $.ajax({
            method: gApi001Method,
            url: apiurl + '?' + themi,
            //data: JSON.stringify(message),
            dataType: 'text'
        })
        .done(function(data) {
            gHomeAPISuccess = new Date().getTime();
            var timeSpent = gHomeAPISuccess - gHomeAPIRequest;
            ga('send', 'event', 'App API 10001', 'Success', connectionType);
            ga('send', 'timing', 'App', 'API Request', timeSpent, 'Home Stories');
            if (data.length <= 300) {
                return;
            }
            gOnlineAPI = true;
            //fillPage(data);
            loadStoryData(data);
            saveoneday('', data);
            todaystamp = unixtochinese(lateststory, 0);
            //$('#homeload .right').html('<a class="button light-btn" onclick="refresh(true)">下载最新文章</a>');
            showDateStamp();
            if (ipadstorage) {
                setTimeout(function() {
                    ipadstorage.droptable();
                    //save_allimg_to_offline_db();
                },10000);
            }
        }).fail(function(jqXHR){
            ga('send', 'event', 'App API 10001', 'Fail', connectionType);
            todaystamp = unixtochinese(lateststory, 0);
            $('#homeload .loadingStatus').html('未能下载成功');
            setTimeout(function(){
                showDateStamp();
            },2000);
            gOnlineAPI = false;
            gHomeAPIFail = new Date().getTime();
            var timeSpent = gHomeAPIFail - gHomeAPIRequest;
            trackFail(message.head.transactiontype + ":" + jqXHR.status + "," + jqXHR.statusText + "," + timeSpent, "Latest News");
        });
    }
}


function loadToHome(data, loadType) {
    $('#homecontent').html(data);
    if (loadType !== undefined) {
        fillContent(loadType);
    } else {
        fillContent();
    }
    addstoryclick();
    removeBrokenIMG();
    //display app images when loaded
    showAppImage('fullbody');
    //display button to download native app
    if (/baidu|micromessenger/i.test(uaString)) {
        $('#download-native').removeClass('hidden');
    }

    // if uses native to display ad
    if (window.location.href.indexOf('useNativeLaunchAd') > 0) {
        $('#pop-ad').addClass('done');
    }

    // if there are data for iap products
    if (typeof iapProducts === 'object' && iapProducts.length > 0) {
        try {
            displayProductsOnHome(iapProducts);
        } catch (ignore) {
        }
    }
}

function loadHomePage(loadType) {
    var dateDescription = '';
    var dateStamp = '';
    var homePageRequest = new Date().getTime();
    var connectionType = window.gConnectionType || 'unknown connection';
    try {
        updateStartStatus('running loadHomePage');
    } catch (ignore) {

    }
    updateTimeStamp();
    $('html').addClass('is-refreshing');
    if (loadType === 'start') {
        gStartStatus = 'startFromOnline start';
        $("#startstatus").html("加载最新主页");
    } else if (/^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/.test(loadType)) {
        dateDescription = loadType.replace(/^([0-9]{4})\-([0-9]{1,2})\-([0-9]{1,2})$/, '$1年$2月$3日');
        dateStamp = '&date=' + loadType;
        $('#homeload .loadingStatus').html('加载' + dateDescription + '主页...');
    } else if (loadType !== 'start') {
        $('#homeload .loadingStatus').html('加载最新主页...');
        //$(".loadingStory").html('<div id="homeload"><div class="cell loadingStatus">' + loadcontent + '</div><div class="cell right">' + loadingBarContent + '</div></div>');
    }
    ga('send', 'event', 'App Home Page', 'Request', connectionType);
    requests.push(
        $.ajax({
            // url with events and date
            url: gStartPageTemplate + themi + dateStamp,
            success: function(data) {
                var homePageSuccess = 0;
                var timeSpent = homePageSuccess - homePageRequest;
                gStartStatus = "startFromOnline success";
                $("#startstatus").html("版面成功加载");
                connectInternet="yes";
                setTimeout(function(){connectInternet="unknown";},300000);
                data = checkhttps(data);
                loadToHome(data, loadType);
                showDateStamp();
                if (/^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/.test(loadType)) {
                    gHomePageIsLatest = false;
                } else {
                    gHomePageIsLatest = true;
                }
                try {
                    localStorage.removeItem(gHomePageStorageKey);
                    saveLocalStorage(gHomePageStorageKey, data);
                } catch (ignore) {
                
                }
                $("#startbar").animate({width:"100%"},300,function(){
                    $("#screenstart").remove();
                });
                $('html').removeClass('is-refreshing');
                ga('send', 'event', 'App Home Page', 'Success', connectionType);
                ga('send', 'timing', 'App', 'Home Page Request', timeSpent, connectionType);
            },
            error: function () {
                gStartStatus = "startFromOnline error";
                ga('send', 'event', 'App Home Page', 'Fail', connectionType);
                if (loadType === 'start') {
                    $("#startstatus").html("服务器开小差了");
                    try {
                        updateStartStatus('starting home failure');
                    } catch (ignore) {

                    }
                    startFromOffline();
                    //trackErr(gStartPageTemplate, 'Start Page Template');
                } else {
                    $('#homeload .loadingStatus').html('服务器开小差了！');
                    try {
                        updateStartStatus('refreshing home failure');
                    } catch (ignore) {

                    }
                    //trackErr(gStartPageTemplate, 'Reload Home Page');
                }
                $('html').removeClass('is-refreshing');
                setTimeout(function(){
                    showDateStamp();
                }, 2000);
            }
        })
    );
    if (loadType === 'start') {
        setTimeout(function(){
            //$('#startstatus').html(gStartStatus);
            if (gStartStatus === 'startFromOnline start') {
                $('#startstatus').html('准备加载缓存的内容...');
                setTimeout(function(){
                    if (gStartStatus === 'startFromOnline start') {
                        startFromOffline();
                    }
                    //$("#screenstart").remove();
                    $('html').removeClass('is-refreshing');
                },2000);
            }
        },3000);
    }
}

function startFromOffline() {
    var data = gStartPageStorage || '';
    if (data !== '' && data.indexOf('data-pubdate') > 0) { //Use data from the local storage
        data = checkhttps(data);
        loadToHome(data);
        $('#startstatus').html('连接失败，加载缓存');
        try {
            updateStartStatus('load cache to start');
        } catch (ignore) {

        }
        $("#startbar").animate({width:"100%"},300,function(){
            $("#screenstart").remove();
            showDateStamp();
        });  
    } else {
        try {
            updateStartStatus('start fail and no cache');
        } catch (ignore) {

        }
        $('#startstatus').html('连接失败，请稍候再次刷新');
    }
}


function refresh(forceDownload){
    var requestTime;
    var todaystamp;
    var loadcontent;
    todaystamp = unixtochinese(lateststory, 0);
    loadcontent = todaystamp + ' 出版';
    $('#startstatus').html(forceDownload);
    if (forceDownload === true && $('#startstatus').length > 0) {
        $('#startstatus').html('再次尝试连接服务器...');
        setTimeout(function(){
            if (isOnline() === 'no') {
                $('#startstatus').html('请联网之后再刷新！');
            } else {
                $('#startstatus').html('等待服务器的响应...');
            }
        }, 2000);
    }
    /*
    if (location.href.indexOf("android")>=0) {
        $("#refreshButton").addClass("blue");
        requestTime = new Date().getTime();
        $.ajax("/index.php/jsapi/get_last_updatetime?"+requestTime)
            .done(function(data) {
                $("#refreshButton").removeClass("blue");
                var k=isNaN(parseInt(data,10));
                if (k===false) {
                    successTime=new Date().getTime();
                    if (successTime-requestTime < 300 || forceDownload === true || gHomePageIsLatest === false) {
                        window.location.reload();
                    } else if (data==lateststory) {
                        lateststory=data;
                        $('#popup-title').html("提示");
                        $('#popup-description').html("FT中文网没有发布更新的内容，仍然刷新？");
                        $('#popup-content').html("<div class='standalonebutton'><button class='ui-light-btn' onclick=\"window.location.reload();\">确定</button></div><div class='standalonebutton last-child'><button class='ui-light-btn' onclick=\"$('#popup').removeClass('on');\">取消</button></div>");
                        $('#popup').addClass('on');
                    } else {
                        lateststory=data;
                        $('#popup-title').html("提示");
                        $('#popup-description').html("您的网速似乎不大理想，仍然刷新？");
                        $('#popup-content').html("<div class='standalonebutton'><button class='ui-light-btn' onclick=\"window.location.reload();\">确定</button></div><div class='standalonebutton last-child'><button class='ui-light-btn' onclick=\"$('#popup').removeClass('on');\">取消</button></div>");
                        $('#popup').addClass('on');
                    }
                } else {
                    $('#popup-title').html("提示");
                    $('#popup-description').html("您现在无法正确获取FT中文网的数据，请稍后尝试刷新");
                    $('#popup-content').html("<button class='ui-light-btn' onclick=\"$('#popup').removeClass('on');\">我知道了</button></div>");
                    $('#popup').addClass('on');
                }
            })
            .fail(function() {
                $('#popup-title').html("提示");
                $('#popup-description').html("您现在连接不到FT中文网的服务器，请稍后尝试刷新");
                $('#popup-content').html("<button class='ui-light-btn' onclick=\"$('#popup').removeClass('on');\">我知道了</button></div>");
                $('#popup').addClass('on');
            });
    } else */
    if (gIsInSWIFT === true || 1 === 1) {
        $('html').addClass('is-refreshing');
        $('#homeload .loadingStatus').html('检查新内容...');
        requestTime = new Date().getTime();
        $.get(gGetLastUpdateTime + requestTime,
            function(data) {
                if (lateststory !== data || forceDownload === true || gHomePageIsLatest === false) {
                    $('#homeload .loadingStatus').html('加载新的主页...');
                    loadHomePage('refresh');
                    if (window.gConnectionType !== 'data' || forceDownload === true || gHomePageIsLatest === false) {
                        downloadStories('refresh');
                    }
                    lateststory = data;
                } else {
                    $('#homeload .loadingStatus').html('您已经下载了最新的内容');
                    setTimeout(function(){
                        $('html').removeClass('is-refreshing');
                        showDateStamp();
                    },2000);
                }
                connectInternet="yes";
            }
        ).fail(function(jqXHR){
            $('html').removeClass('is-refreshing');
            $('#homeload .loadingStatus').html('网络连接失败');
            setTimeout(function() {
                showDateStamp();
            }, 2000);
        });
    } else {
        window.location.reload();
    }
}


/*
function checkbreakingnews() {
    $.get('/index.php/ft/channel/phonetemplate.html?channel=breaking', 
    	function(data) { $('#breakingnews').html(data);});
}
*/





function checkbreakingnews() {
    var message={};
    message.head = {};
    // 突发新闻
    message.head.transactiontype = '10007';
    message.head.source = 'web';
    message.body = {};
    message.body.ielement = {};
    message.body.ielement.type = 'breaking';

    $.ajax({
        method: gPostMethod,
        url: gApiUrl.a10007,
        data: JSON.stringify(message),
        dataType: "json"
    }).done(function(data, textStatus) {
        if (textStatus == 'success' && data.body.oelement.errorcode === 0) {
            var breakingNews = data.body.odatalist[0].title || '';
            breakingNews = breakingNews.replace(/\r\n\t/g,'');
            if (breakingNews.length>=3) {
                breakingNews = '<div style="font-size:17px;margin-bottom:10px;color:#FFF;background:-webkit-gradient(linear, 0 0, 0 100%, from(#9E2F50), to(#8E0000));padding:8px;background-color:#9E2F50;">突发新闻：' +  breakingNews + '</div>';
            }
            $('#breakingnews').html(breakingNews);
        }
    }).fail(function(jqXHR){
        trackErr(message.head.transactiontype, 'breaking news');
    });
}


function addstoryclick() {
    $('.story').unbind().bind('click', function() {
        var storyid = $(this).attr('storyid'), 
            storyHeadline = $(this).find(".headline, .hl").html() || "";
        pageStarted=1;
        _popstate=0;
        readstory(storyid, storyHeadline);
    });
}
// 装入热门文章或热门评论，以及年度文章
function fillArticles(data, place) {
    //gStartStatus = "fillArticles start";
    var jsondata, i = 0, k="", firstChild;
    switch (place) {
        case 'popoular' : 
            place ='#mostPopular,#mostPopular1'; break;
        case 'comment' :
            place = '#mostcomment,#mostcomment1'; break;
        case 'yearly' :
            place = '.yearpopular'; break;
        default :
            return;
    }
    try {
        jsondata = $.parseJSON(data);
    }
    catch(e) {
        //console.log ('wrong data format');
        jsondata = data;
    }

    //console.log (jsondata);
    try {
        if (jsondata!=null) {
            $.each(jsondata, function(entryIndex, entry) {
                i = (place == '.yearpopular') ? i + 1 : entryIndex + 1;
                firstChild = (i==1) ? " first-child" : "";
                k+='<div class="story oneStory more'+firstChild+'" storyid="' + entry.storyid + '"><span class=rank>' + i + '. </span><span class="hl">' + entry.cheadline + '</span></div>';
            });
            $(place).html(k);
            addstoryclick();
        }
    } catch (ignore) {
        console.log ('fill Article Failed!');
    }

    //gStartStatus = "fillArticles end";
}

function fetchItem(url, storage, wrapper) {
    var src;
    if (isOnline()=="possible") {
        $.get(url, function(data) {
            src = checkhttps(data);
            $(wrapper).html(src);
            handlelinks();
            try {
                localStorage.removeItem(src);
                saveLocalStorage(storage, src);
            } catch (ignore) {
            
            }
        });
    } else {
        try {
            src = localStorage.getItem(storage);          
            $(wrapper).html(src);
        } catch(err){
            return;
        }
    }
}

//将文章页和频道页中的链接进行智能转换
function handlelinks() {
    $('#fullbody:visible a[href],#storyview:visible a[href],#channelview:visible a[href], #fullbody:visible a[photo-id], #channelview:visible a[photo-id]').each(function() {
        var patt1 = /.*\/story\/[0-9]{9}$/gi;
        var patt2 = /^openads:.*/gi;
        var patt3 = /^opensafari:.*/gi;
        var patt4 = /^itms.*/gi;
        var patt5 = /^.*\.(?:jpg|gif|png)$/gi;
        var patt6 = /.*\/tag\/.*$/gi;
        var patt7 = /.*\/photonews\/.*$/gi;
        var patt8 = /^mail.*/gi;
        var patt9 = /^iosaction:.*/gi;
        var link = $(this).attr('href') || '';
        var storyid1;
        var newlink;
        var photoId = $(this).attr('photo-id') || '';
        if (link.match(patt8) || link.match(patt9)) {
            return;
        }
        if (photoId !== '' && gIsInSWIFT === true) {
            $(this).removeAttr('onclick');
            $(this).attr('href', 'http://www.ftchinese.com/photonews/' + photoId + '?i=3&d=landscape');
        } else if (link.match(patt1) && !link.match(patt2) && !link.match(patt3)) {
            storyid1 = $(this).attr('href').replace(/^.*\/story\/([0-9]{9}).*/g, '$1');
            $(this).addClass('story').attr('storyid', storyid1)
                .removeAttr('href').removeAttr('target')
                .unbind().bind("click",function() {readstory(storyid1);});
        } else if (link.match(patt6)) {
            storyid1 = $(this).attr('href').replace(/^.*\/tag\/(.*)/g, '$1');
            $(this).removeAttr('href').addClass("link").removeAttr('target').click(function() {showchannel("/index.php/ft/tag/"+storyid1+"?i=2",storyid1);});
        } else if (link.match(patt7) && gIsInSWIFT === true) {
            // do nothing
        } else if (link.match(patt7)) {
            storyid1 = $(this).attr('href').replace(/^.*\/photonews\/(.*)/g, '$1');
            $(this).removeAttr('href').addClass("link").removeAttr('target').click(function() {showSlide("/index.php/ft/photonews/"+storyid1+"?i=2",storyid1);});
        } else if (link.match(patt5)) {
            $(this).find("img,div,p,a").addClass("link");
            $(this).removeAttr('href').removeAttr('target').unbind().bind("click",function(){
                showPicture (link);
            });
        } else if (!link.match(patt2) && !link.match(patt3) && !link.match(patt4)) {
            newlink = unescape(link).replace(/(\/photonews\/.*$)/g,"http://m.ftchinese.com/index.php/ft$1") + "?isad=1";
            $(this).attr('href', newlink).removeAttr('target').addClass('outsidelink');
            adclick();
        }
    });
}

//将Unix时间戳转换为中文日期和星期
function unixtochinese(thetime,datetype) {
    var todaystamp,dayArray,dayChar,thehour,theminute,ampm;
    thisday = new Date(thetime * 1000);
    todaystamp = thisday.getFullYear() + '年' + (thisday.getMonth() + 1) + '月' + thisday.getDate() + '日 星期';
    dayArray = '日一二三四五六';
    dayChar = dayArray[thisday.getDay()];
    todaystamp += dayChar;
    if (datetype == 1) {
        thehour = thisday.getHours();
        thehour = ("0" + thehour).slice(-2);      
        theminute = thisday.getMinutes();
        theminute = ("0" + theminute).slice(-2);
        ampm = (thehour < 12) ? 'AM' : 'PM';
        todaystamp += ' ' + thehour + ':' + theminute + ' ' + ampm;
    }
    return todaystamp;
}

function gotowebapp(url) {
    if (isOnline()=="possible") {
        window.location.href = url;
    } else {
        alert('您现在处于离线状态，无法使用本功能');
    }
}

//启动




//阅读文章
function readstory(theid, theHeadline) {
    var h,theurl, backto, sv, allViewsId, jsondata, myid;
    if (useFTScroller===0) {
        if ($("body").hasClass('storyview')==false) {scrollHeight = window.pageYOffset;}
    }
    if (noFixedPosition==1) {
        h=$(window).height();
        h=(h-46)/2;
        h=parseInt(h,10);
        $("#remindBack").css("top",h+"px");
        $("#remindBack").addClass("on");
        setTimeout(function(){$("#remindBack").removeClass("on");},3000);
    }

    //记录浏览历史
    // check if its already present
    if (hist && ((hist[0] && hist[0].url != 'story/' + theid) || hist.length==0)) {
        hist.unshift({'url': 'story/'+ theid, 'title': theHeadline});
        if (historyAPI()==true && _popstate==0) {
            theurl="#/story/"+theid;
            if (location.href.indexOf(theid)<0) {
                window.history.pushState(null, null, gAppRoot + theurl);
            }
        }
    }
    pageStarted=1;
    _popstate=0;
    sv = $('#storyview'); 
    readingid = theid;
    allViewsId = $('#fullbody:visible,#storyview:visible,#channelview:visible').attr('id');
    if (allViewsId != 'storyview') {
        gNowView = allViewsId;
    }
    backto = (gNowView == 'channelview' || gNowView == 'storyview') ? '后退' : '返回首页';
    sv.find('.backto').html(backto);
    //sv.find('.storybody').html('正在读取文章数据...');
    sv.find('.storydate, .storytitle, .storybyline,.storymore,.storyTag .container').html('');
    $('#allcomments,#columnintro').html('');
    $('#cstoryid').val(theid);
    // display the normal loading view first
    $('#storyview').removeClass('columnFlowOn');
	document.body.className = 'storyview';


    gNowView = 'storyview';
	//阅读时如果有setTimeout，会造成逻辑混乱，导致页面变空白
    //sv.find('.storybody').html('正在读取文章数据...1');
    gCurrentStoryId = theid;
    setTimeout(function() {
        //sv.find('.storybody').html('正在读取文章数据...2');
        if (useFTScroller===0) {
            window.scrollTo(0, 0);
        } else if (nativeVerticalScroll === true) {
            document.getElementById('storyScroller').scrollTop = 0;
        } 
        if (allstories[theid]) {
            displaystory(theid, langmode);
        } else {//online
            //sv.find('.storybody').html('正在读取文章数据...3');
            if (typeof theHeadline === 'string') {
                sv.find('.storytitle').html(theHeadline);
            }
            if (typeof storyScroller === 'object') {
                try {
                    storyScroller.scrollTo(0, 0);
                } catch (ignore) {
                    sv.find('.storybody').html('wrong scroller');
                }
            }
            var k = '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>';
            k = k + k + k;
            k = k + k + k;
            k = k + k + k;
            k = k + k + k; 
            //sv.find('.storybody').html(k);
            sv.find('.storybody').html('<div class="loader-container" style="height: 1000px;"><div class="loader">正在读取文章数据...</div></div>' + k);
            //return;
            $.ajax({
                method: 'GET',
                url: '/index.php/jsapi/get_story_more_info/'+ theid + '?' + themi, 
            }).done(function(data, textStatus) {
                data = checkhttps(data);
                jsondata = $.parseJSON(data);
                myid = jsondata.id;
                allstories[myid] = jsondata;
                // display the story only when Id matches
                // otherwise reader will be interupted when connection is slow
                // display story only when the loader is present
                // otherwise the story body will scroll to top while reader is reading 
                if (gCurrentStoryId === myid && sv.find('.storybody .loader-container').length > 0) {
                    displaystory(myid, langmode);
                } else if (gCurrentStoryId !== myid) {
                    ga('send','event','Stop displaystory', 'Another Story', myid, {'nonInteraction':1});
                } else if (sv.find('.storybody .loader-container').length === 0) {
                    ga('send','event','Stop displaystory', 'Already Reading', myid, {'nonInteraction':1});
                }
            }).fail(function(jqXHR){
                if (gCurrentStoryId === theid) {
                    sv.find('.storybody').html('<div class="loader-container"><div class="highlight">获取文章失败！</div><div class="standalonebutton"><button class="ui-light-btn" id="reload-story">重试</button></div></div>' + k);
                    $('#reload-story').unbind().bind('click', function(){
                        sv.find('.storybody').html('<div class="loader-container">重新加载文章...</div>');
                        setTimeout(function(){
                            readstory(theid, theHeadline);
                        },1000);
                    });
                }
            });
        }
    }, 10);	
	pauseallvideo();
}

function removeTag(theCode) {
    var k = theCode.replace(/<\/*p>/gi, '')
                    .replace(/^<div.*<\/div>$/gi, '')
                    .replace(/<table.*<\/table>/g,'')
                    .replace(/<img.*>/gi, '');
    if (theCode.indexOf('table')>=0) {
        //alert (k.charCodeAt(0));
    } else {
        
    }
    return k;
}


function displaystory(theid, language) {
    var storyViewMode = 'normal';
    var allId;
    var storyTag;
    var storyChannel;
    var storyIndustry;
    var storyArea;
    var storyTopic;
    var storyKeyWords;
    var columnFlowKeyWordsArray;
    if (window.colunmFlowOn === true && typeof FTColumnflow === 'function') {
        allId = allstories[theid];
        storyTag = allId.tag || '';
        storyTopic = allId.Topic || '';
        storyArea = allId.area || '';
        storyIndustry = allId.industry || '';
        storyKeyWords = storyTag + storyTopic + storyArea + storyIndustry;
        columnFlowKeyWordsArray = window.columnFlowKeyWords.split(',');
        for (var i=0; i<columnFlowKeyWordsArray.length; i++) {
            if (storyKeyWords.indexOf(columnFlowKeyWordsArray[i]) >= 0) {
                storyViewMode = 'flow';
                break;
            }
        }
    }
    // if (storyViewMode === 'normal') {
    //     $('#storyview').removeClass('columnFlowOn');
    //     displaystoryNormal(theid, language);
    // } else {
    //     $('#storyview').addClass('columnFlowOn');
    //     displaystoryColumn(theid, language);
    // }
    displaystoryNormal(theid, language);
}


// function displaystoryColumn(theid, language) {
//     // dependency: unixtochinese, saveImgSize

//     //remove popup ad target
//     $('#pop-ad').remove();

//     // manipulate dom 
//     document.getElementById('story-column-flow').innerHTML = '<section id="story-column-viewport"><article id="story-column-target"></article></section>';
//     var storyColumnViewport = document.getElementById('story-column-viewport');
//     var windowWidth = $(window).width();
//     var coverHeight = $(window).height();

//     //console.log (coverHeight);

//     // if page padding is lower than 25, it will not flow good on all screens
//     var pagePadding = 25;
//     var contentHeight;

//     // get story data to flow into the pages
//     var storyData = allstories[theid];

//     // construct flowed content
//     var storyBody = storyData.cbody;
//     var flowedContent = storyBody;

//     // construct fixed content
//     //var storyTopBanner = '<div class="adiframe banner full-width" type="fullwidth" frame="adfullwidth"></div>';
//     var storyTopBanner = '';
//     var storyTimeStamp = unixtochinese(storyData.last_publish_time||storyData.fileupdatetime, 1);
//     var byline = (storyData.cbyline_description||'').replace(/作者[：:]/g, '') + ' ' + (storyData.cauthor||'').replace(/,/g, '、') + ' ' + (storyData.cbyline_status||'');
//     var storyHeadline = storyData.cheadline || '';
//     var storyTag = storyData.tag || '';
//     var storyImage;
//     if ((storyData.story_pic.smallbutton || storyData.story_pic.other) && storyTag.indexOf('插图') >= 0) {
//         storyImage = '<div class="coverIMG"><figure><img src="'+(storyData.story_pic.smallbutton || storyData.story_pic.other)+'"></figure></div>';
//     } else if (storyData.story_pic.smallbutton || storyData.story_pic.other) {
//         storyImage = '<div class="bigIMG image"><figure><img class="app-image" src="'+saveImgSize((storyData.story_pic.smallbutton || storyData.story_pic.other))+'"></figure></div>';
//     } else if (storyData.story_pic.cover) {
//         storyImage = '<div class="coverIMG image"><figure><img class="app-image" src="'+saveImgSize(storyData.story_pic.cover)+'"></figure></div>';
//     } else if (storyData.story_pic.skyline) {
//         storyImage = '<div class="leftimage image" style="width:130px;height:84px;"><figure><img src="'+storyData.story_pic.skyline+'" class="app-image"></figure></div>';
//     } else if (storyData.story_pic.bigbutton) {
//         storyImage = '<div class="leftimage image" style="width:167px;height:96px;"><figure><img src="'+saveImgSize(storyData.story_pic.bigbutton)+'" class="app-image"></figure></div>';
//     } else {
//         storyImage = '';
//     }


//     var storyHeader = '<div class="col-span-2">' + storyTopBanner + '<div class="column-story-header">' + storyImage + '<div class="dateStamp">'+storyTimeStamp+'</div><h1 class="column-story-headline">'+storyHeadline+'</h1><div class="byline">'+byline+'</div></div></div>';
//     var fullPageAd = '<div class="col-span-4 attach-page-2"><div class="full-page-ad" style="width:  '+ windowWidth +'px;height: '+ coverHeight +'px;"><div style="top:-'+ pagePadding +'px;left:0;width:100%;height:100%;position:absolute;background: #333;color:white;"><div id="pop-ad" class="overlay in-page"></div><div class="adiframe hidden" type="0" adwidth="0" frame="fullScreen"></div></div></div></div>';
//     var mpuVW = '<div class="anchor-bottom-col-2 attach-page-4"><div class="adiframe mpu-phone for-phone" type="250" frame="ad300x250-story-vw"></div></div>';
//     var mpuStory = '<div class="anchor-top-col-2 attach-page-6"><div class="adiframe mpu-phone for-phone" type="250" frame="ad300x250-story"></div></div>';
//     var fixedContent  = storyHeader + fullPageAd + mpuVW + mpuStory;
    

//     window.cf = new FTColumnflow("story-column-target", "story-column-viewport", {
//         //showGrid: true,
//         columnWidth:            400,
//         //lineHeight:             30,
//         viewportWidth:          windowWidth,
//         viewportHeight:         coverHeight,
//         columnGap:              21,
//         standardiseLineHeight:  true, //useful when you have subTitle or varied fonts
//         pagePadding:            pagePadding,
//         minFixedPadding:        0.5,
//         pageArrangement:       'vertical'
//     });


//     cf.flow(flowedContent, fixedContent);

//     var scrollingPart = document.getElementById('story-column-target');

//     // insert full screen ads between pages
//     // var fullScreenAdEle = document.createElement('div');
//     // fullScreenAdEle.className = 'full-screen-ad';
//     // fullScreenAdEle.style.height = coverHeight + 'px';
//     // var cfRenderArea = scrollingPart.querySelector('.cf-render-area');
//     // if (cf.pageCount >= 3) {
//     //     cfRenderArea.insertBefore(fullScreenAdEle, cfRenderArea.childNodes[2]);
//     // }

    
//     // scrollingPart.innerHTML = '<div id=sectionwrapper><section><div>Page 1<p>Swipe left to scroll the next page into view.  If you swipe quickly...</p></div></section><section><div>Page 2<p>...lots...</p></div></section><section><div>Page 3<p>...and lots...</p></div></section><section><div>Page 4<p>...of pages...</p></div></section><section><div>Page 5<p>...in one single...</p></div></section><section><div>Page 6<p>...scroll movement.  FTScroller will snap to the nearest page when the scroll animation comes to rest.</p></div></section>        </div>';
//     //console.log (scrollingPart.offsetHeight);
//     contentHeight = coverHeight * cf.pageCount;
//     // console.log (scrollingPart.style);
//     scrollingPart.style.height = contentHeight + 'px';
//     // console.log (scrollingPart.style.height);
//     window.Columnscroller = new FTScroller(document.getElementById('story-column-viewport'), {
//         snapping: true,
//         bouncing: true,
//         scrollbars: true,
//         scrollingX: false,
//         singlePageScrolls: true,
//         snapSizeY: coverHeight,
//         contentWidth: windowWidth,
//         contentHeight: contentHeight
//     });
//     updateAds();
// }


function displaystoryNormal(theid, language) {
    var columnintro = ''; 
    var storyimage;
    var allId = allstories[theid];
    var allIdColumnIfoHeadline;
    var byline;
    var storyHeadline = '';
    var contentnumber;
    var i;
    var storyTag = allId.tag||'';
    var tagdata;
    var ct;
    var leftc;
    var rightc;
    var firstChild;
    var myfont;
    var sinten;
    var k='';
    var l='';
    var d='';
    var e;
    var ceDiff;
    var ua = navigator.userAgent || navigator.vendor || "";
    var eLen;
    var cLen;
    var eText;
    var cText;
    var relatedStory="";
    var cbodyCount = 0;
    var ebodyCount = 0;
    var cbodyTotal = 0;
    var ebodyTotal = 0;
    var shareSource = '';
    var storyArea = allId.area || '';
    var storyTopics = allId.topic || '';
    var storyIndustry = allId.industry || '';
    var storyGenre = allId.genre || '';
    var eauthor = allId.eauthor || 'FTChinese';
    var insertAd = 3;
    var insertAd2 = 10;
    var insertAdCharCount = 0;
    var currentPara = '';
    var paraGraphs;
    var pCount;
    var pCountLimit;
    var insertAdForVW;
    var regIsTitle = /^<b>.*<\/b>$/i;
    var regIsImage = /<img/i;
    var actualLanguage;
    langmode = language;
    //文章的scroller
    addStoryScroller();
    setCookie('langmode', language, '', '/');
    $('#storyview .storydate').html(unixtochinese(allId.last_publish_time||allId.fileupdatetime, 1));
    $(".story[storyid*='" + theid + "']").addClass('visited');
    if (/<p>[_\-]+<\/p>/gi.test(allId.cbody)) {allId.cbody = allId.cbody.replace(/<p>[_\-]+<\/p>/gi,"<hr/><br/>");}

    if (allId.columninfo && allId.columninfo.piclink && allId.columninfo.description) {
        allIdColumnIfoHeadline = allId.columninfo.headline.replace(/《/g, '').replace(/》/g, '');
        columnintro = '<div class=channel url="/index.php/ft/column/' 
            + allId.column + '?i=2" title="' 
            + allIdColumnIfoHeadline + '"><div class="section">' 
            + allIdColumnIfoHeadline + '</div><div class="oneStory more first-child"><img src=' 
            + allId.columninfo.piclink + ' class="leftimage" height=84>' 
            + allId.columninfo.description + '</div></div>';
    } else {
        columnintro = '';
    }

    $('#columnintro, #columnintro1').html(columnintro);
    $('.storyTag').remove();


    if ((allId.story_pic.smallbutton || allId.story_pic.other) && storyTag.indexOf('插图') >= 0) {
        storyimage = '<div class="coverIMG"><figure><img src="'+(allId.story_pic.smallbutton || allId.story_pic.other)+'"></figure></div>';
    } else if (allId.story_pic.smallbutton || allId.story_pic.other) {
        storyimage = '<div class="bigIMG image"><figure><img class="app-image" src="'+saveImgSize((allId.story_pic.smallbutton || allId.story_pic.other))+'"></figure></div>';
    } else if (allId.story_pic.cover) {
        storyimage = '<div class="coverIMG image"><figure><img class="app-image" src="'+saveImgSize(allId.story_pic.cover)+'"></figure></div>';
    } else if (allId.story_pic.skyline) {
        storyimage = '<div class="leftimage image" style="width:130px;height:84px;"><figure><img src="'+allId.story_pic.skyline+'" class="app-image"></figure></div>';
    } else if (allId.story_pic.bigbutton) {
        storyimage = '<div class="leftimage image" style="width:167px;height:96px;"><figure><img src="'+saveImgSize(allId.story_pic.bigbutton)+'" class="app-image"></figure></div>';
    } else {
        storyimage = '';
    }

    $('.cebutton,.enbutton,.chbutton').removeClass('nowreading');
    $('#storyview').removeClass('ceview enview');

    if (language == 'en' && allId.ebody && allId.ebody.length > 30) {
        $('#storyview').addClass('enview').find('.storytitle').html(allId.eheadline);
        actualLanguage = 'en';
        byline = (allstories[theid].ebyline_description || 'By') + ' ' + eauthor;

        $('#storyview .storybody').html(storyimage).append(allId.ebody);
        $('.enbutton').addClass('nowreading');
        storyHeadline = allId.eheadline;
    } else if (language == 'ce' && allId.ebody && allId.ebody.length > 30) {
        $('#storyview').addClass('ceview').find('.storytitle').html(allId.eheadline).append('<br>' + allId.cheadline);
        actualLanguage = 'ce';

        byline = (allId.cbyline_description||'').replace(/作者[：:]/g, '') + ' ' + (allId.cauthor||'').replace(/,/g, '、') + ' ' + (allId.cbyline_status||'');

        $('#storyview .storybody').html('');
            //.append("<div id=cecontent style='display:none'><div id=ccontent>" + allId.cbody + '</div><div id=econtent>'+ allId.ebody + '</div></div>');
        eText = allId.ebody.match(/<p>.*<\/p>/gi);
        cText = allId.cbody.match(/<p>.*<\/p>/gi);
        eLen = (eText !== null) ? eText.length : 0;
        cLen = (cText !== null) ? cText.length : 0;
        contentnumber = Math.max(eLen, cLen);
        //ceDiff = cLen - eLen;
        ct = '';
        //alert (cText);
        for (i = 0; i < contentnumber; i++) {
            leftc = eText[ebodyCount] || '';
            //remove p tag and img tag
            //if leftc or right c is empty, it means it probably is an img in a p
            //then check the next p
            //the check is needed only once
            //assuming editors don't attach two images without text between
            leftc = removeTag(leftc);
            if (leftc.length <= 2) { //short code means no need to display
                ebodyCount += 1;
                leftc = eText[ebodyCount] || '';
                leftc = removeTag(leftc);
            }
            ebodyTotal += 1; 
            ebodyCount += 1;
            rightc = cText[cbodyCount] || '';
            rightc = removeTag(rightc);
            if (rightc.length <= 2) { //short code means no need to display
                cbodyCount += 1;
                rightc = cText[cbodyCount] || '';
                rightc = removeTag(rightc);
            }
            cbodyTotal += 1; 
            cbodyCount += 1;
            ct += '<div class=ebodyt title="'+ ebodyTotal +'">'+ leftc + '</div><div class=cbodyt title="'+ cbodyTotal +'">' + rightc + '</div><div class=clearfloat></div>';
            //console.log ("i: " + i + " ebodyTotal: " + ebodyTotal + ' cbodyTotal: ' + cbodyTotal);
        }
        ceDiff = cbodyTotal - ebodyTotal;
        $('#storyview .storybody').html('<div class=ce>' + ct + '</div>');
        $('#storyview .storybody').prepend('<div id="ceTwoColumn" class=centerButton><button class="ui-light-btn">中英文并排</button></div>');
        $("#ceTwoColumn").unbind().bind("click",function(){
            $("div.ebodyt").css({"float":"left","width":"48%","overflow":"hidden"});
            $("div.cbodyt").css({"float":"right","width":"48%","overflow":"hidden"});
            $(this).hide();
        });
        if (ceDiff>2 || ceDiff<0) {
            $('#storyview .storybody').prepend('<div class="highlight">亲爱的读者，这篇文章的中英文段落不匹配，可能是因为中文翻译有删节，或是因为英文原文的排版有问题。敬请谅解，或<b><a id="complain-english">发邮件提醒编辑！</a></b></div>');
            $("#complain-english").attr("href","mailto:customer.service@ftchinese.com?subject=Billigual Article on FTC&body=Dear Editor, %0D%0A%0D%0AGreatings! %0D%0A%0D%0AI noticed that English and Chinese translation are not aligned properly for an article. Could you kindly make adjustment in your CMS system? And thanks a lot for your attention! %0D%0A%0D%0A" + allId.eheadline + "%0D%0A%0D%0Ahttp://www.ftchinese.com/story/" + allId.id +"/ce%0D%0A%0D%0ABest Regards,%0D%0A%0D%0AA Reader%0D%0A%0D%0A%0D%0A%0D%0A    ====%0A%0D%0A%0D%0ATechnical information:%0D%0A%0D%0AUser-agent: "+ua+"%0D%0A%0D%0AResources version: "+_currentVersion+"%0D%0A%0D%0AScreen Mode: "+$(window).width()+"X"+$(window).height()+"%0D%0A%0D%0Amy URL: " + location.href);
        }
        $('.cebutton').addClass('nowreading');
        storyHeadline = allId.eheadline;
    } else {
        $('#storyview').removeClass('ceview').find('.storytitle').html(allId.cheadline);
        actualLanguage = 'ch';
        byline = (allId.cbyline_description||'').replace(/作者[：:]/g, '') + ' ' + (allId.cauthor||'').replace(/,/g, '、') + ' ' + (allId.cbyline_status || '');
        //alert (allId.cbody);
        $('#storyview .storybody').html(storyimage).append(allId.cbody.replace(/<p>(<div.*<\/div>)<\/p>/g,'$1'));
        if (allId.cbody.indexOf("inlinevideo")>=0) {
            $('#storyview .storybody .inlinevideo').each(function (){
                // if FT Scroller is used, add an overlay to the iframe
                // so that the screen can scroller
                var touchOverlay = '';
                var touchClickClass = '';
                var videoContainerId = '';
                if ($(this).attr('vid')!=='') {
                    videoContainerId = 'story-vid-' + $(this).attr('vid');
                    if (useFTScroller === 1) {
                        touchOverlay = '<div target=_blank class="o-touch-overlay"></div>';
                        touchClickClass = 'inline-video-container';
                    }
                    $(this).addClass('o-responsive-video-container').addClass(touchClickClass).html('<div class="o-responsive-video-wrapper-outer"><div class="o-responsive-video-wrapper-inner"><iframe height="100%" width="100%" src="' + gWebRoot + '/index.php/ft/video/' + $(this).attr('vid') + '?i=1&w=100%&h=100%&autostart=false" scrolling="no" frameborder="0" allowfullscreen=""></iframe></div>' + touchOverlay + '</div><a class="o-responsive-video-caption" id="'+ videoContainerId +'">'+$(this).attr('title')+'</a></div>');
                }
            });
        }
        if (allId.ebody && allId.ebody.length > 30) {$('.chbutton').addClass('nowreading');} else {$('.cebutton,.enbutton,.chbutton').addClass('nowreading');}
        storyHeadline = allId.cheadline;
    }



    // business logic on how to insert MPU ads into story body
    if (actualLanguage === 'ce') {
        paraGraphs = $('#storyview .cbodyt');
    } else {
        paraGraphs = $('#storyview .storybody p, #storyview .storybody div');
    }
    pCount = 0;
    insertAdForVW = ($('#fullbody [frame=ad300x250-home-vw]').length >0)? true: false;

    if (insertAdForVW === true) {
        // this means VW's ad is on
        // two mpu ads need to be displayed in story
        for (pCount=0; insertAdCharCount<70 && pCount<100; pCount++) {
            currentPara = paraGraphs.eq(pCount);
            if (currentPara.html() && !regIsTitle.test(currentPara.html()) && !regIsImage.test(currentPara.html())) {
                insertAdCharCount += currentPara.html().length;
            }
        }
        insertAd2 = pCount;
        pCountLimit = 270;
    } else {
        pCountLimit = 220;
    }
    if (actualLanguage === 'en') {
        pCountLimit = 3 * pCountLimit;
    }
    insertAdCharCount = 0;
    for (pCount=pCount; insertAdCharCount<pCountLimit && pCount<100; pCount++) {
        currentPara = paraGraphs.eq(pCount);
        if (currentPara.html() && !regIsTitle.test(currentPara.html()) && !regIsImage.test(currentPara.html()) && !currentPara.hasClass('centerButton')) {
            insertAdCharCount += currentPara.html().length;
        }
    }
    insertAd = pCount;


    // insert ad position into story page
    // insert to the end of the target paragraph

    if (insertAd > 0) {
        insertAd = insertAd - 1;
    }
    $('<div class="adiframe mpu-phone for-phone" type="250" frame="ad300x250-story"></div>').insertAfter(paraGraphs.eq(insertAd));
    if (insertAdForVW === true) {
        if (insertAd2 > 0) {
            insertAd2 = insertAd2 -1;
        }
        $('<div class="adiframe mpu-phone for-phone" type="250" frame="ad300x250-story-vw"></div>').insertAfter(paraGraphs.eq(insertAd2));        
    }


    

    if (byline.replace(/ /g,"")==""){byline = "FT中文网";}
    storyTag = ',' + storyTag + ',';
    storyTag = storyTag.replace(/，/g, ',')
                        .replace(/,白底,/g, ',')
                        .replace(/,靠右,/g, ',')
                        .replace(/,置顶,/g, ',')
                        .replace(/,单页,/g, ',')
                        .replace(/,沉底,/g, ',')
                        .replace(/,资料,/g, ',')
                        .replace(/,突发,/g, ',')
                        .replace(/,插图,/g, ',')
                        .replace(/,透明,/g, ',')
                        .replace(/,+/g, ',')
                        .replace(/,$/g, '')
                        .replace(/^,/g, '');
    gTagData = storyTag + ',' + storyArea + ',' + storyTopics + ',' + storyGenre + ',' + storyIndustry;
    gTagData = gTagData.replace(/，/g, ',')
                        .replace(/,+/g, ',')
                        .replace(/,$/g, '')
                        .replace(/^,/g, '');
    gTagData = gTagData.split(',');
    //console.log (gTagData);
    tagdata = storyTag.split(',');

    if (tagdata.indexOf("VFTT")>=0 && thed <= '20150115') {
        gSpecial = true;
    } else {
        gSpecial = false;
    }
    storyTag = '';
    for (i = 0; i < tagdata.length; i++) {
        if (i==0) {
            firstChild=" first-child";
        } else {
            firstChild="";
        }
        storyTag += '<a class="oneTag oneStory more'+firstChild+'" onclick=\'showchannel("/index.php/ft/tag/' + tagdata[i] + '?i=2","' + tagdata[i] + '")\'>' + tagdata[i] + '</a>';
    }
    storyTag = storyTag.replace(/，$/g, '');
    $('#storyview .storymore').after('<div class="storyTag"><a class=section><span>相关话题</span></a><div class=container>'+ storyTag +'</div></div>');



    $('#storyview .storybyline').html(byline);
    document.getElementById('header-title').innerHTML = storyHeadline;

    //在Story列表中将当前文章标红
    $('#onedaylist div.story').each(function() {
        var it = $(this);
        if (it.attr('storyid') == theid) {
            it.addClass('highlight');
        } else {
            it.removeClass('highlight');
        }
    });




    //检查字体大小
    myfont = getvalue('myfont');
    if (myfont && myfont >= 0) {setFontSize(myfont);}

    //加载文章的相关评论
    $('#storyview .allcomments').remove();
    $('#storyview .readerCommentTitle').after('<div id=allcomments class="allcomments container"></div>');
    loadcomment(theid, 'allcomments', 'story');

    //记录文章页面PV
    httpspv(gDeviceType + '/storypage/'+ theid);
    
    //记录文章被阅读
    recordAction('/phone/storypage/'+ theid);

    //文章页的链接
    $('#storyview .channel').unbind().bind("click",function() { showchannel($(this).attr('url'), $(this).attr('title'));});

    //相关文章
    $("#storyview .storymore").empty();
    if (allId.relative_story && allId.relative_story.length>0) {
        $.each(allId.relative_story, function(entryIndex, entry) {
            var firstChildClass =  (entryIndex === 0) ? " first-child" : "";
            relatedStory = relatedStory +'<div storyid="'+entry.id+'" class="more oneStory story' +firstChildClass +'">'+entry.cheadline+'</div>';
        });
        relatedStory = '<a class=section><span>相关文章</span></a><div class="container" id="relatedstory"></div>' + relatedStory; 
        $("#storyview .storymore").append(relatedStory);
        $("#storyview .story").unbind().bind("click",function(){
            var storyid = $(this).attr('storyid');
            readstory(storyid);
        });
    }
    
    //文章中的链接
    handlelinks();
	

	//文章推荐
    if (allId.columninfo && allId.columninfo.piclink && allId.columninfo.description) {
        allIdColumnIfoHeadline = allId.columninfo.headline.replace(/《/g, '').replace(/》/g, '');
        columnintro = '<div class=channel url="/index.php/ft/column/' 
            + allId.column + '?i=2" title="' 
            + allIdColumnIfoHeadline + '"><div class="topmargin righttitles">' 
            + allIdColumnIfoHeadline + '</div><div style="margin-bottom:15px;"><img src=' 
            + allId.columninfo.piclink + ' class="leftimage touming" height=84>' 
            + allId.columninfo.description + '</div></div>';
    }
    

	removeBrokenIMG();
    showAppImage('storyview');
    //console.log ('storyview');
    //更新分享链接
	sinten = "";
	if (allId.elongleadbody && allId.elongleadbody.length>=10) {
	    sinten="【" + allId.cheadline + "】" + allId.elongleadbody;
	} else if (allId.clongleadbody && allId.clongleadbody.length>=10) {
	    sinten="【" + allId.cheadline + "】" + allId.clongleadbody;
	} else if (allId.cskylinetext && allId.cskylinetext.length>=5) {
	    sinten="【" + allId.cheadline + "】" + allId.cskylinetext;
	} else if (allId.cshortleadbody && allId.cshortleadbody.length>=5) {
	    sinten="【" + allId.cheadline + "】" + allId.cshortleadbody;
	} else {
	    sinten="【" + allId.cheadline + "】";
	}
    //l = allId.story_pic.skyline || allId.story_pic.cover || allId.story_pic.bigbutton || allId.story_pic.smallbutton || allId.story_pic.other || allId.story_pic.icon || gIconImage;
    
    if (gIsInSWIFT === true) {
        l = allId.story_pic.icon || allId.story_pic.skyline || allId.story_pic.bigbutton || allId.story_pic.cover || allId.story_pic.smallbutton || allId.story_pic.other || gIconImage;
    } else {
        l = allId.story_pic.icon || allId.story_pic.skyline || gIconImage;
    }
    if (language !== 'en') {
        d = $("#bodytext p,#bodytext .cbodyt").eq(0).text();
    }
    k = '';
    if (language !== 'en') {
        k = $("#storyview .storybyline").html() || "FT中文网";
        $("#bodytext p,#bodytext .cbodyt").each(function(index){
            if (index<=2) {
                k = k + "\r\n\r\n" + $(this).html();
            }
        });
        if (osVersion.indexOf("nothing")>=0) {
            k = "【" + allId.cheadline + "】\r\n\r\n" + k + "\r\n\r\n点击阅读全文：\r\n\r\nhttp://www.ftchinese.com/story/"+allId.id+"#ccode=2G178002\r\n\r\n或访问app.ftchinese.com下载FT中文网移动应用，阅读更多精彩文章";
            //$("#shareMobile").val();
        } else {
            k = "【" + allId.cheadline + "】\r\n"+k+"\r\n\r\n......  \r\n继续阅读请点击链接：\r\nhttp://www.ftchinese.com/story/"+allId.id+"#ccode=2G178002";
        }
    }

    updateShare('http://www.ftchinese.com', 'http://www.ftchinese.com', '/story/', allId.id, allId.cheadline, sinten, l, d, k);
    //Sticky Right Rail
    freezeCheck();
    //Display HighCharts in Article
    //Caution: if the code is writen like the following
    //it'll break the JS when compiled into inline JS
    //causing the android app to break on starting
    highchartsCheck(allId.cbody);

    if (nativeVerticalScroll === true) {
        document.getElementById('storyScroller').scrollTop = 0;
    } 
}
//阅读文章


//share to social buttons
function updateShare(domainUrl, mobileDomainUrl, contentType, contentId, contentTitle, contentLongTitle, contentImage, contentDescription, shareMobile) {
    var url = encodeURIComponent(domainUrl) + encodeURIComponent(contentType) + contentId;
    var mobileUrl = encodeURIComponent(mobileDomainUrl) + encodeURIComponent(contentType) + contentId;
    var l = contentImage;
    var d = contentDescription + '';
    var e = '';
    var shareSource = '';
    var k = '';
    $('#shareSinaWeb').attr('href','http:\/\/service.weibo.com\/share\/share.php?appkey=4221537403&isad=1&url=' + url + '&title=' + contentLongTitle + '&ralateUid=1698233740&source=&sourceUrl=&content=utf-8&pic=');
    $('#shareQQ').attr('href','http:\/\/share.v.t.qq.com\/index.php?c=share&a=index&url=' + url + '&title=' + contentLongTitle + '&source=1000014&site=http:\/\/www.ftchinese.com&isad=1');
    $('#shareFacebook').attr('href','http:\/\/www.facebook.com\/sharer.php?isad=1&u=' + url + '&amp;t='+encodeURIComponent(contentLongTitle.substring(0,76)));
    $('#shareTwitter').attr('href','http:\/\/twitter.com\/home?isad=1&status='+contentLongTitle.substring(0,80)+'... ' + decodeURIComponent(url));
    $('#shareRenren').attr('href','http:\/\/share.renren.com/share/buttonshare.do?isad=1&link=' + url + '&title='+encodeURIComponent(contentLongTitle.substring(0,76)));
    $('#shareLinkedIn').attr('href','https:\/\/www.linkedin.com/cws/share?isad=1&url=' + url +'&original_referer=https%3A%2F%2Fdeveloper.linkedin.com%2Fsites%2Fall%2Fthemes%2Fdlc%2Fsandbox.php%3F&token=&isFramed=true&lang=zh_CN&_ts=1422502780259.2795');
    $('#shareSocial,#shareSinaWeibo').val(contentLongTitle + decodeURIComponent(url));
    $('#shareURL').val(decodeURIComponent(url));
    $('#shareMobile').val('【' + contentTitle + '】' + decodeURIComponent(url) + '#ccode=2G178002');
    $('#shareEmail').attr('href','mailto:?subject='+contentTitle+'&body='+ contentLongTitle + decodeURIComponent(url));
    //如果是iOS原生应用，传参数给SDK分享微信
    $('#webappWeixin,#nativeWeixin').hide();
    if ((/phoneapp.html/i.test(location.href) && osVersion.indexOf('ios')>=0 && (osVersion.indexOf('ios7')<0)) || /android|isInSWIFT/i.test(location.href) || iOSShareWechat==1) {
        $('#nativeWeixin').show();
        // if (gIsInSWIFT === true) {
        //     l = resizeImg(l,72,72);
        // }
        if (l !== '') {
            l = '&img=' + l;
        }
        //console.log (l);
        //console.log ('d: ' + d);
        if (d !== '') {
            d = "&description=" + d;
        }
        e = contentTitle;
        if (location.href.indexOf("android")>=0) {
            d=d.replace(/%/g,'％');
            e=e.replace(/%/g,'％');
        }
        if (/iPad/i.test(uaString) || /iPhone/i.test(uaString) || /iPod/i.test(uaString)) {
            shareSource = ' - FT中文网';
        }
        k = 'ftcweixin://?url=' + mobileUrl + "&title=" + encodeURIComponent(e) + shareSource + d + l;
        k = k.replace(/[\r\n\"\'<>]/g,"");
        $("#shareChat").attr("href",k+"&to=chat");
        $("#shareMoment").attr("href",k+"&to=moment");
        $("#shareFav").attr("href",k+"&to=fav");
        if (location.href.indexOf("android")>=0) {
            $("#shareFav").parent().remove();
            $("#shareMoment").parent().addClass('last-child');
        }
        if (gIsInSWIFT === true) {
            k=k.replace(/ftcweixin:/g,'iosaction:');
            $('#iOSAction, #iOS-video-action').attr('href',k);
        }
    } else {
        $("#webappWeixin").show();
    }
    //如果是中文或中英对照模式，取前N段分享到微信客户端
    if (shareMobile !== '') {
        $("#shareMobile").val(shareMobile);
    }
}


//检查文章中是否有High Charts代码
function highchartsCheck(storyBody) {
    if (storyBody.indexOf('highcharts')>=0) {
        if ($('.highcharts[data-chart-id]').length>0) {
            var gChartId = $('.highcharts[data-chart-id]').attr('data-chart-id') || '';
            if (gChartId !== '') {
                (function (d) {
                    var js;
                    var s = d.getElementsByTagName('script')[0];
                    var h = '';
                    js = d.createElement('script');
                    js.async = true;
                    if (typeof Highcharts === 'object') {
                        h = '&highcharts=hide';
                    }
                    js.src = '/index.php/ft/interactive/' + gChartId + '?type=js' + h + '&' + new Date().getTime();
                    s.parentNode.insertBefore(js, s);
                })(window.document);
            }
        }
    }
}


//运行环境检测
function historyAPI() {
    var ua = navigator.userAgent || navigator.vendor || "";
     // Android 2
    if (/Android 2/i.test(ua) || osVersion == "Android2") {
        return false;
    }
    // Return the regular check
    if (window.history && window.history.pushState) {
        return true;
    }
}

function isOnline() {//iOS和BB10可以准确判断离线状态，某些Android设备会返回完全错误的信息
    if ((osVersion.indexOf("ios")>=0 || osVersion == "bb10") && navigator && navigator.onLine==false) {
        return "no";
    }
    return "possible";
}

function checkDevice() {
    if (/OS [0-9]+\_/i.test(uaString) && (/iPhone/i.test(uaString) || /iPad/i.test(uaString) || /iPod/i.test(uaString))) {
        osVersion = "ios" + uaString.replace(/^.*OS ([0-9]+).*$/ig,"$1");
    } else if (/BB10/i.test(uaString) && /mobile/i.test(uaString)) {
        osVersion = "bb10";
    } else if (/Android 2/i.test(uaString) || /Android\/2/i.test(uaString)) {
        osVersion = "Android2";
    } else if (/Android 1/i.test(uaString) || /Android\/1/i.test(uaString)) {
        osVersion = "Android1";
    } else if (/Android 4/i.test(uaString) || /Android\/4/i.test(uaString)) {
        osVersion = "Android4";
    } else if (/Android 5/i.test(uaString) || /Android\/5/i.test(uaString)) {
        osVersion = "Android5";
    } else if (/Android 6/i.test(uaString) || /Android\/6/i.test(uaString)) {
        osVersion = "Android6";
    } else if (/Android 7/i.test(uaString) || /Android\/7/i.test(uaString)) {
        osVersion = "Android7";
    } else if (/Android/i.test(uaString)) {
        osVersion = "Android";
    } else if (/MSIE [0-9]+/i.test(uaString)) {
        osVersion = "MSIE" + uaString.replace(/^.*MSIE ([0-9]+).*$/ig,"$1");
    } else {
        osVersion = "other";
    }
    if (osVersion != "other") {osVersionMore="("+osVersion+")";}
    if ((osVersion.indexOf("ios")>=0 || /Android[4-9]/i.test(osVersion) || osVersion.indexOf("bb10")>=0 || (typeof window.gCustom === "object" && gCustom.useFTScroller === true)) && typeof window.FTScroller==="function"/* && !/iPad/i.test(uaString)*/) {
        setCookie('viewpc', 0, '', '/');
        useFTScroller=1;
    } else if (osVersion.indexOf("Android2")>=0 || osVersion.indexOf("Android1")>=0){
        noFixedPosition=1;
    }
    // using native vertical scroll doesn't make text selection easy 
    // and comes with other problems
    // stop using it for now and revisit the issue in the future
    
    
    if (/Android[4-9]/i.test(osVersion) || /ios[5-9]/i.test(osVersion) || /ios1[0-9]/i.test(osVersion)) {
        nativeVerticalScroll = true;
    }
    

    if (useFTScroller==1) {
        $("html").removeClass("noScroller").addClass("hasScroller");
    } else {
        $("html").addClass("noScroller").removeClass("hasScroller");
    }
    if (noFixedPosition==1) {
        $("html").addClass("noFixedPosition");
    } else {
        $("html").removeClass("noFixedPosition");
    }
    if (osVersion.indexOf("MSIE")>=0) {
        $("html").addClass("fontOutside");
    } else {
        $("html").removeClass("fontOutside");
    }
    if (osVersion.indexOf("bb10")>=0 && location.href.indexOf("phoneapp")>=0) {
        $("html").addClass("hideVideo");
    }
    iOSShareWechat=getvalue("iOSShareWechat") || 0;
    if (location.href.indexOf("iOSShareWechat")>=0 || location.href.indexOf("iphone")>=0 || location.href.indexOf("ipad")>=0) {iOSShareWechat=1;savevalue("iOSShareWechat",1);}
    gShowStatusBar=getvalue("gShowStatusBar") || 0;
    if (location.href.indexOf("gShowStatusBar")>=0) {gShowStatusBar=1;savevalue("gShowStatusBar",1);}
    if (/iPad/i.test(uaString)) {
        gDeviceType = '/ipad';
        $("html").addClass("is-ipad");
    } else {
        gDeviceType = '/phone';
    }
    if (typeof window.gCustom === "object") {
        if (typeof window.gCustom.productid === "string") {
            gDeviceType = gDeviceType + "/" + window.gCustom.productid;
        }
    }
    if (gIsInSWIFT === true) {
        $('html').addClass('is-in-swift');
    }
    // SVG is default, no-svg is exception
    if (typeof SVGRect === 'undefined') {
        $('html').addClass('no-svg');
    }
}

function checkhttps(data) {
    // var url = window.location.href.toLowerCase();
    // if (url.indexOf('https:') >= 0 && url.indexOf('api.ftmailbox.com') >= 0) {
    //     data = data.replace(/http:[\/\\]+i.ftimg.net[\/\\]+/g, 'https://api.ftmailbox.com/media/').replace(/http:[\/\\]+media.ftchinese.com[\/\\]+/g, 'https://api.ftmailbox.com/media/');
    // }
    return data;
}

function removehttps(data) {
    return data.replace(/https:[\/\\]+api.ftmailbox.com[\/\\]+media[\/\\]+/g, 'http://i.ftimg.net/');
}

function getpvalue(theurl, thep) {
    var k,thev;
    if (theurl.toLowerCase().indexOf(thep + "=")>1) {
        k = theurl.toLowerCase().indexOf(thep) + thep.length + 1;
        thev = theurl.toLowerCase().substring(k,theurl.length);
        thev = thev.replace(/\&.*/g,"");
    } else {
        thev = "";
    }
    return thev;
}

//运行环境检测

//错误处理
function removeBrokenIMG() {
	$("img").unbind().bind("error",function(){
		$(this).remove();
	});
}

function pauseallvideo() {
	$("video").each(function(){this.pause();});
}


//错误追踪
function trackErr(err, err_location) {
    var k=err.toString() + ". ua string: " + uaString + ". url: " + location.href + ". version: " + _currentVersion;
    if (_localStorage===1) {
        ga('send','event', 'CatchError', err_location, k);
        fa('send','event', 'CatchError', err_location, k);
    } else {
        new Image().src = 'http://m.ftchinese.com/track/ga.php?utmac=MO-1608715-1&utmn=2013101610&utmr=-&utmp=%2Fphone%2Ferror%2FlocalStorage&guid=ON';
    }
}

//服务器请求失败追踪
function trackFail(err, err_location) {
    var k=err.toString() + ". url: " + location.href + ". version: " + _currentVersion;
    if (_localStorage===1) {
        ga('send','event', 'CatchError', err_location, k);
        fa('send','event', 'CatchError', err_location, k);
    } else {
        new Image().src = 'http://m.ftchinese.com/track/ga.php?utmac=MO-1608715-1&utmn=2013101610&utmr=-&utmp=%2Fphone%2Ferror%2FlocalStorage&guid=ON';
    }
}



//流量追踪
function httpspv(theurl) {
    if (theurl.indexOf("storypage")>0) {
	    document.title = $("#storyview .storytitle").html() + " - FT中文网手机应用";
    } else if (theurl.indexOf("channelpage")>0) {
        theurl = theurl.replace(/[0-9\=\?\&]+$/,"");
	    document.title = $(".channeltitle").html() + " - FT中文网手机应用";
    } else if (theurl.indexOf("photo")<0 && theurl.indexOf("interactive")<0 && theurl.indexOf("video")<0){
        document.title = gAppName;
    }
    var vtype="member", pagetype, userId = getCookie('USER_ID') || '', ftcteam='';
    var w = screenWidth;
    var screenType;
    var deviceName;

    if (username === undefined || username== null || username == "") {
        vtype="visitor";
    }
    if (theurl.indexOf("story")>=0) {
        pagetype="Story";
    } else if (theurl.indexOf("interactive")>=0){
        pagetype="Interactive";
        ftcteam="product";
    } else if (theurl.indexOf("photo")>=0){
        pagetype="Photo";
        ftcteam="product";
    } else if (theurl.indexOf("video")>=0){
        pagetype="Video";
        ftcteam="video";
    } else if (theurl.indexOf("search")>=0){
        pagetype="Search";
    } else if (theurl.indexOf("comment")>=0){
        pagetype="coment";
    } else if (theurl.indexOf("column")>=0){
        pagetype="Column";
    } else if (theurl.indexOf("tag")>=0){
        pagetype="Tag";
    } else if (theurl.indexOf("topic")>=0){
        pagetype="Topic";
    } else if (theurl.indexOf("channel")>=0){
        pagetype="Channel";
    } else if (theurl.indexOf("home")>=0) {
        pagetype="App Home";
    } else {
        pagetype="";
    }
    
    if (w >0) {
        if (w>1220) {
            screenType = 'XL: above 1220';
        } else if (w>980) {
            screenType = 'Large: 981-1220';
        } else if (w>690) {
            screenType = 'Medium: 691-981';
        } else if (w>490) {
            screenType = 'Small: 491-690';
        } else {
            screenType = 'Phone: under 491';
        }
        try {
            ga('set', 'dimension18', screenType);
            //console.log (screenType);
        } catch (ignore) {

        }
    }
    //console.log (deviceName);
    try {
        ga('set', 'dimension7', _currentVersion.toString());
        ga('set', 'dimension2', vtype);
        if (userId !== "") {ga('set', 'dimension14', userId);}
        ga('set', 'dimension4', pagetype);
        if (ftcteam !== "") {ga('set', 'dimension5', ftcteam);}
        ga('set', 'dimension17', langmode);
        if (theurl.indexOf("interactive")>=0){
            if (typeof window.interactiveType === 'string') {
                cg1 = window.interactiveType;
                ga('set', 'contentGroup1', cg1); 
            }
        } else if (cg1 !== '(not set)'){
            cg1 = '(not set)';
            ga('set', 'contentGroup1', null);
        }

    } catch(ignore) {
    }
    if (_localStorage===1) {
        try {
            tracker.push(theurl);
        }catch(err){
            ga('require', 'displayfeatures');
            ga('send', 'pageview',  '/missed'+theurl);
            fa('send', 'pageview',  '/missed'+theurl);
            trackErr(err, "trackerpush");
        }
    } else {
        new Image().src = 'http://m.ftchinese.com/track/ga.php?utmac=MO-1608715-1&utmn=2013101610&utmr=-&utmp=%2Fmissed'+theurl+'&guid=ON';
    }
    updateAds();
    setTimeout (function (){freezeCheck();},200);
}



function recordAction(theAction) {
    var theTimeStamp = new Date();
    actionTimeStamp=Math.round(theTimeStamp.getTime() / 1000);
    savevalue("actionUrl",theAction);
    savevalue("actionTimeStamp",actionTimeStamp);
}

//流量追踪

//离线存储
function getCookie(name){
    var start,len,end;
    try {
        start = document.cookie.indexOf(name+"=");
        if (start == -1) {return null;}
        len = start + name.length + 1;
        end = document.cookie.indexOf(";", len);
        if (end == -1) {end = document.cookie.length;}
        return decodeURIComponent(document.cookie.substring(len, end));
    } catch (err) {
        trackErr(err, "setCookie");
        return "";
    }
}

function setCookie (name, value , sec , path , domain) {
    try {
        var argv = arguments,
            argc,
            expires = new Date(),
            secure;
        argc = argv.length;
        sec = sec ? 1000 * sec : 51840000000;
        expires.setTime (expires.getTime() + sec);
        path = (argc > 3) ? argv[3] : null;
        domain = (argc > 4) ? argv[4] : null;
        secure = (argc > 5) ? argv[5] : false;
        document.cookie = name + "=" + escape (value) +
            ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
            ((path == null) ? "/" : ("; path=" + path)) +
            ((domain == null) ? "" : ("; domain=" + domain)) +
            ((secure == true) ? "; secure" : "");
    } catch (err) {
        trackErr(err, "setCookie");
    }
}

function deleteCookie (name) {
    var exp = new Date(), cval = getCookie (name);
    exp.setTime (exp.getTime() - 1);
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}


function saveLocalStorage(thekey,thevalue) {
    try {
        localStorage.removeItem(thekey);
        localStorage.setItem(thekey, thevalue);
    } catch (ignore) {
    }
}

function savevalue(thekey,thevalue) {
    try {
        saveLocalStorage(thekey, thevalue);
    } catch (err) {
        setCookie(thekey, thevalue, '', '/');
    }
}

function getvalue(thekey) {
    var thevalue="";
    try {
        thevalue=localStorage.getItem(thekey);
    } catch (err) {
        thevalue=getCookie(thekey);
    }
    return thevalue;
}

function save_allimg_to_offline_db() {
    if (window.location.hostname === 'localhost') {
        return;
    }
    var all_img = [];
    $('#coveranchor img').each(function() {
        var mediaurl = removehttps(this.src);
        all_img.push(mediaurl);
    });
    if (all_img.length>0) {
    $.getJSON('/index.php/jsapi/getimagetobase64?url='+ all_img.join(), function(data) {
        $.each(data, function(i, n) {
            if (i.length <= 300) {ipadstorage.save(i, 'picture', n, exp_times);}
        });
    });
    }
}

function get_allimgdata_from_offline_db() {
    $('img').each(function() {
        var that = this, img_src = removehttps(that.src);
        if (img_src.length <= 300) {
            ipadstorage.load(img_src, function(data) {
                that.src = data;
            });
        }
    });
}


//离线存储



//界面操作
function getURLParameter(url, name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[undefined,""])[1].replace(/\+/g, '%20'))||null;
}

function showchannel(url, channel, requireLogin, openIniFrame, channelDescription) {
    if (requireLogin !== undefined && requireLogin === 1 && (username === undefined || username ==="")) {
        $('#popup-title').html("提示");
        $('#popup-description').html("对不起，您需要先登录才能使用这个功能");
        $('#popup-content').html("<div class='standalonebutton'><button class='ui-light-btn' onclick=\"turnonOverlay('loginBox');\">登陆</button></div><div class='standalonebutton last-child'><button class='ui-light-btn' onclick=\"$('#popup').removeClass('on');\">取消</button></div>");
        $('#popup').addClass('on');
        return;
    }
    var channelView = $('#channelview'),
        chview,
        theurl, 
        urlPure,
        current_Page, 
        pageurl, 
        h,
        storyid, 
        it, 
        pvurl,
        navClass,
        navTitle;
    var channelHeight = $(window).height() - 45;
    var channelDetail = channelDescription || '';
    var orignialUrl = url;
    var channelUrl = url;

    if (window.location.hostname === 'localhost' || window.location.hostname.indexOf('192.168') === 0 || window.location.hostname.indexOf('10.113') === 0 || window.location.hostname.indexOf('127.0') === 0) {
        if (url.indexOf('/index.php/users/register')>=0) {
            channelUrl = '/api/register.html';
        } else {
            channelUrl = '/api/channel.html';
        }
    }

    //extract tag information from url
    gTagData = url.replace(/^.*channel=/,'').replace(/^.*tag\//,'').replace(/\?.*$/g,'');
    gTagData = decodeURIComponent(gTagData);
    if (gTagData !== '') {
        gTagData = gTagData.split(',');
    } else {
        gTagData = [];
    }
    //console.log (url);
    //console.log (gTagData);

    if (channelView.find("#channelScroller").length<=0) {
        channelView.html("<div id=channelScroller><div id=channelContent></div></div>");
    }
    chview = channelView.find("#channelContent");
    if (useFTScroller===0) {
        if ($("body").hasClass('storyview')==false) {scrollHeight = window.pageYOffset;}
    }
    closeOverlay();
    document.body.className = 'channelview';
    gNowView = 'channelview';
    if (useFTScroller===0) {
        window.scrollTo(0, 0);
    }
    
    navClass = getURLParameter(url, "navClass");
    navTitle = getURLParameter(url, "navTitle");
    $("#navList li").removeClass("on");
    if (navClass !== null) {
        $("#navList li." + navClass).addClass("on");
    }
    if (navTitle !== null) {
        channel = navTitle; 
    }
    document.getElementById('header-title').innerHTML = channel;
    //$('.channeltitle').html(channel);
    //<div id="head"><div class="header"><div class="channeltitle">'+ channel + '</div></div></div>
    chview.html('<div class="loader-container"><div class="loader">正在读取文章数据...</div></div><div class="standalonebutton"><button class="ui-light-btn" onclick="backhome()">返回</button></div>');

    //每次打开的时候都取新的链接，所以在网址后面要添加一个随机参数
    themi = thisday.getHours() * 10000 + thisday.getMinutes() * 100;
    thed = thisday.getFullYear() * 10000 + thisday.getMonth() * 100 + thisday.getDate();
    themi=thed*1000000+themi;
    if (url.indexOf("?")>0) {
        url=url+"&"+themi;
    } else {
        url=url+"?"+themi;
    }



    //记录频道页浏览历史    
    if (hist && ((hist[0] && hist[0].url != url) || hist.length==0)) {
        hist.unshift({'url': url, 'title': channel});
        if (historyAPI()==true && _popstate==0) {
            theurl="#/channel/"+url;
            urlPure=url.replace(/[\?\&][0-9]+$/g,"");
            if (location.href.indexOf(urlPure)<0) {
                window.history.pushState(null, null, gAppRoot + theurl);
            }
        }
    }
    _popstate=0;

    if (typeof openIniFrame !== 'undefined' && openIniFrame === true) {
        chview.html('<iframe src="' + url + '" width="100%" height="' + channelHeight + 'px" border=0 frameborder=0></iframe>');
    } else {
        $.ajax({
            method: 'GET',
            url: channelUrl, 
        }).done(function(data, textStatus) {
            var pageTitle;
            //$("#progressbar").animate({width:"100%"},300,function(){
            data = checkhttps(data);
            chview.html(data);
            $('.channeltitle').html(channel);

            //频道页中的分页
            if (chview.find('.pagination').length>0) {
                $('.p_input').parent().hide();
                current_Page=chview.find('.pagination span').html();
                current_Page=parseInt(current_Page, 10);
                chview.find('.pagination a').each(function() {
                    it = $(this);
                    pageurl = '/index.php/ft' + it.attr('href') + '&i=2';
                    pageTitle = it.attr('href') || '';
                    pageTitle = pageTitle.replace(/^.*\/tag\//g,"").replace(/\?.*$/g,"");
                    pageTitle = decodeURIComponent(pageTitle);
                    it.removeAttr('href').addClass('channel').attr('url', pageurl).attr('title',pageTitle);
                    if (it.html()=="余下全文" || it.html()==">>" || it.html()=="<<") {
                        it.remove();
                    }
                    h=it.html();
                    h=parseInt(h, 10);
                    if (current_Page>0 && h>0) {
                        it.remove();
                    }
                });
            }

            //点击story阅读全文
            chview.find('.story').click(function() {
                storyid = $(this).attr('storyid');
                readstory(storyid);
            });
            adclick();
            chview.find('.navigation .channel').each(function() {
                it = $(this);
                if (it.html() == channel) {it.addClass('on');}
            });
            chview.find('.channel').bind('click',function(){
                var p=$(this).attr("title") || $(this).html() || "FT中文网";
                showchannel($(this).attr('url'), p, ($(this).hasClass('require-log-in') == true) ? 1 : 0);
            });
            //startslides();

            //记录频道页面PV
            pvurl=url;
            if (url.indexOf("myftread")>0) {pvurl=url.replace(/\&/g,"|");}

            // no need to track pv for registration page
            // because it's already tracked
            if (pvurl !== '/index.php/users/register') {
                httpspv(gDeviceType + '/channelpage'+ pvurl);
            }
            //记录文章被阅读
            recordAction(gDeviceType + '/channelpage'+ pvurl);

            chview.find('.storytop').prepend('<div class=channelleft><div class=channelback><span class=backarrow></span><span class=backto>返回首页</span></div></div>');
            if (hist.length > 1) {
                $('#channelview .backto').html('后退');
            } else {
                $('#channelview .backto').html('返回首页');
            }
            $('.channelback').unbind().bind('click',function() {histback();});
            //显示视频或互动的评论
            $("#slideShow #common-comment-container").remove();
            if ($('#commoncomments').length == 1 && window.topic_object_id != undefined) {
                loadcomment(window.topic_object_id, 'commoncomments', 'common');
            }
            //处理外部和内部链接
            handlelinks();
            //处理频道页的滑动
            addChannelScroller();
            //如果频道页有Navigation
            navScroller($("#channelview"));
            checkLogin();
        }).fail(function(){
            chview.html('<div id="head"><div class="header"><div class="channeltitle">'+ channel + '</div></div></div><div class="loader-container"><div class="highlight">获取内容失败！</div></div><div class="standalonebutton"><button class="ui-light-btn" id="reload-channel">重试</button></div>');
            $('#reload-channel').unbind().bind('click', function(){
                showchannel(originalUrl, channel, requireLogin, openIniFrame, channelDescription);
            });
        });
    }
    url=url.replace(/\?.*$/,'');
    updateShare(url, url, '', '', channel, channel, gIconImage, channelDetail, channel+ ' ' +url);
    pauseallvideo();
	removeBrokenIMG();
}

function startslides() {
    var cv = $('#channelview'),
        lasttouch = -1,
        thistouch,
        sh,
        ch,
        k;
    if (cv.find('.imgslides div').length > 0) {
        cv.find('.imgslides:first').after('<div class=slidedots></div>');
        cv.find('.imgslides div').each(function(index) {
            cv.find('.slidedots:first').append('<span n='+ index + '>&nbsp;&#149;&nbsp;</span>');
        });

        cv.find('.slidedots span').click(function() {
            cv.find('.slidedots span').removeClass('grey');
            $(this).addClass('grey');
             cv.find('.imgslides div').hide();
            cs = $(this).attr('n');
            cs = parseInt(cs, 10);
            $('#channelview .imgslides div').eq(cs).css('left', 0).fadeIn(500);
        });


        $('#channelview .imgslides div:first').show();
        $('#channelview .slidedots span:first').addClass('grey');

        //手指滑动翻页效果
        cs = 0;
        document.getElementById('imgslides').addEventListener('touchmove', function(e) {
            thistouch = e.changedTouches[0].clientX;
            if (lasttouch > 0) {
                sh = $('#imgslides div').eq(cs).css('left').replace(/px/g, '');
                ch = thistouch - lasttouch;
                sh = parseInt(sh, 10);
                k = sh + ch;
                $('#channelheight').html(thistouch + ':'+ lasttouch + ':'+ sh + ':'+ k);
                $('#imgslides div').eq(cs).css('left', k);
            }
            lasttouch = thistouch;
        }, false);


        document.getElementById('imgslides').addEventListener('touchstart', function(e) {
            lasttouch = e.changedTouches[0].clientX;
            touchstartx = lasttouch;
        }, false);

        document.getElementById('imgslides').addEventListener('touchend', function(e) {
            touchendx = e.changedTouches[0].clientX;
            $('#channelheight').html(touchendx + ':'+ touchstartx);
            var ls = cs;
            if (touchendx - touchstartx < -30) {
                cs = cs + 1;
                $('#imgslides div').eq(ls).animate({left: '-999px'}, 500);
            } else if (touchendx - touchstartx > 30) {
                cs = cs - 1;
                $('#imgslides div').eq(ls).animate({left: '999px'}, 500);
            } else {
                $('#imgslides div').eq(ls).animate({left: 0}, 500);
            }
            if (cs == -1) {
                cs = $('#imgslides div').length - 1;
            } else if (cs == $('#imgslides div').length) {
                cs = 0;
            }
            if (cs != ls) {
                setTimeout(function() {
                    $('#imgslides div').hide();
                    $('#imgslides div').eq(cs).css('left', 0).fadeIn(500);
                },500);
            }
            $('#channelview .slidedots span').removeClass('grey');
            $('#channelview .slidedots span').eq(cs).addClass('grey');
        }, false);
    }
}


//如果是从文章回退到channel，则不必调用showchannel，否则需要调用showchannel
function histback(gesture) {
    var thispage,previouspage,theid, index = 0, nonStoryIndex=-1;
    var channelTitle;
    closeOverlay();

    if (hist.length >= 2) {//如果hist数量>=2,则需要考虑是滑动还是点动问题
        thispage = hist.shift();//弹出当前页面

        if (gesture !== undefined && gesture === "pinch") {//如果当前是“pinch",即为滑动的时候，那么对hist先进行处理
            if(thispage.url.indexOf('story') === 0){//如果当前页是story
                hist = hist.filter(function(item){
                    return (item.url.indexOf("story") == -1);
                });
                // console.log("newHist:"+hist);
            } else {//如果当前页不是story
                hist = [];
            }
        }

        if(hist.length>=1){
            previouspage = hist.shift();
            //console.log("prepageUrl:"+previouspage.url);
            if (previouspage.length === 0) {//如果上一个页面不存在，则返回首页
                backhome();
            } else if (previouspage.url.indexOf('story') === 0) {//如果上一个页面为文章页，读取文章页
                theid = previouspage.url.replace(/story\//g, '');
                readstory(theid);
            } else {
                channelTitle = $('#channelview .channeltitle').html() || 'FT中文网';
                if (previouspage.url.indexOf('iap')>0) {
                    document.body.className = 'channelview channel-iap';
                } else {
                    document.body.className = 'channelview';
                }
                document.body.title = channelTitle;
                $('#header-title').html(channelTitle);
                gNowView = 'channelview';
                if (useFTScroller===0) {setTimeout(function() {window.scrollTo(0, scrollHeight);},10);}
                hist = [];
                hist.unshift({'url': previouspage.url, 'title': previouspage.title});
                httpspv(gDeviceType + '/channelpage'+previouspage.url);
                recordAction('/phone/homepage');
                if (thispage.url.indexOf('story') < 0) {
                    showchannel(previouspage.url, previouspage.title);
                    hist = [];
                }
            }
        }else{
            backhome();
        }
        
    } else { //如果hist.length == 1 或0，则一律清空hist并返回home
        hist = [];
        backhome();
    }
}

function closead() {
    document.body.className = gNowView;
    if (useFTScroller===0) {setTimeout(function() {window.scrollTo(0, scrollHeight);},10);}
    $('body').css('background', '#FFF1E0');
    $('#adiframe').attr('src', '');
    //记录首页PV
    httpspv(gDeviceType + '/homepage');
    recordAction('/phone/homepage');
}

function backhome() {
    closeOverlay();
    gTagData = [];
	document.body.className = 'fullbody';
    gNowView = 'fullbody';
    $("#navList li").removeClass("on");
    $("#navList li.homesvg").addClass("on");
    if (useFTScroller===0) {setTimeout(function() {window.scrollTo(0, scrollHeight);},10);}
    hist = [];
    setTimeout(function() {
        addHomeScroller();
        navScroller($("#fullbody"));
        $('#channelContent').empty();
    },10);
    //记录首页PV
    httpspv(gDeviceType + '/homepage');
    recordAction('/phone/homepage');
    // check if its already present
    if (historyAPI()==true) {
        window.history.replaceState(null, null, gAppRoot + "#/home");
    }
    _popstate=0;
    document.getElementById('header-title').innerHTML = '';
}

function resizeImg(iMage,resizeWidth,resizeHeight) {
    //return iMage; //r.ftimg.net returns unreliable images, disable for now. 
    var r=iMage;
    var h='';
    r = encodeURIComponent(r);
    if (typeof resizeHeight !== 'undefined') {
        h = '&height=' + resizeHeight;
    }
    r = 'https://www.ft.com/__origami/service/image/v2/images/raw/'+ r +'?source=ftchinese&width=' + resizeWidth + h;
    // if (r !== null && r.indexOf('r.ftimg.net') < 0) {
    //     r=r.replace(/i\.ftimg\.net/g,"r.ftimg.net").replace(/\.(jpg|png|gif|img)/g,"_"+resizeWidth+"_0.$1");
    // }
    return r;
}

//check out the screen width and device pixel ratio to deliver only the necessary size of image
function saveImgSize(iMage,maxImageWidth){
    return iMage;
    /*
    var r=iMage,s=1,w=$(window).width();
    if (r.indexOf('r.ftimg.net') < 0) {
        if (typeof maxImageWidth === "number") {
            w = maxImageWidth;
        }
        if (typeof window.devicePixelRatio === "number") {
            s = (window.devicePixelRatio >=2) ? 2 : 1;
        }
        w=s*w;
        r=resizeImg(r,w);
    }
    return r;    
    */
}

function turnonOverlay(theId) {
    $(".overlay").removeClass("on");
    $("#"+theId).addClass("on");
    if (noFixedPosition==1) {
        scrollOverlay=window.pageYOffset;
        window.scrollTo(0, 0);
    }
}

function closeOverlay() {
    pauseallvideo();
    $(".overlay").removeClass("on");
    $("button.open").removeClass("open");
    if (noFixedPosition==1) {
        window.scrollTo(0, scrollOverlay);
        scrollOverlay=0;
    }
    $("#videoContent").empty();
}

function setFontSize() {
    closeOverlay();
	$("#fontsetting").addClass("on");
	$(".fontpreferences div").removeClass("-selected");
	$(".fontpreferences ."+fontPreference).addClass("-selected");
}

function closeFontSize() {
	$("#fontsetting").removeClass("on");
    if (fontPreference!=$("#fullbodycontainer").attr("class")) {
        $("#fullbodycontainer").attr("class",fontPreference);
        savevalue("fontPreference",fontPreference);
        $("#currentFont").html($("#"+fontPreference).html());
        reflowscroller();
    }
}

function switchNavOverlay(actionType) {
    if (($("#navOverlay").hasClass("on")==false && actionType === undefined) || actionType === 'on') {
        turnonOverlay('navOverlay');
        addnavScroller('navList');
        $(".channelNavButton").addClass("open");
    } else if (($("#navOverlay").hasClass("on")==true && actionType === undefined) || actionType === 'off') {
        closeOverlay();
        $(".channelNavButton").removeClass("open");
    }
}

function shareArticle() {
    $("#shareStory").addClass("on");
    if (noFixedPosition==1) {
        scrollOverlay=window.pageYOffset;
        window.scrollTo(0, 0);
    }
	if (shareScroller === undefined && typeof window.FTScroller === "function") {
        shareScroller = new FTScroller(document.getElementById("shareScroller"), gVerticalScrollOpts);
    }
}

function closeShareArticle() {
    $("#shareStory").removeClass("on");
}

function openClip(){
	turnonOverlay('clipStory');
	$("#addfavlink").empty('');	
	$("#clipButton").show();
}

function clipStory(){
	var storyid=$('#cstoryid').val();
    $("#addfavlink").html("正在保存您的收藏...");
    $.post("/index.php/users/addfavstory/"+storyid, {
        storyid: storyid
    }, function(data){
        if(data == "ok") {
			$("#clipButton").hide();
            $("#addfavlink").html("已收藏!");
        } else {
			$("#addfavlink").html("收藏未能成功，请在网络连接较好的时候再试一次");
		}
    })
    .fail(function(){
        trackErr("clipping", "Clip Story");
    });
}

function readMyFT(){
    var myTopic=getvalue("myTopic") || "",
        myRegion=getvalue("myRegion") || "",
        myIndustry=getvalue("myIndustry") || "",
        myColumn=getvalue("myColumn") || "",
        myFTColumn=getvalue("myFTColumn")||"";
    showchannel("/index.php/ft/channel/phonetemplate.html?channel=myftread&myTopic="+myTopic+"&myRegion="+myRegion+"&myIndustry="+myIndustry+"&myColumn="+myColumn+"&myFTColumn="+myFTColumn,"我的FT");
}

function myFT(){
    var myTopic=getvalue("myTopic") || "",
        myRegion=getvalue("myRegion") || "",
        myIndustry=getvalue("myIndustry") || "",
        myColumn=getvalue("myColumn") || "",
        myFTColumn=getvalue("myFTColumn")||"",
        myFTSetting;
    myFTSetting=myTopic+myRegion+myIndustry+myColumn+myFTColumn || "";
	if (myFTSetting!="") { //如果有初始设定
		readMyFT();
	} else {
		showchannel("/index.php/ft/channel/phonetemplate.html?channel=myftsetup","我的FT");
	}
}

function switchNightReading() {
    if ($("html").hasClass("night")) {
        $("html").removeClass("night");
        $("html").addClass("pink");
        bgMode="pink";
        $("#"+bgMode).addClass("-selected");
        savevalue("bgMode","pink");
    } else {
        $("html").removeClass("pink");
        $("html").addClass("night");
        savevalue("bgMode","night");
    }
}

function switchNotification() {
    if ($("#notification").hasClass('notificationOn')==true) {
        $("#notification").removeClass('notificationOn');
    } else {
        $("#notification").addClass('notificationOn');
    }
    if (window.ftjavacriptapp !== undefined) {
        if (ftjavacriptapp.is_push()==0) {
            ftjavacriptapp.set_push('1');
        } else {
            ftjavacriptapp.set_push('0');
        }
    }
}

function showloginbox() {
    $('#loginbox').show();
    $('#username').focus();
}

function closeloginbox() {
    $('#loginbox').hide();
}

function closenote(idorclass) {
    $('#'+ idorclass + ',.'+ idorclass).slideUp('500');
    setTimeout(function() {$('#'+ idorclass + ',.'+ idorclass).hide();},800);
}


function register() {
    var regFormNumber = '3';
    var regFormUrl = '';
    // if (window.location.href.indexOf('useNewRegForm') >= 0 || gIsInSWIFT === true) {
    //     regFormNumber = '3';
    // } else { // A/B Test for Android User
    //     regFormNumber = getCookie('regFormNumber') || '';
    //     if (regFormNumber === '') {
    //         regFormNumber = (Math.random() > 0.5)? '2': '3';
    //         setCookie('regFormNumber',regFormNumber,'','/');
    //     }
    // }
    regFormUrl = '/index.php/users/register?i=' + regFormNumber;
    // console.log (regFormUrl);
    showchannel(regFormUrl, '新用户注册');
}

function login(fromwhere) {
    var u, p;
    if (fromwhere !== undefined) {
        u = $('#username'+ fromwhere).val();
        p = $('#password'+ fromwhere).val();
    } else {
        u = $('#username').val();
        p = $('#password').val();
    }
    $('.statusmsg').html('正在登录中...');
    $.post('/index.php/users/login/ajax', { username: u, password: p, saveme: 1},function(d) {
        var l = $.parseJSON(d);
        if (l.status && l.status == 'ok') {
            $('.statusmsg').html('登录成功！');
            $('#logincomment, #logincommentc, #nologincomment, #nologincommentc, .logged, .notLogged').hide();
            $('#nick_name,.user_id,.user_Name').val(u).html(u);
            $('#logincomment, #logincommentc, .logged').show();
            // $('#loginButton').removeClass("blue");
            $("#setting").find(".standalonebutton").eq(0).find("button").html("登出");
            username = u;
            closeOverlay();
            $('.statusmsg').empty();
        }
        else if (l.msg && l.status && l.status == 'error') {
            $('.statusmsg').html('<div class="highlight">'+ l.msg + '</div>');
        } 
        else {
            $('.statusmsg').html('<div class="highlight">对不起，可能是网络故障。请过一段时间再重新尝试。</div>');
        }
    });
}

function logout() {
    $('.logged .statusmsg').html('正在登出...');
    $.get('/index.php/users/logout?' + thed, function() {
        $('#logincomment,#nologincomment, .logged, .notLogged').hide();
        $('#nologincomment,.notLogged').show();
        username = '';
        closeOverlay();
        $("#setting").find(".standalonebutton").eq(0).find("button").html("登录");
    });
}

function checkLogin() {
    $('#logincomment, #nologincomment, .logged, .notLogged').hide();
    $('.statusmsg').empty();
    if (!!username) {
        $('#nick_name,.user_id,.user_Name').val(username).html(username);
        $('#logincomment,.logged').show();
        // $('#loginButton').removeClass("blue");
        $("#setting").find(".standalonebutton").eq(0).find("button").html("登出");
    }else {
        $('#nick_name').val('');
        $('#nologincomment,.notLogged').show();
        // $('#loginButton').addClass("blue");
        
    }
}

function adclick() {
    var lo = window.location.href.toLowerCase();
	if (lo.indexOf('phone.html') > 0) {
    	$('a[href^="open"]').each(function(){
        	var thelink=$(this).attr("href");
        	thelink=thelink.replace(/openads:\/\//g, '').replace(/opensafari:\/\//g, '');
        	$(this).attr("href",thelink).attr("target","_blank");
        });
	}
}

function openSearch() {
    turnonOverlay('searchArticle');
    var savedSearch = getvalue("savedSearch") || "";
    searchHist(savedSearch);
}


function watchVideo(videoUrl, videoTitle, videoId, videoLead, videoImage){
    var w,h,v;
    var videoImg = videoImage || gIconImage;
    var shareTitle = videoTitle;
    var shareLead = videoLead || '';
    if (videoId === undefined) {videoId = "";}
    turnonOverlay("watchVideo");
    $("#watchVideo .settingbox p").html(videoTitle);
    document.title = videoTitle + " - FT中文网手机应用";
    $("#videoContent").empty();

    if (!/【|：|:/i.test(shareTitle)) {
        shareTitle = '视频：' + shareTitle;
    }
    
    if (videoUrl.indexOf("/")>=0) {
        $("#videoContent").html('<video src="'+videoUrl+'" controls="" style="width:100%;height:100%;" id="videoPlay"></video>');
    } else {
        w=$(window).width();
        h=w*9/16;
        h=parseInt(h, 10);
        $("#videoContent").html('<iframe style="margin:0 auto;" frameborder=0 marginheight="0" marginwidth="0" frameborder="0" scrolling="no" src="/index.php/ft/channel/phonetemplate.html?video='+videoUrl+'&width='+w+'&height='+h+'" border=0 width="'+w+'" height="'+h+'"></iframe>');
    }
    $("#videoContent").removeClass("showPic");
    v=document.getElementById('videoPlay');
    if (v!=null) {
        v.play();
        v.addEventListener('ended', function(){
            closeOverlay();
            $("#watchVideo .settingbox p,#videoContent").empty();
        });
    }
    httpspv(gDeviceType + '/video/'+ videoId);
    updateShare('http://www.ftchinese.com', 'http://www.ftchinese.com', '/video/', videoId, shareTitle, shareTitle, videoImage, shareLead, '');
}


function showSlide(slideUrl,slideTitle,requireLogin, interactiveType, openIniFrame){
    var randomTime = new Date().getTime(),url = slideUrl, urlMore, interactiveTypeName = "slide";
    if (requireLogin !== undefined && requireLogin === 1 && (username === undefined || username ==="")) {
        $('#popup-title').html("提示");
        $('#popup-description').html("对不起，您需要先登录才能使用这个功能");
        $('#popup-content').html("<div class='standalonebutton'><button class='ui-light-btn' onclick=\"turnonOverlay('loginBox');\">登陆</button></div><div class='standalonebutton last-child'><button class='ui-light-btn' onclick=\"$('#popup').removeClass('on');\">取消</button></div>");
        $('#popup').addClass('on');
        return;
    }
    turnonOverlay("slideShow");
    urlMore = (url.indexOf("?")>0) ? "&" : "?";
    url = url + urlMore + randomTime;
    if (typeof interactiveType === "string") {
        interactiveTypeName = interactiveType;
    }
    if (typeof openIniFrame !== 'undefined' && openIniFrame === true) {
        $("#slideShow").html('<iframe src="' + url + '" width="100%" height="100%" border=0 frameborder=0></iframe>');
        httpspv(gDeviceType + '/'+ interactiveTypeName +'/'+ slideUrl);
    } else {
        $("#slideShow").html('<div id="bookstart" class=opening><span><font id="bookname" style="font-size:2em;">'+ slideTitle + '</font><p class=booklead id="booklead">获取内容...</p><p class=booklead id="loadstatus">触摸<b onclick="closeOverlay()">此处</b>返回</p></span></div>');
        $.get(url, function(data) {
            data = checkhttps(data);
            $("#slideShow").html(data);
            httpspv(gDeviceType + '/'+ interactiveTypeName +'/'+ slideUrl);
        });
    }
}

function showPicture (link) {
    turnonOverlay("watchVideo");
    $("#watchVideo .settingbox p").html("图片");
    $("#videoContent").html('<img src="'+link+'">').addClass("showPic");
}

function updatecalendar(theday) {
    var currentday, prevmonth, nextmonth, prevyear, nextyear, prevm, nextm, i, j, k, dateclass, themonth, theyear;
    themonth = theday.getMonth() + 1;
    theyear = theday.getFullYear();
    prevmonth = themonth - 1;
    nextmonth = themonth + 1;
    if (prevmonth == 0) {prevyear = theyear - 1;prevmonth = 12;} else {prevyear = theyear;}
    if (nextmonth == 13) {nextyear = theyear + 1;nextmonth = 1;} else {nextyear = theyear;}

    prevm = new Date(prevyear + '/' + prevmonth + '/1');
    nextm = new Date(nextyear + '/' + nextmonth + '/1');

    $('#calendar').html('<div class=floatleft><<</div><div class=floatright>>></div><div class=month>'+ theday.getFullYear() + '年'+ themonth + '月</div>');
    $('#calendar').append('<div class=weekday><div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div></div><div class=days></div>');

    $('#calendar .floatleft').click(function() {
        updatecalendar(prevm, 1);
    });

    $('#calendar .floatright').click(function() {
        updatecalendar(nextm, 1);
    });

    for (i = 1; themonth == new Date(theday.getFullYear() + '/' + themonth + '/' + i).getMonth() + 1; i++) {
        if (i == 1) {
            k = new Date(theday.getFullYear() + '/' + themonth + '/' + i).getDay() - 1;
            for (j = 0; j <= k; j++) {
                $('#calendar .days').append('<div>&nbsp;</div>');
            }
        }
        if (theday.getFullYear() * 10000 + theday.getMonth() * 100 + i == thisday.getFullYear() * 10000 + thisday.getMonth() * 100 + thisday.getDate()) {
            dateclass = 'highlight';
        } else if (theday.getFullYear() * 10000 + theday.getMonth() * 100 + i > new Date().getFullYear() * 10000 + new Date().getMonth() * 100 + new Date().getDate()) {
            dateclass = 'grey';
        } else {
            dateclass = 'normal';
        }
        currentday = theday.getFullYear() + '-' + themonth + '-' + i;
        $('#calendar .days').append('<div><a value='+ currentday + " class='" + dateclass + "'>" + i + '</a></div>');
    }
    $('#calendar .days').append("<div class=clearfloat style='width:300px;height:15px;'></div>");
    $('#calendar .grey').removeAttr('href');

    $('#calendar .normal,#calendar .highlight').click(function() {
        theday = $(this).attr("value");
        $('.highlight').not($(this)).removeClass('highlight');
        $(this).addClass('highlight');
        $('#datestamp').empty();
        if (nativeVerticalScroll === true) {
            $('#homeScroller').animate({scrollTop: 0}, '500');
        } if (typeof theScroller === "object") {
            theScroller.scrollTo(0,0);
        } else {
            window.scrollTo(0, 0);
        }
        loadHomePage(theday);
        //console.log(theday);
        //filloneday(theday);
    });
}


function showSearchHist(element) {
    if (element!="") {
        $("#savedSearch").append('<div class=oneStory><div class=headline align=center>'+element+'</div></div>');
    }
}

function search(txtfield) {
    var keys = $('#'+ txtfield).val(), url;
    url = '/index.php/ft/search/?keys='+ keys + '&type=default&i=2';
    showchannel(url, keys);
    updateSavedSearch(keys);
}

function updateSavedSearch(keys) {
    var savedSearch = getvalue("savedSearch") || "", k, b;
    savedSearch=savedSearch.replace(keys,"");
    k=savedSearch.split("|");
    b=k.unshift(keys);
    b=k.splice(5,100);
    savedSearch=k.join("|");
    savevalue("savedSearch",savedSearch);
    unusedEntryIndex=b;
}

function searchHist(savedSearch) {    
    var n=savedSearch.split("|"), keys, url;
    $("#savedSearch").empty();
    n.forEach(showSearchHist);
    $("#savedSearch .oneStory").unbind().bind("click",function(){
        keys =$(this).find(".headline").eq(0).html();
        url = '/index.php/ft/search/?keys='+ keys + '&type=default&i=2';
        showchannel(url, keys);
        updateSavedSearch(keys);
    });
}
//界面操作


//滚动处理
function reflowscroller() {
    if (useFTScroller===0) {return;}
    if (typeof theScroller ==="object") {
        theScroller.destroy("removeElements");
        setTimeout (function() {
            theScroller = new FTScroller(document.getElementById("fullbody"), gVerticalScrollOpts);
        },900);
    }
    if (typeof storyScroller === 'object') {
        storyScroller.destroy("removeElements");
        setTimeout (function() {
            storyScroller = new FTScroller(document.getElementById("storyview"), gVerticalScrollOpts); 
        },800);
    }
}

function addHomeScroller() {
    if (useFTScroller===0) {return;}
    if (nativeVerticalScroll === true) {
        $('#homeScroller').css({'overflow-y': 'scroll', '-webkit-overflow-scrolling': 'touch', 'overflow-scrolling': 'touch'});
        // document.getElementById('homeScroller').addEventListener('scroll', function(){
        //     homeScrollEvent();
        // });
        startTrackingAdViews('homeScroller');
    } else if (typeof theScroller !=="object") {
        theScroller = new FTScroller(document.getElementById("fullbody"), gVerticalScrollOpts);
        // theScroller.addEventListener("scrollend", function (){
        //     homeScrollEvent();           
        // });
    }
}

// this might make our app load ads when not needed
// so only use it to track viewing ad for now
/*
function homeScrollEvent() {
    screenHeight = $(window).height();
    $("#fullbody .adiframe:visible:not(.loaded-in-view)").each(function(){
        var FrameID;
        //console.log($(this).attr("id") + ":" + $(this).attr("class") + ":" + $(this).offset().top);
        if ($(this).offset().top>=0 && $(this).offset().top <= screenHeight) {
            try {
            FrameID = $(this).find("iframe").eq(0).attr("id");
            console.log($(this).attr("id") + ":" + $(this).attr("class") + ":" + $(this).offset().top);
            //document.getElementById(FrameID).contentDocument.location.reload(true);
            } catch (ignore) {
            }
            $(this).addClass("loaded-in-view");
        }
    });
}
*/



function addStoryScroller() {
    if (useFTScroller===0) {return;}
    //it is possible that storyScroller is an object but not an FTScroller
    //so try to scroll it first and fall back if it fails
    if (nativeVerticalScroll === true) {
        $('#storyScroller').css({'overflow-y': 'scroll', '-webkit-overflow-scrolling': 'touch', 'overflow-scrolling': 'touch'});
        document.getElementById('storyScroller').addEventListener('scroll', function(){
            freezeScroll();
        });
        startTrackingAdViews('storyScroller');
        //console.log ('story scroller tracked');
    } else {
        try {
            storyScroller.scrollTo(0, 0);
        } catch (ignore) {
            storyScroller = new FTScroller(document.getElementById("storyScroller"), gVerticalScrollOpts);
            if (screenWidth>=700 && screenHeight>=400) {//不考虑在使用过程中转屏的情况
                storyScroller.addEventListener("scroll", function(){
                    ftScrollerTop = storyScroller.scrollTop;
                    freezeScroll();
                });
            }
        }
    }
}


function addnavScroller(theId) {
    if (nativeVerticalScroll === true) {
        $('#' + theId).css({'overflow-y': 'scroll', '-webkit-overflow-scrolling': 'touch', 'overflow-scrolling': 'touch'});
    } else if (thenavScroller === undefined && typeof window.FTScroller === "function") {
        thenavScroller = new FTScroller(document.getElementById(theId), gVerticalScrollOpts);
    }
}

function addChannelScroller() {
    if (useFTScroller===0) {return;}
    if (nativeVerticalScroll === true) {
        $('#channelScroller').css({'overflow-y': 'scroll', '-webkit-overflow-scrolling': 'touch', 'overflow-scrolling': 'touch'});
        document.getElementById('channelScroller').scrollTop = 0;
        startTrackingAdViews('channelScroller');
    } else {
        if (typeof channelScroller !== 'object') {
            channelScroller = new FTScroller(document.getElementById('channelScroller'), gVerticalScrollOpts);
        }
        channelScroller.scrollTo(0, 0);
    }
}


function navScroller($currentSlide) {
    if ($currentSlide.find(".navigationScroller").length<=0 || typeof window.FTScroller !== "function") {return;}
    var currentView=$currentSlide.attr("id"), liNumber, newPadding, liWidth;
    if (typeof sectionScroller === "object") {sectionScroller.destroy("removeElements");}
    $currentSlide.find(".navigationScroller").attr("id","scroller_"+currentView);
    sectionScroller = new FTScroller(document.getElementById('scroller_'+currentView), {
        scrollingY: false,
        snapping: false,
        scrollbars: false,
        updateOnChanges: true,
        updateOnWindowResize: true,
        windowScrollingActiveFlag: "gFTScrollerActive"
    });
    if (sectionScrollerX && sectionScrollerX>0) {
        sectionScroller.scrollTo(sectionScrollerX,0);
    }
    sectionScroller.addEventListener("scrollend", function(){
        sectionScrollerX=sectionScroller.scrollLeft;
    });
    if (sectionScroller.scrollWidth<=$(window).width() && sectionScroller.scrollWidth<=1024) {//如果用scroller算出来Navigation的宽度小于窗口宽度，且小于1024像素
        liNumber=$("#gamecontent ul.navigation li").length;
        newPadding=10;
        liWidth=0;
        $("#gamecontent ul.navigation li").each(function(){
            liWidth+=$(this).outerWidth();
        });
        if (liNumber>0 && liWidth<sectionScroller.scrollWidth) {
            newPadding=10+parseInt((sectionScroller.scrollWidth-liWidth)/(2*liNumber), 10);
        }
        $("#gamecontent ul.navigation li").css("padding","0 "+newPadding+"px");
    } else {
        $("#gamecontent ul.navigation li").css("padding","0 10px");
        checkSectionScroller($currentSlide);
        sectionScroller.addEventListener("scrollend", function(){
            checkSectionScroller($currentSlide);
        });
    }
}

function checkSectionScroller($currentSlide){
	if (sectionScroller.scrollLeft>0) {
		$currentSlide.find(".navleftcontainer").show();
	} else {
		$currentSlide.find(".navleftcontainer").hide();			
	}
	if (sectionScroller.scrollLeft+$(window).width()<sectionScroller.scrollWidth) {
		$currentSlide.find(".navrightcontainer").show();
	} else {
		$currentSlide.find(".navrightcontainer").hide();			
	}
}
//滚动处理

//读者评论
function loadcomment(storyid, theid, type) {
    if (window.location.hostname === 'localhost') {
        return;
    }
    var url, new_comment_prefix, common_comment_prefix, user_icon='', isvip, commentnumber, cfoption, cftype, commentsortby;
    new_comment_prefix = "/index.php/comments/newcommentsbysort/";
    common_comment_prefix = "/index.php/common_comments/newcommentsbysort/";
    
    switch (type) {
	    case "story":
	    	commentfolder="/index.php/comments";
	    	url="/index.php/comments/newcomment/" + storyid;
	    	break;
	    case "storyall1":
	    	url=new_comment_prefix+storyid+"/1?limit=0&rows=500";
	    	break;
	    case "storyall2":
	    	url=new_comment_prefix+storyid+"/2?limit=0&rows=500";
	    	break;
	    case "storyall3":
	    	url=new_comment_prefix+storyid+"/3?limit=0&rows=500";
	    	break;
	    case "commonall1":
	    	url=common_comment_prefix+storyid+"/1?limit=0&rows=500";
      		break;
      		
      	case "commonall2":
      		url=common_comment_prefix+storyid+"/2?limit=0&rows=500";
      		break;
      	case "commonall3":
      		url=common_comment_prefix+storyid+"/3?limit=0&rows=500";
      		break;
      		
      	default:
      		commentfolder="/index.php/common_comments";
      		url="/index.php/common_comments/newcomment/" + storyid;
    }
    new_comment_prefix = null;
    common_comment_prefix = null;

    $('#cstoryid').val(storyid);
    readingid = storyid;
    $('#' + theid).html('正在获取本文读者评论的数据...');
    $.getJSON(url, function(data, textStatus) {
        if (textStatus != 'success') {
            $('#' + theid).html("<span class='error'>"
                +"很抱歉。由于您与FT网络之间的连接发生故障，"
                +"加载评论内容失败。请稍后再尝试。</span>");
            return;
        }

        $('#' + theid).html('');

        if (data.hot) {
            $.each(data.hot, function(entryIndex,entry) {
                user_icon = '';
                isvip = '';

                $('#' + theid).append('<div class="commentcontainer">'
                    + user_icon + '<dt><div class="ding"></div><span>' 
                    + entry.dnewdate + '</span><b>' 
                    + entry.nickname.replace(/<[Aa] .+>(.+)<\/[Aa]>/g, '$1') 
                    + isvip + '</b> <font class="grey">' 
                    + entry.user_area 
                    + "</font><img src='/phone/hot_1.gif' width='22' height='14' /></dt><dd>" 
                    + entry.quote_content 
                    + entry.talk + '</dd><div class="replybox" id=reh' 
                    + entry.id + "></div><dt class='replycomment'><a href='javascript:cmt_reply(\"" 
                    + entry.id + "\",\"h\");'>回复</a> <a id=hst" 
                    + entry.id + " href='javascript:voteComment(\"" 
                    + entry.id + "\",\"#hst\", \"support\");'>支持</a>(<font id='hsts" 
                    + entry.id + "' color=#BA2636>" 
                    + entry.support_count + '</font>) <a id=hdt' 
                    + entry.id + " href='javascript:voteComment(\"" 
                    + entry.id + "\",\"#hdt\",\"disagree\");'>反对</a>(<font id='hdtd" 
                    + entry.id + "'>" 
                    + entry.disagree_count + '</font>)</dt></div>');
                unusedEntryIndex = entryIndex;
            });
        }


        $.each(data.result, function(entryIndex,entry) {
            isvip = '';
                $('#' + theid).append('<div class=commentcontainer>'
                    + user_icon + '<dt><span>' 
                    + entry.dnewdate + '</span><b>' 
                    + entry.nickname.replace(/<[Aa] .+>(.+)<\/[Aa]>/g, '$1') 
                    + isvip + '</b> <font class=grey>' 
                    + entry.user_area + '</font><div class=clearfloat></div></dt><dd>' 
                    + entry.quote_content 
                    + entry.talk + '</dd><div class=replybox id=re' 
                    + entry.id + "></div><dt class=replycomment><a href='javascript:cmt_reply(\"" 
                    + entry.id + "\",\"\");'>回复</a> <a id=st" 
                    + entry.id + " href='javascript:voteComment(\"" 
                    + entry.id + "\",\"#st\",\"support\");'>支持</a>(<font id='sts" 
                    + entry.id + "'>" 
                    + entry.support_count + '</font>) <a id=dt' 
                    + entry.id + " href='javascript:voteComment(\"" 
                    + entry.id + "\",\"#dt\",\"disagree\");'>反对</a>(<font id='dtd" 
                    + entry.id + "'>" 
                    + entry.disagree_count + '</font>)</dt></div>');
            unusedEntryIndex = entryIndex;
        });

        if ((data.count && data.count > 0) || type != 'story') {
            $('#commentcount').html(' ( '+ data.count + ' ) ');
            $('#commentcount2').html(' [  '+ data.count + ' 条 ] ');
            $('#readercomment').html("评论[<font style='color:#9e2f50;'>" + data.count + '条</font>]');
            init_repeat_cmt();
            if (data.count > 20 || data.result.length > 20) {
                commentnumber = data.count || data.result.length;
                $('#' + theid).append('<div class=fullcomments>'
                    +'<span class=viewfullcomments>查看全部<span class=highlight>' 
                    + commentnumber + '</span>条评论 </span>'
                    +'<select class=commentsortby>'
                    +'<option value=1 selected>最新的在上方</option>'
                    +'<option value=2>最早的在上方</option>'
                    +'<option value=3>按热门程度</option></select></div>');
                cfoption = (type.indexOf('storyall') >= 0) ? type.replace(/storyall/g, '') : 1;
                cftype = (type.indexOf('story') >= 0) ? 'story' : 'common';
                $('.commentsortby').val(cfoption);
                $('.viewfullcomments').click(function() {
                    storyid = $('#cstoryid').val();
                    theid = $(this).parent().parent().attr('id');
                    commentsortby = $('.commentsortby').val();
                    loadcomment(storyid, theid, cftype + 'all'+ commentsortby);
                });
                $('.commentsortby').change(function() {
                    storyid = $('#cstoryid').val();
                    theid = $(this).parent().parent().attr('id');
                    commentsortby = $(this).val();

                    loadcomment(storyid, theid, cftype + 'all'+ commentsortby);
                });
            }
        } 
        else { 
            $('#' + theid).html('');
        }
    });
}

function init_repeat_cmt() {
    var all_cmt;
    $('.cmt_quote').each(function() {
        if (this.parentNode.tagName.toUpperCase() == 'DD') {
            this.id = 'cmt_quote_'+ Math.round(Math.random() * 1000000);
            if (this.childNodes[0].className == 'cmt_quote') {
                this.childNodes[0].id = 'cmt_quote_child_'+ Math.round(Math.random() * 1000000);
            }
        }else {
            if (this.id != 'recommendcomment') {this.style.display = 'none';}
        }
    });
    $("div[id^='cmt_quote_child_']").each(function() {
        this.style.display = '';
        if (this.childNodes[0].className == 'cmt_quote') {
            all_cmt = $('#'+ this.id + ' .cmt_quote').length;
            $('#'+ this.id).prepend("<p class='showcmt'>重复 [ " + all_cmt + ' ] 条引用已被隐藏,点击展开。</p>');
        }
    });
    $('.showcmt').click(function() {
        $('#'+ this.parentNode.id + ' .cmt_quote').css('display', '');
        this.style.display = 'none';
    });
}

function voteComment(id, ctype, vote) {
    if (!ctype) {ctype = (vote == 'support') ? '#st' : '#dt';}
    var i = $(ctype + vote[0] + id).html();
        i = parseInt(i, 10) || 0;
    $(ctype + vote[0] + id).html(i + 1);
    $("#st"+id+",#dt"+id).removeAttr("href");
    if (vote==='support') {$("#st"+id).html("已支持");} else {$("#st"+id).html("已反对");}
    $.post(commentfolder + '/addvote/', {cmtid: id, action: vote});
}

function cmt_reply(id,ctype) {
    var pl, usenicknamer;
    ctype = ctype || '';
    $('.replybox').empty();
    if (!username) {
        pl = $('#nologincomment').html()
          .replace(/username1/g, 'username2')
          .replace(/password1/g, 'password2')
          .replace(/login\(1\)/g, 'login(2)');
        $('#re' + ctype + id).html(pl);
    } else {
        $('#re' + ctype + id).html('<div id=reply-input-container><b>回复此评论：</b><textarea id="replycontent" class="commentTextArea" rows="3"></textarea><span style="display:none;"><input name="use_nicknamer" type="radio" id="namer" onclick="unuseitr(this);"/><label for="namer">匿名</label><input name="use_nicknamer" type="radio" id="useridr" value="0" onclick="useitr(this);" checked/><label for="useridr">昵称</label> <input type="text" class="user_id textinput" id="nick_namer" value="" /></span><input type="button" value="提交回复" class="comment_btn submitbutton button ui-light-btn" id="addnewcommentr"/></div>');

        $('#nick_namer').attr('value', $('#nick_name').val());
        $('#addnewcommentr').click(function() {
            usenicknamer = 0;
            $.ajax({
                type: 'POST',
                url: commentfolder + '/add',
                data: {storyid: readingid, topic_object_id: readingid, talk: $('#replycontent').val(), use_nickname: usenicknamer, NickName: $('#nick_namer').val()+osVersionMore, cmtid: id, type: 'video', title: '', url: ''} ,
                success: function(data) {
                    if (data != 'yes') {
                        alert('非常抱歉，现在我们的网站遇到一些技术故障。您的留言可能没有发表成功，稍后请您试着重新发表一次。');
                        return;
                    }
                    $('#re' + ctype + id).empty();
                    alert('感谢您的参与，您的评论内容已经提交。审核后会立即显示出来！');
                },
                error: function() {
                    alert('很抱歉。由于您的网络的连接发生故障，发表评论失败。稍后请您试着重新发表一次。');
                    $('#addnewcommentr').attr('disabled', false);
                    return;
                }
            });
            $(this).attr('disabled', true);
        });
        $('#closecomment').click(function() {
            $('.replybox').empty();
        });
    }
}
//读者评论

function addLoadEvent(func) {
    var oldonload = window.onload; 
    if (typeof window.onload != 'function') { 
        window.onload = func; 
    } else {
        window.onload = function() { 
            if (oldonload) { 
                oldonload(); 
            } 
            func();
        };
    }
}

function init_union_adv() {
    trackErr("track execution of init_union_adv", "init_union_adv");
    return false;
}

//navigator.connection.type is not supported by most browsers yet
/*
function updateConnectionClass() {   
    var root = document.documentElement,   
        types = "unknown ethernet wifi 2g 3g 4g none".split(" ");   
    for (var i = 0, n = types.length; i < n; i++) {   
        root.classList.remove("network-" + types[i]);   
    }   
    root.classList.add("network-" + navigator.connection.type);   
} 
*/

//in native iOS app, tap status bar will trigger this
function scrollToTop() {
    try {
        if (gNowView === 'fullbody') {
            scrollEle(theScroller, 'homeScroller');
        } else if (gNowView === 'storyview') {
            scrollEle(storyScroller, 'storyScroller');
        } else if (gNowView === 'channelview') {
            scrollEle(channelScroller, 'channelScroller');
        }
    } catch (ignore) {

    }
}

function scrollEle(ele, id) {
    if (nativeVerticalScroll === true) {
        $('#' + id).animate({scrollTop: 0}, '500');
    } else {
        ele.scrollTo(0,0,500);
    }
}

//in native iOS app, show connection status
function showConnectionStatus() {
    document.getElementById('o-connection-status').innerHTML = window.gConnectionType;
}

//// This jQuery Plugin will disable text selection for Android and iOS devices.
// Stackoverflow Answer: http://stackoverflow.com/a/2723677/1195891
$.fn.extend({
    disableSelection: function() {
        this.each(function() {
            this.onselectstart = function() {
                return false;
            };
            this.unselectable = "on";
            $(this).css('-moz-user-select', 'none');
            $(this).css('-webkit-user-select', 'none');
        });
    }
});


//Start the web app
try {
    checkDevice();
    startpage();
    //window.onload = window.ononline = window.onoffline = updateConnectionClass;
}catch(err){
    trackErr(err + ", where: " + gStartStatus, "startpage");
}