var express = require('express'),
    watson = require('watson-developer-cloud');
var router = express.Router();

/* UPLOAD Setting */
var randomstring = require('randomstring');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, randomstring.generate(6) + '.jpg')
  }
});
var upload = multer({ storage: storage });

/* Text to Speech setting */
var textToSpeech = watson.text_to_speech({
    version: 'v1',
    username: '26114d0f-d70a-43c3-a99b-10d91ea8b1b4',
    password: 'qac3V14sSUUF'
});

/* FaceDetection Setting */
var request = require('superagent');

/* トップ画面 */
router.get('/', function (req, res, next) {
    res.render('index');
});

/* 登録画面 */
router.post('/register', function (req, res, next) {
    //パラメータ取得処理
    var agent_name = req.body.agent_name;
    var agent_age = req.body.agent_age;
    //パラメータチェック
    if (agent_name == null || agent_age == null) {
        return res.redirect('/');
    }
    session.agent_name = agent_name;
    //DB登録処理
    connection.query('INSERT INTO user_agents SET ?',
        {agent_name: agent_name, agent_age: agent_age},
        function (err, result) {
            if (err) {
                return connection.rollback(function () {
                    //throw err;
                    res.redirect('/');
                });
            }
        });
    res.render('register', {
    agent_name: agent_name,
    agent_age: agent_age
    });
});

/* アップロード画面 */
router.post('/upload', upload.single('avater'), function (req, res, next) {
    console.log('UPLOAD')

    console.log(req.file);
    //パラメータ取得処理
    var fileinfo = req.file;
    var filename = fileinfo.filename;
    var fileurl = '/uploads/' + filename;
    var agent_name = session.agent_name;

    //DB登録処理
    connection.query('UPDATE user_agents SET url = ? WHERE agent_name = ? ',
        [fileurl, agent_name],
        function (err, result) {
            if (err) {
                    console.log('DB ERROR!!')
                    throw err;
//                    res.redirect('/');
            }
        });
    res.render('upload');
});


/* 詳細画面 for PC */
router.get('/detail', function (req, res, next) {
    console.log("詳細画面");
    //DB取得処理
    connection.query(
        'select U.agent_name, U.agent_age, E.name, U.url ' +
        '  from user_agents U' +
        '  left join employees E' +
        '    on U.agent_name = E.agent_name',
        function (err, rows) {
            res.render('detail', {agents: rows});
        });
});

/* 判定結果画面 for PC */
router.get('/detect', function (req, res, next) {
    console.log("判定結果画面");
    var result = "あなたの判定結果です。";
    res.render('detect', {result: result});
});


/* Watson API */
router.get('/api/synthesize', function (req, res, next) {
    var transcript = textToSpeech.synthesize(req.query);
    transcript.on('response', function (response) {
        if (req.query.download) {
            response.headers['content-disposition'] = 'attachment; filename=transcript.ogg';
        }
    });
    transcript.on('error', function (error) {
        next(error);
    });
    transcript.pipe(res);
});


router.get('/api/detection', function (req, res, next) {
    var alchemy_url = 'https://gateway-a.watsonplatform.net/calls/url/URLGetRankedImageFaceTags';
    var img_url = 'http://dfvbluemix.mybluemix.net/uploads/0I42Iq.jpg';
    var output_mode = 'json'
    var apikey = 'ddd87f0cc9071313a8007612ef6361e913d350c8';

    //FaceDetectionへのリクエスト処理
    request
       .get(alchemy_url)
       .query({ url: img_url, outputMode: output_mode, apikey: apikey })
        .end(function(err, jsonres){
            json_obj = jsonres.body;
            if(json_obj.imageFaces){
                console.log('-----');
                console.log(json_obj.imageFaces[0]);
                console.log('-----');
                var ageRange = json_obj.imageFaces[0].age.ageRange;
                var ageScore = json_obj.imageFaces[0].age.score;
                var gender = json_obj.imageFaces[0].gender.gender;
                var genderScore = json_obj.imageFaces[0].gender.score;
                return res.send(json_obj.imageFaces[0]);
            }else{
                console.log('ALCHEMY REQUEST ERROR!!');
                return res.send('{"STATUS":"ERROR"}');
            }
        });
});

module.exports = router;
