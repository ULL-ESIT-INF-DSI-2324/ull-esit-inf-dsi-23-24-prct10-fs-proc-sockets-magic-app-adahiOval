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
      console.log(chalk.green(`Card with ID: ${id} removed from the collection!`));
    } else {
      console.log(chalk.red('Card not in the collection!'));
      throw new Error('Card not found');
    }

  }

  addCard(card: Card): void {

    if (this.inCollection(card.id)) {
      console.log(chalk.red('Card already exists in this collection!'));
      throw new Error('Card already in collection');
    } else {
      this.collection.push(card);
      console.log(chalk.green('New card added to the collection!'));
    }

  }

  updateCard(card: Card): void {

    if (this.inCollection(card.id)) {
      this.deleteCard(card.id);
      this.collection.push(card);
      console.log(chalk.green('Card updated in the collection!'));
    } else {
      throw new Error(chalk.red('Card doesnt exist in this collection!'));
    }

  }

  /**
   * Lista las cartas de la colección
   */
  listCollection(): void {
    const printer: CardCollectionPrinter = new CardCollectionPrinter(this);
    printer.print();
  }

  showCard(id: number): void {
    if (this.inCollection(id)) {
      this.collection.find((card) => card.id === id)?.print();
    } else {
      throw new Error(chalk.red('Card not found!'));
    }
  }
}