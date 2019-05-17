import {Component, OnInit} from '@angular/core';
import {BlogService} from '../blog/blog.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Comment, PageModel, Post} from '../app.component';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  searchText: string;
  searchType = '0'; // 0 发布 1 待审核 -1 删除
  pageSize = 10;
  page = 1;
  commentCount = 0;
  currentPage = 1;

  comments = [];
  isVisible: boolean; // 删除提示框
  delete_reason: string;
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };
  other_reason = '';
  delete_id: string;
  filter_post: Post;

  constructor(private blogService: BlogService, private toast: NzMessageService) {
  }

  ngOnInit() {
    this.getComments();
  }

  changeType(type) {
    this.searchType = type;
    this.page = 1;
    this.getComments();
  }

  pageSelect(page) {
    this.page = page;
    this.getComments();
  }

  search(text) {
    this.searchText = text;
    this.page = 1;
    this.getComments();
  }

  filterPost(post: Post) {
    this.filter_post = post;
    this.getComments();
  }

  closeFilterPost() {
    this.filter_post = null;
    this.getComments();
  }

  deleteComment(id: string) {
    this.isVisible = true;
    this.delete_id = id;
  }

  ensure(): void {
    if (!this.delete_reason) {
      this.toast.error('请选择删除原因');
      return;
    }
    if ('其他' === this.delete_reason && !this.other_reason) {
      this.toast.error('请填写其他的删除原因');
      return;
    }
    this.isVisible = false;
    let reason = this.delete_reason;
    if (reason === '其他') {
      reason = this.other_reason;
    }

    const temp = {
      status: -1,
      delete_reason: reason
    };

    this.blogService.updateComment(this.delete_id, temp)
      .subscribe(res => {
        this.delete_reason = '';
        this.other_reason = '';
        this.toast.success('删除成功');
        this.comments = this.comments.filter(comment => comment.id !== res.id);
      }, err => {
        this.toast.success(`删除失败，请重试：\n${err}`);
      });

  }

  cancel(): void {
    this.isVisible = false;
    this.delete_reason = '';
    this.other_reason = '';
  }

  acceptComment(id: string) {
    const temp = {
      status: 0
    };
    this.blogService.updateComment(id, temp)
      .subscribe(res => {
        this.toast.success('审核通过');
        this.comments = this.comments.filter(comment => comment.id !== res.id);
      }, err => {
        this.toast.error(`审核失败，请重试：\n${err}`);
      });
  }

  getComments() {
    this.blogService.getComments(this.page, this.pageSize, this.searchType, this.searchText, this.filter_post)
      .subscribe((commentPage: PageModel<Comment>) => {
        this.comments = commentPage.list;
        this.commentCount = commentPage.count;
        this.currentPage = commentPage.pageNum;
      }, (err) => {
        this.toast.error(err);
      });
  }

}
