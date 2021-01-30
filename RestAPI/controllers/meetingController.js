const express = require('express');
const router = express.Router();
const httpStatus = require('lib/httpStatus');
const Meeting = require('../models/Meeting');
const verifyToken = require('../lib/verifyToken');


router.post('/', verifyToken, function (req, res, next) {
    const { user, room, dateFrom, dateTo } = req.body
    if (!user || !room || !dateFrom || !dateTo) {
        return res.status(httpStatus.BAD_REQUEST).send({ registered: false, error: 'Invalid parameters in request' });
    }
    Meeting.create({
        user: req.body.user,
        room: req.body.room,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo
    },
        function (err, meeting) {
            if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
            res.status(httpStatus.OK).send(meeting);
        });
});


router.get('/', verifyToken, function (req, res, next) {

    Meeting.find({}, function (err, meeting) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send(meeting);
    }).populate({
        path: 'room',
        model: 'Room',
        populate: {
            path: 'reference',
            model: 'User'
        }
    }).populate('user', 'name email');

});

router.get('/:id', verifyToken, function (req, res, next) {
    Meeting.findById(req.params.id, function (err, meeting) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        if (!meeting) return res.status(httpStatus.NOT_FOUND).send('User not found');
        res.status(httpStatus.OK).send(meeting);
    }).populate({
         path: 'room',
         model: 'Room',
         populate: {
             path: 'reference',
             model: 'User'
         }
     }).populate('user', 'name email');

});

router.delete('/:id', verifyToken, function (req, res, next) {
    Meeting.findByIdAndRemove(req.params.id, function (err, meeting) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
        res.status(httpStatus.OK).send("User: " + meeting.name + " was deleted.");
    });
});

router.put('/:id', verifyToken, function (req, res, next) {
    Meeting.findByIdAndUpdate(req.params.id, {
        $set: { email: req.body.email, name: req.body.name }
    }, { new: false }, function (err, meeting) {
        if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Server error: ${err.message}`);
            res.status(httpStatus.NO_CONTENT).send(meeting);
    });
});


module.exports = router;
