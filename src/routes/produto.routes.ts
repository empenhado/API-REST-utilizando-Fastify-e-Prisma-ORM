import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

export async function produtoRoutes(app: FastifyInstance) {
  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const produtos = await prisma.produto.findMany();
      return reply.send(produtos);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar produtos." });
    }
  });

  app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const produto = await prisma.produto.findUnique({ where: { idProduto: id } });
      if (!produto) return reply.status(404).send({ error: "Produto não encontrado." });
      return reply.send(produto);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar produto." });
    }
  });

  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { nome, preco } = request.body as { nome: string; preco: number };
      const produto = await prisma.produto.create({ data: { nome, preco } });
      return reply.status(201).send(produto);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao criar produto." });
    }
  });
}