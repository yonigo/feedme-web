import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  title = 'app';

  constructor(httpClient: HttpClient) {
  }
}
