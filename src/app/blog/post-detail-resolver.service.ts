import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Post} from '../app.component';
import {BlogService} from './blog.service';
import {EMPTY, Observable, of} from 'rxjs';
import {mergeMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostDetailResolverService implements Resolve<Post> {

  constructor(private blogService: BlogService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post> | Promise<Post> | Post {
    const id = route.paramMap.get('id');
    return this.blogService.getPostInfo(id)
      .pipe(
        take(1),
        mergeMap(post => {
          if (post) {
            return of(post);
          } else {
            this.router.navigate(['/']);
            return EMPTY;
          }
        })
      );
  }
}
