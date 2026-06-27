"use server";

import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { parseProjectStatsFromForm } from "@/lib/project-stats";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export type ProjectWithImages = Awaited<
  ReturnType<typeof getPublishedProjects>
>[number];

export async function getPublishedProjects() {
  return db.project.findMany({
    where: { published: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { title: "asc" },
  });
}

export async function getAllProjects(search?: string) {
  return db.project.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search } },
            { location: { contains: search } },
          ],
        }
      : undefined,
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectBySlug(slug: string) {
  return db.project.findUnique({
    where: { slug },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getProjectById(id: string) {
  return db.project.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
}

async function uploadImage(file: File): Promise<string> {
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`projects/${filename}`, file, { access: "public" });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

async function deleteImageUrl(url: string) {
  if (url.includes("blob.vercel-storage.com") && process.env.BLOB_READ_WRITE_TOKEN) {
    await del(url);
  }
}

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);
  const published = formData.get("published") === "on";
  const stats = parseProjectStatsFromForm(formData);

  let slug = slugify(title);
  const existing = await db.project.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const project = await db.project.create({
    data: {
      title,
      slug,
      description,
      location,
      latitude,
      longitude,
      published,
      ...stats,
    },
  });

  const images = formData.getAll("images") as File[];
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    if (file && file.size > 0) {
      const url = await uploadImage(file);
      await db.projectImage.create({
        data: {
          projectId: project.id,
          url,
          alt: title,
          sortOrder: i,
        },
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin/projecten/${project.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);
  const published = formData.get("published") === "on";
  const slug = (formData.get("slug") as string) || slugify(title);
  const stats = parseProjectStatsFromForm(formData);

  await db.project.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      location,
      latitude,
      longitude,
      published,
      ...stats,
    },
  });

  const images = formData.getAll("images") as File[];
  const existingCount = await db.projectImage.count({ where: { projectId: id } });

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    if (file && file.size > 0) {
      const url = await uploadImage(file);
      await db.projectImage.create({
        data: {
          projectId: id,
          url,
          alt: title,
          sortOrder: existingCount + i,
        },
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/projecten/${slug}`);
  redirect(`/admin/projecten/${id}`);
}

export async function deleteProject(id: string) {
  const project = await db.project.findUnique({
    where: { id },
    include: { images: true },
  });

  if (project) {
    for (const image of project.images) {
      await deleteImageUrl(image.url);
    }
    await db.project.delete({ where: { id } });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function togglePublished(id: string, published: boolean) {
  await db.project.update({
    where: { id },
    data: { published },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProjectImage(imageId: string) {
  const image = await db.projectImage.findUnique({ where: { id: imageId } });
  if (image) {
    await deleteImageUrl(image.url);
    await db.projectImage.delete({ where: { id: imageId } });
    revalidatePath("/");
    revalidatePath("/admin");
  }
}

export async function geocodeAddress(address: string): Promise<{
  latitude: number;
  longitude: number;
  placeName: string;
} | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;

  const query = encodeURIComponent(`${address}, Leiden, Netherlands`);
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&limit=1&country=nl&proximity=4.497,52.160`,
  );

  if (!res.ok) return null;

  const data = await res.json();
  const feature = data.features?.[0];
  if (!feature) return null;

  const [longitude, latitude] = feature.center;
  return {
    latitude,
    longitude,
    placeName: feature.place_name as string,
  };
}
