import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { PrismaService } from "src/services/clients/prisma/prisma.client";

export type MockContext = {
  prisma: DeepMockProxy<PrismaService>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaService>()
  };
};
