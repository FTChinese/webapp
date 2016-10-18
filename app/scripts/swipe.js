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
    var _navListWidth = document.getElementById('navList').offsetWidth || 270;

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
                if (typeof window.gFTScrollerActive === "object" || swipables.slideShow.className.indexOf(' on')>0) {
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
                // for visual feedback
                var translateX;
                // if the user is locked in the swiping mode
                // disable vertical scrolling
                // this works for iOS 7 and above
                if (_isSwiping === true) {
                	e.preventDefault();
                }
                // if the user is engaged in a FT Scroller activity
                // or if he is viewing a photo slide
                // abandon ensuing operations
                if ( (typeof window.gFTScrollerActive === "object" && _isSwiping === false) || swipables.slideShow.className.indexOf(' on')>0 ) {
                    _touchStartX = -1;
                    _touchMoveX = -1;
                    _touchStartY = -1;
                    _touchMoveY = -1;
                    return false;
                }
                _touchMoveX = e.changedTouches[0].clientX;
                _touchMoveY = e.changedTouches[0].clientY;
                xDistance = Math.abs(_touchMoveX - _touchStartX);
                yDistance = Math.abs(_touchMoveY - _touchStartY);
                if (_touchStartX !== -1) {
                    //whether the user is swiping or scrolling
                    if (xDistance > _startSwipe && typeof window.gFTScrollerActive !== "object" && yDistance < _minVerticalScroll && yDistance/xDistance < 0.5) {
                        window.gFTScrollerActive = {};
                        _isSwiping = true;
                    }
                    // if the swiping is true
                    // provide visual feedback
                    if (_isSwiping === true) {
                        if (gNowView === 'fullbody') {
                            // home page swiping to right
                            // reveal the navigation
                            if (swipables.navOverlay.className.indexOf(' on')<0) {
                                translateX = xDistance - _navListWidth;
                                if (translateX > 0) {
                                    translateX = 0;
                                }

                            } else {

                            }
                            swipables.navOverlay.style[_transitionProperty] = 'all 0s ease-in-out';
                            swipables.navOverlay.style[_transformProperty] = 'translate3d('+translateX+'px, 0, 0)';
                        }
                    }
                }
            }, false);

            swipables.container.addEventListener('touchend', function(e) {
                window.gFTScrollerActive = false;
                if (_isSwiping === true) {
                    e.preventDefault();
                }
                _touchMoveX = e.changedTouches[0].clientX;
                _touchMoveY = e.changedTouches[0].clientY;
                try {
                    swipables.navOverlay.style.removeProperty(_transitionProperty);
                    swipables.navOverlay.style.removeProperty(_transformProperty);
                } catch (ignore) {

                }
                //console.log ('_isSwiping: ' + _isSwiping)
                //If the swiping is true
                if (_isSwiping === true) {

                    if ((_touchMoveX - _touchStartX > _minSwipe && _moveState === 0)) {
                        if (gNowView==='fullbody') {
                            switchNavOverlay('on');
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