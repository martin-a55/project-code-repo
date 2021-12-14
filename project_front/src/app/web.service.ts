import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//pokedex_list : any;

@Injectable()
export class WebService {
 constructor(public http: HttpClient) {}

 private pokemonID: any;

 pages : any; 

 getPokedex(page: number) {
  return this.http.get(
    'http://localhost:5000/api/v1.0/pokemon?pn=' + page);
  }

  getShortPokedex(page: number) {
    return this.http.get(
      
      'http://localhost:5000/api/v1.0/pokemon?pn=' + page + '&ps=3');
    }

  getPages() {
    return this.http.get(
      'http://localhost:5000/api/v1.0/pokemon/pages');
    }

    getSearch(field: any, value: any) {
      return this.http.get(
        'http://localhost:5000/api/v1.0/pokemon/search?field=' + field + "&val=" + value);
      }

  
  
  getPokemon(id: any) {
    this.pokemonID = id;
    return this.http.get(
      'http://localhost:5000/api/v1.0/pokemon/' + id);
    }

    deletePokemon(id: any) {
      return this.http.delete(
        'http://localhost:5000/api/v1.0/pokemon/' + id);
      }
    

    getComments(id: any) {
      return this.http.get(
      'http://localhost:5000/api/v1.0/pokemon/' + id + '/comments');
      }

      getUserComments(id: any){
        return this.http.get('http://localhost:5000/api/v1.0/pokemon/user/' + id);
      }

      postComment(comment: any) {
        let postData = new FormData();
        postData.append("username", comment.username);
        postData.append("comment", comment.comment);
        return this.http.post(
          'http://localhost:5000/api/v1.0/pokemon/' + this.pokemonID + '/comments', postData);
        
        }

        updateComment(comment: any, pid: any, cid: any) {
          let postData = new FormData();
          postData.append("username", comment.username);
          postData.append("comment", comment.comment);
          return this.http.put(
            'http://localhost:5000/api/v1.0/pokemon/' + pid + '/comments/' + cid, postData);
          
          }

          deleteComments(pid: any, cid:any) {
            return this.http.delete(
              'http://localhost:5000/api/v1.0/pokemon/' + pid + '/comments/' + cid);
            }

        updatePokemon(pokemon: any) {
          let postData = new FormData();
          postData.append("name", pokemon.pokename);
          postData.append("num", pokemon.pokenum);
          postData.append("img",pokemon.img);
          postData.append("type", pokemon.type);
          postData.append("height", pokemon.height);
          postData.append("candy_count", pokemon.candy_count);
          postData.append("egg", pokemon.egg);
          postData.append("spawn_chance", pokemon.spawn_chance);
          postData.append("weight", pokemon.weight);
          postData.append("avg_spawns", pokemon.avg_spawns);
          postData.append("spawn_time", pokemon.spawn_time);
          postData.append("multipliers", pokemon.multipliers);
          postData.append("weaknesses", pokemon.weaknesses);
          
          return this.http.put(
            'http://localhost:5000/api/v1.0/pokemon/' + this.pokemonID, postData);
          
          }

          postPokemon(pokemon: any) {
            let postData = new FormData();
            postData.append("name", pokemon.pokename);
            postData.append("num", pokemon.pokenum);
            postData.append("img",pokemon.img);
            postData.append("type", pokemon.type);
            postData.append("height", pokemon.height);
            postData.append("candy_count", pokemon.candy_count);
            postData.append("egg", pokemon.egg);
            postData.append("spawn_chance", pokemon.spawn_chance);
            postData.append("weight", pokemon.weight);
            postData.append("avg_spawns", pokemon.avg_spawns);
            postData.append("spawn_time", pokemon.spawn_time);
            postData.append("multipliers", pokemon.multipliers);
            postData.append("weaknesses", pokemon.weaknesses);
            
            return this.http.post(
              'http://localhost:5000/api/v1.0/pokemon', postData);
            
            }
    
}
