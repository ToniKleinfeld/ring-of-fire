import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from "../player/player.component";
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatDialog,
} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../player/dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { GameService } from "../firebase-service/game.service";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, PlayerComponent, MatButtonModule, MatIconModule ,MatDialogModule,GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit{

  constructor(public dialog: MatDialog, private gameService: GameService, private route:ActivatedRoute) {
    this.getParam();
    
    
  };

  colors:string[] = ['rgb(221, 106, 106)', 'rgb(231, 171, 58)', 'rgb(228, 228, 46)', 'rgb(49, 224, 49)', 'rgb(187, 236, 252)', 'rgb(150, 102, 150)','rgb(247, 191, 200)', 'rgb(135, 243, 135)'];

  game?:Game;
  drawnCards:number = this.returnNumberOfDrawnCards();
  CurrentPlayers:number = 0;
  adress?:string;
  
  ngOnInit(){
    setTimeout(() => {
      this.getParam();
      this.newGame();

      
    }, 300);    
    
    this.gameService.saveGameSubject.subscribe((game) => {
      this.game = this.gameService.savedGames[this.filterSavedGames()]
    })
  }

  getParam():any{
    return this.route.params.subscribe((params) => {
      this.adress = params['id']       
    }); 
  }

  newGame(){
      let currentGame = this.gameService.savedGames[this.filterSavedGames()] ;
      this.CurrentPlayers = currentGame.players.length 
      this.game = currentGame;    
  }

  filterSavedGames():number{  
    let gameID = 0 
      this.gameService.savedGames.forEach((element,id) => {
        
        if (element.id == this.adress) {
          gameID = id;
        }
      });  
      return gameID
  }

  takeCard(){
    if (!this.game?.pickCardAnimation && this.game && this.CurrentPlayers > 1) {
      this.resetGame()
      this.game.currentCard = this.game.stack.pop() || '';         
      this.game.pickCardAnimation = true;
      this.gameService.updateGame(this.game!);     
      
      setTimeout(() => {
        this.game!.currentPlayer++
        this.game!.currentPlayer = this.game!.currentPlayer % this.game!.players.length;
        
        this.game!.playedCard.push(this.returnString(this.game?.currentCard));
        this.drawnCards = this.returnNumberOfDrawnCards();
        this.game!.pickCardAnimation = false;
        this.gameService.updateGame(this.game!);
      },1500
      )
    }  
  }

  resetGame(){
    if (this.game?.stack.length == 0) {
      let playersArray:string[] = [];
      let id = this.game.id;
      this.game.players.forEach(player => {playersArray.push(player)});
      this.game = new Game()
      playersArray.forEach(player => {this.game!.players.push(player)});
      this.game.id = id;
      this.gameService.updateGame(this.game!);
    }
  }

  returnString(element:string|undefined):string{
    if(element){
      return element
    } else {
      return 'card_empty'
    }
  }  

  returnNumberOfDrawnCards():number {
    if (this.game) {
      return this.game.playedCard.length + 32;      
    } else {
      return 32
    }
  }

  returnNumberOfPlayer():number {
    if (this.game) {
      return this.game.players.length;
    } else {
      return 0;
    }    
  }

  openDialog(): void {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button
    
    const dialogRef = this.dialog.open(DialogAddPlayerComponent)

    dialogRef.afterClosed().subscribe(name => {

      if (name && this.CurrentPlayers < 8) {
        this.game?.players.push(name);
        this.CurrentPlayers = this.returnNumberOfPlayer()
        this.gameService.updateGame(this.game!);
      }      
    });
  }  

}
