
const router = require('express').Router();
const { Thought, Reaction} = require('../../models')

//TODO: ROUTE TO GET ALL THOUGHTS
router.get('/', async (req,res)=> {
    try {
        const thoughts = await Thought.find().populate('reactions')
        res.status(200).json(thoughts)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

//TODO: ROUTE TO CREATE A NEW THOUGHT
router.post('/', async (req,res)=> {
    try {
        const thought = await Thought.create({
            thoughtText: req.body.thoughtText,
            username: req.body.username
        })
        res.status(200).json(thought)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
});

//TODO: ROUTE TO GET SINGLE THOUGHT BASED ON THOUGHT ID
router.get('/:thoughtId', async (req,res)=> {
    try {
        const thought = await Thought.findById(req.params.thoughtId).populate('reactions')
        if (!thought) {
            return res.status(404).json({
                message: 'No thought found with this id!'
            })
        }
        res.status(200).json(thought)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

//TODO: ROUTE TO UPDATE A THOUGHT
router.put('/', async (req,res)=> {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body,)
            if (!thought) {
                return res.status(404).json({
                    message: 'No thought found with this id!'
                })
            }
            res.status(200).json(thought)
        } catch (err) {
            console.error(err)
            res.status(500).json(err)
        }
})

//TODO: ROUTE TO DELETE A THOUGHT BASED ON THOUGHT ID
router.delete('/:thoughtId', async (req,res)=> {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId)
        if (!thought) {
            return res.status(4040).json({
                message: 'No thought found with this id!'
            })
        }
        res.status(200).json({
            message: 'Thought deleted!'
        })
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
});

//TODO: ROUTE TO ADD REACTION TO A THOUGHT
router.post('/:thoughtId/reactions', async (req,res)=> {
    try {
        const reaction = await Reaction.create({
            reactionBody: req.body.reactionBody,
            username: req.body.username
        })
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $push: { reactions: reaction._id}},
            { new: true }
        ).populate('reactions')
        if (!thought) {
            return res.status(404).json({
                message: 'No thought found with this id!'
            })
        }
        res.status(200).json(thought)
    } catch (err) {
        res.status(500).json(err)
    }
});

//TODO: ROUTE TO DELETE A REACTION ON A THOUGHT
router.delete('/:thoughtId/reactions/:reactionId', async (req,res)=> {
    try {
        const reaction = await Reaction.findByIdAndDelete(req.params.reactionId)
        if (!reaction) {
            return res.status(404).json({
                message: 'No reactiong found with this id!'
            })
        }
        res.status(200).json({
            message: 'Thought delted!'
        })
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})

module.exports = router;
