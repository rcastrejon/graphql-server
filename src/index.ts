import Fastify from 'fastify';
import mercurius from 'mercurius';

import { schema } from './schema/index';
import { createContext } from './context';

const app = Fastify();

app.register(mercurius, {
  schema,
  graphiql: 'playground',
  context: createContext,
});

app.listen(4000, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${address}/playground`);
});
