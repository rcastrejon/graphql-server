import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Redis } from 'ioredis';

const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
  request: FastifyRequest;
  reply: FastifyReply;
  redis: Redis;
};

export const createContext = (
  request: FastifyRequest,
  reply: FastifyReply,
  redis: Redis
): Context => ({
  prisma,
  request,
  reply,
  redis,
});
