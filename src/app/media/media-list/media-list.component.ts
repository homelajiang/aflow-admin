import {Component, OnInit} from '@angular/core';
import {MediaService} from '../media.service';
import {Media, PageModel} from '../../app.component';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.css']
})
export class MediaListComponent implements OnInit {

  private page = 1;
  uploadVisible;

  medias: Media[] = [];
  showingMedia: Media = new Media();
  mediaShowing = false;

  mediaUpdate$: Observable<Media>;
  private descriptionText$ = new Subject<string>();

  loadingStatus: number;
  private STATUS_INVISIBLE = 0;
  private STATUS_CAN_LOAD_MORE = 1;
  private STATUS_LOADING = 2;
  private STATUS_NO_MORE = 3;
  private searchText = '';

  constructor(private mediaService: MediaService,
              private toast: NzMessageService,
              private modalService: NzModalService) {
  }

  ngOnInit() {

    this.mediaUpdate$ = this.descriptionText$.pipe(
      // debounceTime(500),
      distinctUntilChanged(),
      switchMap((desc: string) => {
        const temp = new Media();
        temp.description = desc;
        return this.mediaService.updateMedia(this.showingMedia.id, temp);
      })
    );

    this.mediaUpdate$.subscribe((res: Media) => {
      this.medias.forEach((m: Media, index: number) => {
        if (m.id === res.id) {
          this.medias[index] = res;
          // console.log(`index:${index}`);
          return;
        }
      });
    }, err => {
      this.toast.error(`更新失败：${err}`);
    });

    this.getMedias(true);

  }

  handleChange({file, fileList}): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.toast.success(`${file.name} 上传成功`);
      this.medias.unshift(file.response);
    } else if (status === 'error') {
      this.toast.error(`${file.name} 上传失败`);
    }
  }

  getMedias(refresh: boolean) {
    this.loadingStatus = this.STATUS_LOADING;
    if (refresh) {
      this.page = 1;
    }
    this.mediaService.getMedias(this.page, this.searchText)
      .subscribe((pageMedias: PageModel<Media>) => {
        this.page++;
        if (refresh) {
          this.medias = pageMedias.list;
        } else {
          this.medias = this.medias.concat(pageMedias.list);
        }
        pageMedias.hasNextPage ? this.loadingStatus = this.STATUS_CAN_LOAD_MORE
          : this.loadingStatus = this.STATUS_NO_MORE;

      }, (err) => {
        this.toast.error(err);
        this.loadingStatus = this.STATUS_CAN_LOAD_MORE;
      });
  }

  searchMedia(searchText: string) {
    this.searchText = searchText;
    this.getMedias(true);
  }

  deleteMedia() {
    this.modalService.confirm({
      nzTitle: `确定删除该文件？`,
      nzContent: `即将删除文件 ${this.showingMedia.name} ,删除后将不可恢复。`,
      nzOnOk: () => {
        this.mediaShowing = false;
        this.mediaService.deleteMedia(this.showingMedia.id)
          .subscribe(() => {
            this.toast.success('删除成功');
            this.medias.forEach((m: Media, index: number) => {
              if (m.id === this.showingMedia.id) {
                this.medias.splice(index, 1);
                console.log(`index:${index}`);
                return;
              }
            });
          }, (err) => {
            this.toast.error(err);
          });
      }
    });
  }

  loadMore() {
    this.getMedias(false);
  }


  update_description(description: string) {
    console.log(description);
    description = description.trim();
    if (this.showingMedia.description !== description &&
      !(this.showingMedia.description === undefined && description === '')) {
      this.descriptionText$.next(description);
      this.showingMedia.description = description;
    }
  }

  showMediaDetail(media: Media) {
    this.showingMedia = media;
    this.mediaShowing = true;
  }

  closeShowMedia() {
    this.mediaShowing = false;
  }

  showUpload() {
    this.uploadVisible = true;
  }

  closeUpload() {
    this.uploadVisible = false;
  }


  copyResult(res: boolean) {
    res ? this.toast.success('复制成功') : this.toast.error('复制失败，请手动复制');
  }

}
