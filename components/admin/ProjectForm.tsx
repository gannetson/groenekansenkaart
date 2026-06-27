"use client";

import { createProject, updateProject, deleteProjectImage } from "@/lib/actions/projects";
import { generateProjectStats } from "@/lib/project-stats";
import { LocationPicker } from "@/components/admin/LocationPicker";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Card";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const MONTHS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maart" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Augustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

type ProjectFormProps = {
  project?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    published: boolean;
    deliveryMonth: number;
    deliveryYear: number;
    treesAdded: number;
    squareMetersGreen: number;
    images: { id: string; url: string; alt: string }[];
  };
};

export function ProjectForm({ project }: ProjectFormProps) {
  const isEditing = !!project;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultStats = project
    ? {
        deliveryMonth: project.deliveryMonth,
        deliveryYear: project.deliveryYear,
        treesAdded: project.treesAdded,
        squareMetersGreen: project.squareMetersGreen,
      }
    : generateProjectStats(`new-${Date.now()}`);

  const [latitude, setLatitude] = useState(project?.latitude ?? 52.16);
  const [longitude, setLongitude] = useState(project?.longitude ?? 4.497);
  const [location, setLocation] = useState(project?.location ?? "");
  const [published, setPublished] = useState(project?.published ?? false);
  const [images, setImages] = useState(project?.images ?? []);

  function handleDeleteImage(imageId: string) {
    startTransition(async () => {
      await deleteProjectImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      router.refresh();
    });
  }

  async function handleSubmit(formData: FormData) {
    formData.set("latitude", latitude.toString());
    formData.set("longitude", longitude.toString());
    formData.set("location", location);
    if (published) {
      formData.set("published", "on");
    }

    if (isEditing) {
      await updateProject(project.id, formData);
    } else {
      await createProject(formData);
    }
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <form action={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <div>
        <Label htmlFor="title">Titel</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={project?.title}
          placeholder="Bijv. Groene dakterras Hortus"
        />
      </div>

      {isEditing && (
        <div>
          <Label htmlFor="slug">URL-slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={project.slug}
            placeholder="groene-dakterras-hortus"
          />
        </div>
      )}

      <div>
        <Label htmlFor="location">Locatie</Label>
        <Input
          id="location"
          name="location"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Bijv. Rapenburg 73, Leiden"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="deliveryMonth">Datum oplevering — maand</Label>
          <select
            id="deliveryMonth"
            name="deliveryMonth"
            required
            defaultValue={defaultStats.deliveryMonth}
            className="w-full rounded-[var(--radius)] border-2 border-[var(--color-light)] bg-white px-4 py-2.5 text-[var(--color-text)] focus:border-[var(--color-secondary)] focus:outline-none"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="deliveryYear">Datum oplevering — jaar</Label>
          <select
            id="deliveryYear"
            name="deliveryYear"
            required
            defaultValue={defaultStats.deliveryYear}
            className="w-full rounded-[var(--radius)] border-2 border-[var(--color-light)] bg-white px-4 py-2.5 text-[var(--color-text)] focus:border-[var(--color-secondary)] focus:outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="treesAdded">Aantal bomen toegevoegd</Label>
          <Input
            id="treesAdded"
            name="treesAdded"
            type="number"
            min={0}
            required
            defaultValue={defaultStats.treesAdded}
          />
        </div>
        <div>
          <Label htmlFor="squareMetersGreen">m² vergroend</Label>
          <Input
            id="squareMetersGreen"
            name="squareMetersGreen"
            type="number"
            min={0}
            required
            defaultValue={defaultStats.squareMetersGreen}
          />
        </div>
      </div>

      <div>
        <Label>Positie op kaart</Label>
        <LocationPicker
          latitude={latitude}
          longitude={longitude}
          onChange={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
          address={location}
          onAddressChange={setLocation}
        />
        <input type="hidden" name="latitude" value={latitude} />
        <input type="hidden" name="longitude" value={longitude} />
      </div>

      <div>
        <Label htmlFor="description">Beschrijving</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={project?.description}
          placeholder="Vertel over dit groene project..."
        />
      </div>

      <ImageUploader existingImages={images} onDeleteExisting={handleDeleteImage} />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-[var(--color-light)] text-[var(--color-primary)] focus:ring-[var(--color-secondary)]"
        />
        <span className="text-sm font-medium text-[var(--color-primary)]">
          Gepubliceerd (zichtbaar op kaart)
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Opslaan..." : isEditing ? "Wijzigingen opslaan" : "Project aanmaken"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin")}>
          Annuleren
        </Button>
      </div>
    </form>
  );
}
