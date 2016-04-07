var express = require('express'),
    watson = require('watson-developer-cloud');
var router = express.Router();
var textToSpeech = watson.text_to_speech({
  version: 'v1',
  username: '26114d0f-d70a-43c3-a99b-10d91ea8b1b4',
  password: 'qac3V14sSUUF'
});


/* トップ画面 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 登録画面 */
router.post('/register', function(req, res, next) {
  //パラメータ取得処理
  var agent_name = req.body.agent_name;
  var agent_age = req.body.agent_age;
  //パラメータチェック

  //DB登録処理

  console.log("登録画面:" + agent_name + "/"+ agent_age );
  res.render('register', { agent_name: agent_name,
                             agent_age: agent_age});
});

/* 詳細画面 for PC */
router.get('/detail', function(req, res, next) {
  console.log("詳細画面");
  //DB取得処理
  connection.query('select * from user_agents', function(err, rows){
    res.render('detail', { agents: rows });
  });
});

/* Watson API */
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
