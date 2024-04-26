import { Prisma as PC, PrismaClient } from '@prisma/client';

class PrismaSingleton {
  private static instance: PrismaClient<PC.PrismaClientOptions, never> | undefined;

  public static get(): PrismaClient<PC.PrismaClientOptions, never> {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient();
    }

    return PrismaSingleton.instance as PrismaClient<PC.PrismaClientOptions, never>;
  }
}

export default PrismaSingleton.get();
