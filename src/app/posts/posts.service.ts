import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root'
})

export class PostsService {
    private posts: Post[] =[];
    private updatedPosts = new Subject<{posts:Post[], postCount:number}>()

    constructor(private http: HttpClient, private router: Router){}

    getPosts() {
        // // return this.http.get('http://localhost:3000/api/posts')
        // this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
        // // // // // .pipe(map((postData) => {
        // // // // //     return postData.posts.map(post => {
        // // // // //         return {
        // // // // //             title: post.title,
        // // // // //             content: post.content,
        // // // // //             id: post._id
        // // // // //         }
        // // // // //     })
        // // // // // }))
        // .subscribe((res) => {
        //     this.posts =res.posts;
        //     this.updatedPosts.next([...this.posts])
        // } ) 
    }

    getPosts1(postsperPage: number, curpage: number) {
        const queryParams ='?pagesize='+postsperPage+'&page='+curpage
        // return this.http.get('http://localhost:3000/api/posts')
        this.http.get<{message: string,posts: Post[], maxPosts:number}>('http://localhost:3000/api/getId'+queryParams)
        .pipe(map((postData) => {
            return {posts: postData.posts.map((post:any) => {
                return {
                    title: post.title,
                    content: post.content,
                    _id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator
                }
            }),maxPosts: postData.maxPosts}
        }))
        .subscribe((res) => {
            console.log(res);
            
            this.posts =res.posts;
            this.updatedPosts.next({posts: [...this.posts],postCount: res.maxPosts})
        } ) 
    }

    getUpdatedPosts(){
        return this.updatedPosts.asObservable();
    }

    getPost(id: string){
        return this.http.get<Post>("http://localhost:3000/api/getId/"+id)
    }

    addPost(title:string, content: string, image: File){
        // const post: Post = { _id: 'null',title: title, content: content};
        const postData = new FormData();
        postData.append("title", title)
        postData.append("content", content)
        postData.append("image", image, title)
        console.log(postData);
        
        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
        .subscribe((res) => {
            // const post: Post = {_id: res.post._id, title: title,content: content, imagePath: res.post.imagePath}
            // // const id = res.postId;
            // // post._id = id;
            // this.posts.push(post)
            // this.updatedPosts.next([...this.posts])
            this.router.navigate(["/"])
        })
        // this.posts.push(post)
        // this.updatedPosts.next([...this.posts])
    }

    updatePost(id: string,title: string,content: string,image: string | File){
        let postData: Post | FormData;
        if(typeof(image) ==='object'){
            postData = new FormData();
            postData.append("id", id)
            postData.append("title", title)
            postData.append("content", content)
            postData.append("image", image, title)
        } else {
            postData = { _id: id, title: title, content: content, imagePath: image, creator: ''}
        }
        
        // post: Post = { _id: id, title: title, content: content, imagePath: image}; 
        this.http.put("http://localhost:3000/api/update/"+ id, postData).subscribe(res => {
            // const updatedPost = [...this.posts]
            // const indexx = updatedPost.findIndex(p => p._id === id)
            // const post: Post = { _id: id, title: title, content: content, imagePath: ''};
            // updatedPost[indexx] = post
            // this.posts = updatedPost
            // this.updatedPosts.next([...this.posts])
            this.router.navigate(["/"])
        })
    }

    deletePost(id: string){
        return this.http.delete('http://localhost:3000/api/post/' + id)
        // .subscribe((res)=>{
        //     const updatedPosts = this.posts.filter(post => post._id != id)
        //     this.posts = updatedPosts
        //     this.updatedPosts.next([...this.posts])
        // })
    }

}