import { z } from "zod";

export const createPokemonSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-Z\s]+$/, "Nome deve conter apenas letras e espaços"),

  height: z
    .number()
    .positive("Altura deve ser positiva")
    .max(100, "Altura deve ser menor que 100m")
    .optional(),

  weight: z
    .number()
    .positive("Peso deve ser positivo")
    .max(10000, "Peso deve ser menor que 10000kg")
    .optional(),

  description: z
    .string()
    .max(1000, "Descrição deve ter no máximo 1000 caracteres")
    .optional(),

  imageUrl: z.string().url("URL da imagem deve ser válida").optional(),

  baseHp: z
    .number()
    .int("HP base deve ser um inteiro")
    .min(1, "HP base deve ser pelo menos 1")
    .max(255, "HP base deve ser no máximo 255")
    .default(50),

  baseAttack: z
    .number()
    .int("Ataque base deve ser um inteiro")
    .min(1, "Ataque base deve ser pelo menos 1")
    .max(255, "Ataque base deve ser no máximo 255")
    .default(50),

  baseDefense: z
    .number()
    .int("Defesa base deve ser um inteiro")
    .min(1, "Defesa base deve ser pelo menos 1")
    .max(255, "Defesa base deve ser no máximo 255")
    .default(50),

  baseSpeed: z
    .number()
    .int("Velocidade base deve ser um inteiro")
    .min(1, "Velocidade base deve ser pelo menos 1")
    .max(255, "Velocidade base deve ser no máximo 255")
    .default(50),

  primaryTypeId: z
    .string()
    .regex(/^\d+$/, "ID do tipo primário deve ser um número válido"),

  secondaryTypeId: z
    .string()
    .regex(/^\d+$/, "ID do tipo secundário deve ser um número válido")
    .optional(),
});

export const updatePokemonSchema = createPokemonSchema.partial();

export const pokemonParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID deve ser um número válido"),
});

export const pokemonQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1))
    .pipe(z.number().int().positive()),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10))
    .pipe(z.number().int().positive().max(100)),

  search: z
    .string()
    .max(100, "Busca deve ter no máximo 100 caracteres")
    .optional(),

  typeId: z
    .string()
    .regex(/^\d+$/, "ID do tipo deve ser um número válido")
    .optional(),
});

export type CreatePokemonInput = z.infer<typeof createPokemonSchema>;
export type UpdatePokemonInput = z.infer<typeof updatePokemonSchema>;
export type PokemonParams = z.infer<typeof pokemonParamsSchema>;
export type PokemonQuery = z.infer<typeof pokemonQuerySchema>;
