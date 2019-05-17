import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Categories, Comment, PageModel, Post, Tag} from '../app.component';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  commentHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private authService: AuthService) {
  }


  createCategories(categories: Categories): Observable<Categories> {
    return this.http.post<Categories>('api/v1/categories', categories, this.commentHttpOptions);
  }

  removeCategories(id: string): Observable<{}> {
    return this.http.delete(`api/v1/categories/${id}`);
  }

  updateCategories(id: string, categories: Categories): Observable<Categories> {
    return this.http.post<Categories>(`api/v1/categories/${id}`, categories, this.commentHttpOptions);
  }

  getCategories(page: number, pageSize: number, keyword?: string): Observable<PageModel<Categories>> {
    let p: HttpParams = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNum', page.toString());
    if (keyword && keyword.trim()) {
      p = p.set('key', keyword.trim());
    }
    return this.http.get<PageModel<Categories>>('api/v1/categories', {params: p});
  }

  getCategoriesInfo(id: string): Observable<Categories> {
    return this.http.get<Categories>(`api/v1/categories/${id}`);
  }

  createTags(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>('api/v1/tag', tag, this.commentHttpOptions);
  }

  removeTag(id: string): Observable<{}> {
    return this.http.delete(`api/v1/tag/${id}`);
  }

  updateTag(id: string, tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(`api/v1/tag/${id}`, tag, this.commentHttpOptions);
  }

  getTags(page: number, pageSize: number, keyword?: string): Observable<PageModel<Tag>> {
    let p: HttpParams = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNum', page.toString());
    if (keyword && keyword.trim()) {
      p = p.set('key', keyword.trim());
    }
    return this.http.get<PageModel<Tag>>('api/v1/tag', {params: p});
  }

  removeComment(id: String): Observable<{}> {
    return this.http.delete(`api/v1/comment/${id}`);
  }

  updateComment(id: string, comment: any): Observable<Comment> {
    return this.http.post<Comment>(`api/v1/comment/${id}`, comment, this.commentHttpOptions);
  }

  getComments(page: number, pageSize: number, type: string, keyword: string, post: Post): Observable<PageModel<Comment>> {
    let p: HttpParams = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNum', page.toString());

    if (keyword && keyword.trim()) {
      p = p.set('key', keyword.trim());
    }
    if (post && post.id) {
      p = p.set('post_id', post.id);
    }
    if (type === '0' || type === '1' || type === '-1') {
      p = p.set('type', type.toString());
    }

    return this.http.get<PageModel<Comment>>('api/v1/comment', {params: p});
  }

  getTagInfo(id: string): Observable<Tag> {
    return this.http.get<Tag>(`api/v1/tag/${id}`);
  }

  createPost(post): Observable<Post> {
    return this.http.post<Post>('api/v1/post', post, this.commentHttpOptions);
  }

  removePost(id: string): Observable<{}> {
    return this.http.delete(`api/v1/post/${id}`);
  }

  updatePost(id: string, post): Observable<Post> {
    return this.http.post<Post>(`api/v1/post/${id}`, post, this.commentHttpOptions);
  }

  getPosts(page: number, pageSize: number, type: string, keyword?: string): Observable<PageModel<Post>> {
    let p: HttpParams = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageNum', page.toString());

    if (keyword && keyword.trim()) {
      p = p.set('key', keyword);
    }

    if (type === '0' || type === '1' || type === '-1') {
      p = p.set('type', type);
    }

    return this.http.get<PageModel<Post>>('api/v1/post', {params: p});
  }

  getPostInfo(id: string): Observable<Post> {
    return this.http.get<Post>(`api/v1/post/${id}`);
  }

  getTodos(page: number): Observable<PageModel<any>> {
    return this.http.get<PageModel<any>>(`api/v1/todos`);
  }

  getStatistics(): Observable<any> {
    return this.http.get(`api/v1/statistics`);
  }

  getPostStatistics(sort_by: string, sort_rang: string): Observable<any> {
    const p: HttpParams = new HttpParams()
      .set('sort_by', sort_by)
      .set('sort_range', sort_rang);
    return this.http.get(`api/v1/statistics/post`, {params: p});
  }

}
