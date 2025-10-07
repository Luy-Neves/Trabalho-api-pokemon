import { Router, type Request, type Response } from "express";
import {
  createPokemonSchema,
  updatePokemonSchema,
  pokemonParamsSchema,
  pokemonQuerySchema,
  type CreatePokemonInput,
  type UpdatePokemonInput,
  type PokemonParams,
  type PokemonQuery,
} from "../schemas/pokemon.js";
import {
  validateBody,
  validateParams,
  validateQuery,
  getValidatedData,
  type TypedRequest,
} from "../middleware/validation.js";
import { PokemonService } from "../services/pokemon.service.js";

const router: Router = Router();

/**
 * @swagger
 * /pokemon:
 *   get:
 *     summary: Listar pokémons
 *     description: Retorna uma lista paginada de pokémons com opções de filtro
 *     tags: [Pokemon]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Número da página (padrão 1)
 *         example: "1"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Itens por página (padrão 10, máximo 100)
 *         example: "10"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Buscar pokémons por nome (busca parcial)
 *         example: "pika"
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Filtrar por ID do tipo
 *         example: "4"
 *     responses:
 *       200:
 *         description: Lista de pokémons retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PokemonListResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
// GET /pokemon - Listar todos os pokémons com filtros opcionais
router.get(
  "/pokemon",
  validateQuery(pokemonQuerySchema),
  async (req: TypedRequest, res: Response) => {
    try {
      const queryParams = getValidatedData<PokemonQuery>(req, "query");
      const result = await PokemonService.findMany(queryParams);

      res.json({
        success: true,
        message: "Lista de pokémons",
        ...result,
      });
    } catch (error) {
      console.error("Erro ao buscar pokémons:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }
);

/**
 * @swagger
 * /pokemon/{id}:
 *   get:
 *     summary: Buscar pokémon por ID
 *     description: Retorna um pokémon específico pelo seu ID
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: ID único do pokémon
 *         example: "1"
 *     responses:
 *       200:
 *         description: Pokémon encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Pokémon encontrado"
 *                 data:
 *                   $ref: '#/components/schemas/Pokemon'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
// GET /pokemon/:id - Buscar um pokémon específico
router.get(
  "/pokemon/:id",
  validateParams(pokemonParamsSchema),
  async (req: TypedRequest, res: Response) => {
    try {
      const { id } = getValidatedData<PokemonParams>(req, "params");
      const pokemon = await PokemonService.findById(parseInt(id));

      res.json({
        success: true,
        message: `Pokémon encontrado`,
        data: pokemon,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Pokémon não encontrado"
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Erro ao buscar pokémon:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }
);

/**
 * @swagger
 * /pokemon:
 *   post:
 *     summary: Criar novo pokémon
 *     description: Cria um novo pokémon com os dados fornecidos
 *     tags: [Pokemon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePokemonRequest'
 *           examples:
 *             pikachu:
 *               summary: Exemplo do Pikachu
 *               value:
 *                 name: "Pikachu"
 *                 height: 0.4
 *                 weight: 6.0
 *                 description: "Um Pokémon do tipo Elétrico conhecido por suas bochechas vermelhas."
 *                 baseHp: 35
 *                 baseAttack: 55
 *                 baseDefense: 40
 *                 baseSpeed: 90
 *                 primaryTypeId: "4"
 *             minimal:
 *               summary: Dados mínimos necessários
 *               value:
 *                 name: "Ditto"
 *                 primaryTypeId: "18"
 *             with_secondary_type:
 *               summary: Pokémon com dois tipos
 *               value:
 *                 name: "Dragonite"
 *                 height: 2.2
 *                 weight: 210.0
 *                 description: "Um Pokémon dragão gentil e poderoso."
 *                 baseHp: 91
 *                 baseAttack: 134
 *                 baseDefense: 95
 *                 baseSpeed: 80
 *                 primaryTypeId: "7"
 *                 secondaryTypeId: "12"
 *     responses:
 *       201:
 *         description: Pokémon criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Pokémon criado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Pokemon'
 *       400:
 *         description: Erro de validação ou regra de negócio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Erro de validação
 *                 value:
 *                   success: false
 *                   message: "Dados de entrada inválidos"
 *                   errors:
 *                     - field: "name"
 *                       message: "Nome é obrigatório"
 *                       code: "too_small"
 *               business_error:
 *                 summary: Erro de regra de negócio
 *                 value:
 *                   success: false
 *                   message: "Já existe um pokémon com o nome \"Pikachu\""
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
// POST /pokemon - Criar novo pokémon
router.post(
  "/pokemon",
  validateBody(createPokemonSchema),
  async (req: TypedRequest, res: Response) => {
    try {
      const pokemonData = getValidatedData<CreatePokemonInput>(req, "body");
      const pokemon = await PokemonService.create(pokemonData);

      res.status(201).json({
        success: true,
        message: "Pokémon criado com sucesso",
        data: pokemon,
      });
    } catch (error) {
      if (error instanceof Error) {
        // Erros de negócio (duplicação, tipo não encontrado, etc.)
        if (
          error.message.includes("Já existe") ||
          error.message.includes("não encontrado")
        ) {
          return res.status(400).json({
            success: false,
            message: error.message,
          });
        }
      }

      console.error("Erro ao criar pokémon:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }
);

/**
 * @swagger
 * /pokemon/{id}:
 *   put:
 *     summary: Atualizar pokémon
 *     description: Atualiza os dados de um pokémon existente. Todos os campos são opcionais.
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: ID único do pokémon
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePokemonRequest'
 *           examples:
 *             update_basic:
 *               summary: Atualização básica
 *               value:
 *                 description: "Pikachu atualizado - Um Pokémon elétrico muito fofo!"
 *                 baseAttack: 60
 *             update_name:
 *               summary: Atualizar apenas o nome
 *               value:
 *                 name: "Pikachu Evolved"
 *             update_types:
 *               summary: Atualizar tipos
 *               value:
 *                 primaryTypeId: "4"
 *                 secondaryTypeId: "12"
 *     responses:
 *       200:
 *         description: Pokémon atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Pokémon atualizado com sucesso"
 *                 data:
 *                   $ref: '#/components/schemas/Pokemon'
 *       400:
 *         description: Erro de validação ou regra de negócio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Erro de validação
 *                 value:
 *                   success: false
 *                   message: "Dados de entrada inválidos"
 *                   errors:
 *                     - field: "name"
 *                       message: "Nome deve conter apenas letras e espaços"
 *                       code: "custom"
 *               business_error:
 *                 summary: Nome duplicado
 *                 value:
 *                   success: false
 *                   message: "Já existe um pokémon com o nome \"Charizard\""
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
// PUT /pokemon/:id - Atualizar pokémon existente
router.put(
  "/pokemon/:id",
  validateParams(pokemonParamsSchema),
  validateBody(updatePokemonSchema),
  async (req: TypedRequest, res: Response) => {
    try {
      const { id } = getValidatedData<PokemonParams>(req, "params");

      console.log("ID do Pokémon a ser atualizado:", id);
      const updateData = getValidatedData<UpdatePokemonInput>(req, "body");
      const pokemon = await PokemonService.update(parseInt(id), updateData);

      res.json({
        success: true,
        message: `Pokémon atualizado com sucesso`,
        data: pokemon,
      });
    } catch (error) {
      if (error instanceof Error) {
        // Erros de negócio
        if (
          error.message.includes("não encontrado") ||
          error.message.includes("Já existe")
        ) {
          return res.status(400).json({
            success: false,
            message: error.message,
          });
        }

        if (error.message === "Pokémon não encontrado") {
          return res.status(404).json({
            success: false,
            message: error.message,
          });
        }
      }

      console.error("Erro ao atualizar pokémon:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }
);

/**
 * @swagger
 * /pokemon/{id}:
 *   delete:
 *     summary: Deletar pokémon
 *     description: Remove um pokémon do banco de dados
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: ID único do pokémon
 *         example: "1"
 *     responses:
 *       200:
 *         description: Pokémon deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Pokémon deletado com sucesso"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
// DELETE /pokemon/:id - Deletar pokémon
router.delete(
  "/pokemon/:id",
  validateParams(pokemonParamsSchema),
  async (req: TypedRequest, res: Response) => {
    try {
      const { id } = getValidatedData<PokemonParams>(req, "params");
      const result = await PokemonService.delete(parseInt(id));

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Pokémon não encontrado"
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Erro ao deletar pokémon:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }
);

export default router;
