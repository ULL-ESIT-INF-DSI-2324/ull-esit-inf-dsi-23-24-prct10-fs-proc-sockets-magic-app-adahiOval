import net from 'net';
import { CardColor, CardType, CardRarity } from './classes/Card.js';
import yargs from 'yargs';
import chalk from 'chalk';
import {hideBin} from 'yargs/helpers';
import { CardShape } from './classes/CollectionReader.js';

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
  
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  const card: CardShape = {
    ID: argv.id,
    Name: argv.name,
    Cost: argv.cost,
    Color: argv.color,
    Type: argv.type,
    Rarity: argv.rarity,
    Text: argv.text,
    Price: argv.price,
    Stats: {
      fuerza: 0,
      resistencia: 0
    },
    Loyalty: 0
  }

  if (argv.type == CardType.criatura && typeof argv.strength === 'number' && typeof argv.resistance === 'number') {
    card.Stats.fuerza = argv.strength;
    card.Stats.resistencia = argv.resistance;
  } else if (argv.type === CardType.criatura && !argv.strength) {
    throw new Error('Stats not found.');
  } else if (argv.type == CardType.planeswalker && typeof argv.loyalty === 'number') {
    card.Loyalty = argv.loyalty;
  } else if (argv.type === CardType.planeswalker && !argv.strength) {
    throw new Error('Stats not found.');
  }

  let response = '';

  client.write(JSON.stringify({'requestType': 'add', 'user': argv.user, card}) + '\n');

  client.on('data', (data) => {
    response += data;
  })

  client.on('end', () => {
    console.log(JSON.parse(response));
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
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  const card: CardShape = {
    ID: argv.id,
    Name: argv.name,
    Cost: argv.cost,
    Color: argv.color,
    Type: argv.type,
    Rarity: argv.rarity,
    Text: argv.text,
    Price: argv.price,
    Stats: {
      fuerza: 0,
      resistencia: 0
    },
    Loyalty: 0
  }

  if (argv.type == CardType.criatura && typeof argv.strength === 'number' && typeof argv.resistance === 'number') {
    card.Stats.fuerza = argv.strength;
    card.Stats.resistencia = argv.resistance;
  } else if (argv.type === CardType.criatura && !argv.strength) {
    throw new Error('Stats not found.');
  } else if (argv.type == CardType.planeswalker && typeof argv.loyalty === 'number') {
    card.Loyalty = argv.loyalty;
  } else if (argv.type === CardType.planeswalker && !argv.strength) {
    throw new Error('Stats not found.');
  }

  client.write(JSON.stringify({'requestType': 'update', 'user': argv.user, card}) + '\n');
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
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  client.write(JSON.stringify({'requestType': 'remove', 'user': argv.user,'id': argv.id}) + '\n');

 })
 .command('list', 'Lists the cards from the collection', {
  
  user: {
    description: 'Username',
    type: 'string',
    demandOption: true
  }
 }, (argv) => {
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  client.write(JSON.stringify({'requestType': 'list', 'user': argv.user}) + '\n');
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
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  client.write(JSON.stringify({'requestType': 'read', 'user': argv.user,'id': argv.id}) + '\n');
 })
 .command('addUser', 'Adds a user to the server', {
  
  user: {
    description: 'Username',
    type: 'string',
    demandOption: true
  }
 }, (argv) => {
  const client = net.connect({port: 60300}, () => {
    console.log(chalk.green('Connection established.'));
  });

  client.write(JSON.stringify({'requestType': 'addUser', 'user': argv.user}) + '\n');
 })
 
 .help()
 .argv;