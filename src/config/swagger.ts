import swaggerJSDoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Pokémon API",
    version: "1.0.0",
    description: "Criação de api pokemon",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de Desenvolvimento",
    },
    {
      url: "https://trabalho-pokemon-api.com",
      description: "Servidor de Produção",
    },
  ],
  tags: [
    {
      name: "Pokemon",
      description: "Operações relacionadas aos Pokémons",
    },
    {
      name: "Types",
      description: "Operações relacionadas aos tipos de Pokémon",
    },
  ],
  components: {
    schemas: {
      Pokemon: {
        type: "object",
        required: [
          "id",
          "name",
          "baseHp",
          "baseAttack",
          "baseDefense",
          "baseSpeed",
        ],
        properties: {
          id: {
            type: "integer",
            description: "ID único do Pokémon",
            example: 1,
          },
          name: {
            type: "string",
            description: "Nome do Pokémon",
            example: "Pikachu",
            minLength: 1,
            maxLength: 100,
            pattern: "^[a-zA-Z\\s]+$",
          },
          height: {
            type: "number",
            description: "Altura do Pokémon em metros",
            example: 0.4,
            minimum: 0,
            maximum: 100,
          },
          weight: {
            type: "number",
            description: "Peso do Pokémon em quilogramas",
            example: 6.0,
            minimum: 0,
            maximum: 10000,
          },
          description: {
            type: "string",
            description: "Descrição do Pokémon",
            example:
              "Um Pokémon do tipo Elétrico conhecido por suas bochechas vermelhas.",
            maxLength: 1000,
          },
          imageUrl: {
            type: "string",
            format: "uri",
            description: "URL da imagem do Pokémon",
            example: "https://example.com/pikachu.png",
          },
          baseHp: {
            type: "integer",
            description: "HP base do Pokémon",
            example: 35,
            minimum: 1,
            maximum: 255,
          },
          baseAttack: {
            type: "integer",
            description: "Ataque base do Pokémon",
            example: 55,
            minimum: 1,
            maximum: 255,
          },
          baseDefense: {
            type: "integer",
            description: "Defesa base do Pokémon",
            example: 40,
            minimum: 1,
            maximum: 255,
          },
          baseSpeed: {
            type: "integer",
            description: "Velocidade base do Pokémon",
            example: 90,
            minimum: 1,
            maximum: 255,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação do registro",
            example: "2023-10-06T10:30:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Data da última atualização",
            example: "2023-10-06T10:30:00Z",
          },
          PokemonType: {
            type: "array",
            description: "Tipos do Pokémon",
            items: {
              $ref: "#/components/schemas/PokemonType",
            },
          },
        },
      },
      PokemonType: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "ID da relação Pokémon-Tipo",
            example: 1,
          },
          pokemonId: {
            type: "integer",
            description: "ID do Pokémon",
            example: 1,
          },
          typeId: {
            type: "integer",
            description: "ID do Tipo",
            example: 4,
          },
          type: {
            $ref: "#/components/schemas/Type",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação da relação",
            example: "2023-10-06T10:30:00Z",
          },
        },
      },
      Type: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "ID único do tipo",
            example: 1,
          },
          name: {
            type: "string",
            description: "Nome do tipo",
            example: "Fire",
          },
          color: {
            type: "string",
            description: "Cor representativa do tipo",
            example: "#F08030",
          },
          description: {
            type: "string",
            description: "Descrição do tipo",
            example: "Pokémons do tipo Fogo",
          },
        },
      },
      CreatePokemonRequest: {
        type: "object",
        required: ["name", "primaryTypeId"],
        properties: {
          name: {
            type: "string",
            description: "Nome do Pokémon",
            example: "Pikachu",
            minLength: 1,
            maxLength: 100,
            pattern: "^[a-zA-Z\\s]+$",
          },
          height: {
            type: "number",
            description: "Altura do Pokémon em metros",
            example: 0.4,
            minimum: 0,
            maximum: 100,
          },
          weight: {
            type: "number",
            description: "Peso do Pokémon em quilogramas",
            example: 6.0,
            minimum: 0,
            maximum: 10000,
          },
          description: {
            type: "string",
            description: "Descrição do Pokémon",
            example:
              "Um Pokémon do tipo Elétrico conhecido por suas bochechas vermelhas.",
            maxLength: 1000,
          },
          imageUrl: {
            type: "string",
            format: "uri",
            description: "URL da imagem do Pokémon",
            example: "https://example.com/pikachu.png",
          },
          baseHp: {
            type: "integer",
            description: "HP base do Pokémon",
            example: 35,
            minimum: 1,
            maximum: 255,
            default: 50,
          },
          baseAttack: {
            type: "integer",
            description: "Ataque base do Pokémon",
            example: 55,
            minimum: 1,
            maximum: 255,
            default: 50,
          },
          baseDefense: {
            type: "integer",
            description: "Defesa base do Pokémon",
            example: 40,
            minimum: 1,
            maximum: 255,
            default: 50,
          },
          baseSpeed: {
            type: "integer",
            description: "Velocidade base do Pokémon",
            example: 90,
            minimum: 1,
            maximum: 255,
            default: 50,
          },
          primaryTypeId: {
            type: "string",
            description: "ID do tipo primário (obrigatório)",
            example: "4",
            pattern: "^\\d+$",
          },
          secondaryTypeId: {
            type: "string",
            description: "ID do tipo secundário (opcional)",
            example: "12",
            pattern: "^\\d+$",
          },
        },
      },
      UpdatePokemonRequest: {
        type: "object",
        description:
          "Dados para atualização do Pokémon (todos os campos são opcionais)",
        properties: {
          name: {
            type: "string",
            description: "Nome do Pokémon",
            example: "Pikachu Evolved",
            minLength: 1,
            maxLength: 100,
            pattern: "^[a-zA-Z\\s]+$",
          },
          height: {
            type: "number",
            description: "Altura do Pokémon em metros",
            example: 0.5,
            minimum: 0,
            maximum: 100,
          },
          weight: {
            type: "number",
            description: "Peso do Pokémon em quilogramas",
            example: 7.0,
            minimum: 0,
            maximum: 10000,
          },
          description: {
            type: "string",
            description: "Descrição do Pokémon",
            example: "Um Pokémon elétrico evoluído e mais poderoso.",
            maxLength: 1000,
          },
          imageUrl: {
            type: "string",
            format: "uri",
            description: "URL da imagem do Pokémon",
            example: "https://example.com/pikachu-evolved.png",
          },
          baseHp: {
            type: "integer",
            description: "HP base do Pokémon",
            example: 40,
            minimum: 1,
            maximum: 255,
          },
          baseAttack: {
            type: "integer",
            description: "Ataque base do Pokémon",
            example: 60,
            minimum: 1,
            maximum: 255,
          },
          baseDefense: {
            type: "integer",
            description: "Defesa base do Pokémon",
            example: 45,
            minimum: 1,
            maximum: 255,
          },
          baseSpeed: {
            type: "integer",
            description: "Velocidade base do Pokémon",
            example: 95,
            minimum: 1,
            maximum: 255,
          },
          primaryTypeId: {
            type: "string",
            description: "ID do tipo primário",
            example: "4",
            pattern: "^\\d+$",
          },
          secondaryTypeId: {
            type: "string",
            description: "ID do tipo secundário",
            example: "12",
            pattern: "^\\d+$",
          },
        },
      },
      PaginationInfo: {
        type: "object",
        properties: {
          page: {
            type: "integer",
            description: "Página atual",
            example: 1,
          },
          limit: {
            type: "integer",
            description: "Itens por página",
            example: 10,
          },
          total: {
            type: "integer",
            description: "Total de itens",
            example: 50,
          },
          totalPages: {
            type: "integer",
            description: "Total de páginas",
            example: 5,
          },
          hasNext: {
            type: "boolean",
            description: "Indica se há próxima página",
            example: true,
          },
          hasPrev: {
            type: "boolean",
            description: "Indica se há página anterior",
            example: false,
          },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Operação realizada com sucesso",
          },
          data: {
            type: "object",
            description: "Dados da resposta (varia por endpoint)",
          },
        },
      },
      PokemonListResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Lista de pokémons",
          },
          data: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Pokemon",
            },
          },
          pagination: {
            $ref: "#/components/schemas/PaginationInfo",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Erro ao processar solicitação",
          },
          errors: {
            type: "array",
            description: "Detalhes dos erros (presente em erros de validação)",
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                  description: "Campo que causou o erro",
                  example: "name",
                },
                message: {
                  type: "string",
                  description: "Mensagem do erro",
                  example: "Nome é obrigatório",
                },
                code: {
                  type: "string",
                  description: "Código do erro",
                  example: "too_small",
                },
              },
            },
          },
        },
      },
    },
    responses: {
      NotFound: {
        description: "Recurso não encontrado",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              message: "Pokémon não encontrado",
            },
          },
        },
      },
      ValidationError: {
        description: "Erro de validação dos dados de entrada",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              message: "Dados de entrada inválidos",
              errors: [
                {
                  field: "name",
                  message: "Nome é obrigatório",
                  code: "too_small",
                },
              ],
            },
          },
        },
      },
      InternalError: {
        description: "Erro interno do servidor",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              message: "Erro interno do servidor",
            },
          },
        },
      },
    },
  },
};

const options: Options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/schemas/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
