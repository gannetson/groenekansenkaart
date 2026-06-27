"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Project = {
  id: string;
  slug: string;
  title: string;
  location: string;
  published: boolean;
  updatedAt: Date;
};

type AdminProjectListProps = {
  projects: Project[];
  searchQuery: string;
  onTogglePublished: (id: string, published: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function AdminProjectList({
  projects,
  searchQuery,
  onTogglePublished,
  onDelete,
}: AdminProjectListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    router.push(q ? `/admin?q=${encodeURIComponent(q)}` : "/admin");
  }

  function handleToggle(id: string, published: boolean) {
    startTransition(async () => {
      await onTogglePublished(id, !published);
      router.refresh();
    });
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) return;
    startTransition(async () => {
      await onDelete(id);
    });
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={searchQuery}
          placeholder="Zoek projecten..."
          className="flex-1 rounded-[var(--radius)] border-2 border-[var(--color-light)] px-4 py-2 focus:border-[var(--color-secondary)] focus:outline-none"
        />
        <Button type="submit" variant="outline">
          Zoeken
        </Button>
      </form>

      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--color-light)]/80 bg-white shadow-[var(--shadow)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-light)]/60 bg-[var(--color-bg)]">
            <tr>
              <th className="px-4 py-3 font-semibold text-[var(--color-primary)]">Titel</th>
              <th className="hidden px-4 py-3 font-semibold text-[var(--color-primary)] sm:table-cell">
                Locatie
              </th>
              <th className="px-4 py-3 font-semibold text-[var(--color-primary)]">Status</th>
              <th className="px-4 py-3 font-semibold text-[var(--color-primary)]">Acties</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-[var(--color-bg)] hover:bg-[var(--color-bg)]/60"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/projecten/${project.id}`}
                    className="font-medium text-[var(--color-primary)] hover:text-[var(--color-secondary)]"
                  >
                    {project.title}
                  </Link>
                </td>
                <td className="hidden px-4 py-3 text-[var(--color-secondary)] sm:table-cell">
                  {project.location}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleToggle(project.id, project.published)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      project.published
                        ? "bg-[var(--color-light)]/50 text-[var(--color-primary)]"
                        : "bg-[var(--color-warn)]/30 text-[#7a5a00]"
                    }`}
                  >
                    {project.published ? "Gepubliceerd" : "Concept"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/projecten/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        Bewerken
                      </Button>
                    </Link>
                    {project.published && (
                      <Link href={`/projecten/${project.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          Bekijk
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleDelete(project.id, project.title)}
                    >
                      Verwijder
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <p className="p-8 text-center text-[var(--color-secondary)]">
            Nog geen projecten. Maak er een aan!
          </p>
        )}
      </div>
    </div>
  );
}
