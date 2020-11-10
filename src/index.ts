import Fastify from 'fastify';
import mercurius from 'mercurius';
import fastifyCookie from 'fastify-cookie';
import fastifySession from 'fastify-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';

import { schema } from './schema/index';
import { createContext } from './context';
import { sessionPrefix, __prod__ } from './constants';

const app = Fastify();

const RedisStore = connectRedis(fastifySession as any);
const redisClient = new Redis();

app.register(fastifyCookie);
app.register(fastifySession, {
  secret: process.env.SESSION_SECRET!,
  store: new RedisStore({
    client: redisClient,
    disableTouch: true,
    prefix: sessionPrefix,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 7, // 7 years
    httpOnly: true,
    secure: __prod__,
    sameSite: 'lax',
  },
  saveUninitialized: false,
});

app.register(mercurius, {
  schema,
  graphiql: 'playground',
  context: (request, reply) => createContext(request, reply, redisClient),
});

app.listen(4000, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${address}/playground`);
});
