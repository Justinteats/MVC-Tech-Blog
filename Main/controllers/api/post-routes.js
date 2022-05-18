const router = require("express").Router();
const { Post, Comment, User } = require("../../models/");
const withAuth = require("../../utils/auth");
const sequelize = require('../../config/connection');

// route to get all users
router.get("/", (req,res) => {
    Post.findAll({
        attibutes: ['id','post_url', 'title', 'created_at', [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),'vote_count'
        ]],
        include: [{
            model:Comment,
            attibutes: ['id', 'comment_text', 'post_id', 'user_id', 'creat_at'],
            include: {
                model:User,
                attibutes:['username']
            }
        },
        {
            model: User,
            attibutes: ['username']
        }
    ]
    }).then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
})

// route to get user by ID
router.get('/:id', (req,res) => {
    Post.findOne({
        where: {
            id:req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at', [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
            include: [{
                model: Comment,
                attibutes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                  }
                },
                {
                  model: User,
                  attributes: ['username']
                }
              ]
            })
              .then(dbPostData => {
                if (!dbPostData) {
                  res.status(404).json({ message: 'No post found with this id' });
                  return;
                }
                res.json(dbPostData);
              })
              .catch(err => {
                console.log(err);
                res.status(500).json(err);
              });
          });
 

module.exports = router;