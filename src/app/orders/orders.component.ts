import { Component,OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var google: any, GeoCode: any, firebase: any;

@Component({
    moduleId: module.id,
    selector: 'orders-cmp',
    templateUrl: 'orders.component.html',
    styleUrls: ['orders.component.scss']
})

export class OrdersComponent implements OnInit {

    public tableData1: any;
    public markers: any = [];
    public map: any = null;
    private googleGeoCode: any;
    public user = {
        "username": "backoffice01",
        "password": "123456"
    };
    public orders: any = [];

    constructor(private httpClient:HttpClient) {
        this.googleGeoCode   = new GeoCode('google', { key: 'AIzaSyD_NMEe_Y-jP1p37eXkI_ua5J-XXi_TTFA' });

        //httpClient.post('http://localhost:3000/users/login', this.user).toPromise();
        httpClient.get('http://localhost:3000/orders').toPromise().then((data) => {
            console.log(data);
            this.orders = data;
            this.orders.forEach(e => {   
                e.orderDate = new Date(e.orderDate).toDateString();
                this.googleGeoCode.geolookup(e.supplier.details.address).then(result => {
                    console.log(result);
                    this.markers.push(result[0]);
                    if (this.map)
                        this.map.setCenter([result[0].lat, result[0].lng]);
                });
            });
        }).catch(err => {
            console.log(err);
        })
    }

    private updateServerWithToken(token) {
        this.httpClient.post('http://localhost:3000/users/registerChromePush', {username: this.user.username, chromeToken: token}).toPromise().then(function(data) {
            console.log(data);
        }).catch(err => {
            console.log(err);
        })
    }

    ngOnInit() {

        const messaging = firebase.messaging();
        messaging.usePublicVapidKey("BFEu4qbkvDdhsxAySDDom7WddVoJpm9q2zXDODZ61FcetroIErhVkD6lS3kXE8XjJjchXD9GuslTgYvsqs_98YY");
        messaging.requestPermission().then(function() {
            console.log('Notification permission granted.');
            // TODO(developer): Retrieve an Instance ID token for use with FCM.
            // ...
        }).catch(function(err) {
            console.log('Unable to get permission to notify.', err);
        });
        messaging.getToken().then((currentToken) =>{
            if (currentToken) {
                console.log("Token is ", currentToken);
                this.updateServerWithToken(currentToken);
              //sendTokenToServer(currentToken);
              //updateUIForPushEnabled(currentToken);
            } else {
              // Show permission request.
              console.log('No Instance ID token available. Request permission to generate one.');
              // Show permission UI.
              //updateUIForPushPermissionRequired();
              //setTokenSentToServer(false);
            }
          }).catch(function(err) {
            console.log('An error occurred while retrieving token. ', err);
            //showToken('Error retrieving Instance ID token. ', err);
            //setTokenSentToServer(false);
          });

          messaging.onTokenRefresh(function() {
            messaging.getToken().then(function(refreshedToken) {
              console.log('Token refreshed.');
              // Indicate that the new Instance ID token has not yet been sent to the
              // app server.
              //setTokenSentToServer(false);
              // Send Instance ID token to app server.
              //sendTokenToServer(refreshedToken);
              // ...
              this.updateServerWithToken(refreshedToken);
            }).catch(function(err) {
              console.log('Unable to retrieve refreshed token ', err);
              //showToken('Unable to retrieve refreshed token ', err);
            });
          });

          messaging.onMessage((payload) => {
            console.log('Message received. ', payload);
            this.httpClient.get('http://localhost:3000/orders/' + payload.data.order).toPromise().then((data: any)=> {
                data.isNew = true;
                data.orderDate = new Date(data.orderDate).toDateString();
                this.googleGeoCode.geolookup(data.supplier.details.address).then(result => {
                    console.log(result);
                    this.markers.push(result[0]);
                    if (this.map)
                        this.map.setCenter([result[0].lat, result[0].lng]);
                });
                this.orders.push(data);
                this.setZoom();
            }).catch(err => {
                console.log(err);
            })
          });


        this.tableData1 = {
            dataRows: [
                { name: 'one', address:'Shtand', city: 'Tel Aviv', phone: '044-4222333', isNew: true, created: new Date().toDateString(), image: 'http://befreshcorp.net/wp-content/uploads/2017/06/product-packshot-Carrot-558x600.jpg'},
                { name: 'two', address:'Bazel', city: 'Tel Aviv', phone: '044-4222333', isNew: false, created: new Date().toDateString(), image: 'http://befreshcorp.net/wp-content/uploads/2017/06/product-packshot-Carrot-558x600.jpg'},
                { name: 'three', address:'Moses', city: 'Tel Aviv', phone: '044-4222333', isNew: false, created: new Date().toDateString(), image: 'http://befreshcorp.net/wp-content/uploads/2017/06/product-packshot-Carrot-558x600.jpg'},
                { name: 'four', address:'Dizengoff', city: 'Tel Aviv', phone: '044-4222333', isNew: false, created: new Date().toDateString(), image: 'http://befreshcorp.net/wp-content/uploads/2017/06/product-packshot-Carrot-558x600.jpg'}
            ]
        };





        // var myLatlng = new google.maps.LatLng(40.748817, -73.985428);
        // var mapOptions = {
        //   zoom: 13,
        //   center: myLatlng,
        //   scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
        //   styles: [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}]
        //
        // }
        // var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //
        // var marker = new google.maps.Marker({
        //     position: myLatlng,
        //     title:"Hello World!"
        // });
        //
        // // To add the marker to the map, call setMap();
        // marker.setMap(map);
    }

    onMapReady(map) {
        this.map = map;
        if (this.markers[0])
            this.map.setCenter(this.markers[0].raw.geometry.location);
        this.setZoom();
    }

    setZoom() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
            let marker =new google.maps.Marker({
                position: this.markers[i].raw.geometry.location
            });
            bounds.extend(marker.getPosition());
        }

        this.map.fitBounds(bounds);
    }
}
