window.iapProducts = [{title: '汇改后的中国经济',description: '人民币无疑是当前宏观经济政策制定者和全球金融市场最关注的问题之一。<br>“8·11”汇改全球市场震动，一周年过去了，人民币的故事并没有结束。如何评价这一事件？中国对世界经济影响有何变化？人民币在全球市场上究竟占据何种地位？与美元的“难舍难分”又会带来什么影响？<br>随着人民币正式加入SDR在即，经济放缓下的贬值压力也随之加大。人民币会继续贬值吗？想要打破贬值预期，到底应该怎么做？',price: 'CN¥6.00',id: 'com.ft.ftchinese.mobile.book.ChinaEconomyAfterFXReform',image: 'http://i.ftimg.net/picture/1/000065581_piclink.jpg', teaser: '人民币会继续贬值吗？', isPurchased: false, isDownloaded: false},{title: '与FT共进午餐（一）',description: '英国《金融时报》的“Lunch with the FT”栏目诞生于1994年，邀请各界人士在餐桌上向FT敞开心扉，谈论美食、爱好、家庭，展露他们职业生涯之外更真实的生活状态，迄今已经采访了800多人，可谓一卷丰富多彩的人物志。<br>在第一辑中您将看到对比尔·盖茨、诺奖得主尤努斯，郭广昌等各领域知名人士的采访。',price: 'CN¥6.00',id: 'com.ft.ftchinese.mobile.book.lunch1',image: 'http://i.ftimg.net/picture/6/000061936_piclink.jpg', teaser: '英国《金融时报》最受欢迎的栏目', isPurchased: false, isDownloaded: false},{title: '与FT共进午餐（二）',description: '《与FT共进午餐》多年来都是FT周末版最受欢迎的栏目之一。<br>精英名流们在餐桌上向FT敞开心扉，谈论美食、爱好、家庭，展露他们职业生涯之外更真实的生活状态。<br>采访过程也很独特——由被采访对象指定餐厅，餐后由FT付账，或奢或俭，文章末尾都会列出菜单和价格。<br>总之。《与FT共进午餐》是FT上最有看头的栏目。<br>在这期您将看到我们采访：奥沙利文、郎朗、安吉丽娜·朱莉等各领域知名人物。',price: 'CN¥6.00',id: 'com.ft.ftchinese.mobile.book.lunch2',image: 'http://i.ftimg.net/picture/7/000061937_piclink.jpg', teaser: '英国《金融时报》最受欢迎的栏目', isPurchased: false, isDownloaded: false},{title: 'FT研究院',description: '管窥蠡测，以知一叶之秋。基于百万读者的大样本调研数据，同时广泛汲取公开数据资源，《FT研究院》专注热点财经问题及重要行业发展趋势的研究，致力于为广大读者提供贴近商业实况的前瞻性分析与洞察。',price: 'CN¥68.00',id: 'com.ft.ftchinese.mobile.subscription.intelligence2',image: 'http://i.ftimg.net/picture/3/000068413_piclink.jpg', teaser: '中国商业和消费数据', isPurchased: false, isDownloaded: false}];

// MARK: - The HTML template for channel pages, so that you don't have to load from web
var channelPageTemplate = '<div id="channelScroller" style="overflow-y: scroll;"><div id="channelContent"><div id="head" onclick="switchNavOverlay()"><div class="header"><div class="channeltitle">[channelTitle]</div></div></div><div class="layout-a_region-3"><div class="inner"><div class="container">[channelContent]</div></div></div><div class="layout-a_region-4"><div class="inner"><div class="adiframe mpu loaded-in-view" type="250" frame="ad300x250"></div></div></div><div class="copyright"><b><font face="arial">© </font>英国金融时报</b> 有限公司 <font face="arial">2017</font>&nbsp;&nbsp;<span><acronym title="Financial Times">FT中文网</acronym>为英国金融时报的注册商标</span></div></div></div>';

function displayProductsOnHome(products) {
  if (typeof products === 'object' && products.length > 0) {
    var productsHTML = getProductHTMLCode (products);
    if (document.getElementById('iap')) {
      document.getElementById('iap').innerHTML = productsHTML;
    }
  } 
}

function getProductHTMLCode (products) {
	var productsHTML = '';
	if (typeof products === 'object' && products.length > 0) {
	    for (var i=0; i<products.length; i++) {
	    	var firstChildClass = '';
	    	var productActionButton = '';
			if (i===0) {
				productsHTML += '<div class="section"><a onclick="showchannel(\'/index.php/ft/channel/phonetemplate.html?channel=ebook\',\'FT电子书\')"><span>FT电子书</span></a><a href="restorepurchases://"><button class="floatright">恢复</button></div>';
				firstChildClass = ' first-child';
			}

			if (products[i].isDownloaded === true) {
				productActionButton = '<div class="iap-button" product-id="' + products[i].id + '"><a href="readbook://' + products[i].id + '"><button class="iap-move-left">打开</button></a><a href="removedownload://' + products[i].id + '"><button>删除</button></a></div>';
			} else if (products[i].isPurchased === true) {
				productActionButton = '<div class="iap-button" product-id="' + products[i].id + '"><a href="downloadproduct://' + products[i].id + '"><button>下载</button></a></div>';
			} else {
				productActionButton = '<div class="iap-button" product-id="' + products[i].id + '" product-price="' + products[i].price + '"><button class="iap-detail">查看</button><a href="buy://' + products[i].id + '"><button class="iap-move-left">' + products[i].price + '</button></a></div>';
			}
			productsHTML += '<div product-id="' + products[i].id + '" class="iap-item oneStory' + firstChildClass + ' track-click" eventLabel="iap-detail: '+i+'"><img src="https://www.ft.com/__origami/service/image/v2/images/raw/' + products[i].image + '?source=ftchinese&width=160" class=leftimage width="80"><div class="headline">' + products[i].title + '</div><div class=lead>' + products[i].teaser + '</div>' + productActionButton + '<div class=clearfloat></div></div>';
	    }
	}
    return productsHTML;
}

function displayProducts(products, page, pageTitle) {
  if (typeof products === 'object' && products.length > 0) {
  	var productsHTML = getProductHTMLCode (products);
    // MARK: - if page is not 'home', then we should open channel view
    if (page !== '') {
    	var channelHTML = channelPageTemplate
    		.replace('[channelContent]',productsHTML)
    		.replace('[channelTitle]',pageTitle);
    		console.log (channelHTML);
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
	    httpspv(gDeviceType + '/channelpage/iap/'+ page);
	    // console.log (gDeviceType + '/channelpage/iap/'+ page);
    }
  }
}

function showProductDetail(productId) {
	console.log (productId + ' should be displayed. ');
	var currentProduct;
	// TODO: - Get product information
	if (typeof iapProducts === 'object' && iapProducts.length > 0) {
	    for (var i=0; i<iapProducts.length; i++) {
	    	if (iapProducts[i].id === productId) {
	    		currentProduct = iapProducts[i];
	    		break;
	    	}
	    }
	}
	// TODO: - Display the story view
	if (typeof currentProduct === 'object') {
		var storyView = document.getElementById('storyview');
		var imageHTML = '<div class="leftPic imageloaded"><img src="https://www.ft.com/__origami/service/image/v2/images/raw/'+ currentProduct.image +'?source=ftchinese&width=414"></div>';
		storyView.querySelector('.storydate').innerHTML = '';
		storyView.querySelector('.storybyline').innerHTML = '';
		storyView.querySelector('.storytitle').innerHTML = currentProduct.title;
		document.getElementById('bodytext').innerHTML = imageHTML + currentProduct.description;
		document.getElementById('header-title').innerHTML = currentProduct.groupTitle || '';
		document.body.className = 'storyview story-iap';
		gNowView = 'storyview';
		addStoryScroller();
	}
}

function iapActions(productID, actionType) {
	var iapButtons = document.querySelectorAll('.iap-button');
	var iapHTMLCode = '';
	var productPrice = '';

	switch(actionType) {
	    case 'success':
	        iapHTMLCode = '<a href="readbook://' + productID + '"><button class="iap-move-left">打开</button></a><a href="removedownload://' + productID + '"><button>删除</button></a>';
	        break;
	    case 'pendingdownload':
	        iapHTMLCode = '<a href="downloadproduct://' + productID + '"><button>下载</button></a>';
	        break;
	    case 'downloading':
	        iapHTMLCode = '<a id="pause-' + productID + '" href="pausedownload://' + productID + '"><button class="iap-move-left pause-button">暂停</button></a><a href="canceldownload://' + productID + '"><button>取消</button></a><div class="progresscontainer"><div class="progressbar standardprogressbar uses3d progressbg structureprogress" id="progress-' + productID + '"></div></div><div id="status-' + productID + '" class="download-status"></div>';
	        break;
	    case 'pending':
	        iapHTMLCode = '<button>请求...</button>';
	        break;
	    default:
	}
	for (var i=0; i<iapButtons.length; i++) {
		if (productID === iapButtons[i].getAttribute('product-id')) {
			iapButtons[i].innerHTML = iapHTMLCode;
		} else if (productID === '') {
			productPrice = iapButtons[i].getAttribute('product-price') || '购买';
			iapHTMLCode = '<a href="buy://' + iapButtons[i].getAttribute('product-id') + '"><button>' + productPrice + '</button></a>';
			iapButtons[i].innerHTML = iapHTMLCode;
		}
	}
}

function updateDownloadProgress(productID, barPercentage, progressStatus) {
	document.getElementById('progress-' + productID).style.width = barPercentage;
	document.getElementById('status-' + productID).innerHTML = progressStatus;
}

function updateDownloadPauseButton(productID, action) {
	var pauseButton = document.getElementById('pause-' + productID);
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