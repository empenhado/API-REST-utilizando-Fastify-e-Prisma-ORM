import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

/**Registra as rotas relacionadas ao Produto no servidor Fastify*/
export async function produtoRoutes(app: FastifyInstance) {
  /**Utilizando método GET/ para listar todos os produtos cadastrados*/
  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const produtos = await prisma.produto.findMany();
      return reply.send(produtos);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar produtos." });
    }
  });

  /**Utilizando método GET/:id para listar um produto específico por ID */
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

  /** Método POST para criar um novo produto no banco de dados */
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