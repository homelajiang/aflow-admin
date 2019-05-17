import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {PageModel, Post, Profile} from '../app.component';
import {AuthService} from '../auth/auth.service';
import {BlogService} from '../blog/blog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  private profile: Profile;

  cardNoPadding = {
    padding: 0
  };
  cardBottomPadding = {
    padding: '20px 24px 8px',
  };

  height = 46;

  statistics = {
    blog: {
      statistics: [],
      current: 0,
      total: 0
    },
    view: {
      statistics: [],
      current: 0,
      total: 0
    },
    comment: {
      statistics: [],
      current: 0,
      total: 0
    },
    storage: {
      used: '',
      total: '',
      percent: '',
      mediaCount: 0
    }
  };
  scale = [{
    dataKey: 'date',
    tickInterval: 20,
  }];

  lineScale = [{
    dataKey: 'value',
    min: 0,
  }, {
    dataKey: 'date',
    min: 0,
    max: 1,
  }];

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  todoPage = 1;
  todoCount: number;
  todoList = [];
  showDelCommentDialog = false;
  rejectCommentId: string;
  reject_reason: string;
  reject_other_reason: string;
  sort_range = 'week';
  sort_posts: Post[] = [];

  handleChange({file, fileList}): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.toast.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.toast.error(`${file.name} file upload failed.`);
    }
  }

  constructor(private toast: NzMessageService, private authService: AuthService, private blogService: BlogService) {
  }

  ngOnInit() {
    this.profile = this.authService.profile;
    this.getTodoList(this.todoPage);
    this.getSortPosts(this.sort_range);

    this.blogService.getStatistics()
      .subscribe((res) => {
        this.statistics = res;
      });


  }


  acceptComment(id: string) {
    const temp = {
      status: 0
    };
    this.blogService.updateComment(id, temp)
      .subscribe(res => {
        this.toast.success('审核通过');
        this.todoList = this.todoList.filter(todo => todo.id !== res.id);
      }, err => {
        this.toast.error(`审核失败，请重试：\n${err}`);
      });
  }

  rejectComment(id: string) {
    this.showDelCommentDialog = true;
    this.rejectCommentId = id;
  }

  onCancelDelCommentDialog() {
    this.showDelCommentDialog = false;
    this.reject_reason = '';
    this.reject_other_reason = '';
  }

  onEnsureDelCommentDialog() {
    if (!this.reject_reason) {
      this.toast.error('请选择拒绝原因');
      return;
    }
    if ('其他' === this.reject_reason && !this.reject_other_reason) {
      this.toast.error('请填写其他的拒绝原因');
      return;
    }
    this.showDelCommentDialog = false;
    let reason = this.reject_reason;
    if (reason === '其他') {
      reason = this.reject_other_reason;
    }

    const temp = {
      status: -1,
      delete_reason: reason
    };

    this.blogService.updateComment(this.rejectCommentId, temp)
      .subscribe(res => {
        this.reject_reason = '';
        this.reject_other_reason = '';
        this.toast.success('已处理');
        this.todoList = this.todoList.filter(todo => todo.id !== res.id);
      }, err => {
        this.toast.error(`拒绝失败：\n${err}`);
      });

  }

  getSortPosts(sort_range: string) {
    this.blogService.getPostStatistics('view', sort_range)
      .subscribe((res) => {
        this.sort_posts = res;
      }, (err) => {
        this.toast.error(`获取热门文章失败：\n${err}`);
      });
  }

  getTodoList(page: number) {
    this.todoPage = page;
    this.blogService.getTodos(this.todoPage)
      .subscribe((res: PageModel<any>) => {
        this.todoList = res.list;
        this.todoPage = res.pageNum;
        this.todoCount = res.count;
      }, (err) => {
        this.toast.error(`获取待办事项失败：\n${err}`);
      });
  }


}
