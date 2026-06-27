import { PrismaClient } from "@prisma/client";
import { generateProjectStats } from "../lib/project-stats";

const db = new PrismaClient();

async function main() {
  const projects = await db.project.findMany({ select: { id: true, slug: true } });

  console.log(`Backfilling stats for ${projects.length} projects...`);

  for (const project of projects) {
    const stats = generateProjectStats(project.slug);
    await db.project.update({
      where: { id: project.id },
      data: stats,
    });
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
