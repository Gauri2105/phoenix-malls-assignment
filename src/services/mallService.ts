import { malls } from '../data/malls';
import type { Mall } from '../types/mall';

export interface MallRepository {
  getMalls(): Promise<Mall[]>;
  getMallById(id: string): Promise<Mall | undefined>;
  getMallsByCountry(country: string): Promise<Mall[]>;
}

class MockMallRepository implements MallRepository {
  async getMalls(): Promise<Mall[]> {
    await Promise.resolve();

    return malls;
  }

  async getMallById(id: string): Promise<Mall | undefined> {
    await Promise.resolve();

    return malls.find((mall) => mall.id === id);
  }

  async getMallsByCountry(country: string): Promise<Mall[]> {
    await Promise.resolve();

    return malls.filter(
      (mall) => mall.country.toLowerCase() === country.toLowerCase(),
    );
  }
}

export const mallRepository: MallRepository = new MockMallRepository();