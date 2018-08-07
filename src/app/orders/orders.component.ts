import { Component,OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var google: any, GeoCode: any, firebase: any, $: any;

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
    public products: any = [];
    private googleGeoCode: any;
    public user: any = {
        "username": "backoffice01",
        "password": "123456"
    };
    public orders: any = [];

    constructor(private httpClient:HttpClient) {
        this.googleGeoCode   = new GeoCode('google', { key: 'AIzaSyB3tRdzJeZlsyOljoj2kl8xrfVXu5EjJ_Q' });

        httpClient.post('http://localhost:3000/users/login', this.user).toPromise().then((data) => { this.user = data});
        httpClient.get('http://localhost:3000/orders').toPromise().then((data) => {
            console.log(data);
            this.orders = data;
            this.orders.forEach(e => {   
                e.orderDate = new Date(e.orderDate).toDateString();
                this.googleGeoCode.geolookup(e.supplier.details.address).then(result => {
                    console.log(result);
                    this.markers.push({pos: result[0], icon: '../../assets/icons/disableMap.png'});
                    if (this.map)
                        this.map.setCenter([result[0].lat, result[0].lng]);
                });
            });
            return httpClient.get('http://localhost:3000/products').toPromise()
        }).then((products) => {
            this.products = products;
            this.orders.forEach( o => {
                o.product = this.products.filter((p) => p._id === o.product)[0];
            });
            console.log( this.orders);
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
        messaging.usePublicVapidKey("BEZO8ocgl3D_81b9rA1EiuUD4a6Ero8hytoVYmlT8G7kGdSoi8zCKcS8mF4-IE4szpR2QDIVCIj-1DTvFLAwQhI");
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
                    this.markers.push({pos: result[0], icon: '../../assets/icons/enableMap.png'});
                    if (this.map)
                        this.map.setCenter([result[0].lat, result[0].lng]);
                });
                this.orders.push(data);
                this.setZoom();
                this.showNotification('bottom','left');
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
    }

    onMapReady(map) {
        this.map = map;
        if (this.markers[0])
            this.map.setCenter(this.markers[0].pos.raw.geometry.location);
        this.setZoom();
    }

    setZoom() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
            let marker =new google.maps.Marker({
                position: this.markers[i].pos.raw.geometry.location
            });
            bounds.extend(marker.getPosition());
        }

        this.map.fitBounds(bounds);
    }

    toggleOrder(order) {
        order.show = !order.show;
        this.orders.forEach((o, i) => {
            if (o.show) 
                this.markers[i].icon = '../../assets/icons/enableMap.png'
            else
            this.markers[i].icon = '../../assets/icons/disableMap.png';
        })
    }

    showNotification(from, align){

    	$.notify({
        	message: "התקבלה הזמנה חדשה"
        },{
            type: 'success',
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
    }

    openModal(event, order) {
        event.stopPropagation();
        this.httpClient.post('http://localhost:3000/orders/accept', {id: order.id, userId: this.user.id }).toPromise().then((data) => { });
    }
}
