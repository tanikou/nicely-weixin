# nicely-weixin
当时在要用到微信时也百度过别的东西，看到有weiixn-api，node-weixin等等一些很多的东西，但都觉得他们写得太死不够灵活，里面的方法和属性完全又是他们自己定义的一些东西，我需要要看微信的API还要看他们的代码才写完程序，这样太累（此为个人看法无褒贬意思，他们中也很多好的东西，比我这处理的东西更多），所以我自己做了一个，on是调用的emitter的on，**当收到微信请求时会emit微信请求中的MsgType属性**，这样如果微信变更[微信公众平台开发者文档](http://mp.weixin.qq.com/wiki/17/fc9a27730e07b9126144d9c96eaf51f9.html)的type类型你也只需要在你自己代码里面变动一下就好，而不会因为nicely-weixin没有更新而导致程序不能正常运行。send的时候你也可用weixin.packer去包装返回数据也可以按官方的文档一样包装返回数据。**这样在接受和返回时都做到了最大的灵活。nicely-weixin主要只负责接受微信请求并转换成json数据**。其他一切都随你
```javascript
/* 参数为在微信公众平台设定的token, 在验证 服务器地址 时使用 */
var weixin = require('nicely-weixin')('tan');
weixin
/* 处理文本信息。其他信息有image, voice, video, music, link, news所有参数请参考微信文档：  */
/* http://mp.weixin.qq.com/wiki/14/89b871b5466b19b3efa4ada8e577d45e.html#.E5.9B.9E.E5.A4.8D.E6.96.87.E6.9C.AC.E6.B6.88.E6.81.AF */
.on('text', function (req, res) {
	var data = req.body.message;
	data.Content = '这里是文本回复';
	res.type('xml').send(weixin.packer.text(data));
})
.on('image', function (req, res) {
	var data = req.body.message;
	data.MediaId = '这里填写MediaId';
	res.type('xml').send(weixin.packer.image(data));
})
.on('event.subscribe', function (req, res) {
	var data = req.body.message;
	data.Content = '欢迎关注我们';
	res.type('xml').send(weixin.packer.text(data));
})
/* 统一处理不支持的信息类型。*/
/* 也可如普通信息一样用on('other', function (req, res) {})来绑定 */
.other(function (req, res) {
	var data = req.body.message;
	data.Content = '暂不支持处理此种类型的信息';
	res.type('xml').send(weixin.packer.text(data));
})
;
```
```javascript

/* 在express的router处理get请求，即绑定地址时验证signature用 */
router.get('/', function (req, res) {
	res.status(200).send(weixin.signature(req));
});
router.post('/', function (req, res) {
	weixin.handle(req, res);
});
```

**当信息是事件即MsgType为event时**，比如订阅事件。可以用on('event', function (req, res){})，绑定所有event的处理，也可以用on('event.subscribe', function (req, res) {})这样针对具体的某一个处理
