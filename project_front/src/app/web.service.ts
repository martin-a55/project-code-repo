import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable()
export class WebService {
 constructor(public http: HttpClient) {}

 //set API endpoint host (local host for local testing)
 //host = 'https://stockprojectapi.azurewebsites.net'; 
 host =  'http://localhost:5000'; 

 
//API endpoint for getting all stock locations
 getStockLoactions() {
  return this.http.get(
    encodeURI( this.host + '/api/v1.0/location'));
  }

//API endpoint for getting one stock location
  getOneStockLocation(id: any) {
    return this.http.get(
      encodeURI(this.host + '/api/v1.0/location/' + id));
  }

  //API endpoint for getting one stock
  getStock(id: any) {
    return this.http.get(
    encodeURI(this.host + '/api/v1.0/location/' + id + '/stock'));
  }

  //API endpoint for  adding a new stock location
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

  //API endpoint for editing a stock location
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

  //API endpoint for deleteing stock locations
  deleteLocation(id: any) {
    return this.http.delete(
      encodeURI(this.host + '/api/v1.0/location/' + id));
  }

  //API endpoint for deleting one stock
  deleteStock(lid: any, sid: any) {
    return this.http.delete(
      encodeURI(this.host + '/api/v1.0/location/' + lid + '/stock/' + sid));
  }

 //API endpoint for adding new stock 
  postStock(stock: any, id: any) {
    let postData = new FormData();


    postData.append("details", stock.details);
    postData.append("quantity", stock.qty);

    return this.http.post(
      encodeURI(this.host + '/api/v1.0/location/' + id + '/stock'), postData);
  }

  //API endpoint for getting all stock details
  getStockDetails() {
      return this.http.get(
        encodeURI( this.host + '/api/v1.0/details'));
  }

  //API endpoint for add new stock details
  postDetails(details: any) {
    let postData = new FormData();
    postData.append("name", details.name);
    postData.append("desc", details.desc);
    postData.append("reorder", details.reorder);
    postData.append("max", details.max);
    postData.append("img", details.img);

    return this.http.post(
      encodeURI(this.host + '/api/v1.0/details'), postData);
    
  }

  //API endpoint for editing stock details
  updateDetails(details: any, id: any) {
    let postData = new FormData();
    postData.append("name", details.name);
    postData.append("desc", details.desc);
    postData.append("reorder", details.reorder);
    postData.append("max", details.max);
    postData.append("img", details.img);



    return this.http.put(
      encodeURI(this.host + '/api/v1.0/details/' + id), postData);
  }

  //API endpoint for getting one stock details
  getOneStockDetails(id: any) {
    return this.http.get(
      encodeURI(this.host + '/api/v1.0/details/' + id));
  }

  //API endpoint for getting stock based on its stock details
  getStockByDetails(id: any) {
    return this.http.get(
      encodeURI(this.host + '/api/v1.0/details/' + id + '/stock'));
  }

  //API endpoint for deleteing stock details
  deleteDetails(id: any) {
    return this.http.delete(
      encodeURI(this.host + '/api/v1.0/details/' + id));
  }

  //API endpoint for editing stock
  updateStock(stock: any, lid: any, sid: any) {
      let postData = new FormData();

      postData.append("details", stock.details);
      postData.append("quantity", stock.qty);

      return this.http.put(
      encodeURI(this.host + '/api/v1.0/location/' + lid + '/stock/' + sid), postData);
  }

//API endpoint for searching for stock locations and stock details
  getSearch(field: any, value: any, col: any) {
    return this.http.get(
      encodeURI(this.host + '/api/v1.0/stock/search?field=' + field + "&val=" + value + "&col=" + col));
  }

  //API endpoint for getting details where stock is under reorder
  getReorder() {
    return this.http.get(
      encodeURI(this.host + '/api/v1.0/stock/reorder'));
  }

  //API endpoint for getting details where stock is over max
  getMaxStock() {
    return this.http.get(
      encodeURI(this.host + '/api/v1.0/stock/maxstock'));
  }

  //API endpoint for getting details with stock totals
  getStockAmount() {
    return this.http.get(
      encodeURI(this.host + '/api/v1.0/stock/amount'));
  }
    
}
