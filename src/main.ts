import Fastify from "fastify";
import { appRoutes } from "./routes/index";

/**O logger está habilitado para registrar requisições e erros automaticamente*/
const app = Fastify({ logger: true });

//Registrando todas as rotas da aplicação: clientes, produtos e pedidos
app.register(appRoutes);


/**Inicializa o servidor na porta 3000
 * Em caso de falha na inicialização, loga o erro e encerra o processo*/
const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log("Servidor rodando na porta 3000");
  } catch (err) {
    /**Usando o log do fastify para manter consistencia nos logs*/
    app.log.error(err);
    process.exit(1);
  }
};

start();