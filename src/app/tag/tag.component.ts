import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BlogService} from '../blog/blog.service';
import {PageModel, Tag} from '../app.component';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  tagForm: FormGroup;
  editForm: FormGroup;

  tags = [];
  tagCount: number;
  currentPage: number;
  pageSize = 6;
  private searchText: string;
  private page = 1;
  isSpinning = false;
  editTagModel: Tag;
  editMode = false; // 编辑状态


  constructor(private fb: FormBuilder, private blogService: BlogService,
              private toast: NzMessageService, private modalService: NzModalService) {
  }

  ngOnInit() {
    this.tagForm = this.fb.group({
      name: [null, [Validators.required]],
      alias: [null],
      image: [null],
      description: [null]
    });

    this.editForm = this.fb.group({
      alias: [null],
      image: [null],
      description: [null]
    });

    this.getTags();
  }

  createTag() {
    for (const i in this.tagForm.controls) {
      this.tagForm.controls[i].markAsDirty();
      this.tagForm.controls[i].updateValueAndValidity();
    }
    if (this.tagForm.invalid) {
      return;
    }
    this.isSpinning = true;
    this.blogService.createTags(this.tagForm.value)
      .subscribe((tag: Tag) => {
        this.isSpinning = false;
        this.toast.success('创建成功');
        this.page = 1;
        this.getTags();
        this.tagForm.reset();
      }, (err) => {
        this.isSpinning = false;
        this.toast.error(`创建失败：${err}`);
      });

  }


  updateCategories() {
    for (const i in this.editForm.controls) {
      this.editForm.controls[i].markAsDirty();
      this.editForm.controls[i].updateValueAndValidity();
    }
    if (this.editForm.invalid) {
      return;
    }
    this.blogService.updateTag(this.editTagModel.id, this.editForm.value)
      .subscribe((tag: Tag) => {
        this.editTagModel = tag;
        this.toast.success(`修改成功`);
        this.tags.forEach((c, index) => {
          if (c.id === tag.id) {
            this.tags[index] = tag;
            this.tags = this.tags.concat([]); // 只能重新赋值
            return;
          }
        });
      }, (err) => {
        this.toast.error(`修改失败：${err}`);
      });
  }

  editCategories(tag: Tag) {
    this.editTagModel = tag;
    this.editMode = true;
    this.editForm.patchValue({
      alias: tag.alias,
      image: tag.image,
      description: tag.description
    });
  }

  deleteTag(tag: Tag) {
    this.modalService.confirm({
      nzTitle: `确定删除该分类`,
      nzContent: `即将删除分类：${tag.name} - ${tag.alias},是否继续删除`,
      nzOnOk: () => {
        this.blogService.removeTag(tag.id)
          .subscribe(() => {
            this.toast.success('删除成功');
            this.getTags();
          }, (err) => {
            this.toast.error(`删除失败：${err}`);
          });
      }
    });
  }

  pageSelect(page) {
    this.page = page;
    this.getTags();
  }

  search(searchText: string) {
    this.searchText = searchText;
    this.page = 1;
    this.getTags();
  }

  closeEditDrawer() {
    this.editMode = false;
  }

  getTags() {
    this.blogService.getTags(this.page, this.pageSize, this.searchText)
      .subscribe((tagPage: PageModel<Tag>) => {
        this.tags = tagPage.list;
        this.tagCount = tagPage.count;
        this.currentPage = tagPage.pageNum;
      }, (err) => {
        this.toast.error(err);
      });
  }


}
