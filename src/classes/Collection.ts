import { Card } from "./Card.js";
import chalk from 'chalk';
import { CardCollectionPrinter } from "./CollectionPrinter.js";

export class CardCollection {

  constructor(public collection: Card[], public user: string) {}

  private inCollection(cardID: number): boolean {
    return this.collection.some((card) => card.id === cardID);
  }

  deleteCard(id: number) {

    if (this.inCollection(id)) {
      this.collection = this.collection.filter((element) => element.id !== id);
      return 'Card removed from the collection!';
    } else {
      console.log(chalk.red('Card not in the collection!'));
      return 'Card not found';
    }

  }

  addCard(card: Card): string {

    if (this.inCollection(card.id)) {
      return 'Card already in collection';
    } else {
      this.collection.push(card);
      return 'New card added to the collection!';
    }

  }

  updateCard(card: Card): string {

    if (this.inCollection(card.id)) {
      this.deleteCard(card.id);
      this.collection.push(card);
      return 'Card updated in the collection!';
    } else {
      return 'Card doesnt exist in this collection!';
    }

  }

  /**
   * Lista las cartas de la colección
   */
  listCollection(): void {
    const printer: CardCollectionPrinter = new CardCollectionPrinter(this);
    printer.print();
  }

  showCard(id: number): Card | undefined {
    if (this.inCollection(id)) {
      return this.collection.find((card) => card.id === id)!;
    } else {
      return undefined;
    }
  }

  getCards(): Card[] {
    return this.collection;
  }

}