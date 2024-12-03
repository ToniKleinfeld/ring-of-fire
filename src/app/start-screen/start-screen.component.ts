import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from "../firebase-service/game.service";
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

  constructor( private router: Router,private gameService: GameService) {}

  game:Game = new Game();

  newGame() {
    //Start Game
    
    let game:Game = {
      players: this.game?.players || [],
      stack: this.game?.stack || [],
      playedCard: this.game?.playedCard || [],
      currentPlayer: this.game?.currentPlayer || 0,
    } 
  
    this.gameService.addToFireBase(game);       
  }

}
