import { Injectable, inject, OnDestroy } from '@angular/core';
import { Firestore, collection, doc , collectionData , onSnapshot, addDoc, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Game } from '../../models/game';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class GameService {

  firestore: Firestore = inject(Firestore);  
  unsubGame;
  adressID = 'games';
   

  constructor() {
    this.unsubGame = this.subGameList();      
  }  

  ngonDestroy(){
    this.unsubGame()
  }

  getGamesRef(){ 
    console.log(this.adressID)
    return collection(this.firestore, this.adressID) 
  }

  subGameList(){  
    console.log(this.adressID)
    return onSnapshot(this.getGamesRef(), (list) => {
        list.forEach(game => {
          console.log(this.setGameObject(game.data(),game.id));
          console.log(this.adressID,game.id)
        });
      });
  }
  
  async addToFireBase(content:Game){
    await addDoc(this.getGamesRef(),content)
  }

  setGameObject(obj:any, id?:string):Game {
    return {
      id: id,
      players: obj.players || [],
      stack: obj.stack || [],
      playedCard: obj.playedCard || [],
      currentPlayer: obj.currentPlayer || 0,
    }
  }

  // loadParamGame(paramsID:string) {
  //   return collection(this.firestore,paramsID)
  // }

  // subParamGame(paramsID:string){
  //   return onSnapshot(this.loadParamGame(paramsID), (game) => 
  //     console.log(this.setGameObject(game),paramsID)
  //   )
  //   }
    

  }
