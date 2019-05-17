import {Component, OnInit} from '@angular/core';
import {BlogService} from '../../blog/blog.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {PageModel, Post} from '../../app.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  gridStyle = {
    padding: 0,
    margin: '5px',
    width: '40px',
    height: '40px'
  };

  actionStyle = {
    padding: 0
  };
  private tagColors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
  private STATUS_INVISIBLE = 0;
  private STATUS_CAN_LOAD_MORE = 1;
  private STATUS_LOADING = 2;
  private STATUS_NO_MORE = 3;

  pageSize = 10;
  searchText: string;
  searchType = '100';
  posts: Post[] = [];

  loadingStatus: number;
  page = 1;


  constructor(private blogService: BlogService, private router: Router,
              private toast: NzMessageService, private modalService: NzModalService) {
  }

  ngOnInit() {
    this.getPosts(true);
  }


  changeType(type) {
    this.searchType = type;
    this.getPosts(true);
  }

  search(text) {
    this.searchText = text;
    this.getPosts(true);
  }

  newPost() {
    this.router.navigate(['post/edit']);
  }

  editPost(post: Post) {
    this.router.navigate(['post/edit', post.id]);
  }

  viewPost(post: Post) {
    this.toast.success('开发中');
  }

  removePost(post: Post) {
    this.modalService.confirm({
      nzTitle: '确认删除？',
      nzContent: `即将删除  ${post.title}  \r\n删除后将不可恢复，是否继续删除？`,
      nzOnOk: () => {
        this.blogService.removePost(post.id)
          .subscribe(() => {
            this.toast.success(`删除成功`);
            this.posts.forEach((p, index) => {
              if (post.id === p.id) {
                this.posts = this.posts.filter(tp => tp.id !== p.id);
                return;
              }
            });
          }, (err) => {
            this.toast.error(`删除失败：${err}`);
          });
      }
    });
  }

  getPosts(refresh: boolean) {
    this.loadingStatus = this.STATUS_LOADING;
    if (refresh) {
      this.page = 1;
      this.posts = [];
    }
    this.blogService.getPosts(this.page, this.pageSize, this.searchType, this.searchText)
      .subscribe((postPage: PageModel<Post>) => {
        this.page++;
        const postList = postPage.list;
        postList.forEach((p, i) => {
          postList[i].tags.forEach((t, j) => {
            postList[i].tags[j].color = this.getRandomColor();
          });
        });

        if (refresh) {
          this.posts = postList;
        } else {
          this.posts = this.posts.concat(postList);
        }
        if (postPage.count === 0) {
          this.loadingStatus = this.STATUS_INVISIBLE;
        } else {
          postPage.hasNextPage ? this.loadingStatus = this.STATUS_CAN_LOAD_MORE
            : this.loadingStatus = this.STATUS_NO_MORE;
        }
      }, (err) => {
        this.toast.error(err);
        this.loadingStatus = this.STATUS_CAN_LOAD_MORE;
      });
  }

  getRandomColor() {
    return this.tagColors[Math.floor(Math.random() * (this.tagColors.length))];
  }


}
