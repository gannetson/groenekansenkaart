"use client";

import { ProjectWithImages } from "@/lib/actions/projects";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type ProjectSidebarProps = {
  projects: ProjectWithImages[];
  selectedId: string | null;
  onSelect: (project: ProjectWithImages) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export function ProjectSidebar({
  projects,
  selectedId,
  onSelect,
  search,
  onSearchChange,
}: ProjectSidebarProps) {
  const filtered = useMemo(() => {
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()),
    );
  }, [projects, search]);

  return (
    <aside className="panel-card flex h-full w-full flex-col">
      <div className="border-b border-[var(--color-light)]/60 p-4">
        <h2 className="font-display text-xl font-bold text-[var(--color-primary)]">
          Groene projecten
        </h2>
        <p className="mt-1 text-sm text-[var(--color-secondary)]">
          {projects.length} initiatieven in Leiden
        </p>

        <input
          type="search"
          placeholder="Zoek op titel of locatie..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mt-3 w-full rounded-[var(--radius)] border-2 border-[var(--color-light)] px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
        />
      </div>

      <ul className="flex-1 overflow-y-auto p-2">
        {filtered.map((project) => (
          <li key={project.id}>
            <button
              onClick={() => onSelect(project)}
              className={cn(
                "mb-1 w-full rounded-[var(--radius)] px-3 py-3 text-left transition hover:bg-[var(--color-bg)]",
                selectedId === project.id &&
                  "bg-[var(--color-bg)] ring-2 ring-[var(--color-secondary)]",
              )}
            >
              <span className="font-semibold text-[var(--color-primary)]">{project.title}</span>
              <span className="mt-0.5 block text-xs text-[var(--color-secondary)]">
                {project.location}
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="p-4 text-center text-sm text-[var(--color-secondary)]">
            Geen projecten gevonden
          </li>
        )}
      </ul>
    </aside>
  );
}
