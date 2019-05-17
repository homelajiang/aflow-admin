import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.css']
})
export class PostDashboardComponent implements OnInit {

  @Input()
  statistics_post: any;

  constructor() {
  }

  ngOnInit() {
  }

}
