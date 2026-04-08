import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

export async function pedidoRoutes(app: FastifyInstance) {
  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const pedidos = await prisma.pedido.findMany({
        include: {
          produtos: true,
          cliente: true,
        },
      });
      return reply.send(pedidos);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar pedidos." });
    }
  });

  app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const pedido = await prisma.pedido.findUnique({
        where: { idPedido: id },
        include: {
          produtos: true,
          cliente: true,
        },
      });
      if (!pedido) return reply.status(404).send({ error: "Pedido não encontrado." });
      return reply.send(pedido);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar pedido." });
    }
  });

  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { clienteId, produtoIds } = request.body as {
      clienteId: string;
      produtoIds: string[];
    };

    
    const produtos = await prisma.produto.findMany({
      where: { idProduto: { in: produtoIds } },
    });

    
    let valorTotal = 0

    for (const produto of produtos) {
    valorTotal += produto.preco
    }

    
    const pedido = await prisma.pedido.create({
      data: {
        clienteId,
        valorTotal,
        produtos: {
          connect: produtoIds.map((id) => ({ idProduto: id })),
        },
      },
      include: {
        produtos: true,
        cliente: true,
      },
    });

    return reply.status(201).send(pedido);
  } catch (error) {
    console.log(error)
    return reply.status(500).send({ error: "Erro ao criar pedido." });
  }
});
}