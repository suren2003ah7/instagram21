const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/instagram21");

const userScheme = new Schema({
    name: String,
    age: Number
})

const postScheme = new Schema({
    title: String,
    description: String,
    userId: String
})

const User = mongoose.model("user", userScheme);
const Post = mongoose.model("post", postScheme);

const app = express();
app.use(bp.json());
app.use(bp.urlencoded({extended: true}));

app.post("/users", (req, res) => {
    const user = new User({
        name: req.body.name,
        age: req.body.age
    })
    user.save((err) => {
        if (err){
            res.send(err);
        }
        else{
            res.send("Data saved")
        }
    });
});

app.get("/users", (req, res) => {
    User.find({}, (err, data) => {
        if (err){
            res.send(err)
        }
        else{
            res.send(data)
        }
    })
});

app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    User.findById(id, (err, data) => {
        if (err){
            res.send(err);
        }
        else{
            res.send(data);
        }
    });
});

app.put("/users/:id", (req, res) => {
    const userData = {
        name: req.body.name,
        age: req.body.age
    }
    const id = req.params.id;
    User.findByIdAndUpdate(id, userData, (err, data) => {
        if (err){
            res.send(err);
        }
        else{
            res.send("Data updated!")
        }
    });
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id, (err) => {
        if (err){
            res.send(err);
        }
        else{
            res.send("Data deleted!")
        }
    });
});

app.post("/users/posts/:user_id", (req, res) => {
    const userId = req.params.user_id;
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        userId: userId
    });
    post.save((err) => {
        if (err){
            res.send(err)
        }
        else{
            res.send("Post uploaded!")
        }
    })
});

app.get("/users/posts/:user_id", (req, res) => {
    const userId = req.params.user_id;
    Post.find({userId: userId}, (err, data) => {
        if (err){
            res.send(err)
        }
        else{
            res.send(data)
        }
    })
})

app.put("/users/posts/:post_id/:user_id", (req, res) => {
    const postId = req.params.post_id;
    const userId = req.params.user_id;
    const userPost = {
        title: req.body.title,
        description: req.body.description,
        userId: userId
    }
    Post.findById(postId, (err, data) => {
        if (data.userId == userId){
            Post.findByIdAndUpdate(postId, userPost, (err) => {
                if (err){
                    res.send(err)
                }
                else{
                    res.send("Post updated!")
                }
            })
        }
        else{
            res.send("Wrong user!")
        }
    })
})

app.delete("/users/posts/:post_id", (req, res) => {
    const postId = req.params.post_id;
    Post.findByIdAndDelete(postId, (err) => {
        if (err){
            res.send(err)
        }
        else{
            res.send("Post deleted!")
        }
    });
})

app.listen(6969, () => {
    console.log("Server started")
});