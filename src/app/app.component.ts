import {Component, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AFlowBlog';
  isCollapsed = false;
  triggerTemplate = null;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }
}

export interface PageModel<T> {
  hasNextPage: boolean;
  pageSize: number;
  pageNum: number;
  count: number;
  list: Array<T>;
}

export class Media {
  id: string;
  name: string;
  path: string;
  description: string;
  mimetype: string;
  create_date: string;
  modify_date: string;
}

export class Profile {
  id: string;
  username: string;
  nickname: string;
  userImg: string;
  gender: number;
  email: string;
  signature: string;
  confirmed: boolean;
  lastLoginDate: string;
  joinDate: string;
  mobile: string;
  status: number;
  role: number;
}

export class Tag {
  id: string;
  name: string;
  alias: string;
  image: string;
  description: string;
  color: string;
}

export class Categories {
  id: string;
  name = '未分类';
  alias: string;
  image: string;
  description: string;
}

export class Post {
  id = '';
  title = '';
  description = '';
  content = '';
  create_date = '';
  modify_date = '';
  publish_date = '';
  cover = null;
  stick = false;
  open = 0;
  password = '';
  open_comment = true;
  need_review = false;
  status = 0;
  categories = null;
  tags: Tag[] = [];
}

export class Comment {
  id: string;
  status: number;
  content: string;
  creator: Creator;
  create_date: string;
  post: Post;
  delete_date: string;
  delete_reason: string;

}

export class Creator {
  name: string;
  email: string;
  host: string;
  img: string;
}

export class Auth {
  access_token: string;
  // token_type: string;
  // epires_in: number;
  // refresh_token: string;
}
