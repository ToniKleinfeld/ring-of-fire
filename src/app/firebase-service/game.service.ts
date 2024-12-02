import { Injectable, inject, OnDestroy } from '@angular/core';
import { Firestore, collection, doc , collectionData , onSnapshot, addDoc, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Game } from '../../models/game';

interface GameObject {
  id?:string,
  readonly players: string[],
  stack:string[],
  playedCard:string[],
  currentPlayer:number,
}
@Injectable({
  providedIn: 'root'
})
export class GameService {

  firestore: Firestore = inject(Firestore);

  unsubGame;

  constructor() {
    this.unsubGame = this.subGameList();
   }

  ngonDestroy(){
    this.unsubGame()
  }

  subGameList(){
    
    return onSnapshot(this.getGamesRef(), (list) => {
        list.forEach(game => {
          console.log(this.setGameObject(game.data(),game.id))
        });
      });
  }

  getGamesRef(){ 
    return collection(this.firestore, 'games') 
  }

  async addToGame(content:object){
    await addDoc(this.getGamesRef(),content)
  }

  setGameObject(obj:any, id:string):Game {
    return {
      id: id,
      players: obj.players || [],
      stack: obj.stack || [],
      playedCard: obj.playedCard || [],
      currentPlayer: obj.currentPlayer || 0,
    }
  }

}
