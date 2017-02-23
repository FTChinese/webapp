window.iapProducts = [{title: '汇改后的中国经济',description: '人民币无疑是当前宏观经济政策制定者和全球金融市场最关注的问题之一。<br>“8·11”汇改全球市场震动，一周年过去了，人民币的故事并没有结束。如何评价这一事件？中国对世界经济影响有何变化？人民币在全球市场上究竟占据何种地位？与美元的“难舍难分”又会带来什么影响？<br>随着人民币正式加入SDR在即，经济放缓下的贬值压力也随之加大。人民币会继续贬值吗？想要打破贬值预期，到底应该怎么做？',price: '￥6.00',id: 'com.ft.ftchinese.mobile.book.ChinaEconomyAfterFXReform',image: 'http://i.ftimg.net//picture/1/000065581_piclink.jpg', teaser: '人民币会继续贬值吗？', isPurchased: true},{title: '与FT共进午餐（一）',description: '英国《金融时报》的“Lunch with the FT”栏目诞生于1994年，邀请各界人士在餐桌上向FT敞开心扉，谈论美食、爱好、家庭，展露他们职业生涯之外更真实的生活状态，迄今已经采访了800多人，可谓一卷丰富多彩的人物志。<br>在第一辑中您将看到对比尔·盖茨、诺奖得主尤努斯，郭广昌等各领域知名人士的采访。',price: '￥6.00',id: 'com.ft.ftchinese.mobile.book.lunch1',image: 'http://i.ftimg.net//picture/6/000061936_piclink.jpg', teaser: '英国《金融时报》最受欢迎的栏目', isPurchased: false}];

function displayProductsOnHome(products) {
  if (typeof products === 'object' && products.length > 0) {
    var productsHTML = '';
    for (var i=0; i<products.length; i++) {
    	var firstChildClass = '';
    	var productActionButton = '';
		if (i===0) {
			productsHTML += '<a class="section" onclick="showchannel(\'/index.php/ft/channel/phonetemplate.html?channel=ebook\',\'FT电子书\')"><span>FT电子书</span></a>';
			firstChildClass = ' first-child';
		}

		if (products[i].isPurchased === true) {
			productActionButton = '<div class="iap-button" product-id="' + products[i].id + '"><a href="readbook://' + products[i].id + '"><button>打开</button></a></div>';
		} else {
			productActionButton = '<div class="iap-button" product-id="' + products[i].id + '"><a href="buy://' + products[i].id + '"><button>' + products[i].price + '</button></a></div>';
		}

		productsHTML += '<div class="oneStory' + firstChildClass + ' track-click" eventLabel="speedread: '+i+'"><img src="https://www.ft.com/__origami/service/image/v2/images/raw/' + products[i].image + '?source=ftchinese&width=160" class=leftimage width="80"><div class="headline">' + products[i].title + '</div><div class=lead>' + products[i].teaser + '</div>' + productActionButton + '<div class=clearfloat></div></div>';
      	//productsHTML += '<div><p>' + products[i].title + '</p>' + products[i].description + products[i].price + products[i].id + '</div>';
    }
    if (document.getElementById('iap')) {
      document.getElementById('iap').innerHTML = productsHTML;
    }
  } 
}

function deliverIAPGoods(productID) {
	var iapButtons = document.querySelectorAll('.iap-button');
	for (var i=0; i<iapButtons.length; i++) {
		if (productID === iapButtons[i].getAttribute('product-id')) {
			iapButtons[i].innerHTML = '<a href="readbook://' + productID + '"><button>打开</button></a>';
		}
	}
}