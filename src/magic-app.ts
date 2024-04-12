import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import { CardCollectionReader } from './classes/CollectionReader.js';
import { CardCollection } from './classes/Collection.js';
import { Card, CardColor, CardRarity, CardType } from './classes/Card.js';
import { Artefacto, Conjuro, Criatura, Encantamiento, Instantaneo, Planeswalker, Tierra } from './classes/CardTypes.js';
import chalk from 'chalk';
import { CardCollectionWriter } from './classes/CollectionWriter.js';
import { CardCollectionPrinter } from './classes/CollectionPrinter.js';
import fs from 'fs';
import path from 'path';

yargs(hideBin(process.argv))
  .command('add', 'Adds a card to the collection', {
  
  user: {
      description: 'Username',
      type: 'string',
      demandOption: true
  },
  id: {
   description: 'Card ID',
   type: 'number',
   demandOption: true
  },
  name: {
    description: 'Card Name',
    type: 'string',
    demandOption: true
  },
  cost: {
    description: 'Card Cost',
    type: 'number',
    demandOption: true
  },
  color: {
    description: 'Card Name',
    type: 'string',
    demandOption: true,
    choices: Object.values(CardColor)
  },
  type: {
    description: 'Card Type',
    type: 'string',
    demandOption: true,
    choices: Object.values(CardType)
  },
  rarity: {
    description: 'Card Rarity',
    type: 'string',
    demandOption: true,
    choices: Object.values(CardRarity)
  },
  text: {
    description: 'Card Text',
    type: 'string',
    demandOption: true
  },
  price: {
    description: 'Card Price',
    type: 'number',
    demandOption: true
  },
  loyalty: {
    description: 'Planeswalker loyalty',
    type: 'number',
    demandOption: false
  },
  strength: {
    description: 'Card Strength',
    type: 'number',
    demandOption: false
  },
  resistance: {
    description: 'Card Resistance',
    type: 'number',
    demandOption: false
  }
 }, (argv) => {
  const reader: CardCollectionReader = new CardCollectionReader(argv.user, (err) => {
    if(err){
      throw new Error(err);
    } else {
      const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
      let card: Card;
      const cardType: CardType = argv.type as CardType;
      const cardColor: CardColor = argv.color as CardColor;
      const cardRarity: CardRarity = argv.rarity as CardRarity;
      let cardStrength: number = 0;
      let cardResistance: number = 0;
      let cardLoyalty: number = 0;
    
      if (cardType == CardType.criatura && typeof argv.strength === 'number' && typeof argv.resistance === 'number') {
        cardStrength = argv.strength;
        cardResistance = argv.resistance;
      } else if (cardType === CardType.criatura && !argv.strength) {
        throw new Error(chalk.red('Stats not found.'));
      } else if (cardType == CardType.planeswalker && typeof argv.loyalty === 'number') {
        cardLoyalty = argv.loyalty;
      } else if (cardType === CardType.planeswalker && !argv.strength) {
        throw new Error(chalk.red('Stats not found.'));
      }
      
      switch (cardType) {
        case CardType.tierra:
          card = new Tierra(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price);
          collection.addCard(card);
          break;
    
        case CardType.encantamiento:
          card = new Encantamiento(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price);
          collection.addCard(card);
          break;
    
        case CardType.conjuro:
          card = new Conjuro(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price);
          collection.addCard(card);
          break;
    
        case CardType.instantaneo:
          console.log("hoola");
          card = new Instantaneo(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price);
          collection.addCard(card);
          break;
    
        case CardType.artefacto:
          card = new Artefacto(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price);
          collection.addCard(card);
          break;
    
        case CardType.criatura:
          card = new Criatura(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price, {fuerza: cardStrength, resistencia: cardResistance});
          collection.addCard(card);
          break;
    
        case CardType.planeswalker:
          card = new Planeswalker(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price, cardLoyalty);
          collection.addCard(card);
          break;
      
        default:
          throw new Error(chalk.red('No valid type!'));
      }
    
      const writer: CardCollectionWriter = new CardCollectionWriter(collection);
      writer.write();
    }
  });

 })
 .command('update', 'Updates a card from the collection', {
  
  user: {
      description: 'Username',
      type: 'string',
      demandOption: true
  },
  id: {
   description: 'Card ID',
   type: 'number',
   demandOption: true
  },
  name: {
    description: 'Card Name',
    type: 'string',
    demandOption: true
  },
  cost: {
    description: 'Card Cost',
    type: 'number',
    demandOption: true
  },
  color: {
    description: 'Card Name',
    type: 'string',
    demandOption: true
  },
  type: {
    description: 'Card Type',
    type: 'string',
    demandOption: true
  },
  rarity: {
    description: 'Card Rarity',
    type: 'string',
    demandOption: true
  },
  text: {
    description: 'Card Text',
    type: 'string',
    demandOption: true
  },
  price: {
    description: 'Card Price',
    type: 'number',
    demandOption: true
  },
  loyalty: {
    description: 'Planeswalker loyalty',
    type: 'number',
    demandOption: false
  },
  strength: {
    description: 'Card Strength',
    type: 'number',
    demandOption: false
  },
  resistance: {
    description: 'Card Resistance',
    type: 'number',
    demandOption: false
  }
 }, (argv) => {
  const reader: CardCollectionReader = new CardCollectionReader(argv.user, (err) => {
    if (err) {
      throw new Error(err);
    } else {
      const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
      let card: Card;
      const cardType: CardType = argv.type as CardType;
      const cardColor: CardColor = argv.color as CardColor;
      const cardRarity: CardRarity = argv.rarity as CardRarity;
      let cardStrength: number = 0;
      let cardResistance: number = 0;
      let cardLoyalty: number = 0;
    
      if (cardType == CardType.criatura && typeof argv.strength === 'number' && typeof argv.resistance === 'number') {
        cardStrength = argv.strength;
        cardResistance = argv.resistance;
      } else if (cardType === CardType.criatura && !argv.strength) {
        throw new Error(chalk.red('Stats not found.'));
      } else if (cardType == CardType.planeswalker && typeof argv.loyalty === 'number') {
        cardLoyalty = argv.loyalty;
      } else if (cardType === CardType.planeswalker && !argv.strength) {
        throw new Error(chalk.red('Stats not found.'));
      }
      
      switch (cardType) {
        case CardType.tierra:
          card = new Tierra(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price);
          collection.updateCard(card);
          break;
    
        case CardType.encantamiento:
          card = new Encantamiento(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price);
          collection.updateCard(card);
          break;
    
        case CardType.conjuro:
          card = new Conjuro(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price);
          collection.updateCard(card);
          break;
    
        case CardType.instantaneo:
          card = new Instantaneo(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price);
          collection.updateCard(card);
          break;
    
        case CardType.artefacto:
          card = new Artefacto(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price);
          collection.updateCard(card);
          break;
    
        case CardType.criatura:
          card = new Criatura(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price, {fuerza: cardStrength, resistencia: cardResistance});
          collection.updateCard(card);
          break;
    
        case CardType.planeswalker:
          card = new Planeswalker(argv.id, argv.name, argv.cost, cardColor, cardType, cardRarity, argv.text, argv.price, cardLoyalty);
          collection.updateCard(card);
          break;
      
        default:
          throw new Error(chalk.red('No valid type!'));
      }
    
      const writer: CardCollectionWriter = new CardCollectionWriter(collection);
      writer.write();
    }
  });

 })
 .command('remove', 'Removes a card from the collection', {
  
  user: {
    description: 'Username',
    type: 'string',
    demandOption: true
  },
  id: {
   description: 'Card ID',
   type: 'number',
   demandOption: true
  }
 }, (argv) => {
  const reader: CardCollectionReader = new CardCollectionReader(argv.user, (err) => {
    if (err) {
      throw new Error(err);
    } else {
      const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
      collection.deleteCard(argv.id);
      const writer: CardCollectionWriter = new CardCollectionWriter(collection);
      writer.write();
    }
  });

 })
 .command('list', 'Lists the cards from the collection', {
  
  user: {
    description: 'Username',
    type: 'string',
    demandOption: true
  }
 }, (argv) => {
  const reader: CardCollectionReader = new CardCollectionReader(argv.user, (err) => {
    if (err) {
      throw new Error(err);
    } else {
      const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
      const printer: CardCollectionPrinter = new CardCollectionPrinter(collection);
      printer.print();
    }
  });

 })
 .command('read', 'Reads a card from the collection', {
  
  user: {
    description: 'Username',
    type: 'string',
    demandOption: true
  },
  id: {
   description: 'Card ID',
   type: 'number',
   demandOption: true
  }
 }, (argv) => {
  const reader: CardCollectionReader = new CardCollectionReader(argv.user, (err) => {
    if(err){
      throw new Error(err);
    } else {
      const collection: CardCollection = new CardCollection(reader.getCollection(), reader.getUser());
      collection.showCard(argv.id);
    }
  });
 })
 .command('addUser', 'Adds a user to the server', {
  
  user: {
    description: 'Username',
    type: 'string',
    demandOption: true
  }
 }, (argv) => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const sourcedir = path.resolve(__dirname, '..');
  const route = path.join(sourcedir, `src/database/users/${argv.user}`);
  fs.access(route, (err) => {
    if(!err){
      throw new Error('Usuario ya existe');
    } else {
      fs.mkdir(route, {recursive: true}, (err) => {
        if(err){
          throw new Error(err.message);
        } else {
          console.log(chalk.green('Usuario creado correctamente!'));
        }
      });
    }
  });
 })
 
 .help()
 .argv;