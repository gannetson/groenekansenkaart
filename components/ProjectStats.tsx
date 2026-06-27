import { formatDeliveryDate, ProjectStats } from "@/lib/project-stats";

type ProjectWithStats = {
  deliveryMonth: number;
  deliveryYear: number;
  treesAdded: number;
  squareMetersGreen: number;
};

export function ProjectStatsDisplay({ project }: { project: ProjectWithStats }) {
  return (
    <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
      <div className="rounded-[var(--radius)] bg-[var(--color-bg)] px-2 py-2">
        <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
          Oplevering
        </dt>
        <dd className="mt-0.5 text-xs font-bold text-[var(--color-primary)]">
          {String(project.deliveryMonth).padStart(2, "0")}/{project.deliveryYear}
        </dd>
      </div>
      <div className="rounded-[var(--radius)] bg-[var(--color-bg)] px-2 py-2">
        <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
          Bomen
        </dt>
        <dd className="mt-0.5 text-xs font-bold text-[var(--color-primary)]">
          {project.treesAdded}
        </dd>
      </div>
      <div className="rounded-[var(--radius)] bg-[var(--color-bg)] px-2 py-2">
        <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
          m² groen
        </dt>
        <dd className="mt-0.5 text-xs font-bold text-[var(--color-primary)]">
          {project.squareMetersGreen}
        </dd>
      </div>
    </dl>
  );
}

export function ProjectStatsDetail({ project }: { project: ProjectWithStats }) {
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-3">
      {[
        {
          label: "Datum oplevering",
          value: formatDeliveryDate(project.deliveryMonth, project.deliveryYear),
        },
        { label: "Bomen toegevoegd", value: String(project.treesAdded) },
        { label: "m² vergroend", value: `${project.squareMetersGreen} m²` },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-[var(--radius)] border border-[var(--color-light)]/80 bg-white p-5 shadow-[var(--shadow)]"
        >
          <p className="text-sm font-medium text-[var(--color-secondary)]">{stat.label}</p>
          <p className="font-display mt-1 text-2xl font-bold text-[var(--color-primary)]">
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
}
