import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-dashboard',
  templateUrl: './comment-dashboard.component.html',
  styleUrls: ['./comment-dashboard.component.css']
})
export class CommentDashboardComponent implements OnInit {

  constructor() { }

  data = new Array(4).fill({}).map((i, index) => {
    return {
      href: 'http://ant.design',
      title: `User ${index}`,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content: 'We supply a series of design principles, ' +
      'practical patterns and high quality design resources (Sketch and Axure), ' +
      'to help people create their product prototypes beautifully and efficiently.'
    };
  });

  ngOnInit() {
  }

}
