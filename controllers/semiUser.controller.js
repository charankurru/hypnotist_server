const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const { attempt } = require('lodash');
const { getfeed } = require('./user.controller');
const { json } = require('body-parser');

const User = require("../models/user.model")
const postfeed = require("../models/postfeedmodel");
module.exports = {
  UnFollowUser(req, res) {
    const unfollow = async () => {
      await User.update(
        {
          _id: req._id,
        },
        {
          $pull: {
            followings: {
              userfollowing: req.body.user_id,
            },
          },
        }
      );

      await User.update(
        {
          _id: req.body.user_id,
        },
        {
          $pull: {
            followers: {
              follower: req._id,
            },
          },
          notifications: {
            senderId: req._id,
            message: `${req.fullName} unfollowed you.`,
            created: new Date(),
            viewProfile: false,
          },
        }
      );
    };
    unfollow()
      .then((done) => {
        res
          .status(200)
          .json({ message: 'unfollowing the user Successfully', done });
      })
      .catch(() => {
        res.status(400).json({ message: 'something went wrong!' });
      });
  },

  removeUser(req, res) {
    // console.log('from frnt end' + JSON.stringify(req.body));
    // console.log('id is ' + req.body.user_id);
    // console.log('form jwt helper' + req._id);
    const remove = async () => {
      await User.update(
        {
          _id: req._id,
        },
        {
          $pull: {
            followers: {
              follower: req.body.user_id,
            },
          },
        }
      );

      await User.update(
        {
          _id: req.body.user_id,
        },
        {
          $pull: {
            followings: {
              userfollowing: req._id,
            },
          },
        }
      );
    };
    remove()
      .then((done) => {
        res
          .status(200)
          .json({ message: 'removed the user Successfully', done });
      })
      .catch(() => {
        res.status(400).json({ message: 'something went wrong!' });
      });
  },

  async MarkNotification(req, res) {
    // console.log('from Notificatoins body' + JSON.stringify(req.body));
    // console.log('from nitif params' + JSON.stringify(req.params));
    // console.log(req._id);
    if (!req.body.deletevalue) {
      await User.updateOne(
        {
          _id: req._id,
          'notifications._id': req.body.user_id,
        },
        {
          $set: { 'notifications.$.read': true },
        }
      )
        .then(() => {
          res.status(200).json({ message: 'notification read' });
        })
        .catch((err) => {
          res.status(400).json({ message: 'went wrong!' });
        });
    } else {
      await User.update(
        {
          _id: req._id,
          'notifications._id': req.body.user_id,
        },
        {
          $pull: {
            notifications: { _id: req.body.user_id },
          },
        }
      )
        .then(() => {
          res.status(200).json({ message: 'notification deleted' });
        })
        .catch((err) => {
          res.status(400).json({ message: 'went wrong with deletion !' });
        });
    }
  },
  async getbyNaam(req, res) {
    await User.findOne({
      fullName: req.params.naam,
    })
      .populate('favlist.favoneId')
      .then((record) => {

        res.status(200).json({ message: 'user Found', record });
      })
      .catch((err) => {
        res.status(400).json({ message: 'went wrong with finding !' });
      });
  },

  async addfavdoctor(req, res) {
    User.find(
      {
        favlist: {
          $elemMatch: { favoneId: req.body._id },
        }
      }, async (err, result) => {
        console.log(result);
        if (result.length > 0) {
          return res.status(200).json({ message: "already added to fav" })
        }
        else if (result.length <= 0) {

          User.update(
            { _id: req._id },
            {
              $push: {
                favlist: {
                  favoneId: req.body._id,
                  favname: req.body.fullName,
                },
              },
            }
          ).then((record) => {
            res.status(200).json({ message: "Added to fav", record })
          })
            .catch(err => {
              res.status(400).json({ message: "error occureed" })
            })
        }
        if (err) {
          console.log(err);
          // return res.status(200).json({ message: 'updated successfully', result });  
        }

      });

  },

  async postfeed(req, res) {
    console.log('from noew');
    console.log(req.body);
    User.findOne({ _id: req._id }, (err, user) => {
      if (!user)
        return res
          .status(404)
          .json({ status: false, message: 'User record not found.' });
      else if (user)
        var body = {
          user: user._doc._id,
          username: user._doc.fullName,
          post: req.body.post,
          created: new Date(),
        };
      postfeed
        .create(body)
        .then(async (post) => {
          await User.update(
            { _id: req._id },
            {
              $push: {
                posts: {
                  postId: post._id,
                  post: req.body.post,
                  created: new Date(),
                },
              },
            }
          );
          res.status(200).json({ message: 'post Created', post });
        })
        .catch((err) => {
          res.status(400).json({ message: 'error Occured' });
        });
    });
  },
};
