//server.js

//base setup
//==============================================================================

//call packages we need
var express =  require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Bear     = require('./app/models/bear');

mongoose.connect('mongodb://chris:chrispass@ds035673.mongolab.com:35673/learn-aws');



//configure app o use bodyParser
//this will let us get the data back from POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); //instance of express router

//middleware to use for all req
router.use(function (req, res, next) {
  //do logging
  console.log('Happening');
  next(); //go to the next route
});

//testing router
router.get('/', function(req, res){
  res.json({message:"It works!"});
});

//more routes here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err) {
            if (err)
                res.send(err);

            //res.json({ message: 'Bear created!' });
            res.json(bear);
        });

    })

    //get all the bears
    .get(function(req, res){
      Bear.find(function (err, bears) {
        if (err){res.send(err)};
        res.json(bears);
      });

    });

router.route('/bears/:bear_id')

    .get(function (req, res) {
      Bear.findById(req.params.bear_id, function (err, bear) {
        if (err){res.send(err)};
        res.json(bear);
        console.log(bear);
      });
    })

    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
   .put(function(req, res) {

       // use our bear model to find the bear we want
       Bear.findById(req.params.bear_id, function(err, bear) {

           if (err)
               res.send(err);

           bear.name = req.body.name;  // update the bears info

           // save the bear
           bear.save(function(err) {
               if (err)
                   res.send(err);

               res.json({ message: 'Bear updated!' });
           });

       });
   })

   .delete(function(req,res){
     Bear.remove({
       _id: req.params.bear_id
     }, function (err, bear) {
       if(err){res.send(err)};
       console.log(bear);
       res.json({message: 'Successfully Deleted' + bear});
     });
   });



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//start the server
//==============================================================================
app.listen(port);
console.log("The Piggies dance on port " + port);
