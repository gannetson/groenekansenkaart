import { getAllProjects, togglePublished, deleteProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { AdminProjectList } from "@/components/admin/AdminProjectList";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];
  let dbError = false;

  try {
    projects = await getAllProjects(q);
  } catch {
    dbError = true;
  }

  return (
    <div>
      {dbError && (
        <div className="mb-6 rounded-[var(--radius)] border-2 border-[var(--color-warn)] bg-[var(--color-warn)]/10 px-4 py-3 text-sm text-[#7a5a00]">
          Database niet bereikbaar. Run{" "}
          <code className="font-mono">npm run db:push && npm run db:seed</code> om de database
          aan te maken.
        </div>
      )}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-primary)]">Projecten</h1>
          <p className="mt-1 text-[var(--color-secondary)]">
            {projects.length} project{projects.length !== 1 ? "en" : ""} in totaal
          </p>
        </div>
        <Link href="/admin/projecten/nieuw">
          <Button>+ Nieuw project</Button>
        </Link>
      </div>

      <AdminProjectList
        projects={projects}
        searchQuery={q ?? ""}
        onTogglePublished={togglePublished}
        onDelete={deleteProject}
      />
    </div>
  );
}
