import { Injectable, inject, OnDestroy } from '@angular/core';
import { Firestore, collection, doc , collectionData , onSnapshot, addDoc, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Game } from '../../models/game';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})

export class GameService {

  savedGames:any[] = []

  firestore: Firestore = inject(Firestore);  
  unsubGame;
  adressID = 'games';   

  constructor(private router: Router) {
    this.unsubGame = this.subGameList();      
  }  

  ngonDestroy(){
    this.unsubGame()
  }

  getGamesRef(){ 
    return collection(this.firestore, this.adressID) 
  }

  subGameList(){  
    return onSnapshot(this.getGamesRef(), (list) => {
      this.savedGames = [];
        list.forEach(game => {
          this.savedGames.push(this.setGameObject(game.data(),game.id));
        });

        console.log(this.savedGames)
      });
  }
  
  async addToFireBase(content:Game|object){
    await addDoc(this.getGamesRef(),content).then((gameInfo:any)=>{
      this.router.navigateByUrl('/game/'+gameInfo['id'])
    }).catch(
      (err) => {console.error(err)}
    );
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

  async updateGame(game: Game){
    if (game.id) {
      let item =  this.getCleanJson(game);
      await updateDoc(this.getSingleDocRef(game.id),item).catch(
        (err) => {console.error(err)}
      )
    }
  }

  getCleanJson(game:Game):{} {
    return {
      players: game.players,
      stack: game.stack,
      playedCard: game.playedCard,
      currentPlayer: game.currentPlayer,
    }
  }

  getSingleDocRef( docID:string){
    return doc(collection(this.firestore, this.adressID), docID)
  }

  }
