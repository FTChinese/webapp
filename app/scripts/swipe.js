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

    if (window.useFTScroller === 1) {
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
        try {
            swipables.container.addEventListener('touchstart', function(e) {
                // gNowView reflects the current view
                // update it from document.body anyway
                // in case other parts of the code has bugs
                gNowView = document.body.className;
                _screenWidth = screen.width;
                _touchStartT = (new Date()).getTime();


                // when touchstart, reset the swiping status
                _isSwiping = false;

                _histDelStory = hist.filter(function(item){
                    return (item.url.indexOf("story") == -1);
                })
                console.info("hist:"+hist);
                console.info("_histDelStory:"+_histDelStory);
               

                if(gNowView == "storyview"){
                     _histDelStoryNum = _histDelStory.length;
                     if(_histDelStoryNum == 0){//只有从主页点进来的文章，_histNum才等于1
                        _preView = "fullbody";
                    } else {
                        _preView = "channelview";
                    }
                    console.log("gNowView: "+ gNowView);
                    console.log("_preView: "+ _preView);
                } 
                
                // if 1. user is swiping on an FTScroller like the horizonal navigation on home
                // or 2. user is viewing a slide show
                // no need to trigger swiping gesture
                if (typeof window.gFTScrollerActive === "object" || swipables.slideShow.className.indexOf(' on')>0) {//如果使用了FTScroller且使用了slideShow，则通过returnfalse终止这个事件处理函数的执行
                    _touchStartX = -1;
                    _touchStartY = -1;
                    return false;
                }
                _touchStartX = e.changedTouches[0].clientX;
                _touchStartY = e.changedTouches[0].clientY;
            }, false);

            swipables.container.addEventListener('touchmove', function(e) {
                // horizontal move distance
                var xDistance;
                // vertical movement distance
                var yDistance;
                
                //手指横向滑动的方向
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
                xDistance = Math.abs(_touchMoveX - _touchStartX);//手指横向滑动距离

                xDirection = (_touchMoveX-_touchStartX)>0? "toRight":"toLeft";

                yDistance = Math.abs(_touchMoveY - _touchStartY);//手指纵向滑动距离


                if (_touchStartX !== -1) {//当其等于-1就是要么用了FTScroller要么是slideShow，这时横向滑动应该是无效的
                    //whether the user is swiping or scrolling

                    if (xDistance > _startSwipe && typeof window.gFTScrollerActive !== "object" && yDistance < _minVerticalScroll && yDistance/xDistance < 0.5) {//当横坐标滑动距离超过15px，且没有用FTScroller，且纵坐标滑动距离不到30px，且x滑动距离比y滑动距离的两倍还多
                        window.gFTScrollerActive = {};
                        _isSwiping = true;//这时被判定为确实是在进行横向滑动动作
                    }

                    // if the swiping is true
                    // provide visual feedback
                    if (_isSwiping === true) {

                        ///如果是处在首页的情况下：
                        if (gNowView === 'fullbody') {
                            // home page swiping to right
                            // reveal the navigation

                            if (swipables.navOverlay.className.indexOf(' on')<0 && xDirection == "toRight") {//如果没有打开导航菜单
                                translateX = xDistance - _navListWidth;//手指划过的距离一旦大于菜单宽度，则不能再往外拉了
                                //待修改bug:往左滑也会和往右滑一样拉出导航菜单
                                //拉开时往右滑：translateX小于0,绝对值越来越小，即其值越来越大，translate3d(translateX,0,0)才能向右
                                

                            } else if(swipables.navOverlay.className.indexOf('on')>-1 && xDirection == "toLeft") {
                                translateX = -xDistance;
                                //收拢时往左滑，translateX还是小于0，且绝对值越来越大，即其值越来越小
                            }
                            
                            if (translateX > 0) {
                                translateX = 0;
                            }
                            swipables.navOverlay.style[_transitionProperty] = 'all 0s ease-in-out';
                            swipables.navOverlay.style[_transformProperty] = 'translate3d('+translateX+'px, 0, 0)';
                             //swipables.navOverlay.style[_transformProperty] = 'translateX('-translateX+'px)';

                        } else if(gNowView == 'storyview') {///如果是处在文章页的情况下,只用考虑向有滑动
                            if(xDirection == "toRight"){
                                //对于文章页，直接拉到右边去，故该处x值是从0变到100%的，就等于xDistance
                                translateX = xDistance;//translateX始终为正，往右滑动距离越大，translateX越大，这样才能实现元素向右动

                                swipables.storyview.style[_transitionProperty] = 'all 0s ease-in-out';
                                swipables.storyview.style[_transformProperty] = 'translate3d('+translateX+'px,0,0)';

                                
                                ///上一页不管是主页or频道页，都是从左边拉到中间去，故该处x值是从-100%变到0的，就等于(xDistance - 屏幕宽度)
                                previewTranslateX = xDistance - _screenWidth;


                                ///这里要判断其上一页是主页or频道页
                                if(_preView == "fullbody"){
                                     
                                    swipables.fullbody.style[_transitionProperty] = 'all 0s ease-in-out';
                                    swipables.fullbody.style[_transformProperty] = 'translate3d('+previewTranslateX+'px,0,0)';
                                } else if(_preView == "channelview") {
                                    swipables.channelview.style[_transitionProperty] = 'all 0s ease-in-out';
                                    swipables.channelview.style[_transformProperty] = 'translate3d('+previewTranslateX+'px,0,0)';
                                }
                               
                            }

                        } else if(gNowView == "channelview") {
                            if(xDirection == "toRight"){
                                //对于频道页，直接拉到右边去，故该处x值是从0变到100%的，就等于xDistance
                                translateX = xDistance;

                                swipables.channelview.style[_transitionProperty] = 'all 0s ease-in-out';
                                swipables.channelview.style[_transformProperty] = 'translate3d('+translateX+'px,0,0)';

                                //那么preView肯定是主页了
                                ///上一页是主页，是从左边拉到中间去，故该处x值是从-100%变到0的，就等于(xDistance - 屏幕宽度)
                                previewTranslateX = xDistance - _screenWidth;
                                 swipables.fullbody.style[_transitionProperty] = 'all 0s ease-in-out';
                                    swipables.fullbody.style[_transformProperty] = 'translate3d('+previewTranslateX+'px,0,0)';
                            }
                        }

                    }
                }
            }, false);

            swipables.container.addEventListener('touchend', function(e) {
                //alert("touchend");
                var timeSpent;
                window.gFTScrollerActive = false;
                _touchEndT = (new Date()).getTime();
                timeSpent = _touchEndT - _touchStartT;

                if (timeSpent > 0 && timeSpent < 1000) {
                    
                }



                if (_isSwiping === true) {//
                    e.preventDefault();//待查证：touchend默认行为是什么？？看不出来
                }
                _touchMoveX = e.changedTouches[0].clientX;//手指离开屏幕时的横坐标位置
                _touchMoveY = e.changedTouches[0].clientY;//手指离开屏幕时的纵坐标位置
                try {
                    if(gNowView==='fullbody'){
                        swipables.navOverlay.style.removeProperty(_transitionProperty);//移除_transitionProperty属性
                        swipables.navOverlay.style.removeProperty(_transformProperty);//移除_transformProperty属性
                    } else if(gNowView === 'storyview'){
                        swipables.storyview.style.removeProperty(_transitionProperty);
                        swipables.storyview.style.removeProperty(_transformProperty);

                        if(_preView == 'fullbody'){
                            swipables.fullbody.style.removeProperty(_transitionProperty);
                            swipables.fullbody.style.removeProperty(_transformProperty);
                        } else if (_preView == 'channelview') {
                            swipables.channelview.style.removeProperty(_transitionProperty);
                            swipables.channelview.style.removeProperty(_transformProperty);
                        }
                        
                    } else if (gNowView == 'channelview') {
                        swipables.channelview.style.removeProperty(_transitionProperty);
                        swipables.channelview.style.removeProperty(_transformProperty);
                        swipables.fullbody.style.removeProperty(_transitionProperty);
                        swipables.fullbody.style.removeProperty(_transformProperty);

                    }
                    
                } catch (ignore) {

                }
                //console.log ('_isSwiping: ' + _isSwiping)
                //If the swiping is true
                if (_isSwiping === true) {

                    if ((_touchMoveX - _touchStartX > _minSwipe)) {//滑动距离向右大于72px，直接自动拉满
                        if (gNowView==='fullbody') {
                            switchNavOverlay('on');
                            //swipables.navOverlay.classList.add("darkbg");
                        } else {
                            histback('pinch');
                        }


                        ga('send','event', 'App Feature', 'Swipe', 'Back');
                        //console.log ('go right!');
                        _touchStartX = -1;
                    } else if (_touchMoveX - _touchStartX < -_minSwipe){//如果滑动距离是向左的大于72px，直接自动收回
                        if (gNowView==='fullbody') {
                            switchNavOverlay('off');

                        }
                        //console.log ('go left!');
                        _touchStartX = -1;
                    } 

                }
                _touchStartX = -1;
                _touchMoveX = -1;
                _isSwiping = false;
            }, false);
        } catch (ignore){
        
        }
    }
}