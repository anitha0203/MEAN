import { Component, Input, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnDestroy {

    posts: Post[] = []
    private postsSub!: Subscription;
    isLoading = false
    totalPosts = 10
    postsPerPage = 5
    currentPage = 1
    pageSizeOptions = [1,2,5,10]
    private authStatusSub!: Subscription
    userIsAuthenticated = false
    userId!:string

    constructor(public service: PostsService, public authService: AuthService) {}

    ngOnInit(){
        this.isLoading = true        
        this.userId = this.authService.getUserId()
        this.service.getPosts1(this.postsPerPage, this.currentPage);
        this.postsSub = this.service.getUpdatedPosts().subscribe((postData: {posts: Post[], postCount:number}) => {
            this.isLoading = false
            this.totalPosts = postData.postCount
            this.posts = postData.posts         
        })

        this.userIsAuthenticated = this.authService.getIsAuth()

        this.authStatusSub = this.authService.getAuthStatus().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated
            this.userId = this.authService.getUserId()
        })
    }

    onChangedPage(pageData: PageEvent){
        this.currentPage = pageData.pageIndex+1
        this.postsPerPage = pageData.pageSize
        this.service.getPosts1(this.postsPerPage, this.currentPage); 
    }

    onDelete(id: string){        
        this.service.deletePost(id).subscribe((res)=>{
            this.service.getPosts1(this.postsPerPage, this.currentPage)
        });
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe()
        this.authStatusSub.unsubscribe()
    }
}