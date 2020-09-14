const mongoose = require('mongoose');
const ObjectId = require('mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://charan:bharathi@cluster0-2hbtz.mongodb.net/chatapp?retryWrites=true&w=majority", options, (err) => {
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

