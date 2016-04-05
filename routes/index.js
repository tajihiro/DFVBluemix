var express = require('express'),
    watson = require('watson-developer-cloud');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("トップ画面");
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  console.log("登録画面");
  res.render('register', { title: 'Express' });
});

router.get('/detail', function(req, res, next) {
  console.log("詳細画面");
  res.render('detail', { title: 'Express' });
});

var textToSpeech = watson.text_to_speech({
  version: 'v1',
  username: '99999-88888',
  password: 'xxxxx'
});

router.get('/api/synthesize', function(req, res, next) {
  var transcript = textToSpeech.synthesize(req.query);
  transcript.on('response', function(response) {
    if (req.query.download) {
      response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
    }
  });
  transcript.on('error', function(error) {
    next(error);
  });
  transcript.pipe(res);
});
module.exports = router;
