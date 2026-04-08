import { FastifyInstance } from "fastify";
import { clienteRoutes } from "./cliente.routes";
import { produtoRoutes } from "./produto.routes";
import { pedidoRoutes } from "./pedido.routes";

export async function appRoutes(app: FastifyInstance) {
  app.register(clienteRoutes, { prefix: "/clientes" });
  app.register(produtoRoutes, { prefix: "/produtos" });
  app.register(pedidoRoutes, { prefix: "/pedidos" });
}