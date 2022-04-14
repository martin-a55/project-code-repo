import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable()
export class WebService {
 constructor(public http: HttpClient) {}

 //host = 'https://stockprojectapi.azurewebsites.net'; 
 host =  'http://localhost:5000'; 

 

 getStockLoactions() {
  return this.http.get(
    encodeURI( this.host + '/api/v1.0/location'));
  }

  getOneStockLocation(id: any) {
    return this.http.get(
      encodeURI(this.host + '/api/v1.0/location/' + id));
  }

  getStock(id: any) {
    return this.http.get(
    encodeURI(this.host + '/api/v1.0/location/' + id + '/stock'));
    }

    postLocation(location: any) {
      let postData = new FormData();
      postData.append("location", location.location);
      postData.append("warehouse", location.warehouse);
      postData.append("stock_rack", location.rack);
      postData.append("rack_row", location.row);
      postData.append("rack_column", location.column);
      
      
      return this.http.post(
        encodeURI(this.host + '/api/v1.0/location'), postData);
      
      }

    updateLocation(location: any, id: any) {
      let postData = new FormData();
      postData.append("location", location.location);
      postData.append("warehouse", location.warehouse);
      postData.append("stock_rack", location.rack);
      postData.append("rack_row", location.row);
      postData.append("rack_column", location.column);
      
      
      return this.http.put(
        encodeURI(this.host + '/api/v1.0/location/' + id), postData);
      
      }

  deleteLocation(id: any) {
    return this.http.delete(
      encodeURI(this.host + '/api/v1.0/location/' + id));
    }

    deleteStock(lid: any, sid: any) {
      return this.http.delete(
        encodeURI(this.host + '/api/v1.0/location/' + lid + '/stock/' + sid));
      }

    postStock(stock: any, id: any) {
      let postData = new FormData();
      
        
      postData.append("details", stock.details);
      postData.append("quantity", stock.qty);
        
      return this.http.post(
        encodeURI(this.host + '/api/v1.0/location/' + id + '/stock'), postData);
        
       }

      getStockDetails() {
          return this.http.get(
            encodeURI( this.host + '/api/v1.0/details'));
        }

        postDetails(details: any) {
          let postData = new FormData();
          postData.append("name", details.name);
          postData.append("desc", details.desc);
          postData.append("reorder", details.reorder);
          postData.append("img", details.img);
          
          return this.http.post(
            encodeURI(this.host + '/api/v1.0/details'), postData);
          
          }

          updateDetails(details: any, id: any) {
            let postData = new FormData();
             postData.append("name", details.name);
          postData.append("desc", details.desc);
          postData.append("reorder", details.reorder);
          postData.append("img", details.img);
            
            
            return this.http.put(
              encodeURI(this.host + '/api/v1.0/details/' + id), postData);
            
            }

          getOneStockDetails(id: any) {
            return this.http.get(
              encodeURI(this.host + '/api/v1.0/details/' + id));
          }

          getStockByDetails(id: any) {
            return this.http.get(
              encodeURI(this.host + '/api/v1.0/details/' + id + '/stock'));
          }
    
          deleteDetails(id: any) {
            return this.http.delete(
              encodeURI(this.host + '/api/v1.0/details/' + id));
            }
}
