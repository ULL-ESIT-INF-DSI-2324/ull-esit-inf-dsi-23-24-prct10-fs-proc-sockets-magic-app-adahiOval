import 'mocha';
import { expect } from 'chai';
import { Criatura, Planeswalker } from '../src/classes/CardTypes.js';
import { CardColor, CardRarity, CardType } from '../src/classes/Card.js';

describe('Instancias de clases Hijas de Card.', () => {

  const plane1: Planeswalker = new Planeswalker(0, "Testwalker", 6, CardColor.Negro, CardType.Planeswalker, CardRarity.Mítica, "Testing the lands for which he walks.", 20, 3);

  const creature1: Criatura = new Criatura(0, "Testwalker", 6, CardColor.Negro, CardType.Planeswalker, CardRarity.Mítica, "Testing the lands for which he walks.", 20, { fuerza: 3, resistencia: 5 });

  it('Getters funcionan correctamente.', () => {
    expect(plane1.id).to.eq(0);
    expect(plane1.name).to.eq('Testwalker');
    expect(plane1.cost).to.eq(6);
    expect(plane1.color).to.deep.eq(CardColor.Negro);
    expect(plane1.type).to.eq(CardType.Planeswalker);
    expect(plane1.rarity).to.eq(CardRarity.Mítica);
    expect(plane1.text).to.eq('Testing the lands for which he walks.');
    expect(plane1.price).to.eq(20);
    expect(plane1.loyalty).to.eq(3);
  }); 

  it('Criatura funciona correctamente.', () => {
    expect(creature1.stats.fuerza).to.eq(3);
    expect(creature1.stats.resistencia).to.eq(5);
  });

})