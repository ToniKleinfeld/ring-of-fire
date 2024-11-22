import { CommonModule } from '@angular/common';
import { Component, numberAttribute} from '@angular/core';
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
   game?:GameObject;
   currentCard?:string;
   drawnCards:number = this.returnNumberOfDrawnCards();
  
   ngOnInit(){
    this.newGame()
   }

  newGame(){
    this.game = new Game()
    console.log(this.game)
  }


  takeCard(){
    if (!this.pickCardAnimation && this.game) {
      this.currentCard = this.game.stack.pop();         
      this.pickCardAnimation = true; 
      
      setTimeout(() => {
        this.game?.playedCard.push(this.returnString(this.currentCard));
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
}
