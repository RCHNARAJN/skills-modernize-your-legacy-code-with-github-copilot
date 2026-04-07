#!/usr/bin/env node
const readline = require('readline');

let storedBalance = 1000.00;

function formatAmount(value) {
  return Number(value).toFixed(2);
}

function readBalance() {
  return storedBalance;
}

function writeBalance(balance) {
  storedBalance = Number(balance);
}

function prompt(question, rl) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function getUserChoice(rl) {
  const answer = await prompt('Enter your choice (1-4): ', rl);
  const choice = parseInt(answer, 10);
  return Number.isNaN(choice) ? null : choice;
}

async function getAmount(rl, promptText) {
  const answer = await prompt(promptText, rl);
  const amount = parseFloat(answer);
  if (Number.isNaN(amount) || amount < 0) {
    return null;
  }
  return Number(amount.toFixed(2));
}

function showMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

async function handleOperation(operationType, rl) {
  if (operationType === 'TOTAL') {
    const balance = readBalance();
    console.log(`Current balance: ${formatAmount(balance)}`);
    return;
  }

  if (operationType === 'CREDIT') {
    const amount = await getAmount(rl, 'Enter credit amount: ');
    if (amount === null) {
      console.log('Invalid amount. Please enter a numeric value.');
      return;
    }
    const current = readBalance();
    const newBalance = current + amount;
    writeBalance(newBalance);
    console.log(`Amount credited. New balance: ${formatAmount(newBalance)}`);
    return;
  }

  if (operationType === 'DEBIT') {
    const amount = await getAmount(rl, 'Enter debit amount: ');
    if (amount === null) {
      console.log('Invalid amount. Please enter a numeric value.');
      return;
    }
    const current = readBalance();
    if (current >= amount) {
      const newBalance = current - amount;
      writeBalance(newBalance);
      console.log(`Amount debited. New balance: ${formatAmount(newBalance)}`);
    } else {
      console.log('Insufficient funds for this debit.');
    }
    return;
  }

  console.log('Invalid choice, please select 1-4.');
}

async function runApp() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let continueFlag = true;

  while (continueFlag) {
    showMenu();
    const choice = await getUserChoice(rl);
    switch (choice) {
      case 1:
        await handleOperation('TOTAL', rl);
        break;
      case 2:
        await handleOperation('CREDIT', rl);
        break;
      case 3:
        await handleOperation('DEBIT', rl);
        break;
      case 4:
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  console.log('Exiting the program. Goodbye!');
  rl.close();
}

if (require.main === module) {
  runApp();
}

module.exports = {
  runApp,
  readBalance,
  writeBalance,
  formatAmount,
  handleOperation,
};
