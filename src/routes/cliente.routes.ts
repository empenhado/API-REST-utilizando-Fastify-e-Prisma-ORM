import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

  ///Registra as rotas relacionadas ao recurso Cliente no servidor Fastify
export async function clienteRoutes(app: FastifyInstance) {
  ///Utilizando método GET/ para listar todos os clientes cadastrados
  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const clientes = await prisma.cliente.findMany();
      return reply.send(clientes);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar clientes." });
    }
  });

    ///Utilizando método GET/:id para listar um cliente específico por ID 
  app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const cliente = await prisma.cliente.findUnique({ where: { idCliente: id } });
      if (!cliente) return reply.status(404).send({ error: "Cliente não encontrado." });
      return reply.send(cliente);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar cliente." });
    }
  });

  ///Método POST para criar um novo cliente no banco de dados
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { nome, email } = request.body as { nome: string; email: string };
      const cliente = await prisma.cliente.create({ data: { nome, email } });
      return reply.status(201).send(cliente);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao criar cliente." });
    }
  });
}
