
const router = require('express').Router();
const {User} = require("../../models")

//ROUTE THAT GETS ALL THE USERS, include friends?
router.get('/', (req,res)=> {
    //find all users
    User.find({}, (err, allUsers)=> {
        if (err) {
            console.log(err)
            res.send(err)
        }
        //send back as a json object
        res.status(200).json(allUsers)
        //include friends and thoughts of the user
    }).populate('friends')
    .populate('thoughts')
})

//ROUTE THAT CREATES A NEW USER
router.post('/', (req,res)=> {
    //create a new user with a username and email
    User.create({
        username: req.body.username,
        email: req.body.email
    }, (err, newUser) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        //return as json object
        res.status(200).json(newUser)
    })
});

//TODO - ROUTE THAT GETS A SINGLE USER BASED ON USER ID
router.get('/:userId', (req,res) => {
    //findById does exactly that. find a user based off of the data passed in
    User.findById(req.params.userId, (err, newUser) => {
        if (err) {
            res.send(err)
        }
        res.status(200).json(User)
    }).populate('thoughts', 'friends')
})

//TODO - ROUTE THAT UPDATES A SINGLE USER
router.put('/:userId', (req,res)=> {
    //same thing just update the user
    const options = {new: true}
    User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        options,
        (err, updatedUser) => {
            if (err) {
                console.log(err)
                res.send(err)
            }
        res.status(200).json(updatedUser)
        })
})

//TODO - ROUTE THAT DELETES A SINGLE USER BASED ON USER ID
router.delete('/:userId', (req,res)=> {
    User.findByIdAndDelete(req.params.userId, (err, deletedUser) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.status(200).json('User Deleed!')
    })
});

//TODO - ROUTE THAT ADDS A FRIEND TO A USER
router.put('/:userId/friends/:friendId', (req,res)=> {
    User.findById(req.params.friendId, (friendErr, friend) =>{
        User.findByIdAndUpdate(
            req.params.userId,
            { $push: { friends: friend }},
            (userErr, updatedUser) => {
                if (userErr) {
                    console.log(userErr)
                    res.send(userErr)
                }
                console.log('Friend:', friend.username ,'added!')
                res.status(200).json('Friend added!')
            }
        )
    })
})

//TODO - ROUTE THAT DELETES A FRIEND FROM A USER'S FRIENDS, DONT DELETE THE FRIEND AS A USER THOUGH!
router.delete('/:userId/friends/:friendId', (req,res)=> {
    User.findByIdAndUpdate(
        req.params.userId,
        { $pull: {friends: req.params.friendId}},
        (userErr, updatedUser) => {
            if (userErr) {
                console.log(userErr)
                res.send(userErr)
            }
            console.log('Friend deleted!')
            res.status(200).json('Friend deleted!')
        }
    )
});

module.exports = router;
