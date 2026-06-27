"use client";

import { ProjectWithImages } from "@/lib/actions/projects";
import { ProjectStatsDisplay } from "@/components/ProjectStats";
import Link from "next/link";
import Image from "next/image";

type ProjectPopupProps = {
  project: ProjectWithImages;
  onClose: () => void;
};

export function ProjectPopup({ project, onClose }: ProjectPopupProps) {
  const heroImage = project.images[0];

  return (
    <div className="relative w-72 overflow-hidden rounded-[var(--radius)] bg-white shadow-[var(--shadow)] sm:w-80">
      {heroImage && (
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={heroImage.url}
            alt={heroImage.alt || project.title}
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>
      )}
      <div className="p-4">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[var(--color-primary)] shadow hover:bg-white"
          aria-label="Sluiten"
        >
          ×
        </button>

        <h3 className="font-display text-lg font-bold text-[var(--color-primary)]">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-secondary)]">{project.location}</p>
        <ProjectStatsDisplay project={project} />
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#1D2B1F]/80">
          {project.description}
        </p>
        <Link
          href={`/projecten/${project.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] transition hover:gap-2"
        >
          Bekijk details →
        </Link>
      </div>
    </div>
  );
}
