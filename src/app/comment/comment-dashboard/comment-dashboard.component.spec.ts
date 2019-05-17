import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentDashboardComponent } from './comment-dashboard.component';

describe('CommentDashboardComponent', () => {
  let component: CommentDashboardComponent;
  let fixture: ComponentFixture<CommentDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
