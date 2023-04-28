import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { PostsService } from './posts/posts.service';
import { AuthService } from './auth/auth.service';

// export interface postss {
//   title: string,
//   content: string
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  storedPosts: Post[] = []

  onPostAdded(post:Post){
    this.storedPosts.push(post);
  }

  constructor(public authService: AuthService) {}
  ngOnInit(){
    this.authService.autoAuthUser()
  }
}
