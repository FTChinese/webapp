function initSwipeGesture() {
    // doms for swipables
    var swipables = {
        // attach touchstart, touchmove and touchend to the container
        'container': document.getElementById('fullbodycontainer'),
        // navigation menu
        'navOverlay': document.getElementById('navOverlay'),
        // slide show
        'slideShow': document.getElementById('slideShow'),
        // fullbody view
        'fullbody': document.getElementById('fullbody'),
        // story view
        'storyview': document.getElementById('storyview'),
        // channel view
        'channelview':document.getElementById('channelview')
    };

    /*******测试代码:start********
    var testDiv = document.createElement("div");

    testDiv.id = "monitor";
    testDiv.setAttribute("style","position:fixed;z-index:10000;width:220px;height:450px;right:10px;bottom:10px;background-color:white;color:black;display:none;");

    testDiv.innerHTML = '<div id="monitorevent"></div><div id="eventbegin"></div><div id="eventfinish"></div><div id="monitorconsole"></div><div id = "monitordata"></div><div id = "monitortype"></div><div id = "realtransition"></div>';

    document.body.appendChild(testDiv);

    var monitorevent = document.getElementById("monitorevent");
    var monitordata=document.getElementById("monitordata");
    var monitortype=document.getElementById("monitortype");
    var monitorrealtransition = document.getElementById("realtransition");
    var monitorEventBegin=document.getElementById("eventbegin");
    var monitorEventFinish=document.getElementById("eventfinish");
    var monitorconsole=document.getElementById("monitorconsole");
    /******测试代码:end*********/


    // initial parameters
    var _touchStartX = -1;
    var _touchMoveX = -1;
    var _touchStartY = -1;
    var _touchMoveY = -1;
    //swipe  at least _minSwipe px to go back
    var _minSwipe = 72;
    // when you swipe at least _startSwipe px
    // you are locked in the horizontal swipe mode
    // vertical scroll (native) will be disabled
    // using preventDefault()
    var _startSwipe = 15;

    // if a user is scrolling vertically
    var _minVerticalScroll = 30;
    var _isSwiping = false;
   
    // Determine the browser engine and prefix, trying to use the unprefixed version where available.
    var _vendorCSSPrefix;
    var _vendorStylePropertyPrefix;
    var _vendorTransformLookup;
    var _transformProperty;
    var _transitionProperty;

    // meature width of navigation
    var _navListWidth = document.getElementById('navList').offsetWidth || 270;//这就是导航菜单的宽度

    // meature width of screen
    var _screenWidth = screen.width;

    // 这一页记为
    //gNowView = document.body.className;
    // 上一页记为_PreView
    var _preView = "";
    var _histDelStory = [];
    var _histDelStoryNum = 0;

    var _touchStartT;
    var _touchEndT;
    var _touchMoveT;

    var baseView="";
    var _eventHistory = [];
    
	var _speedThred = 0.36;//单位是px/ms,算法是180px/500ms=0.36
    var _timeSpentThres = 200;//单位ms,滑动时间阈值，如果滑动时间小于timeSpentThres，则按快速情况处理
    
    var a = 1;//针对restTms的参数,越小，快速滑动情况滑动越快;
    var a2 = 1;//针对restTms2的参数

    /*************处理前缀问题block:start*************/
    ///要保证transform/transition前缀在js和css中完全一致
    if (document.createElement('div').style.transform !== undefined) {
        _vendorCSSPrefix = '';
        _vendorStylePropertyPrefix = '';
        _vendorTransformLookup = 'transform';
    } else if (window.opera && Object.prototype.toString.call(window.opera) === '[object Opera]') {
        _vendorCSSPrefix = '-o-';
        _vendorStylePropertyPrefix = 'O';
        _vendorTransformLookup = 'OTransform';
    } else if (document.documentElement.style.MozTransform !== undefined) {
        _vendorCSSPrefix = '-moz-';
        _vendorStylePropertyPrefix = 'Moz';
        _vendorTransformLookup = 'MozTransform';
    } else if (document.documentElement.style.webkitTransform !== undefined) {
        _vendorCSSPrefix = '-webkit-';
        _vendorStylePropertyPrefix = 'webkit';
        _vendorTransformLookup = '-webkit-transform';
    } else if (typeof navigator.cpuClass === 'string') {
        _vendorCSSPrefix = '-ms-';
        _vendorStylePropertyPrefix = 'ms';
        _vendorTransformLookup = '-ms-transform';
    } 
    _transformProperty = _vendorStylePropertyPrefix + (_vendorStylePropertyPrefix ? 'T' : 't') + 'ransform';
    _transitionProperty = _vendorStylePropertyPrefix + (_vendorStylePropertyPrefix ? 'T' : 't') + 'ransition';


    var stylesheetContainerNode = document.getElementsByTagName('head')[0] || document.documentElement;

    var newStyleNode = document.createElement('style');
    newStyleNode.type = 'text/css';  

    /// Add our rules
    var _styleText = [
        '#navOverlay {' + _vendorCSSPrefix + 'transform:translate3d(-100%,0,0);' + _vendorCSSPrefix + 'transition:all 0.5s ease-out; }', 
        '#navOverlay.on {' + _vendorCSSPrefix + 'transform: translate3d(0, 0, 0); }',
        '#fullbody,#storyview,#channelview,#adview,div.fullbody{' + _vendorCSSPrefix + 'transition: all 0.5s ease-out;}',
        '.hasScroller #fullbody,.hasScroller .storyview #channelview{'+_vendorCSSPrefix+'transform:translate3d(-100%,0,0);}',
        '.hasScroller #storyview,.hasScroller .fullbody #channelview,.hasScroller #channelview {'+_vendorCSSPrefix+'transform: translate3d(100%, 0, 0); }',
        '.hasScroller .fullbody #fullbody,.hasScroller .storyview #storyview,.hasScroller .channelview #channelview {'+ _vendorCSSPrefix +'transform: translate3d(0, 0, 0); }'
    ];

    if (newStyleNode.styleSheet) {
        newStyleNode.styleSheet.cssText = _styleText.join('\n');
    } else {
        newStyleNode.appendChild(document.createTextNode(_styleText.join('\n')));
    }

    // Add the stylesheet
    stylesheetContainerNode.insertBefore(newStyleNode, stylesheetContainerNode.firstChild);
    /***********处理前缀问题block:end*********/
    var removeAllTransf = function(){    	
        swipables.navOverlay.style[_transformProperty]=null;
        swipables.fullbody.style[_transformProperty]=null;
        swipables.storyview.style[_transformProperty]=null;
        swipables.channelview.style[_transformProperty]=null;
    };

    var removeAllTransi = function(){
        swipables.navOverlay.style[_transitionProperty]=null;
        swipables.fullbody.style[_transitionProperty]=null;
        swipables.storyview.style[_transitionProperty]=null;
        swipables.channelview.style[_transitionProperty]=null;
    };
    var removeAllTransfAndTransi = function(){

        swipables.navOverlay.style[_transformProperty]=null;
        swipables.navOverlay.style[_transitionProperty]=null;

        swipables.fullbody.style[_transformProperty]=null;
        swipables.fullbody.style[_transitionProperty]=null;

        swipables.storyview.style[_transformProperty]=null;
        swipables.storyview.style[_transitionProperty]=null;

        swipables.channelview.style[_transformProperty]=null;
        swipables.channelview.style[_transitionProperty]=null;
    };

    /*****测试用:start*****
    var setRealInnerHTML = function(view) {//view的实参可以为swipables.navOverlay,swipables.fullbody,swipables.storyview,swipables.channelview
        if(view === swipables.navOverlay||swipables.fullbody||swipables.storyview||swipables.channelview){
             monitorrealtransition.innerHTML= 'realTransition:'+window.getComputedStyle(view)[_transitionProperty]+'\n'+
                                    'realTransform: '+window.getComputedStyle(view)[_transformProperty];
        } 
    };
    /*****测试用:end*****/

    if (window.useFTScroller === 1) {

        try {
            swipables.container.addEventListener('touchstart', function(e) {
                // gNowView reflects the current view
                // update it from document.body anyway
                // in case other parts of the code has bugs
                //setEventInnerHTML(e);
                //monitorEventBegin.innerHTML="startEventBeginisSwipe:"+_isSwiping;
                gNowView = document.body.className;
                baseView = gNowView;

                _screenWidth = screen.width;
                _touchStartT = e.timeStamp;//这样直接得到时间戳，而不用(new Date()).getTime()


                // when touchstart, reset the swiping status
                _isSwiping = false;

                /// 过滤掉hist数组中的文章页信息，这样就只留下了频道页信息
                _histDelStory = hist.filter(function(item){
                    return (item.url.indexOf("story") == -1);
                });
               

                if(gNowView == "storyview"){
                     _histDelStoryNum = _histDelStory.length;
                     if(_histDelStoryNum == 0){//只有从主页点进来的文章，_histDelStoryNum才等于1
                        _preView = "fullbody";
                    } else {
                        _preView = "channelview";
                    }
                
                } 
                
                // if 1. user is swiping on an FTScroller like the horizonal navigation on home
                // or 2. user is viewing a slide show
                // no need to trigger swiping gesture
                //monitorconsole.innerHTML="gFTScrollerActive:"+window.gFTScrollerActive+"\r"+"slideShowisOn: "+swipables.slideShow.className.indexOf(' on');
                if (typeof window.gFTScrollerActive === "object" || swipables.slideShow.className.indexOf(' on')>0) {//如果使用了FTScroller且使用了slideShow，则通过returnfalse终止这个事件处理函数的执行
                    _touchStartX = -1;
                    _touchStartY = -1;
                    return false;
                }
                _touchStartX = e.changedTouches[0].clientX;
                _touchStartY = e.changedTouches[0].clientY;

                /**version2: start**/
                _eventHistory.length = 0;
                _eventHistory.push({x:_touchStartX, y:_touchStartY,t: _touchStartT});
                /**version2: end**/
                //monitorEventFinish.innerHTML="startEventFinishisSwipe:"+_isSwiping;
            }, false);

            swipables.container.addEventListener('touchmove', function(e) {
                //setEventInnerHTML(e);

                // horizontal move distance
                var xDistance;
                // vertical movement distance
                var yDistance;
               
                // 手指横向滑动的方向
                var xDirection;
                // 手指横向滑动的距离，for visual feedback
                var translateX;

                // 文章页的translatex:
                //var storyviewX;
                // 当前页面要退回的上级页面的translatex:
                var previewTranslateX;

                // if the user is locked in the swiping mode
                // disable vertical scrolling
                // this works for iOS 7 and above
                if (_isSwiping === true) {//这个在本touchmove事件处理程序后面有判断_isSwiping什么时候赋值为true
                	e.preventDefault();
                }

                // if the user is engaged in a FT Scroller activity
                // or if he is viewing a photo slide
                // abandon ensuing operations
                if ( (typeof window.gFTScrollerActive === "object" && _isSwiping === false) || swipables.slideShow.className.indexOf(' on')>0 ) {//如果使用了FTScroller且属于纵向滑动，或，使用了slideShow，则通过return false终止这个事件处理程序的执行
                    _touchStartX = -1;
                    _touchMoveX = -1;
                    _touchStartY = -1;
                    _touchMoveY = -1;
                    return false;
                }
                _touchMoveX = e.changedTouches[0].clientX;//获取滑动过程中手指的横坐标位置
                _touchMoveY = e.changedTouches[0].clientY;//获取滑动过程中手指的纵坐标位置
                _touchMoveT = e.timeStamp;

                xDistance = Math.abs(_touchMoveX - _touchStartX);//手指横向滑动距离

                xDirection = (_touchMoveX-_touchStartX)>0? "toRight":"toLeft";

                yDistance = Math.abs(_touchMoveY - _touchStartY);//手指纵向滑动距离


                if (_touchStartX !== -1) {//当其等于-1就是要么用了FTScroller要么是slideShow，这时横向滑动应该是无效的
                    //whether the user is swiping or scrolling

                    if (xDistance > _startSwipe && typeof window.gFTScrollerActive !== "object" && yDistance < _minVerticalScroll && yDistance/xDistance < 0.5) {//当横坐标滑动距离超过15px，且没有用FTScroller，且纵坐标滑动距离不到30px，且x滑动距离比y滑动距离的两倍还多
                        //window.gFTScrollerActive = {};
                        _isSwiping = true;//这时被判定为确实是在进行横向滑动动作
                    }
                    var moveTransitionProperty = 'all 0s ease-in-out';
                    // if the swiping is true
                    // provide visual feedback
                    if (_isSwiping === true) {

                        ///如果是处在首页的情况下：
                        if (gNowView === 'fullbody') {
                            // home page swiping to right
                            // reveal the navigation

                            if (swipables.navOverlay.className.indexOf(' on')==-1 && xDirection == "toRight") {//如果没有打开导航菜单
                                translateX = xDistance - _navListWidth;//手指划过的距离一旦大于菜单宽度，则不能再往外拉了
                                //拉开时往右滑：translateX小于0,绝对值越来越小，即其值越来越大，translate3d(translateX,0,0)才能向右
                              
                            } else if(swipables.navOverlay.className.indexOf('on')>-1 && xDirection == "toLeft") {
                                translateX = -xDistance;
                                //收拢时往左滑，translateX还是小于0，且绝对值越来越大，即其值越来越小
                            }
                            
                            if (translateX > 0) {
                                translateX = 0;
                            }
                            swipables.navOverlay.style[_transitionProperty] = moveTransitionProperty;
                            swipables.navOverlay.style[_transformProperty] = 'translate3d('+translateX+'px, 0, 0)';
                             //swipables.navOverlay.style[_transformProperty] = 'translateX('-translateX+'px)';

                        } else if(gNowView == 'storyview') {///如果是处在文章页的情况下,只用考虑向右滑动
                            if(xDirection == "toRight"){
                                //对于文章页，直接拉到右边去，故该处x值是从0变到100%的，就等于xDistance
                                translateX = xDistance;//translateX始终为正，往右滑动距离越大，translateX越大，这样才能实现元素向右动

                                swipables.storyview.style[_transitionProperty] = moveTransitionProperty;
                                swipables.storyview.style[_transformProperty] = 'translate3d('+translateX+'px,0,0)';

                                
                                ///上一页不管是主页or频道页，都是从左边拉到中间去，故该处x值是从-100%变到0的，就等于(xDistance - 屏幕宽度)
                                previewTranslateX = xDistance - _screenWidth;


                                ///这里要判断其上一页是主页or频道页
                                if(_preView == "fullbody"){
                                     
                                    swipables.fullbody.style[_transitionProperty] = moveTransitionProperty;
                                    swipables.fullbody.style[_transformProperty] = 'translate3d('+previewTranslateX+'px,0,0)';
                                } else if(_preView == "channelview") {
                                    swipables.channelview.style[_transitionProperty] = moveTransitionProperty;
                                    swipables.channelview.style[_transformProperty] = 'translate3d('+previewTranslateX+'px,0,0)';
                                }
                               
                            }

                        } else if(gNowView == "channelview") {
                            if(xDirection == "toRight"){
                                //对于频道页，直接拉到右边去，故该处x值是从0变到100%的，就等于xDistance
                                translateX = xDistance;

                                swipables.channelview.style[_transitionProperty] = moveTransitionProperty;
                                swipables.channelview.style[_transformProperty] = 'translate3d('+translateX+'px,0,0)';

                                //那么preView肯定是主页了
                                ///上一页是主页，是从左边拉到中间去，故该处x值是从-100%变到0的，就等于(xDistance - 屏幕宽度)
                                previewTranslateX = xDistance - _screenWidth;
                                swipables.fullbody.style[_transitionProperty] = moveTransitionProperty;
                                swipables.fullbody.style[_transformProperty] = 'translate3d('+previewTranslateX+'px,0,0)';
                            }
                        }

                        _eventHistory.push({x:_touchMoveX,y:_touchMoveY,t:_touchMoveT});

                        if(_eventHistory.length > 30){
                        	_eventHistory.splice(0,15);//只保留最后15个点
                        }
   
                    }
                }

            }, false);

            swipables.container.addEventListener('touchend', function(e) {
                if(_isSwiping === true) {
                    e.preventDefault();

                    window.gFTScrollerActive = false;

                    _touchMoveX = e.changedTouches[0].clientX;//手指离开屏幕时的横坐标位置
                    _touchMoveY = e.changedTouches[0].clientY;//手指离开屏幕时的纵坐标位置
                    var touchDistance =_touchMoveX - _touchStartX;//此值正为往右滑，负为往左滑
                    
                    _touchEndT = e.timeStamp;
                    var timeSpent = _touchEndT - _touchStartT;

                    ///快速滑动情况相关时间：restTms
                    var restTms =(_screenWidth - Math.abs(touchDistance)) * timeSpent / Math.abs(touchDistance) / a;//以ms为单位
                    var restTms_real=restTms;
                    if(restTms<100&&restTms>0){
                        restTms= 100;
                    } else if(restTms>500){
                        restTms = 500;
                    }
                    var transitionPropertyByRestT = 'all '+ restTms +'ms ease-out';

                    ///先快后面情况相关时间:restTms2
                    var lenOfEventHistory = _eventHistory.length;
                    var lastPosition = _eventHistory[lenOfEventHistory-1];
                    var comparitonPosition = _eventHistory[lenOfEventHistory-2];
                    for(var i = lenOfEventHistory-3;i>=0;i--) {
                    	if (lastPosition.t - _eventHistory[i].t > 100) {
                    		break;
                    	}
                    	comparitonPosition = _eventHistory[i];
                    }
                    var movementTime = lastPosition.t - comparitonPosition.t;
                    if (!movementTime) {
                    	movementTime = 16;
                    }
                    var movementSpeed = Math.abs(lastPosition.x - comparitonPosition.x)/movementTime;//movementSpeed就是速率
                    var restTms2 = 0;
                    restTms2 = 2*(_screenWidth - Math.abs(touchDistance))/movementSpeed/a2;
                    var restTms2_real = restTms2;
                    if(restTms2>0&&restTms2<100){
                        restTms2=100;
                    } else if(restTms2>500){
                        restTms2 = 500;
                    }
                    var transitionPropertyByRestT2 = 'all '+ restTms2 +'ms ease-out';

                    var transitionPropertyBy500 = 'all 500ms ease-out';

                    var transformPropertyAtR = 'translate3d(100%,0,0)';
                    var transformPropertyAtM = 'translate3d(0,0,0)';
                    var transformPropertyAtL = 'translate3d(-100%,0,0)';

                    /***测试用:start***
                    monitordata.innerHTML ="_transitionProperty: "+ _transitionProperty+"\n"+"_transformProperty: "+_transformProperty+"\n"+
                        //"baseView: " +baseView+"\n" + 
                        //"_touchMoveX:"+_touchMoveX +"\n"+
                        //"_touchStartX:"+_touchStartX+"\n"+
                        "touchDistance:"+touchDistance+"\n"+
                        "timeSpent: "+timeSpent+"\n"+
                        "restTms: "+restTms+"\n"+
                        "restTms_real: "+restTms_real+"\n"+
                        "restTms2: " +restTms2+"\n" +
                        "restTms2_real: "+restTms2_real+"\n"+
                        "movementTime: " +movementTime+"\n"+
                        "movementSpeed: "+movementSpeed; 
                    /***测试用:end***/

 
                    if(touchDistance>_minSwipe){//如果是向右滑动超过72px
                       
                        if (timeSpent > 0 && timeSpent < _timeSpentThres) {//情况1：快速向右滑动超过72——即timeSpent位于(0,200)
                            //monitortype.innerHTML="fastToRight>72"; 
                            if(baseView =='fullbody'){
                                swipables.navOverlay.style[_transitionProperty] = transitionPropertyByRestT;
                                swipables.navOverlay.style[_transformProperty] = transformPropertyAtM; 
                                //setRealInnerHTML(swipables.navOverlay);
                                setTimeout(function(){ 
                                    removeAllTransfAndTransi();
                                    switchNavOverlay('on');
                                },restTms);

                            } else if(baseView == 'storyview'){
                                swipables.storyview.style[_transitionProperty] = transitionPropertyByRestT; 
                                swipables.storyview.style[_transformProperty] = transformPropertyAtR;    
                                if(_preView == "fullbody"){                                  
                                    swipables.fullbody.style[_transitionProperty] = transitionPropertyByRestT;
                                    swipables.fullbody.style[_transformProperty] = transformPropertyAtM;
                                } else if(_preView == "channelview") {          
                                    swipables.channelview.style[_transitionProperty] = transitionPropertyByRestT;
                                    swipables.channelview.style[_transformProperty] = transformPropertyAtM;
                                }
                                //setRealInnerHTML(swipables.storyview);     
                                setTimeout(function(){ 
                                    removeAllTransfAndTransi();
                                    histback('pinch');
                                },restTms);

                            } else if(baseView == 'channelview'){
                                swipables.channelview.style[_transitionProperty] = transitionPropertyByRestT;
                                swipables.fullbody.style[_transitionProperty] = transitionPropertyByRestT;
                                swipables.channelview.style[_transformProperty] = transformPropertyAtR;
                                swipables.fullbody.style[_transformProperty] = transformPropertyAtM;
                                //setRealInnerHTML(swipables.channelview);
                                setTimeout(function(){ 
                                    removeAllTransfAndTransi();
                                    histback('pinch');
                                },restTms);

                            }

                        } else if(timeSpent >= _timeSpentThres && movementSpeed>_speedThred) {//情况2：先慢后快向右滑动超过72——即timeSpent位于[200,+infi),且momentSpeed位于(0.36,+infi)
                            //monitortype.innerHTML="slowToFastToRight>72";                            
                            if(baseView =='fullbody'){
                                swipables.navOverlay.style[_transitionProperty] = transitionPropertyByRestT2;
                                swipables.navOverlay.style[_transformProperty] =transformPropertyAtM;
                                //setRealInnerHTML(swipables.navOverlay);
                                setTimeout(function(){
                                    switchNavOverlay('on');
                                    removeAllTransfAndTransi();
                                },restTms2);

                            } else if(baseView == 'storyview'){
                                swipables.storyview.style[_transitionProperty] = transitionPropertyByRestT2;         
                                swipables.storyview.style[_transformProperty] = transformPropertyAtR;
                                if(_preView == "fullbody"){
                                    swipables.fullbody.style[_transitionProperty] = transitionPropertyByRestT2; 
                                    swipables.fullbody.style[_transformProperty] = transformPropertyAtM;
                                } else if(_preView == "channelview") {
                                    swipables.channelview.style[_transitionProperty] = transitionPropertyByRestT2;
                                    swipables.channelview.style[_transformProperty] = transformPropertyAtM;
                                }   
                                //setRealInnerHTML(swipables.storyview);
                                setTimeout(function(){ 
                                    removeAllTransfAndTransi();
                                    histback('pinch');
                                },restTms2);

                                
                            } else if(baseView == 'channelview'){                      
                                swipables.channelview.style[_transitionProperty] = transitionPropertyByRestT2;
                                swipables.fullbody.style[_transitionProperty] = transitionPropertyByRestT2;
                                swipables.channelview.style[_transformProperty] = transformPropertyAtR;
                                swipables.fullbody.style[_transformProperty] = transformPropertyAtM;
                                //setRealInnerHTML(swipables.channelview);
                                setTimeout(function(){ 
                                    removeAllTransfAndTransi();
                                    histback('pinch');
                                },restTms2);

                            }  
                        } else{//情况3：正常原速向右滑动超过72——即timeSpent位于[200,+infi)，且momentSpeed位于(0,0.36]
                        	//monitortype.innerHTML="slowToRight>72";    
                            if(baseView =='fullbody'){
                                swipables.navOverlay.style[_transitionProperty] = transitionPropertyBy500;
                                swipables.navOverlay.style[_transformProperty] = transformPropertyAtM; 
                                //setRealInnerHTML(swipables.navOverlay);
                                setTimeout(function(){ 
                                    removeAllTransfAndTransi();
                                    switchNavOverlay('on');
                                },500);
                                
                            } else if(baseView == 'storyview'){ 
                                swipables.storyview.style[_transitionProperty] = transitionPropertyBy500;    
                                swipables.storyview.style[_transformProperty] = transformPropertyAtR; 
                                if(_preView == "fullbody"){    
                                    swipables.fullbody.style[_transitionProperty] = transitionPropertyBy500;    
                                    swipables.fullbody.style[_transformProperty] = transformPropertyAtM;
                                } else if(_preView == "channelview") {          
                                    swipables.channelview.style[_transitionProperty] = transitionPropertyBy500;
                                    swipables.channelview.style[_transformProperty] = transformPropertyAtM;
                                }                                
                                //setRealInnerHTML(swipables.storyview);
                                setTimeout(function(){ 
                                    removeAllTransfAndTransi();
                                    histback('pinch');
                                },500);

                            } else if(baseView == 'channelview'){
                                swipables.channelview.style[_transitionProperty] = transitionPropertyBy500;
                                swipables.fullbody.style[_transitionProperty] = transitionPropertyBy500;
                                swipables.channelview.style[_transformProperty] = transformPropertyAtR;
                                swipables.fullbody.style[_transformProperty] = transformPropertyAtM;
                                //setRealInnerHTML(swipables.channelview);
                                setTimeout(function(){ 
                                    removeAllTransfAndTransi();
                                    histback('pinch');
                                },500);
                            }

                        }
                        ga('send','event', 'App Feature', 'Swipe', 'Back');
                        
                    
                    } else if (touchDistance <-_minSwipe && baseView == 'fullbody' && swipables.navOverlay.className.indexOf(" on")>-1){//如果是向左滑动超过72px且基准页为fullbody且导航菜单触发

                        if (timeSpent > 0 && timeSpent < _timeSpentThres){//情况4：快速向左滑动超过72
                            //monitortype.innerHTML="fastToLeft>72";            
                            swipables.navOverlay.style[_transitionProperty] = transitionPropertyByRestT;
                            swipables.navOverlay.style[_transformProperty] = transformPropertyAtL;
                            //setRealInnerHTML(swipables.navOverlay);
                            window.setTimeout(function(){
                                switchNavOverlay('off');
                                removeAllTransfAndTransi();
                            },restTms);
  
                        } else if(timeSpent>=_timeSpentThres&& movementSpeed>_speedThred){///情况5：先慢后快向左滑动超过72
                            //monitortype.innerHTML="flowToFastToLeft>72"; 
                            swipables.navOverlay.style[_transitionProperty] = transitionPropertyByRestT2;
                            swipables.navOverlay.style[_transformProperty] = transformPropertyAtL;
                            //setRealInnerHTML(swipables.navOverlay);
                            window.setTimeout(function(){
                                switchNavOverlay('off');
                                removeAllTransfAndTransi();
                            },restTms2);
                            
                        } else {///情况6：慢速向左滑动超过72
                            //monitortype.innerHTML="flowToLeft>72";
                            swipables.navOverlay.style[_transitionProperty] = transitionPropertyBy500;
                            swipables.navOverlay.style[_transformProperty] = transformPropertyAtL;
                            //setRealInnerHTML(swipables.navOverlay);
                            window.setTimeout(function(){
                                switchNavOverlay('off');
                                removeAllTransfAndTransi();
                            },500); 

                        }
                        

                    } else if (touchDistance <= _minSwipe && touchDistance>=-_minSwipe){///情况7：如果向左向右滑动都没超过72px
                        //monitortype.innerHTML="moveToLeftOrRight<72"; 
                        removeAllTransfAndTransi();
                    
                    }
                
                } else {///疑问：还是想不出来isSwipe如果不为true，为什么还要移除这些属性，疑问这些属性都是在touchmove阶段设置的，且设置的前提条件就是isSwipe === true
                    removeAllTransfAndTransi();
                }               
                _touchStartX = -1;
                _touchMoveX = -1;
                _isSwiping = false;

            }, false);
        } catch (ignore){
        
        }
    }


}

