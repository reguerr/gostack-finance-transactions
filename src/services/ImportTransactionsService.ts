import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';

import CreateTransactionService, {
  CreateTransactionProps,
} from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const createTransaction = new CreateTransactionService();
    const newTransactions: CreateTransactionProps[] = [];
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );
      if (!title || !type || !value) return;

      newTransactions.push({ title, type, value, category });
    });
    await new Promise(resolve => parseCSV.on('end', resolve));
    const transactions = [];
    for (let index = 0; index < newTransactions.length; index += 1) {
      const newTransaction = newTransactions[index];
      // eslint-disable-next-line no-await-in-loop
      transactions.push(await createTransaction.execute(newTransaction));
    }

    return transactions;
  }
}

export default ImportTransactionsService;
