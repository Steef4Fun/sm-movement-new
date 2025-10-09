"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, UploadCloud } from "lucide-react";
import Image from "next/image";

interface MediaUploaderProps {
  label: string;
  accept: string;
  existingMedia: string[];
  onExistingMediaChange: (urls: string[]) => void;
  onNewMediaChange: (files: File[]) => void;
}

export function MediaUploader({
  label,
  accept,
  existingMedia,
  onExistingMediaChange,
  onNewMediaChange,
}: MediaUploaderProps) {
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const newPreviews = newMediaFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newMediaFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setNewMediaFiles((prev) => [...prev, ...files]);
      onNewMediaChange([...newMediaFiles, ...files]);
    }
  };

  const removeExistingMedia = (urlToRemove: string) => {
    onExistingMediaChange(existingMedia.filter((url) => url !== urlToRemove));
  };

  const removeNewMedia = (indexToRemove: number) => {
    const updatedFiles = newMediaFiles.filter((_, i) => i !== indexToRemove);
    setNewMediaFiles(updatedFiles);
    onNewMediaChange(updatedFiles);
  };

  const isImage = accept.includes("image");

  return (
    <div className="space-y-4">
      <label className="font-medium">{label}</label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {existingMedia.map((url) => (
          <div key={url} className="relative group aspect-square">
            {isImage ? (
              <Image src={url} alt="Existing media" layout="fill" className="object-cover rounded-md" />
            ) : (
              <video src={url} className="w-full h-full object-cover rounded-md" />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeExistingMedia(url)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {previews.map((previewUrl, index) => (
          <div key={previewUrl} className="relative group aspect-square">
            {isImage ? (
              <Image src={previewUrl} alt="New media preview" layout="fill" className="object-cover rounded-md" />
            ) : (
              <video src={previewUrl} className="w-full h-full object-cover rounded-md" />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeNewMedia(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <label className="cursor-pointer aspect-square flex flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors">
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <span className="text-xs text-muted-foreground mt-2">Toevoegen</span>
          <Input
            type="file"
            className="hidden"
            accept={accept}
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}