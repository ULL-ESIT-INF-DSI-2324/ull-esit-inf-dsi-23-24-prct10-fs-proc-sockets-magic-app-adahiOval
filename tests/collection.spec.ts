import 'mocha';
import { expect } from 'chai';
import { CardCollection } from '../src/classes/Collection.js';
import { CardCollectionReader } from '../src/classes/CollectionReader.js';
import { Artefacto, Conjuro, Criatura, Encantamiento, Instantaneo, Planeswalker, Tierra } from '../src/classes/CardTypes.js';
import { CardColor, CardRarity, CardType } from '../src/classes/Card.js';
import { CardCollectionPrinter } from '../src/classes/CollectionPrinter.js';

describe('CardCollection tests', () => {

  const reader1: CardCollectionReader = new CardCollectionReader('adahi');
  const reader2: CardCollectionReader = new CardCollectionReader('test');
  const card1: Tierra = new Tierra(1, 'test', 3, CardColor.Rojo, CardType.Tierra, CardRarity.Infrecuente, 'This is a test', 20);
  const card2: Planeswalker = new Planeswalker(2, 'test2', 3, CardColor.Azul, CardType.Planeswalker, CardRarity.Infrecuente, 'This is a second test', 20, 3);
  const card3: Encantamiento = new Encantamiento(3, 'Enchantest', 3, CardColor.Verde, CardType.Encantamiento, CardRarity.Infrecuente, 'This is a enchantmentest', 20);
  const card4: Encantamiento = new Encantamiento(3, 'Enchantest', 3, CardColor.Verde, CardType.Encantamiento, CardRarity.Infrecuente, 'This is a enchantmentest', 10);
  const card5: Conjuro = new Conjuro(4, 'Enchantest', 3, CardColor.Verde, CardType.Encantamiento, CardRarity.Infrecuente, 'This is a enchantmentest', 10);
  const card6: Instantaneo = new Instantaneo(5, 'Enchantest', 3, CardColor.Verde, CardType.Encantamiento, CardRarity.Infrecuente, 'This is a enchantmentest', 10);
  const card7: Artefacto = new Artefacto(6, 'Enchantest', 3, CardColor.Verde, CardType.Encantamiento, CardRarity.Infrecuente, 'This is a enchantmentest', 10);
  const card8: Criatura = new Criatura(3, 'Enchantest', 3, CardColor.Verde, CardType.Encantamiento, CardRarity.Infrecuente, 'This is a enchantmentest', 10, {fuerza: 3, resistencia: 4});
  const collection1: CardCollection = new CardCollection([card1, card2], 'adahi');
  const collection2: CardCollection = new CardCollection(reader1.getCollection(), reader1.getUser());
  const printerCollection2: CardCollectionPrinter = new CardCollectionPrinter(collection2);

  it('Se lee el directorio correctamente y se crean las cartas correspondientes', () => {
    expect(reader1.readDir()).to.not.throw;
    expect(reader1.getCollection()).to.deep.eq([card1, card2]);
    expect(() => reader2.readDir()).to.throw('User doesnt exist!');
  });

  it('Se crea una coleccion a partir del reader correctamente', () => {
    expect(collection1).to.deep.eq(collection2);
  });

  it('Se añade una carta a la coleccion correctamente', () => {
    collection2.addCard(card3);
    expect(collection2.collection).to.deep.eq([card1, card2, card3]);
    expect(() => collection2.addCard(card3)).to.throw('Card already exists in this collection!');
  });

  it('Se modifica una carta correctamente dentro de la coleccion', () => {
    collection2.updateCard(card4);
    expect(collection2.collection).to.deep.eq([card1, card2, card4]);
    expect(() => collection2.updateCard(card7)).to.throw('Card doesnt exist in this collection!');
  });

  it('Se elimina una carta correctamente dentro de la coleccion', () => {
    collection2.deleteCard(card4.id);
    expect(collection2.collection).to.deep.eq([card1, card2]);
    expect(() => collection2.deleteCard(card4.id)).to.throw('Card not in the collection!');
  });

  it('Se muestran las cartas correctamente dentro de la coleccion', () => {
    expect(collection2.listCollection()).to.not.throw;
    expect(printerCollection2.print()).to.not.throw;
  });

  it('Se muestra cada carta correctamente con su método print', () => {
    expect(card1.print()).to.not.throw;
    expect(card2.print()).to.not.throw;
    expect(card4.print()).to.not.throw;
    expect(card5.print()).to.not.throw;
    expect(card6.print()).to.not.throw;
    expect(card7.print()).to.not.throw;
    expect(card8.print()).to.not.throw;
    expect(collection2.showCard(1)).to.not.throw;
    expect(() => collection2.showCard(6)).to.throw('Card not found!');
  });

});
