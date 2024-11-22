import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { Game } from '../../models/game';

interface GameObject {
    readonly players: string[],
    stack:string[],
    playedCard:string[],
    currentPlayer:number,
}
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent {
   pickCardAnimation:boolean = false; 
   game:GameObject|undefined;
   currentCard:string|undefined = '';

   ngOnInit(){
    this.newGame()
   }

  newGame(){
    this.game = new Game()
    console.log(this.game)
  }


  takeCard(){
    if (!this.pickCardAnimation && this.game ) {
      this.currentCard = this.game.stack.pop();          
      this.pickCardAnimation = true;   

      setTimeout(() => {this.pickCardAnimation = false;},2000
      )
    }  
  }
}
