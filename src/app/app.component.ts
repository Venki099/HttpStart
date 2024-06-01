import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  loadedPosts:Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription

  constructor(private http: HttpClient,private postService : PostsService) {}

  ngOnInit() {
   this.errorSub = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage
    })

    this.isFetching = true;
    this.postService.fetchPost().subscribe(post => {
      this.isFetching = false;
      this.loadedPosts = post
    },error =>{
      this.isFetching = false;
      this.error = error.error.error
      console.log(this.error)
    });
  }

  ngOnDestroy() {
      this.errorSub.unsubscribe();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData.title,postData.content);
    this.onFetchPosts();
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPost().subscribe(post => {
      this.isFetching = false;
      this.loadedPosts = post
    },error =>{
      this.isFetching = false;
      this.error = error.error.error
      console.log(this.error)
    });
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePost().subscribe(responseData => {
      console.log(responseData);
      this.loadedPosts = [];
    });
  }

  private fetchPost(){
    this.isFetching = true
  }

  onHandleerror(){
    this.error = null;
  }
}
