var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 27017;

mongoose.connect('mongodb://kukisnake:******@jello.modulusmongo.net:27017/?replicaSet=test');
var Bird = require('./app/models/bird.js');

var router = express.Router();

router.use(function (req, res, next) {
    console.log('Doing something...');
    next();
});

router.get('/', function (req, res) {
    res.json({message: 'Welcome to our RESTful API!'});
});

router.route('/birds')
        .post(function (req, res) {
            var bird = new Bird();
            bird.name = req.body.name;
            bird.save(function (err) {
                if (err)
                    res.send(err);
                res.json({message: 'Bird has been created!'});
            });
        })
        .get(function (req, res) {
            Bird.find(function (err, birds) {
                if (err)
                    res.send(err);
                res.json(birds);
            });
        });
        
router.route('/birds/:bird_id')
        .get(function (req, res) {
            Bird.findById(req.params.bird_id, function (err, bird) {
                if (err)
                    res.send(err);
                res.json(bird);
            });
        })
        .put(function (req, res) {
            Bird.findById(req.params.bird_id, function (err, bird) {
                if (err)
                    res.send(err);
                bird.name = req.body.name;
                bird.save(function (err) {
                    if (err)
                        res.send(err);
                    res.json({message: 'Bird has been updated!'});
                });
            });
        })
        .delete(function (req, res) {
            Bird.remove({
                _id: req.params.bird_id
            }, function (err, bird) {
                if (err)
                    res.send(err);

                res.json({message: 'Bird has been deleted'});
            });
        });

app.use('/api', router);

app.listen(port);
console.log('Server is listening on port ' + port);