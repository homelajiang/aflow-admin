import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {LoginComponent} from './login/login.component';
import {MediaListComponent} from './media/media-list/media-list.component';
import {PostEditComponent} from './post/post-edit/post-edit.component';
import {PostListComponent} from './post/post-list/post-list.component';
import {CommentComponent} from './comment/comment.component';
import {TagComponent} from './tag/tag.component';
import {CategoriesComponent} from './categories/categories.component';
import {appRouting} from './app.router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PostDashboardComponent} from './post/post-dashboard/post-dashboard.component';
import {CommentDashboardComponent} from './comment/comment-dashboard/comment-dashboard.component';
import {MarkdownComponent} from './markdown/markdown.component';
import {Code404Component} from './code404/code404.component';
import {MainComponent} from './main/main.component';
import {SettingComponent} from './setting/setting.component';
import {ClipboardModule} from 'ngx-clipboard';
import {ViserModule} from 'viser-ng';
import {httpInterceptorProviders} from './http-interceptors';
import {JwtModule} from '@auth0/angular-jwt';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    MediaListComponent,
    PostEditComponent,
    PostListComponent,
    CommentComponent,
    TagComponent,
    CategoriesComponent,
    DashboardComponent,
    PostDashboardComponent,
    CommentDashboardComponent,
    MarkdownComponent,
    Code404Component,
    MainComponent,
    SettingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    appRouting,
    ClipboardModule,
    ViserModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [], // 限制 JWT 发送的域名，这样公开 API 将不会接收到 JWT。
        blacklistedRoutes: [] // 允许我们指定不用接收 JWT 的路径，即使这些路径包含在 whitelisted 域名中。通常我们需要将登陆接口路径加在此处。
      }
    })
  ],
  providers: [{provide: NZ_I18N, useValue: zh_CN},
    httpInterceptorProviders // 拦截器
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function tokenGetter() {
  return localStorage.getItem('access_token');
}
