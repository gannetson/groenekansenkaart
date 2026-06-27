import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-display mb-8 text-3xl font-bold text-[var(--color-primary)]">
        Nieuw project
      </h1>
      <ProjectForm />
    </div>
  );
}
