import { getProjectById } from "@/lib/actions/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display mb-8 text-3xl font-bold text-[var(--color-primary)]">
        Project bewerken
      </h1>
      <ProjectForm project={project} />
    </div>
  );
}
