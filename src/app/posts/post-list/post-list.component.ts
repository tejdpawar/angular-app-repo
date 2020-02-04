import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    // posts = [{title: 'first post', content: 'first post content'},
    // {title: 'second post', content: 'second post content'}];
    posts: Post[] = [];
    sub: Subscription;
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    userIsAuthenticated = false;
    userId: string;
    private authStatusSub: Subscription;
    constructor(public postSer: PostsService, private authService: AuthService) {

    }
    ngOnInit() {
        this.isLoading = true;
        this.postSer.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.sub = this.postSer.getPostUpdatedListener()
        .subscribe((postsData: { posts: Post[], postCount: number}) => {
          this.isLoading = false;
          this.posts = postsData.posts;
          this.totalPosts = postsData.postCount;
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe((isAuthenticated) => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
    }
    onDelete(postId: string) {
      this.isLoading = true;
      this.postSer.deletePost(postId)
      .subscribe(() => {
        this.postSer.getPosts(this.postsPerPage, this.currentPage);
      });
    }
    onChangedPage(pageData: PageEvent) {
      this.isLoading = true;
      this.currentPage = pageData.pageIndex + 1;
      this.postsPerPage = pageData.pageSize;
      this.postSer.getPosts(this.postsPerPage, this.currentPage);
    }
    ngOnDestroy() {
      this.sub.unsubscribe();
      this.authStatusSub.unsubscribe();
    }
}
