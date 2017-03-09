// MARK: - The data object for all the iap products

// window.iapProducts = [{title: '汇改后的中国经济',description: '人民币无疑是当前宏观经济政策制定者和全球金融市场最关注的问题之一。<br>“8·11”汇改全球市场震动，一周年过去了，人民币的故事并没有结束。如何评价这一事件？中国对世界经济影响有何变化？人民币在全球市场上究竟占据何种地位？与美元的“难舍难分”又会带来什么影响？<br>随着人民币正式加入SDR在即，经济放缓下的没有结束。如何评价这一事件？中国对世界经济影响有何变化？人民币在全球市场上究竟占据何种地位？与美元的“难舍难分”又会带来什么影响？<br>随着人民币正式加入SDR在即，经济放缓下的贬值压力也随之加大。人民币会继续贬值吗？想要打破贬值预期，到底应该怎么做？',price: '￥6.00',id: 'com.ft.ftchinese.mobile.book.ChinaEconomyAfterFXReform',image: 'http://i.ftimg.net/picture/1/000065581_piclink.jpg', teaser: '人民币会继续贬值吗？', isPurchased: true, isDownloaded: true, group: 'ebook', groupTitle: 'FT电子书'},{title: '与FT共进午餐（一）',description: '英国《金融时报》的“Lunch with the FT”栏目诞生于1994年，邀请各界人士在餐桌上向FT敞开心扉，谈论美食、爱好、家庭，展露他们职业生涯之外更真实的生活状态，迄今已经采访了800多人，可谓一卷丰富多彩的人物志。<br>在第一辑中您将看到对比尔·盖茨、诺界人士在餐桌上向FT敞开心扉，谈论美食、爱好、家庭，展露他们职业生涯之外更真实的生活状态，迄今已经采访了800多人，可谓一卷丰富多彩的人物志。<br>在第一辑中您将看到对比尔·盖茨、诺奖得主尤努斯，郭广昌等各领域知名人士的采访。',price: '￥6.00',id: 'com.ft.ftchinese.mobile.book.lunch1',image: 'http://i.ftimg.net/picture/6/000061936_piclink.jpg', teaser: '英国《金融时报》最受欢迎的栏目', isPurchased: true, isDownloaded: true, group: 'ebook', groupTitle: 'FT电子书'},{title: '与FT共进午餐（二）',description: '《与FT共进午餐》多年来都是FT周末版最受欢迎的栏目之一。<br>精英名流们在餐桌上向FT敞开心扉，谈论美食、爱好、家庭，展露他们职业生涯之外更真实的生活状态。<br>采访过程也很独特——由被采访对象指定餐厅，餐后由FT付账，或奢或俭，文章末尾都会列出菜单和价格。<br>总之。《与FT共论美食、爱好、家庭，展露他们职业生涯之外更真实的生活状态。<br>采访过程也很独特——由被采访对象指定餐厅，餐后由FT付账，或奢或俭，文章末尾都会列出菜单和价格。<br>总之。《与FT共进午餐》是FT上最有看头的栏目。<br>在这期您将看到我们采访：奥沙利文、郎朗、安吉丽娜·朱莉等各领域知名人物。',price: '￥6.00',id: 'com.ft.ftchinese.mobile.book.lunch2',image: 'http://i.ftimg.net/picture/7/000061937_piclink.jpg', teaser: '英国《金融时报》最受报》最受欢迎的栏目', isPurchased: true, isDownloaded: true, group: 'ebook', groupTitle: 'FT电子书'},{title: 'FT研究院',description: '管窥蠡测，以知一叶之秋。基于百万读者的大样本调研数据，同时广泛汲取公开数据资源，《FT研究院》专注热点财经问题及重要行业发展趋势的研究，致力于为广大读者提供贴近商业实况的前瞻性分析与洞察。',price: '￥68.00',id: 'com.ft.ftchinese.mobile.subscription.intelligence2',image: 'http://i.ftimg.net/picture/3/000068413_piclink.jpg', teaser: '中国商业和消费数据', isPurchased: false, isDownloaded: false, group: 'subscription', groupTitle: '订阅'}];

// MARK: - The HTML template for iap channel pages like eBook store or subscription center, so that you don't have to load from web
var channelPageTemplate = '<div class="channel-iap" id="channelScroller" style="overflow-y: scroll;"><div id="channelContent"><div id="head" onclick="switchNavOverlay()"><div class="header"><div class="channeltitle">[channelTitle]</div></div></div><div class="layout-a_region-3"><div class="inner"><div class="container">[channelContent]</div></div></div><div class="layout-a_region-4"><div class="inner"><div class="adiframe mpu loaded-in-view" type="250" frame="ad300x250"></div></div></div><div class="copyright"><b><font face="arial">© </font>英国金融时报</b> 有限公司 <font face="arial">2017</font>&nbsp;&nbsp;<span><acronym title="Financial Times">FT中文网</acronym>为英国金融时报的注册商标</span></div></div></div>';

// MARK: - Display all the iap products on the home page
function displayProductsOnHome(products) {

// TODO: When displaying iap products on home, it should be grouped by type
  if (typeof products === 'object' && products.length > 0) {
    var productsHTML = getProductHTMLCode (products, 'all');
    if (document.getElementById('iap')) {
      document.getElementById('iap').innerHTML = productsHTML;
    }
  }
}

// MARK: - Create the HTML Code for iap Products to be displayed on home and channel pages
// MARK: - forGroup is used as filter to get only the specified iap type for channel page
function getProductHTMLCode (products, forGroup) {
	var productsHTML = '';
	var currentGroup = '';
	if (typeof products === 'object' && products.length > 0) {
	    for (var i=0; i<products.length; i++) {
	    	if (forGroup === 'all' || forGroup === products[i].group) {
		    	var firstChildClass = '';
		    	var productActionButton = '';
		    	var productPrice = products[i].price || '购买';
		    	// MARK: If the forGroup is set to all, display all products in groups
				if (forGroup ==='all' && currentGroup !== products[i].group) {
					currentGroup = products[i].group;
					productsHTML += '<div class="section"><a class="iap-channel" iap-action="' + currentGroup + '" iap-title="' + products[i].groupTitle +'"><span>' + products[i].groupTitle +'</span></a><a href="restorepurchases://"><button class="floatright">恢复</button></a></div>';
					firstChildClass = ' first-child';
				}
				if (products[i].isDownloaded === true) {
					productActionButton = '<div class="iap-button" product-id="' + products[i].id + '"><a href="readbook://' + products[i].id + '"><button class="iap-move-left">打开</button></a><a href="removedownload://' + products[i].id + '"><button>删除</button></a></div>';
				} else if (products[i].isPurchased === true) {
					productActionButton = '<div class="iap-button" product-id="' + products[i].id + '"><a href="downloadproduct://' + products[i].id + '"><button>下载</button></a></div>';
				} else {
					productActionButton = '<div class="iap-button" product-id="' + products[i].id + '" product-price="' + productPrice + '"><button onclick="showProductDetail(\'' + products[i].id + '\');" class="iap-detail">查看</button><a href="buy://' + products[i].id + '"><button class="iap-move-left">' + productPrice + '</button></a></div>';
				}
				// MARK: - use onclick to capture click rather than jQuery's body.on, which is buggy on iPhone
				productsHTML += '<div product-id="' + products[i].id + '" class="iap-item oneStory' + firstChildClass + ' track-click" eventLabel="iap-detail: '+i+'"><div onclick="showProductDetail(\'' + products[i].id + '\');"><img src="https://www.ft.com/__origami/service/image/v2/images/raw/' + products[i].image + '?source=ftchinese&width=160" class=leftimage width="80"><div class="headline">' + products[i].title + '</div><div class=lead>' + products[i].teaser + '</div></div>' + productActionButton + '<div class=clearfloat></div></div>';	
	    	}
	    }
	}
    return productsHTML;
}

// MARK: - extract product information and display it to home or channel page
function displayProducts(products, page, pageTitle) {
  if (typeof products === 'object' && products.length > 0) {
  	// TODO: Page should be used as a filter, for example, "ebook" should be used to extra only the eBooks from the iapProducts


  	var productsHTML = getProductHTMLCode (products, page);
    // MARK: - if page is not 'home', then we should open channel view
    if (page !== '') {
    	var channelHTML = channelPageTemplate
    		.replace('[channelContent]',productsHTML)
    		.replace('[channelTitle]',pageTitle);
    	var channelView = $('#channelview');
    	channelView.html(channelHTML);
    	document.getElementById('header-title').innerHTML = pageTitle;
    	closeOverlay();
    	document.body.className = 'channelview channel-iap';
	    gNowView = 'channelview';
	    if (useFTScroller===0) {
	        window.scrollTo(0, 0);
	    }
	    // MARK: - Send Traffic Data so that this can be tracked
	    var url = gDeviceType + '/channelpage/iap/'+ page;
	    httpspv(url);
	    // MARK: 记录频道页浏览历史
	    if (hist && ((hist[0] && hist[0].url != url) || hist.length==0)) {
	        hist.unshift({'url': '/channelpage/iap/'+ page, 'title': pageTitle});
	    }
    }
  }
}

// MARK: - Open the product detail page so that user can buy, download and use the product
function showProductDetail(productId) {
	// MARK: - Get current product information
	var currentProduct;
	if (typeof iapProducts === 'object' && iapProducts.length > 0) {
	    for (var i=0; i<iapProducts.length; i++) {
	    	if (iapProducts[i].id === productId) {
	    		currentProduct = iapProducts[i];
	    		break;
	    	}
	    }
	}
	// MARK: - Display the story view
	if (typeof currentProduct === 'object') {
		// MARK: - Calculate Product Information
		var storyView = document.getElementById('storyview');
		var imageHTML = '<div class="leftPic imageloaded"><img src="https://www.ft.com/__origami/service/image/v2/images/raw/'+ currentProduct.image +'?source=ftchinese&width=414"></div>';

		// MARK: - Get iap-rail Dom innerHTML to display two buttons at the bottom of product detail 
		var iapRailHTML = '';
		if (currentProduct.isPurchased === false && currentProduct.isDownloaded === false) {
			iapRailHTML = '<a href="buy://' + currentProduct.id + '"><button class="floatright iap-highlight">购买：'+currentProduct.price+'</button></a><a href="try://' + currentProduct.id + '"><button class="floatleft">试读</button></a>';
		} else if (currentProduct.isPurchased === true && currentProduct.isDownloaded === false) {
			iapRailHTML = '<a href="downloadproduct://' + currentProduct.id + '"><button class="full-width iap-highlight">下载</button></a>';
		} else if (currentProduct.isPurchased === true && currentProduct.isDownloaded === true) {
			iapRailHTML = '<a href="readbook://' + currentProduct.id + '"><button class="floatright iap-highlight">打开</button></a><a href="removedownload://' + currentProduct.id + '"><button class="floatleft">删除</button></a>';
		}

		// MARK: - Update Dom here
		storyView.querySelector('.storydate').innerHTML = '';
		storyView.querySelector('.storybyline').innerHTML = '';
		storyView.querySelector('.storytitle').innerHTML = currentProduct.title;
		document.getElementById('bodytext').innerHTML = imageHTML + currentProduct.description;
		document.getElementById('header-title').innerHTML = currentProduct.groupTitle || '';

		// MARK: - Update the iap-rail Button
		document.getElementById('iap-rail').innerHTML = iapRailHTML;
		document.getElementById('iap-rail').setAttribute('data-id', productId);
		document.getElementById('iap-rail').setAttribute('data-price', currentProduct.price);

		// MARK: - Display the storyview by changing the className of body
		document.body.className = 'storyview story-iap';
		gNowView = 'storyview';
		addStoryScroller();
		
	    // MARK: - Send Traffic Data so that this can be tracked
	    httpspv(gDeviceType + '/storypage/iap'+ productId);

	    // MARK: update the hist array so that it can be swiped back
	    if (hist && ((hist[0] && hist[0].url != 'story/' + productId) || hist.length==0)) {
	        hist.unshift({'url': 'story/'+ productId, 'title': currentProduct.title});
	    }
	}
}

// MARK: - Update window.iapProducts after user act on any one of the products
function updateProductStatus(productIndex, isProductPurchased, isProductDownloaded) {
	if (productIndex>=0 && window.iapProducts[productIndex]) {
		window.iapProducts[productIndex].isPurchased = isProductPurchased;
		window.iapProducts[productIndex].isDownloaded = isProductDownloaded;
	} 
}


function getViewPrefix() {
	var viewPrefix = '';
	if (gNowView.indexOf('storyview') >= 0) {
		viewPrefix = 'story-';
	} else if (gNowView.indexOf('channelview') >= 0) {
		viewPrefix = 'channel-';
	}
	return viewPrefix;
}

// MARK: - Update DOM UI based on user actions
function iapActions(productID, actionType) {
	var iapButtons;
	var iapRailHTML = '';
	var iapHTMLCode = '';
	var productPrice = '';
	var productIndex;

	// MARK: - current view prefix
	var viewPrefix = getViewPrefix();

	// MARK: get iapButtons based on the current view
	var currentView = 'fullbody';
	if (gNowView.indexOf('storyview') >= 0) {
		currentView = 'storyview';
	} else if (gNowView.indexOf('channelview') >= 0) {
		currentView = 'channelview';
	}

	iapButtons = document.getElementById(currentView).querySelectorAll('.iap-button');

	// MARK: - Get the index number of the current product for window.iapProducts
	if (productID !== '') {
		for (var i=0; i < window.iapProducts.length; i++) {
			if (productID === iapProducts[i].id) {
				productIndex = i;
				break;
			}
		}
	}

	// MARK: - get product price here
	productPrice = window.iapProducts[productIndex].price || '购买';

	// MARK: - iapHTMLCode is used for home and channel page, iapRailHTML is used for product detail page
	switch(actionType) {
	    case 'success':
	        iapHTMLCode = '<a href="readbook://' + productID + '"><button class="iap-move-left">打开</button></a><a href="removedownload://' + productID + '"><button>删除</button></a>';
	        iapRailHTML = '<a href="readbook://' + productID + '"><button class="floatright iap-highlight">打开</button></a><a href="removedownload://' + productID + '"><button class="floatleft">删除</button></a>';
	        updateProductStatus(productIndex, true, true);
	        break;
	    case 'pendingdownload':
	        iapHTMLCode = '<a href="downloadproduct://' + productID + '"><button>下载</button></a>';
	        iapRailHTML = '<a href="downloadproduct://' + productID + '"><button class="full-width iap-highlight">下载</button></a>';
	        updateProductStatus(productIndex, true, false);
	        break;
	    case 'downloading':
	        iapHTMLCode = '<a id="' + viewPrefix + 'pause-' + productID + '" href="pausedownload://' + productID + '"><button class="iap-move-left pause-button">暂停</button></a><a href="canceldownload://' + productID + '"><button>取消</button></a><div class="progresscontainer"><div class="progressbar standardprogressbar uses3d progressbg structureprogress" id="' + viewPrefix + 'progress-' + productID + '"></div></div><div id="' + viewPrefix + 'status-' + productID + '" class="download-status"></div>';
	        iapRailHTML = '<a href="canceldownload://' + productID + '"><button class="quarter-width floatright">取消</button></a><a id="story-pause-' + productID + '" href="pausedownload://' + productID + '"><button class="pause-button quarter-width floatright">暂停</button></a><div class="progresscontainer"><div class="progressbar standardprogressbar uses3d progressbg structureprogress" id="' + viewPrefix + 'progress-' + productID + '"></div></div><div id="' + viewPrefix + 'status-' + productID + '" class="download-status"></div>';
	        updateProductStatus(productIndex, true, false);
	        break;
	    case 'pending':
	        iapHTMLCode = '<button>请求...</button>';
	        iapRailHTML = '<button class="full-width">请求...</button>';
	        updateProductStatus(productIndex, false, false);
	        break;
	    case 'fail':
	        iapHTMLCode = '<a href="buy://' + productID + '"><button class="iap-move-left">'+productPrice+'</button></a><button onclick="showProductDetail(\'' + productID + '\');" class="iap-detail">查看</button>';
	        iapRailHTML = '<a href="buy://' + productID + '"><button class="floatright iap-highlight">购买：'+productPrice+'</button></a><a href="try://' + productID + '"><button class="floatleft">试读</button></a>';
	        updateProductStatus(productIndex, false, false);
	        break;
	    default:
	}

	// MARK: - for each of the iap button containers that fit the criteria, update its innerHTML
	for (var i=0; i<iapButtons.length; i++) {
		//productPrice = iapButtons[i].getAttribute('product-price') || '购买';
		if (productID === iapButtons[i].getAttribute('product-id')) {
			//iapHTMLCode = iapHTMLCode.replace('[productprice]',productPrice);
			iapButtons[i].innerHTML = iapHTMLCode;
		} else if (productID === '') {
			iapHTMLCode = '<a href="buy://' + iapButtons[i].getAttribute('product-id') + '"><button class="iap-move-left">' + productPrice + '</button></a><button onclick="showProductDetail(\'' + products[i].id + '\');" class="iap-detail">查看</button>';
			iapButtons[i].innerHTML = iapHTMLCode;
		}
	}

	// Mark: Update iap Button at the bottom of the detail view
	if (productID !== '' && document.getElementById('iap-rail').getAttribute('data-id') === productID && gNowView.indexOf('storyview') >= 0) {
		document.getElementById('iap-rail').innerHTML = iapRailHTML;
	}

}

// MARK: - Update download progress and status based on the current view
function updateDownloadProgress(productID, barPercentage, progressStatus) {
	if (gNowView.indexOf('storyview') >= 0) {
		document.getElementById('story-progress-' + productID).style.width = barPercentage;
		document.getElementById('story-status-' + productID).innerHTML = progressStatus;
	} else {
		// TODO: need to update progress bars in both home and channel pages
		var viewPrefix = getViewPrefix();
		document.getElementById(viewPrefix + 'progress-' + productID).style.width = barPercentage;
		document.getElementById(viewPrefix + 'status-' + productID).innerHTML = progressStatus;
	}
}

// MARK: - Update download pause button based on user interaction
function updateDownloadPauseButton(productID, action) {
	var pauseButton;
	var viewPrefix = getViewPrefix();
	pauseButton = document.getElementById(viewPrefix + 'pause-' + productID);

	var newAction;
	var newHref;
	if (action === 'pause') {
		newAction = '继续';
		newHref = 'resumedownload://' + productID;
	} else {
		newAction = '暂停';
		newHref = 'pausedownload://' + productID;
	}

	pauseButton.querySelector('.pause-button').innerHTML = newAction;
	pauseButton.setAttribute('href', newHref);
}