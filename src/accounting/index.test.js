const {
  readBalance,
  writeBalance,
  handleOperation,
} = require('./index');

function createMockRl(inputs) {
  let index = 0;
  return {
    question(prompt, callback) {
      const answer = inputs[index++] || '';
      callback(answer);
    },
  };
}

async function captureLogs(fn) {
  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => logs.push(args.join(' '));

  try {
    await fn();
  } finally {
    console.log = originalLog;
  }

  return logs;
}

describe('Accounting application business logic', () => {
  beforeEach(() => {
    writeBalance(1000.0);
  });

  test('TC02: View current balance shows initial balance', async () => {
    const rl = createMockRl([]);
    const logs = await captureLogs(() => handleOperation('TOTAL', rl));

    expect(readBalance()).toBe(1000.0);
    expect(logs).toContain('Current balance: 1000.00');
  });

  test('TC03: Credit account with a valid amount', async () => {
    const rl = createMockRl(['200']);
    const logs = await captureLogs(() => handleOperation('CREDIT', rl));

    expect(readBalance()).toBe(1200.0);
    expect(logs).toContain('Amount credited. New balance: 1200.00');
  });

  test('TC04: Debit account with a valid amount less than balance', async () => {
    const rl = createMockRl(['500']);
    const logs = await captureLogs(() => handleOperation('DEBIT', rl));

    expect(readBalance()).toBe(500.0);
    expect(logs).toContain('Amount debited. New balance: 500.00');
  });

  test('TC05: Attempt debit with insufficient funds does not change balance', async () => {
    const rl = createMockRl(['1500']);
    const logs = await captureLogs(() => handleOperation('DEBIT', rl));

    expect(readBalance()).toBe(1000.0);
    expect(logs).toContain('Insufficient funds for this debit.');
  });

  test('TC06: Invalid operation choice is handled gracefully', async () => {
    const rl = createMockRl([]);
    const logs = await captureLogs(() => handleOperation('UNKNOWN', rl));

    expect(readBalance()).toBe(1000.0);
    expect(logs).toContain('Invalid choice, please select 1-4.');
  });

  test('TC08: Read balance after credit operation returns updated balance', async () => {
    const creditRl = createMockRl(['250']);
    await handleOperation('CREDIT', creditRl);

    const readRl = createMockRl([]);
    const logs = await captureLogs(() => handleOperation('TOTAL', readRl));

    expect(readBalance()).toBe(1250.0);
    expect(logs).toContain('Current balance: 1250.00');
  });

  test('TC09: Updated balance persists within session after multiple operations', async () => {
    const firstCredit = createMockRl(['100']);
    await handleOperation('CREDIT', firstCredit);

    const firstDebit = createMockRl(['50']);
    await handleOperation('DEBIT', firstDebit);

    expect(readBalance()).toBe(1050.0);
  });

  test('TC10: No negative balance allowed on debit', async () => {
    const rl = createMockRl(['2000']);
    const logs = await captureLogs(() => handleOperation('DEBIT', rl));

    expect(readBalance()).toBe(1000.0);
    expect(logs).toContain('Insufficient funds for this debit.');
  });
});
