import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const sumTransationValue = (total: number, transaction: Transaction): number =>
  total + +transaction.value;

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce(sumTransationValue, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce(sumTransationValue, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
