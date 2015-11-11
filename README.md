# nicely-weixin
```javascript
	/* 参数为在微信公众平台设定的token, 在验证signature时使用 */
	var weixin = require('nicely-weixin')('tan');
	weixin
	/* 处理文本信息。其他信息有image, voice, video, music, news所有参数请参考微信文档：  */
	/* http://mp.weixin.qq.com/wiki/14/89b871b5466b19b3efa4ada8e577d45e.html#.E5.9B.9E.E5.A4.8D.E6.96.87.E6.9C.AC.E6.B6.88.E6.81.AF */
	.text(function (req, res) {
		var data = req.body.message;
		data.Content = '这里是文本回复';
		res.type('xml').send(weixin.packer.text(data));
	})
	.other(function (req, res) {
		var data = req.body.message;
		data.Content = '暂不支持';
		res.type('xml').send(weixin.packer.text(data));
	})
	;
	/* 在router处理get请求，即绑定地址时验证signature用 */
	router.get('/', function (req, res) {
		res.status(200).send(weixin.signature(req));
	});
	router.post('/', function (req, res) {
		weixin.handle(req, res);
	});
```
