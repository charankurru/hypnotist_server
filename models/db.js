const mongoose = require('mongoose');
const ObjectId = require('mongoose');


mongoose.connect("mongodb+srv://charan:bharathi@cluster0-2hbtz.mongodb.net/chatapp?retryWrites=true&w=majority", (err) => {
  if (!err) {
    console.log('MongoDB connection succeeded.');
  } else {
    console.log(
      'Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2)
    );
  }
});

require('./user.model');
require('./postfeedmodel');

