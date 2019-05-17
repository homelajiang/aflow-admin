import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Categories, PageModel, Post, Tag} from '../../app.component';
import {BlogService} from '../../blog/blog.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {MarkdownComponent} from '../../markdown/markdown.component';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  @ViewChild('inputElement') inputElement: ElementRef;

  // post = new Post();
  radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  openStatusEditing; // 正在编辑开放状态
  commentStatusEditing; // 正在编辑评论状态
  openStatus = '0'; // 开放状态
  stick: boolean; // 置顶
  postPw: string; // 密码
  commentStatus = '0'; // 评论状态
  needReview: boolean; // 需要审核
  categories: Categories[] = [];
  showCategoriesMenu = false;
  newCategoriesName: string;
  showTagMenu = false;
  newTagValue = '';
  tagInputVisible = false;
  tags: Tag[] = [];
  coverSelected: boolean;
  noCategories = new Categories();

  post: Post;

  @ViewChild(MarkdownComponent)
  private markdown: MarkdownComponent;

  constructor(private blogService: BlogService, private toast: NzMessageService,
              private routerInfo: ActivatedRoute) {
  }

  ngOnInit() {
    // this.mdContent = '## 回复可见的是\n' +
    //   '>引用\n\n* 元\--啦啦--n\n**哇呕**\n```javascript\nfunction(){\nalert("yuan");\n}\n' +
    //   'module.exports = require(\'./lib/marked\');\n' +
    //   'import "com.android.utils.*"' + '\n' +
    //   '```\n' + '$$E=mc^2$$';
    // this.getPostInfo();

    const postId = this.routerInfo.snapshot.paramMap.get('id');
    if (postId) {
      this.routerInfo.data
        .subscribe((data: { post: Post }) => {
          this.post = data.post;
        }, (err) => {
          console.log(err);
        });
    } else {
      this.post = new Post();
    }
    this.getAllCategories();
    this.getUsedTags();
  }


  prePost() {

  }

  toggleOpenMenu(status: boolean) {
    this.openStatusEditing = status;
    if (status) {
      this.openStatus = this.post.open.toString();
      this.postPw = this.post.password;
      this.stick = this.post.stick;
    }
  }

  changeOpenStatus() {
    this.post.open = parseInt(this.openStatus, 0);
    this.post.password = this.postPw;
    this.post.stick = this.stick;
    this.openStatusEditing = false;
  }

  toggleCommentMenu(status: boolean) {
    this.commentStatusEditing = status;
    if (status) {
      this.commentStatus = this.post.open_comment ? '0' : '1';
      this.needReview = this.post.need_review;
    }
  }

  changeCommentStatus() {
    this.post.open_comment = this.commentStatus === '0';
    this.post.need_review = this.needReview;
    this.commentStatusEditing = false;
  }

  toggleCategoriesMenu() {
    this.showCategoriesMenu = !this.showCategoriesMenu;
  }

  createCategories() {
    const categories = new Categories();
    categories.name = this.newCategoriesName;
    this.blogService.createCategories(categories)
      .subscribe((res: Categories) => {
        this.toast.success('分类创建成功');
        this.newCategoriesName = '';
        this.categories.push(res);
      }, (err) => {
        this.toast.error(`分类创建失败:${err}`);
      });
  }

  toggleTagMenu() {
    this.showTagMenu = !this.showTagMenu;
  }

  createTag() {
    const tag = new Tag();
    tag.name = this.newTagValue;
    this.blogService.createTags(tag)
      .subscribe((res: Tag) => {
        this.handleNewTag(res);
      }, (err) => {
        this.toast.error(`标签创建失败:${err}`);
      });
  }

  handleNewTag(tag: Tag) {
    this.tags.push(tag);
    this.post.tags.push(tag);
    this.newTagValue = '';
    this.tagInputVisible = false;
  }

  handleTagClose(removedTag: Tag): void {
    this.post.tags = this.post.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showTagInput(): void {
    this.tagInputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  selectTag(tag: Tag) {
    let found = false;
    this.post.tags.some((value: Tag) => {
      return found = tag.id === value.id;
    });
    if (!found) {
      this.post.tags.push(tag);
    }
  }

  toggleCover() {
    if (this.coverSelected) {
      this.post.cover = '';
    } else {
      // 选择图片
      this.post.cover = 'http://cover.acfunwiki.org/cover.php';
    }
    this.coverSelected = !this.coverSelected;
  }

  setAsDraft() { // 设置为草稿
    this.post.status = 0;
  }

  showStatusText() {
    if (this.post.status === 0) {
      return '草稿';
    } else if (this.post.status > 0) {
      return '已发布';
    } else {
      return '已删除';
    }
  }

  showOpenText() {
    if (this.post.open === 0) {
      if (this.post.stick) {
        return '开放、置顶';
      }
      return '开放';
    } else if (this.post.open === 1) {
      return '密码保护';
    } else if (this.post.open === 2) {
      return '私密';
    } else {
      return '未知状态';
    }
  }

  showCommentStatusText() {
    if (this.post.open_comment) {
      if (this.post.need_review) {
        return '评论需要审核';
      } else {
        return '开放评论';
      }
    } else {
      return '禁止评论';
    }
  }

  updatePostInfo() {
    if (this.post && this.post.id) {
      this.openStatus = this.post.status.toString();
      this.stick = this.post.stick;
      this.postPw = this.post.password;
      this.commentStatus = this.post.open ? '0' : '1';
      this.needReview = this.post.need_review;
    }
  }

  getAllCategories() {
    this.blogService.getCategories(1, 100)
      .subscribe((res: PageModel<Categories>) => {
        this.categories = res.list;
      }, (err) => {
        this.toast.error(err);
      });
  }

  getUsedTags() {
    this.blogService.getTags(1, 15)
      .subscribe((res: PageModel<Tag>) => {
        this.tags = res.list;
      }, (err) => {
        this.toast.error(err);
      });
  }

  savePost(publish?: boolean) {
    const p = this.filterPost();
    if (publish) {
      p['status'] = 1;
    }
    if (this.post.id) {
      this.blogService.updatePost(this.post.id, p)
        .subscribe((res) => {
          this.post = res;
          if (publish) {
            this.toast.success('发布成功');
          } else {
            this.toast.success('保存成功');
          }
        }, (err) => {
          this.toast.error(err);
        });
    } else {
      this.blogService.createPost(p)
        .subscribe((res) => {
          this.post = res;
          if (publish) {
            this.toast.success('发布成功');
          } else {
            this.toast.success('保存成功');
          }
        }, (err) => {
          this.toast.error(err);
        });
    }
  }


  filterPost() {
    const data = {};
    data['title'] = this.post.title;
    data['description'] = this.post.description;
    data['content'] = this.markdown.getMdContent();

    if (!this.post.title && !this.post.description && !this.post.content) {
      this.toast.error('写点东西再保存吧');
      return;
    }

    data['cover'] = this.post.cover ? this.post.cover : null;
    data['stick'] = !!this.post.stick;
    data['open'] = this.post.open;
    data['password'] = this.post.password;
    data['open_comment'] = this.post.open_comment;
    data['need_review'] = this.post.need_review;
    data['status'] = this.post.status;
    data['categories'] = this.post.categories ? this.post.categories.id : null;

    data['tags'] = [];

    this.post.tags.forEach((tag: Tag) => {
      data['tags'].push(tag.id);
    });
    return data;
  }


  getPostInfo(postId: string) {
    this.blogService.getPostInfo(postId)
      .subscribe((res: Post) => {
        this.post = res;
        this.updatePostInfo();
      }, (err) => {
        this.toast.error(err);
      });

  }

  /*  handleChange(checked: boolean, tag: string): void {
      if (checked) {
        this.selectedTags.push(tag);
      } else {
        this.selectedTags = this.selectedTags.filter(t => t !== tag);
      }
      console.log('You are interested in: ', this.selectedTags);
    }*/

}
