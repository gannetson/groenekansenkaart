import { PrismaClient } from "@prisma/client";
import { leidenVergroenenProjects } from "./data/leiden-vergroenen-projects";
import { generateProjectStats } from "../lib/project-stats";

const db = new PrismaClient();

async function main() {
  console.log("Seeding Leiden Vergroenen projects...");

  let created = 0;
  let updated = 0;

  for (const project of leidenVergroenenProjects) {
    const existing = await db.project.findUnique({ where: { slug: project.slug } });
    const stats = generateProjectStats(project.slug);
    await db.project.upsert({
      where: { slug: project.slug },
      update: { ...project, ...stats },
      create: { ...project, ...stats },
    });
    if (existing) updated++;
    else created++;
  }

  console.log(`Done: ${created} created, ${updated} updated (${leidenVergroenenProjects.length} total).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
