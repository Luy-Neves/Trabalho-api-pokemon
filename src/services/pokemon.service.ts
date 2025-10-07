import { prisma } from "../lib/prisma.js";
import type {
  CreatePokemonInput,
  UpdatePokemonInput,
  PokemonQuery,
} from "../schemas/pokemon.js";

export class PokemonService {
  static async findMany(filters: Partial<PokemonQuery> = {}) {
    const { page = 1, limit = 10, search, typeId } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (typeId) {
      where.PokemonType = {
        some: {
          typeId: parseInt(typeId),
        },
      };
    }

    const [pokemons, total] = await Promise.all([
      prisma.pokemon.findMany({
        where,
        include: {
          PokemonType: {
            include: {
              type: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
        skip,
        take: limit,
      }),
      prisma.pokemon.count({ where }),
    ]);

    return {
      data: pokemons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  static async findById(id: number) {
    const pokemon = await prisma.pokemon.findUnique({
      where: { id },
      include: {
        PokemonType: {
          include: {
            type: true,
          },
        },
      },
    });

    if (!pokemon) {
      throw new Error("Pokémon não encontrado");
    }

    return pokemon;
  }

  static async create(data: CreatePokemonInput) {
    const existingByName = await prisma.pokemon.findUnique({
      where: { name: data.name },
    });
    if (existingByName) {
      throw new Error(`Já existe um pokémon com o nome "${data.name}"`);
    }

    const primaryType = await prisma.type.findUnique({
      where: { id: parseInt(data.primaryTypeId) },
    });
    if (!primaryType) {
      throw new Error("Tipo primário não encontrado");
    }

    if (data.secondaryTypeId) {
      const secondaryType = await prisma.type.findUnique({
        where: { id: parseInt(data.secondaryTypeId) },
      });
      if (!secondaryType) {
        throw new Error("Tipo secundário não encontrado");
      }
    }

    const pokemon = await prisma.$transaction(async (tx) => {
      const newPokemon = await tx.pokemon.create({
        data: {
          name: data.name,
          height: data.height || null,
          weight: data.weight || null,
          description: data.description || null,
          imageUrl: data.imageUrl || null,
          baseHp: data.baseHp,
          baseAttack: data.baseAttack,
          baseDefense: data.baseDefense,
          baseSpeed: data.baseSpeed,
        },
      });

      await tx.pokemonType.create({
        data: {
          pokemonId: newPokemon.id,
          typeId: parseInt(data.primaryTypeId),
        },
      });

      if (data.secondaryTypeId) {
        await tx.pokemonType.create({
          data: {
            pokemonId: newPokemon.id,
            typeId: parseInt(data.secondaryTypeId),
          },
        });
      }

      return newPokemon;
    });

    return this.findById(pokemon.id);
  }

  static async update(id: number, data: UpdatePokemonInput) {
    await this.findById(id);

    if (data.name) {
      const existingByName = await prisma.pokemon.findUnique({
        where: { name: data.name },
      });
      if (existingByName && existingByName.id !== id) {
        throw new Error(`Já existe um pokémon com o nome "${data.name}"`);
      }
    }

    const pokemon = await prisma.$transaction(async (tx) => {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.height !== undefined) updateData.height = data.height;
      if (data.weight !== undefined) updateData.weight = data.weight;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
      if (data.baseHp !== undefined) updateData.baseHp = data.baseHp;
      if (data.baseAttack !== undefined)
        updateData.baseAttack = data.baseAttack;
      if (data.baseDefense !== undefined)
        updateData.baseDefense = data.baseDefense;
      if (data.baseSpeed !== undefined) updateData.baseSpeed = data.baseSpeed;

      const updatedPokemon = await tx.pokemon.update({
        where: { id },
        data: updateData,
      });

      if (data.primaryTypeId || data.secondaryTypeId) {
        await tx.pokemonType.deleteMany({
          where: { pokemonId: id },
        });

        if (data.primaryTypeId) {
          const primaryType = await tx.type.findUnique({
            where: { id: parseInt(data.primaryTypeId) },
          });
          if (!primaryType) {
            throw new Error("Tipo primário não encontrado");
          }

          await tx.pokemonType.create({
            data: {
              pokemonId: id,
              typeId: parseInt(data.primaryTypeId),
            },
          });
        }

        if (data.secondaryTypeId) {
          const secondaryType = await tx.type.findUnique({
            where: { id: parseInt(data.secondaryTypeId) },
          });
          if (!secondaryType) {
            throw new Error("Tipo secundário não encontrado");
          }

          await tx.pokemonType.create({
            data: {
              pokemonId: id,
              typeId: parseInt(data.secondaryTypeId),
            },
          });
        }
      }

      return updatedPokemon;
    });

    return this.findById(pokemon.id);
  }

  static async delete(id: number) {
    await this.findById(id);

    await prisma.$transaction(async (tx: any) => {
      await tx.pokemonType.deleteMany({
        where: { pokemonId: id },
      });

      await tx.pokemon.delete({
        where: { id },
      });
    });

    return { message: "Pokémon deletado com sucesso" };
  }

  static async addType(pokemonId: number, typeId: number) {
    await this.findById(pokemonId);

    const type = await prisma.type.findUnique({
      where: { id: typeId },
    });
    if (!type) {
      throw new Error("Tipo não encontrado");
    }

    const existingPokemonType = await prisma.pokemonType.findUnique({
      where: {
        pokemonId_typeId: {
          pokemonId,
          typeId,
        },
      },
    });

    if (existingPokemonType) {
      throw new Error("Este pokémon já possui este tipo");
    }

    const existingTypes = await prisma.pokemonType.count({
      where: { pokemonId },
    });

    if (existingTypes >= 2) {
      throw new Error("Um pokémon pode ter no máximo 2 tipos");
    }

    return prisma.pokemonType.create({
      data: {
        pokemonId,
        typeId,
      },
      include: {
        type: true,
      },
    });
  }

  static async removeType(pokemonId: number, typeId: number) {
    await this.findById(pokemonId);

    const typeCount = await prisma.pokemonType.count({
      where: { pokemonId },
    });

    if (typeCount <= 1) {
      throw new Error("Um pokémon deve ter pelo menos 1 tipo");
    }

    const deletedType = await prisma.pokemonType.delete({
      where: {
        pokemonId_typeId: {
          pokemonId,
          typeId,
        },
      },
    });

    return { message: "Tipo removido do pokémon com sucesso" };
  }
}
