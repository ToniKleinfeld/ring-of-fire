import { CommonModule } from '@angular/common';
import { Component, numberAttribute, Injectable, inject, OnDestroy } from '@angular/core';
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

export class GameComponent {

  constructor(public dialog: MatDialog, private gameService: GameService, private route:ActivatedRoute) {
    this.getParam();
    
    
  };

  colors:string[] = ['rgb(221, 106, 106)', 'rgb(231, 171, 58)', 'rgb(228, 228, 46)', 'rgb(49, 224, 49)', 'rgb(187, 236, 252)', 'rgb(150, 102, 150)','rgb(247, 191, 200)', 'rgb(135, 243, 135)'];

  pickCardAnimation:boolean = false; 
  game?:Game;
  currentCard?:string;
  drawnCards:number = this.returnNumberOfDrawnCards();
  CurrentPlayers:number = 0;
  adress?:string;
  
  ngOnInit(){
    setTimeout(() => {
      this.getParam();
      this.newGame();  
    }, 500);      
  }

  getParam():any{
    return this.route.params.subscribe((params) => {
      this.adress = params['id']       
    }); 
  }

  newGame(){
      let currentGame = this.filterSavedGames();
      this.CurrentPlayers = currentGame.players.length 
      this.game = currentGame;    
  }

  filterSavedGames(){  
    let game = new Game  
      this.gameService.savedGames.forEach(element => {
        if (element.id == this.adress) {
          game = element;
        }
      });  
      return game
  }

  takeCard(){
    if (!this.pickCardAnimation && this.game && this.CurrentPlayers > 1) {
      this.currentCard = this.game.stack.pop();         
      this.pickCardAnimation = true;       
      
      setTimeout(() => {
        this.game!.currentPlayer++
        this.game!.currentPlayer = this.game!.currentPlayer % this.game!.players.length;
        
        this.game!.playedCard.push(this.returnString(this.currentCard));
        this.drawnCards = this.returnNumberOfDrawnCards();
        this.pickCardAnimation = false;
        this.gameService.updateGame(this.game!);
      },1500
      )
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
