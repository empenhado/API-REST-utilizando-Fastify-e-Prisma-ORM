import Fastify from "fastify";
import { appRoutes } from "./routes/index";

const app = Fastify({ logger: true });

app.register(appRoutes);

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Servidor rodando na porta 3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();