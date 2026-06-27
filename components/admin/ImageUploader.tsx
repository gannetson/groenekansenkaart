"use client";

import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/Card";

type ImageUploaderProps = {
  existingImages?: { id: string; url: string; alt: string }[];
  onDeleteExisting?: (id: string) => void;
};

export function ImageUploader({
  existingImages = [],
  onDeleteExisting,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <div className="space-y-4">
      {existingImages.length > 0 && (
        <div>
          <Label>Huidige foto&apos;s</Label>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {existingImages.map((image) => (
              <div key={image.id} className="group relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
                {onDeleteExisting && (
                  <button
                    type="button"
                    onClick={() => onDeleteExisting(image.id)}
                    className="absolute right-1 top-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Verwijder
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="images">Nieuwe foto&apos;s toevoegen</Label>
        <input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm text-[var(--color-primary)] file:mr-4 file:rounded-[var(--radius)] file:border-0 file:bg-[var(--color-bg)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--color-primary)] hover:file:bg-[var(--color-light)]/40"
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previews.map((url, i) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-xl">
              <Image src={url} alt={`Preview ${i + 1}`} fill className="object-cover" sizes="150px" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
