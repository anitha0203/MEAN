const Post = require('../models/post');


exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host")
    const posts = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    })
    posts.save().then(result => {
        res.status(201).json({
            message: "Post added successfully",
            post: {
                ...result,
                id: result._id
            }
        })
    }).catch(err => {
        res.status(500).json({message: "Creating a post failed!"})
    })

}

exports.usee = (req, res, next) => {
    // const posts = [
    //     {id: 'mean1',title: 'first title',content: 'first content'},
    //     {id: 'mean2',title: 'second title',content: 'second content'}
    // ]
    Post.find().then(documents => {
        res.status(200).json({ message: 'Posts feched succesfully', posts: documents })
    })
        .catch(() => {
            console.log('There is no data in collection');
        })

}

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const curpage = +req.query.page;
    const postQuery = Post.find()
    let fetchedPots
    if(pageSize && curpage){
        postQuery.skip(pageSize * (curpage - 1)).limit(pageSize)
    }
    postQuery.then(post => {
        fetchedPots = post
        return Post.count()
        // if (post) {
        //     res.status(200).json( {message: "Fetched Successfully",posts:post})
        // } else {
        //     res.status(404).json({ message: "Post not found" })
        // }
    }).then(count => {
        res.status(200).json( {message: "Fetched Successfully",posts:fetchedPots,maxPosts: count})
    }).catch(err => {
        res.status(500).json({message: "Fecting post faild!"})
    })
}

exports.getPostsById = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "Post not found" })
        }
    }).catch(err => {
        res.status(500).json({message: "Fecting post faild!"})
    })
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + "://" + req.get("host")
        imagePath = url + "/images/" + req.file.filename
    }
    const post = { _id: req.body._id, title: req.body.title, content: req.body.content, imagePath: imagePath, creator: req.userData.userId }
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if(result.matchedCount  > 0)
        {
            res.status(200).json({ message: "Updated Successfully" })
            // res.status(200).json({ message: "Updated Successfully",post: {
            //     id: post._id, imagePath: post.imagePath
            // } })
        } else {
            res.status(401).json({ message: "Not authorized!" })
        }
    }).catch(err => {
        res.status(500).json({message: "Couldn't update post!"})
    })
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if(result.deletedCount > 0){
            res.status(200).json({ message: 'Deleted successfully' })
        } else {
            res.status(401).json({ message: "Not authorized!" })
        }
    }).catch(err => {
        res.status(500).json({message: "Fecting post faild!"})
    })
}