import characters from './characters.js';
import { rollDice, getRandomBlock, logRollResult, resolveBlock } from './utils.js';

const CHARS = ["Mario", "Peach", "Yoshi", "Bowser", "Luigi", "DonkeyKong"];

async function playRaceEngine(character1, character2) {
  for (let round = 1; round <= 5; round++) {
    console.log(`🏁 Rodada ${round}`);

    // sortear bloco
    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    // rolar os dados
    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();

    // resolver o bloco
    let { totalTestSkill1, totalTestSkill2, powerResult1, powerResult2 } = resolveBlock(
      character1,
      character2,
      block,
      diceResult1,
      diceResult2
    );

    // teste de habilidade e confrontos
    if (block === "CONFRONTO") {
      console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`);

      await logRollResult(character1.NOME, "CONFRONTO", diceResult1, character1.PODER);
      await logRollResult(character2.NOME, "CONFRONTO", diceResult2, character2.PODER);

      if (powerResult1 > powerResult2) {
        console.log(`${character1.NOME} venceu o confronto!`);
        if (character2.PONTOS === 0) {
          console.log(`Mas ${character2.NOME} não possui pontos.`);
        } else {
          console.log(`E ${character2.NOME} perdeu 1 ponto 🐢.`);
          character2.PONTOS--;
        }
      } else if (powerResult1 < powerResult2) {
        console.log(`${character2.NOME} venceu o confronto!`);
        if (character1.PONTOS === 0) {
          console.log(`Mas ${character1.NOME} não possui pontos.`);
        } else {
          console.log(`E ${character1.NOME} perdeu 1 ponto 🐢.`);
          character1.PONTOS--;
        }
      } else {
        console.log("Empate! Nenhum ponto perdido.");
      }

    } else if (block === "DESAFIO") {
      // Registra os resultados dos dados e habilidades
      await logRollResult(character1.NOME, "DESAFIO", diceResult1, character1.VELOCIDADE + character1.MANOBRABILIDADE);
      await logRollResult(character2.NOME, "DESAFIO", diceResult2, character2.VELOCIDADE + character2.MANOBRABILIDADE);

      // Verifica e atribui pontos
      if (totalTestSkill1 > totalTestSkill2) {
        console.log(`${character1.NOME} venceu o desafio e marcou um ponto!`);
        character1.PONTOS++;
      } else if (totalTestSkill2 > totalTestSkill1) {
        console.log(`${character2.NOME} venceu o desafio e marcou um ponto!`);
        character2.PONTOS++;
      } else {
        console.log("Desafio empatado! Nenhum ponto foi atribuído");
      }
    } else {
      // Log para blocos RETA e CURVA
      await logRollResult(character1.NOME, block, diceResult1, character1[block === "RETA" ? "VELOCIDADE" : "MANOBRABILIDADE"]);
      await logRollResult(character2.NOME, block, diceResult2, character2[block === "RETA" ? "VELOCIDADE" : "MANOBRABILIDADE"]);

      // Verificando o vencedor de cada rodada
      if (totalTestSkill1 > totalTestSkill2) {
        console.log(`${character1.NOME} marcou um ponto!`);
        character1.PONTOS++;
      } else if (totalTestSkill2 > totalTestSkill1) {
        console.log(`${character2.NOME} marcou um ponto!`);
        character2.PONTOS++;
      }
    }

    console.log("-----------------------------");
  }
}

async function declareWinner(character1, character2) {
  console.log("Resultado final:");
  console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
  console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

  if (character1.PONTOS > character2.PONTOS)
    console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🏆`);
  else if (character2.PONTOS > character1.PONTOS)
    console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🏆`);
  else
    console.log("A corrida terminou em empate");
}

function getRandomCharacter() {
  const randomIndex = Math.floor(Math.random() * CHARS.length);
  return CHARS[randomIndex];
}

(async function main() {
  // Escolher dois personagens distintos
  let player1Name = getRandomCharacter();
  let player2Name = getRandomCharacter();

  while (player1Name === player2Name) {
    player2Name = getRandomCharacter();
  }
  // Obter os personagens a partir do objeto `characters`
  const player1 = characters[player1Name];
  const player2 = characters[player2Name];
  console.log(
    `🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`
  );

  await playRaceEngine(player1, player2);
  await declareWinner(player1, player2);
})();
