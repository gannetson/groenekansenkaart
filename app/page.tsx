import { getPublishedProjects } from "@/lib/actions/projects";
import { ProjectMap } from "@/components/map/ProjectMap";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let projects: Awaited<ReturnType<typeof getPublishedProjects>> = [];

  try {
    projects = await getPublishedProjects();
  } catch (error) {
    console.error("Failed to load published projects:", error);
    projects = [];
  }

  return (
    <>
      <SiteHeader />

      <main id="kaart" className="relative min-h-[calc(100vh-4.25rem)]">
        {/* Hero background */}
        <div className="absolute inset-0">
          <Image
            src="/hero-groen.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/40 via-[var(--color-bg)]/75 to-[var(--color-bg)]" />
        </div>

        {/* Map panels */}
        <div className="relative z-10 px-3 py-3 sm:px-4 lg:px-6">
          <div className="mx-auto h-[calc(80vh-4.25rem)] min-h-[520px] max-w-7xl">
            <ProjectMap projects={projects} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
