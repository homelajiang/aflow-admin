import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PostListComponent} from './post/post-list/post-list.component';
import {CommentComponent} from './comment/comment.component';
import {CategoriesComponent} from './categories/categories.component';
import {Code404Component} from './code404/code404.component';
import {LoginComponent} from './login/login.component';
import {PostEditComponent} from './post/post-edit/post-edit.component';
import {MediaListComponent} from './media/media-list/media-list.component';
import {TagComponent} from './tag/tag.component';
import {AuthGuard} from './auth/auth.guard';
import {MainComponent} from './main/main.component';
import {SettingComponent} from './setting/setting.component';
import {PostDetailResolverService} from './blog/post-detail-resolver.service';

const router: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '', component: MainComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent, data: {title: '工作台'}},
      {path: 'posts', component: PostListComponent, data: {title: '文章'}},
      {path: 'post/edit/:id', component: PostEditComponent, data: {title: '编辑'}, resolve: {post: PostDetailResolverService}},
      {path: 'post/edit', component: PostEditComponent, data: {title: '新建'}},
      {path: 'medias', component: MediaListComponent, data: {title: '多媒体'}},
      {path: 'comments', component: CommentComponent, data: {title: '评论'}},
      {path: 'categories', component: CategoriesComponent, data: {title: '分类'}},
      {path: 'tags', component: TagComponent, data: {title: '标签'}},
      {path: 'setting', component: SettingComponent, data: {title: '设置'}}
    ]
  },
  {path: '**', component: Code404Component}
];

export const appRouting = RouterModule.forRoot(router);
