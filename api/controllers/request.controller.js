var mongoose = require('mongoose'),
    moment = require('moment'),
    Validations = require('../utils/validations'),
    User = mongoose.model('User'),
    Child = mongoose.model('Child'),
    Request = mongoose.model('Request');


module.exports.addRequest =  function (req, res, next) {

    if (!Validations.isObjectId(req.params.teacherId)) {
        return res.status(422).json({
            err: null,
            msg: 'User parameter must be a valid ObjectId.',
            data: null
        });
    }
    if (!Validations.isObjectId(req.params.childId)) {
        return res.status(422).json({
            err: null,
            msg: 'User parameter must be a valid ObjectId.',
            data: null
        });
    }
    Child.findById(req.params.childId).exec(function (err, user) {

        if (err) {
            return next(err);
        }
        if (!user) {
            return res
                .status(404)
                .json({err: null, msg: 'child not found.', data: null});
        }

        if (user.parent_id != req.decodedToken.user._id) {
            return res
                .status(401)
                .json({err: null, msg: 'you are not this child parent', data: null});

        }
    });
    Request.findOne({recievingTeacherId: req.params.teacherId , childId: req.params.childId}, function(err, retrievedRequests){
        if (err) {
            return res.status(422).json({
                err: err,
                msg: "Couldn't retrieve requests",
                data: null
            });
        }
        if(retrievedRequests){
            return res.status(422).json({
                err: null,
                msg:
                    'you already send this request, please wait for the teacher response',
                data: null
            });
        }
    });

    // Creates the new item object
    request = {
        requestingParentId: req.decodedToken.user._id,
        childId: req.params.childId ,
        recievingTeacherId: req.params.teacherId,
        created_at: Date.now()
    };

    // inserts the new object in the database
    Request.create(request, function (err, newRequest) {
        if (err) {
            return res.status(422).json({
                err: err,
                msg: "Couldn't create request",
                data: null
            });
        }
        return res.status(200).json({
            err: null,
            msg: "Created request successfully",
            data: newRequest
        });

    });


}

module.exports.getRequests = function(req, res, next)
{
    Request.find({recievingTeacherId: req.decodedToken.user._id}, function(err, retrievedRequests){
        if (err) {
            return res.status(422).json({
                err: err,
                msg: "Couldn't retrieve requests",
                data: null
            });
        }
        return res.status(200).json({
            err: null,
            msg: "retrieved" + retrievedRequests.length + "Requests",
            data: retrievedRequests
        });
    });

}