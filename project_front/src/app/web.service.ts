import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable()
export class WebService {
 constructor(public http: HttpClient) {}

 

 getStockLoactions() {
  return this.http.get(
    encodeURI('http://localhost:5000/api/v1.0/location'));
  }

  getOneStockLocation(id: any) {
    return this.http.get(
      encodeURI('http://localhost:5000/api/v1.0/location/' + id));
  }

  getStock(id: any) {
    return this.http.get(
    encodeURI('http://localhost:5000/api/v1.0/location/' + id + '/stock'));
    }

    postLocation(location: any) {
      let postData = new FormData();
      postData.append("location", location.location);
      postData.append("warehouse", location.warehouse);
      postData.append("stock_rack", location.rack);
      postData.append("rack_row", location.row);
      postData.append("rack_column", location.column);
      
      
      return this.http.post(
        encodeURI('http://localhost:5000/api/v1.0/location'), postData);
      
      }

    updateLocation(location: any, id: any) {
      let postData = new FormData();
      postData.append("location", location.location);
      postData.append("warehouse", location.warehouse);
      postData.append("stock_rack", location.rack);
      postData.append("rack_row", location.row);
      postData.append("rack_column", location.column);
      
      
      return this.http.put(
        encodeURI('http://localhost:5000/api/v1.0/location/' + id), postData);
      
      }

  deleteLocation(id: any) {
    return this.http.delete(
      encodeURI('http://localhost:5000/api/v1.0/location/' + id));
    }

    deleteStock(lid: any, sid: any) {
      return this.http.delete(
        encodeURI('http://localhost:5000/api/v1.0/location/' + lid + '/stock/' + sid));
      }

      postStock(stock: any, id: any) {
        let postData = new FormData();
        console.log(stock.desc);
        
        postData.append("name", stock.name);
        postData.append("quantity", stock.qty);
        postData.append("desc", stock.desc);
        
        return this.http.post(
          encodeURI('http://localhost:5000/api/v1.0/location/' + id + '/stock'), postData);
        
        }
    
}
