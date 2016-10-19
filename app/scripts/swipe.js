function initSwipeGesture() {
    // doms for swipables
    var swipables = {
        // attach touchstart, touchmove and touchend to the container
        'container': document.getElementById('fullbodycontainer'),
        // navigation menu
        'navOverlay': document.getElementById('navOverlay'),
        // slide show
        'slideShow': document.getElementById('slideShow')
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
    var _moveState = 0;

    // Determine the browser engine and prefix, trying to use the unprefixed version where available.
    var _vendorCSSPrefix;
    var _vendorStylePropertyPrefix;
    var _vendorTransformLookup;
    var _transformProperty;
    var _transitionProperty;

    // meature width of navigation
    var _navListWidth = document.getElementById('navList').offsetWidth || 270;//这就是导航菜单的宽度

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

                // when touchstart, reset the swiping status
                _isSwiping = false;

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
                var xDirection;
                //手指横向滑动的方向
                var yDistance;
                // for visual feedback
                var translateX;
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
                        }

                    }
                }
            }, false);

            swipables.container.addEventListener('touchend', function(e) {
                //alert("touchend");
                window.gFTScrollerActive = false;

                if (_isSwiping === true) {//如果刚刚还是确实是在进行横向滑动，则就还不用执行touchend事件，应该还是继续执行touchmove事件
                    e.preventDefault();
                }
                _touchMoveX = e.changedTouches[0].clientX;//手指离开屏幕时的横坐标位置
                _touchMoveY = e.changedTouches[0].clientY;//手指离开屏幕时的纵坐标位置
                try {
                    swipables.navOverlay.style.removeProperty(_transitionProperty);//移除_transitionProperty属性
                    swipables.navOverlay.style.removeProperty(_transformProperty);//移除_transformProperty属性
                } catch (ignore) {

                }
                //console.log ('_isSwiping: ' + _isSwiping)
                //If the swiping is true
                if (_isSwiping === true) {

                    if ((_touchMoveX - _touchStartX > _minSwipe && _moveState === 0)) {//只有滑动距离大于72px，才设置'on'的阴影效果
                        if (gNowView==='fullbody') {
                            switchNavOverlay('on');
                            //swipables.navOverlay.classList.add("darkbg");
                        } else {
                            histback('pinch');
                        }
                        ga('send','event', 'App Feature', 'Swipe', 'Back');
                        //console.log ('go right!');
                        _touchStartX = -1;
                    } else if (_touchMoveX - _touchStartX < -_minSwipe && _moveState ===0){
                        if (gNowView==='fullbody') {
                            switchNavOverlay('off');

                        }
                        //console.log ('go left!');
                        _touchStartX = -1;
                    } else if ((_touchMoveX - _touchStartX > _minSwipe && _moveState<0) || (_touchMoveX - _touchStartX < -_minSwipe && _moveState>0)) {
                        //console.log ('donot go!');
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