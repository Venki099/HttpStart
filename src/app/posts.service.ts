import { HttpClient, HttpEventType, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map,catchError, tap } from "rxjs/operators";
import { Subject,throwError } from "rxjs";

@Injectable({
  providedIn:'root'
})

export class PostsService{
  error = new Subject<string>()
  constructor(private http:HttpClient){}
  createAndStorePost(title:string,content:string){
    // console.log(postData);
    const postData : Post = {
      title:title,
      content:content
    }
    this.http.post<{name:string}>('https://backend-dedd7-default-rtdb.firebaseio.com/post.json',postData,{
      observe:'response'
    }).subscribe(response => {
      console.log(response);
    },error => {
      this.error.next(error.message);
    })
  }

  fetchPost(){
   return this.http.get<{[key:string]:Post}>('https://backend-dedd7-default-rtdb.firebaseio.com/post.json',
   {
      headers : new HttpHeaders({'Custom-Header':'Hello'})
   })
    .pipe(map(responseData => {
      const postArray :Post[] = []
      for(const key in responseData){
        if(responseData.hasOwnProperty(key)){
          postArray.push({...responseData[key],id:key})
        }
      }
      return postArray;
    }),catchError(errorRes => {
      return throwError(errorRes)
    }))
    // .subscribe(posts => {
    //   console.log(posts);
    //   // this.isFetching = false;
    //   // this.loadedPosts = posts
    // })
  }

  deletePost(){
    return this.http.delete('https://backend-dedd7-default-rtdb.firebaseio.com/post.json',{
      observe:'events'
    }).pipe(tap(event => {
      console.log(event);
      if(event.type === HttpEventType.Response){
        console.log(event.body)
      }
    }))
  }
}
