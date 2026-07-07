export type IsolationLevel = 'read_uncommitted' | 'read_committed' | 'repeatable_read' | 'serializable';

export interface TransactionOptions {
  isolation?: IsolationLevel;
  timeout?: number;
}

export interface Transaction {
  id: string;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  isActive(): boolean;
}

export interface ITransactionManager {
  startTransaction(options?: TransactionOptions): Promise<Transaction>;
  executeInTransaction<T>(fn: (tx: Transaction) => Promise<T>, options?: TransactionOptions): Promise<T>;
}

export class TransactionManager implements ITransactionManager {
  private activeTransactions = new Map<string, Transaction>();

  async startTransaction(options?: TransactionOptions): Promise<Transaction> {
    const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const transaction: Transaction = {
      id,
      isActive: () => true,
      commit: async () => {
        this.activeTransactions.delete(id);
      },
      rollback: async () => {
        this.activeTransactions.delete(id);
      },
    };

    this.activeTransactions.set(id, transaction);
    return transaction;
  }

  async executeInTransaction<T>(
    fn: (tx: Transaction) => Promise<T>,
    options?: TransactionOptions
  ): Promise<T> {
    const transaction = await this.startTransaction(options);

    try {
      const result = await fn(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
