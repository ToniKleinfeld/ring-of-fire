import { Injectable, inject, OnDestroy } from '@angular/core';
import { Firestore, collection, doc , collectionData , onSnapshot, addDoc, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
          console.log(game.id, game.data())
        });
      });
  }

  getGamesRef(){ 
    return collection(this.firestore, 'games') 
  }

  async addToGame(content:object){
    await addDoc(this.getGamesRef(),content)
  }
}
