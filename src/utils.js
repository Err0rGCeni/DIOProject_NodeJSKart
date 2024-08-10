export async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

export async function getRandomBlock() {
    let random = Math.random();
    let result;

    switch (true) {
        case random < 0.30:
            result = "RETA";
            break;
        case random < 0.60:
            result = "CURVA";
            break;
        case random < 0.90:
            result = "CONFRONTO";
            break;
        default:
            result = "DESAFIO";
            break;
    }

    return result;
}

export async function logRollResult(characterName, block, diceResult, attribute) {
    let attributeName;

    switch (block) {
        case "RETA":
            attributeName = "velocidade";
            break;
        case "CURVA":
            attributeName = "manobrabilidade";
            break;
        case "CONFRONTO":
            attributeName = "poder";
            break;
        case "DESAFIO":
            attributeName = "(velocidade + manobrabilidade)";
            break;
        default:
            attributeName = "";
    }

    console.log(
        `${characterName} 🎲 rolou um dado de ${attributeName} ${diceResult} + ${attribute} = ${diceResult + attribute}`
    );
}

export function resolveBlock(character1, character2, block, diceResult1, diceResult2) {
    let totalTestSkill1 = 0;
    let totalTestSkill2 = 0;
    let powerResult1, powerResult2;

    if (block === "CONFRONTO") {
        powerResult1 = diceResult1 + character1.PODER;
        powerResult2 = diceResult2 + character2.PODER;

        return { totalTestSkill1: 0, totalTestSkill2: 0, powerResult1, powerResult2 };
    }

    if (block === "RETA") {
        totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
        totalTestSkill2 = diceResult2 + character2.VELOCIDADE;
    }

    if (block === "CURVA") {
        totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
        totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;
    }

    if (block === "DESAFIO") {
        console.log(`Desafio! Testem seus potenciais`);
        totalTestSkill1 = Math.max(0, diceResult1 + character1.VELOCIDADE + character1.MANOBRABILIDADE - diceResult2);
        totalTestSkill2 = Math.max(0, diceResult2 + character2.VELOCIDADE + character2.MANOBRABILIDADE - diceResult1);
    }

    return { totalTestSkill1, totalTestSkill2, powerResult1, powerResult2 };
}
