import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

/**Registrando as rotas relacionadas ao Pedido no servidor fastify*/
export async function pedidoRoutes(app: FastifyInstance) {
    /**Utilizando método GET/ para listar todos os pedidos cadastrados*/
  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const pedidos = await prisma.pedido.findMany({
        include: {
          /**Para retornar todos os arrays de produto e o objeto com os dados de cliente*/
          produtos: true,
          cliente: true,
        },
      });
      return reply.send(pedidos);
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao buscar pedidos." });
    }
  });
  /**Utilizando método GET/:id para listar um pedido específico por ID*/
  app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const pedido = await prisma.pedido.findUnique({
        where: { idPedido: id },
        include: {
          /**Para retornar todos os arrays de produto e o objeto com os dados de cliente*/
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

  /**Método POST para criar um novo produto no banco de dados*/
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { clienteId, produtoIds } = request.body as {
      clienteId: string;
      produtoIds: string[];
    };

    /**Busca apenas os produtos informados anteriormente para calcular o total corretamente*/
    const produtos = await prisma.produto.findMany({
      where: { idProduto: { in: produtoIds } },
    });

    /**Soma o preço de cada produto para montar o valor total do pedido*/
    let valorTotal = 0

    for (const produto of produtos) {
    valorTotal += produto.preco
    }

    
    const pedido = await prisma.pedido.create({
      data: {
        clienteId,
        valorTotal,
        produtos: {
          /**Connect vincula produtos existentes ao pedido sem duplicá-los no banco*/
          connect: produtoIds.map((id) => ({ idProduto: id })),
        },
      },
      include: {
        /**Para retornar todos os arrays de produto e o objeto com os dados de cliente*/
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