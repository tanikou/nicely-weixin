var events  = require('events');
var xml2js  = require('xml2js');
var sha1    = require('sha1');

/*
http://mp.weixin.qq.com/wiki/14/89b871b5466b19b3efa4ada8e577d45e.html#.E5.9B.9E.E5.A4.8D.E6.96.87.E6.9C.AC.E6.B6.88.E6.81.AF
*/
var Packer = function () {};
Packer.prototype.text = function (data) {
	var time = Math.round(new Date().getTime() / 1000);
	
	var output = '' + 
	'<xml>' + 
		 '<ToUserName><![CDATA['   + data.FromUserName + ']]></ToUserName>' + 
		 '<FromUserName><![CDATA[' + data.ToUserName   + ']]></FromUserName>' + 
		 '<CreateTime>'            + time              + '</CreateTime>' + 
		 '<MsgType><![CDATA['      + 'text'            + ']]></MsgType>' + 
		 '<Content><![CDATA['      + data.Content      + ']]></Content>' + 
	'</xml>';
	
	//this.res.type('xml'); 
	//this.res.send(output);
	return output;
};
Packer.prototype.image = function (data) {
	var time = Math.round(new Date().getTime() / 1000);
	
	var output = '' + 
	'<xml>' + 
		 '<ToUserName><![CDATA['   + data.FromUserName + ']]></ToUserName>' + 
		 '<FromUserName><![CDATA[' + data.ToUserName   + ']]></FromUserName>' + 
		 '<CreateTime>'            + time              + '</CreateTime>' + 
		 '<MsgType><![CDATA['      + 'image'           + ']]></MsgType>' + 
		 '<Image>' + 
		 '<MediaId><![CDATA['      + data.MediaId      + ']]></MediaId>' + 
		 '</Image>'+ 
	'</xml>';

	return output;
};
Packer.prototype.voice = function (data) {
	var time = Math.round(new Date().getTime() / 1000);
	
	var output = '' + 
	'<xml>' + 
		 '<ToUserName><![CDATA['   + data.FromUserName + ']]></ToUserName>' + 
		 '<FromUserName><![CDATA[' + data.ToUserName   + ']]></FromUserName>' + 
		 '<CreateTime>'            + time              + '</CreateTime>' + 
		 '<MsgType><![CDATA['      + 'voice'           + ']]></MsgType>' + 
		 '<Voice>' + 
		 '<MediaId><![CDATA['      + data.MediaId      + ']]></MediaId>' + 
		 '</Voice>'+ 
	'</xml>';

	return output;
};
Packer.prototype.video = function (data) {
	var time = Math.round(new Date().getTime() / 1000);
	
	var output = '' + 
	'<xml>' + 
		 '<ToUserName><![CDATA['   + data.FromUserName + ']]></ToUserName>' + 
		 '<FromUserName><![CDATA[' + data.ToUserName   + ']]></FromUserName>' + 
		 '<CreateTime>'            + time              + '</CreateTime>' + 
		 '<MsgType><![CDATA['      + 'video'           + ']]></MsgType>' + 
		 '<Video>' + 
		 '<MediaId><![CDATA['      + data.MediaId      + ']]></MediaId>' + 
		 '<Title><![CDATA['        + data.Title        + ']]></Title>' + 
		 '<Description><![CDATA['  + data.Description  + ']]></Description>' + 
		 '</Video>'+ 
	'</xml>';

	return output;
};
Packer.prototype.music = function (data) {
	var time = Math.round(new Date().getTime() / 1000);
	
	var output = '' + 
	'<xml>' + 
		 '<ToUserName><![CDATA['   + data.FromUserName + ']]></ToUserName>' + 
		 '<FromUserName><![CDATA[' + data.ToUserName   + ']]></FromUserName>' + 
		 '<CreateTime>'            + time              + '</CreateTime>' + 
		 '<MsgType><![CDATA['      + 'music'           + ']]></MsgType>' + 
	 	 '<Music>' + 
	 	 '<Title><![CDATA['        + data.Title        + ']]></Title>' + 
	 	 '<Description><![CDATA['  + data.Description  + ']]></Description>' + 
	 	 '<MusicUrl><![CDATA['     + data.MusicUrl     + ']]></MusicUrl>' + 
	 	 '<HQMusicUrl><![CDATA['   + data.HQMusicUrl   + ']]></HQMusicUrl>' + 
	 	 '<ThumbMediaId><![CDATA[' + data.ThumbMediaId + ']]></ThumbMediaId>' + 
	 	 '</Music>' + 
	'</xml>';
	
	return output;
};
Packer.prototype.news = function (data) {
	var time = Math.round(new Date().getTime() / 1000);
	
	var strs = '';	
	for (var i = 0; i < data.Articles.length; i++) {
		var item = data.Articles[i];
		strs += '<item>' + 
					'<Title><![CDATA['       + item.Title       + ']]></Title>' + 
					'<Description><![CDATA[' + item.Description + ']]></Description>' + 
					'<PicUrl><![CDATA['      + item.PicUrl      + ']]></PicUrl>' + 
					'<Url><![CDATA['         + item.Url         + ']]></Url>' + 
				'</item>';
	}

	var output = '' + 
	'<xml>' + 
		'<ToUserName><![CDATA['   + data.FromUserName    + ']]></ToUserName>' + 
		'<FromUserName><![CDATA[' + data.ToUserName      + ']]></FromUserName>' + 
		'<CreateTime>'            + time                 + '</CreateTime>' + 
		'<MsgType><![CDATA['      + 'news'               + ']]></MsgType>' + 
		'<ArticleCount>'          + data.Articles.length +'</ArticleCount>'+
		'<Articles>' + 
		strs + 
		'</Articles>' + 
	'</xml>';
	
	return output;
};

var WeiXin = function (token) {
	this.token   = token;
	this.emitter = new events.EventEmitter();
	this.packer  = new Packer();
};
// 事件开始
WeiXin.prototype.on = function (type, callback) {
	this.emitter.on(type, callback);
	return this;
};
/* 额外的绑定other回调支持接受到没绑定事件的信息类型。也可用on('other', callback) */
WeiXin.prototype.other = function (callback) {
	this.emitter.on('other', callback);
	return this;
};
// 事件结束
WeiXin.prototype.signature = function (query) {
	// 按照字典排序
	var array = [this.token, query.timestamp, query.nonce];
	array.sort();
	var valid = sha1(array.join('')) == query.signature;
	
	return valid ? query.echostr : 'signature verification failed';
};
// 读取并异步返回请求数据
WeiXin.prototype.parse = function (req) {
	var self = this;
	return new Promise(function (resolve, reject) {
		// 获取XML内容
		var buf = '', data = {};
		req.setEncoding('utf8');
		req.on('data', function(chunk) { buf += chunk; });

		// 内容接收完毕
		req.on('end', function() {
			xml2js.parseString(buf, function(err, json) {
				err ? reject(err) : resolve(json.xml)
			});
		});
	})
};
// 读取并解析XML 开始
WeiXin.prototype.handle = function (req, res) {
	var self = this;

	// 获取XML内容
	var buf = '', data = {};
	req.setEncoding('utf8');
	req.on('data', function(chunk) { buf += chunk; });
	
	// 内容接收完毕
	req.on('end', function() {
		xml2js.parseString(buf, function(err, json) {
			if (err) { res.status = 400; return; }

			req.body    = req.body || {};
			var message = req.body.message = {}, data = json.xml;
			for (var i in data) {
				message[i] = data[i][0];
			};
			var type    = message.MsgType || 'text';
			
			if (self.emitter.listeners(type).length > 0) {
				self.emitter.emit(type, req, res);

			} else if ('event' == type && self.emitter.listeners('event.' + message.Event).length > 0) {
				self.emitter.emit('event.' + message.Event, req, res);
				
			} else {
				self.emitter.emit('other', req, res);
			}
		});
	});
};
// 读取并解析XML 结束

module.exports = function (token) { return new WeiXin(token); };