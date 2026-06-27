import { getProjectBySlug } from "@/lib/actions/projects";
import { ProjectStatsDetail } from "@/components/ProjectStats";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailMap } from "@/components/map/DetailMap";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project niet gevonden" };
  return {
    title: `${project.title} — Groene Kansen Kaart`,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || !project.published) {
    notFound();
  }

  const heroImage = project.images[0];

  return (
    <>
      <SiteHeader />
      <article>
        {heroImage ? (
          <div className="relative h-64 w-full bg-[var(--color-light)] sm:h-80 md:h-96">
            <Image
              src={heroImage.url}
              alt={heroImage.alt || project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-2 text-[var(--color-light)]">{project.location}</p>
            </div>
          </div>
        ) : (
          <div className="bg-[var(--color-primary)] px-6 py-12 sm:px-10">
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-2 text-[var(--color-light)]">{project.location}</p>
          </div>
        )}

        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-sm font-semibold text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
          >
            ← Terug naar kaart
          </Link>

          <p className="whitespace-pre-wrap text-lg leading-relaxed text-[#1D2B1F]/90">
            {project.description}
          </p>

          <ProjectStatsDetail project={project} />

          {project.images.length > 1 && (
            <section className="mt-12">
              <h2 className="font-display mb-6 text-2xl font-bold text-[var(--color-primary)]">
                Foto&apos;s
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] shadow-[var(--shadow)]"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || project.title}
                      fill
                      className="object-cover transition hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12">
            <h2 className="font-display mb-4 text-2xl font-bold text-[var(--color-primary)]">
              Locatie
            </h2>
            <DetailMap latitude={project.latitude} longitude={project.longitude} />
            <p className="mt-2 text-sm text-[var(--color-secondary)]">{project.location}</p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </>
  );
}
