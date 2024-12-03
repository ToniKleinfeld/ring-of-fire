import { CommonModule } from '@angular/common';
import { Component, numberAttribute, Injectable, inject, OnDestroy, OnInit  } from '@angular/core';
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

export class GameComponent implements OnInit {

  constructor(public dialog: MatDialog, private gameService: GameService, private route:ActivatedRoute) {
  };

  colors:string[] = ['rgb(221, 106, 106)', 'rgb(231, 171, 58)', 'rgb(228, 228, 46)', 'rgb(49, 224, 49)', 'rgb(187, 236, 252)', 'rgb(150, 102, 150)','rgb(247, 191, 200)', 'rgb(135, 243, 135)'];

  pickCardAnimation:boolean = false; 
  game?:Game;
  currentCard?:string;
  drawnCards:number = this.returnNumberOfDrawnCards();
  CurrentPlayers:number = 0;
  adress?:string;
  
  ngOnInit(){
    this.newGame();
    this.getParam();
  }

   getParam():any{
    this.route.params.subscribe((params) => {
      this.adress = params['id'];
      this.gameService.adressID = this.adress!
    })  
   }

  newGame(){
    this.game = new Game();  
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
        this.pickCardAnimation = false;},1500
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
      }      
    });
  }  

  uploadGame(){
    let game:Game = {
      players: this.game?.players || [],
      stack: this.game?.stack || [],
      playedCard: this.game?.playedCard || [],
      currentPlayer: this.game?.currentPlayer || 0,
    } 

    this.gameService.addToFireBase(game);
  }
}
