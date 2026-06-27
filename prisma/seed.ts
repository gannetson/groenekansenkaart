import { PrismaClient } from "@prisma/client";
import { leidenVergroenenProjects } from "./data/leiden-vergroenen-projects";
import { generateProjectStats } from "../lib/project-stats";

const db = new PrismaClient();

const demoProjects = [
  {
    slug: "groene-daken-de-kooi",
    title: "Groene daken De Kooi",
    description:
      "Een collectief groen dakinitiatief in de wijk De Kooi. Bewoners hebben samen sedumdaken aangelegd die regenwater opvangen, de biodiversiteit vergroten en de leefomgeving verkoelen. Het project laat zien hoe stedelijke daken kunnen bijdragen aan een klimaatbestendiger Leiden.",
    location: "De Kooi, Leiden",
    latitude: 52.174,
    longitude: 4.508,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
        alt: "Groen dak met planten",
        sortOrder: 0,
      },
    ],
  },
  {
    slug: "community-tuin-havenkwartier",
    title: "Community-tuin Havenkwartier",
    description:
      "In het Havenkwartier is een levendige community-tuin ingericht waar buurtbewoners samen groenten, kruiden en bloemen kweken. De tuin fungeert als ontmoetingsplek en educatieve ruimte voor kinderen en volwassenen die meer willen leren over stadslandbouw.",
    location: "Havenkwartier, Leiden",
    latitude: 52.155,
    longitude: 4.488,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
        alt: "Community tuin",
        sortOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800",
        alt: "Moestuin",
        sortOrder: 1,
      },
    ],
  },
  {
    slug: "bomenrij-rapenburg",
    title: "Bomenrij Rapenburg",
    description:
      "Langs de historische Rapenburg zijn nieuwe bomen geplant om de straat groener en aangenamer te maken. Het project combineert erfgoed en vergroening: passende boomsoorten die bijdragen aan schaduw, luchtzuivering en een prettiger wandelklimaat langs het water.",
    location: "Rapenburg, Leiden",
    latitude: 52.158,
    longitude: 4.485,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        alt: "Bomen langs water",
        sortOrder: 0,
      },
    ],
  },
  {
    slug: "regenwatertuin-stevenshof",
    title: "Regenwatertuin Stevenshof",
    description:
      "Een demonstratietuin in Stevenshof toont hoe regenwater lokaal kan worden vastgehold met wadi's, regentonnetjes en doorlatende verharding. Bewoners kunnen hier ideeën opdoen voor hun eigen tuin om wateroverlast te verminderen.",
    location: "Stevenshof, Leiden",
    latitude: 52.148,
    longitude: 4.472,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800",
        alt: "Regenwatertuin",
        sortOrder: 0,
      },
    ],
  },
  {
    slug: "insectenhotel-leiden-centrum",
    title: "Insectenhotels Leiden Centrum",
    description:
      "Verspreid door het centrum van Leiden zijn insectenhotels geplaatst om bijen, vlinders en andere bestuivers te ondersteunen. Dit kleinschalige but impactful project maakt biodiversiteit zichtbaar en inspireert bedrijven en particulieren om hetzelfde te doen.",
    location: "Leiden Centrum",
    latitude: 52.16,
    longitude: 4.493,
    published: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800",
        alt: "Insectenhotel",
        sortOrder: 0,
      },
    ],
  },
];

async function seedProjectList(
  projects: Array<{
    slug: string;
    title: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    published: boolean;
    images?: { url: string; alt: string; sortOrder: number }[];
  }>,
) {
  for (const project of projects) {
    const { images = [], ...data } = project;
    const stats = generateProjectStats(project.slug);
    const payload = { ...data, ...stats };
    await db.project.upsert({
      where: { slug: project.slug },
      update: payload,
      create: {
        ...payload,
        images: images.length > 0 ? { create: images } : undefined,
      },
    });
  }
}

async function main() {
  console.log("Seeding database...");

  await seedProjectList(demoProjects);
  console.log(`Seeded ${demoProjects.length} demo projects.`);

  await seedProjectList(leidenVergroenenProjects);
  console.log(`Seeded ${leidenVergroenenProjects.length} Leiden Vergroenen projects.`);

  const total = await db.project.count();
  console.log(`Total: ${total} projects in database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
