import { prisma } from "../lib/prisma.js";

async function seedTypes() {
  console.log("🌱 Criando tipos de pokémon...");

  const types = [
    { name: "Fire", color: "#F08030", description: "Pokémons do tipo Fogo" },
    { name: "Water", color: "#6890F0", description: "Pokémons do tipo Água" },
    { name: "Grass", color: "#78C850", description: "Pokémons do tipo Grama" },
    {
      name: "Electric",
      color: "#F8D030",
      description: "Pokémons do tipo Elétrico",
    },
    {
      name: "Psychic",
      color: "#F85888",
      description: "Pokémons do tipo Psíquico",
    },
    { name: "Ice", color: "#98D8D8", description: "Pokémons do tipo Gelo" },
    {
      name: "Dragon",
      color: "#7038F8",
      description: "Pokémons do tipo Dragão",
    },
    { name: "Dark", color: "#705848", description: "Pokémons do tipo Sombrio" },
    {
      name: "Fighting",
      color: "#C03028",
      description: "Pokémons do tipo Lutador",
    },
    {
      name: "Poison",
      color: "#A040A0",
      description: "Pokémons do tipo Venenoso",
    },
    { name: "Ground", color: "#E0C068", description: "Pokémons do tipo Terra" },
    {
      name: "Flying",
      color: "#A890F0",
      description: "Pokémons do tipo Voador",
    },
    { name: "Bug", color: "#A8B820", description: "Pokémons do tipo Inseto" },
    { name: "Rock", color: "#B8A038", description: "Pokémons do tipo Pedra" },
    {
      name: "Ghost",
      color: "#705898",
      description: "Pokémons do tipo Fantasma",
    },
    { name: "Steel", color: "#B8B8D0", description: "Pokémons do tipo Aço" },
    { name: "Fairy", color: "#EE99AC", description: "Pokémons do tipo Fada" },
    {
      name: "Normal",
      color: "#A8A878",
      description: "Pokémons do tipo Normal",
    },
  ];

  for (const type of types) {
    try {
      await prisma.type.upsert({
        where: { name: type.name },
        update: {},
        create: type,
      });
      console.log(`✅ Tipo ${type.name} criado/atualizado`);
    } catch (error) {
      console.error(`❌ Erro ao criar tipo ${type.name}:`, error);
    }
  }
}

async function seedPokemons() {
  console.log("🌱 Criando pokémons de exemplo...");

  const fireType = await prisma.type.findUnique({ where: { name: "Fire" } });
  const waterType = await prisma.type.findUnique({ where: { name: "Water" } });
  const grassType = await prisma.type.findUnique({ where: { name: "Grass" } });
  const electricType = await prisma.type.findUnique({
    where: { name: "Electric" },
  });
  const psychicType = await prisma.type.findUnique({
    where: { name: "Psychic" },
  });

  const pokemons = [
    {
      name: "Pikachu",
      height: 0.4,
      weight: 6.0,
      description:
        "Um Pokémon do tipo Elétrico conhecido por suas bochechas vermelhas que armazenam eletricidade.",
      baseHp: 35,
      baseAttack: 55,
      baseDefense: 40,
      baseSpeed: 90,
      types: [electricType?.id],
    },
    {
      name: "Charizard",
      height: 1.7,
      weight: 90.5,
      description:
        "Um poderoso Pokémon dragão que cospe fogo intenso de sua boca.",
      baseHp: 78,
      baseAttack: 84,
      baseDefense: 78,
      baseSpeed: 100,
      types: [fireType?.id],
    },
    {
      name: "Blastoise",
      height: 1.6,
      weight: 85.5,
      description:
        "Um Pokémon tartaruga que atira poderosos jatos de água de seus canhões.",
      baseHp: 79,
      baseAttack: 83,
      baseDefense: 100,
      baseSpeed: 78,
      types: [waterType?.id],
    },
    {
      name: "Venusaur",
      height: 2.0,
      weight: 100.0,
      description:
        "Um grande Pokémon planta com uma flor nas costas que exala um aroma calmante.",
      baseHp: 80,
      baseAttack: 82,
      baseDefense: 83,
      baseSpeed: 80,
      types: [grassType?.id],
    },
    {
      name: "Alakazam",
      height: 1.5,
      weight: 48.0,
      description:
        "Um Pokémon psíquico extremamente inteligente com poderes telepáticos.",
      baseHp: 55,
      baseAttack: 50,
      baseDefense: 45,
      baseSpeed: 120,
      types: [psychicType?.id],
    },
  ];

  for (const pokemon of pokemons) {
    try {
      const existing = await prisma.pokemon.findUnique({
        where: { name: pokemon.name },
      });

      if (existing) {
        console.log(`⚠️  Pokémon ${pokemon.name} já existe`);
        continue;
      }

      const newPokemon = await prisma.pokemon.create({
        data: {
          name: pokemon.name,
          height: pokemon.height,
          weight: pokemon.weight,
          description: pokemon.description,
          baseHp: pokemon.baseHp,
          baseAttack: pokemon.baseAttack,
          baseDefense: pokemon.baseDefense,
          baseSpeed: pokemon.baseSpeed,
        },
      });

      if (pokemon.types[0]) {
        await prisma.pokemonType.create({
          data: {
            pokemonId: newPokemon.id,
            typeId: pokemon.types[0],
          },
        });
      }

      console.log(`✅ Pokémon ${pokemon.name} criado`);
    } catch (error) {
      console.error(`❌ Erro ao criar pokémon ${pokemon.name}:`, error);
    }
  }
}

async function main() {
  try {
    await seedTypes();
    await seedPokemons();
    console.log("🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { seedTypes, seedPokemons };
