import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BlogService} from '../blog/blog.service';
import {Categories, PageModel} from '../app.component';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoriesForm: FormGroup;
  editForm: FormGroup;

  categories = [];
  categoriesCount: number;
  currentPage: number;
  pageSize = 6;
  private searchText: string;
  private page = 1;
  isSpinning = false;
  editCategoriesModel: Categories;
  editMode = false; // 编辑状态


  constructor(private fb: FormBuilder, private blogService: BlogService,
              private toast: NzMessageService, private modalService: NzModalService) {
  }

  ngOnInit() {
    this.categoriesForm = this.fb.group({
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

    this.getCategories();
  }

  createCategories() {
    for (const i in this.categoriesForm.controls) {
      this.categoriesForm.controls[i].markAsDirty();
      this.categoriesForm.controls[i].updateValueAndValidity();
    }
    if (this.categoriesForm.invalid) {
      return;
    }
    this.isSpinning = true;
    this.blogService.createCategories(this.categoriesForm.value)
      .subscribe((categories: Categories) => {
        this.isSpinning = false;
        this.toast.success('创建成功');
        this.page = 1;
        this.getCategories();
        this.categoriesForm.reset();
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
    this.blogService.updateCategories(this.editCategoriesModel.id, this.editForm.value)
      .subscribe((categories: Categories) => {
        this.editCategoriesModel = categories;
        this.toast.success(`修改成功`);
        this.categories.forEach((c, index) => {
          if (c.id === categories.id) {
            this.categories[index] = categories;
            this.categories = this.categories.concat([]); // 只能重新赋值
            return;
          }
        });
      }, (err) => {
        this.toast.error(`修改失败：${err}`);
      });
  }

  editCategories(categories: Categories) {
    this.editCategoriesModel = categories;
    this.editMode = true;
    this.editForm.patchValue({
      alias: categories.alias,
      image: categories.image,
      description: categories.description
    });
  }

  deleteCategories(categories: Categories) {
    this.modalService.confirm({
      nzTitle: `确定删除该分类`,
      nzContent: `即将删除分类：${categories.name} - ${categories.alias},是否继续删除`,
      nzOnOk: () => {
        this.blogService.removeCategories(categories.id)
          .subscribe(() => {
            this.toast.success('删除成功');
            this.getCategories();
          }, (err) => {
            this.toast.error(`删除失败：${err}`);
          });
      }
    });
  }

  pageSelect(page) {
    this.page = page;
    this.getCategories();
  }

  search(searchText: string) {
    this.searchText = searchText;
    this.page = 1;
    this.getCategories();
  }

  closeEditDrawer() {
    this.editMode = false;
  }

  getCategories() {
    this.blogService.getCategories(this.page, this.pageSize, this.searchText)
      .subscribe((categoriesPage: PageModel<Categories>) => {
        this.categories = categoriesPage.list;
        this.categoriesCount = categoriesPage.count;
        this.currentPage = categoriesPage.pageNum;
      }, (err) => {
        this.toast.error(err);
      });
  }


}
