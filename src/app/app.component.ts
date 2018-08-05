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
    var data = {
      "username": "farmer01",
      "password": "123456"
    };

    // var promise = httpClient.post('http://localhost:3000/users/login', data).toPromise();

    // promise.then(function(data) {
    //   console.log(data);
    //   httpClient.get('http://localhost:3000/orders/supplier/5b66e7782210230c28d5a456', {withCredentials: true}).toPromise().then(function(data) {
    //     console.log(data);
    //   })
    // });
  }
}
