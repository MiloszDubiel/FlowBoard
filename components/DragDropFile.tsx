"use client";

import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { X, FileText } from "lucide-react";
import { type Accept } from "react-dropzone";
import { Attachment } from "@/generated/prisma/client";

type PreviewFile = {
  file: File;
  preview: string;
};

export const DragDrop = ({
  onFileChange,
  type,
  defaultFiles = [],
}: {
  onFileChange: (files: File[]) => void;
  fileSize: number;
  type: "text" | "img";
  defaultFiles?: Attachment[];
}) => {
  const [existingFiles, setExistingFiles] =
    useState<Attachment[]>(defaultFiles);
  const [removeExistinfFiles, setRemoveExistingFiles] = useState<Attachment[]>(
    [],
  );

  const [newFiles, setNewFiles] = useState<PreviewFile[]>([]);

  const accept: Accept =
    type === "text"
      ? {
          "application/pdf": [".pdf"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
          "application/msword": [".doc"],
          "text/plain": [".txt"],
        }
      : {
          "image/*": [],
        };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,

    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setNewFiles((prev) => [...prev, ...files]);
      onFileChange([...newFiles.map((item) => item.file), ...acceptedFiles]);
    },
    maxFiles: 3,
  });

  const removeExistingFile = (id: number) => {
    setExistingFiles((prev) => prev.filter((file) => file.id !== id));

    setRemoveExistingFiles((prev: Attachment[]) => [
      ...prev,
      ...existingFiles.filter((el) => el.id === id),
    ]);
  };

  const removeNewFile = (fileToRemove: PreviewFile) => {
    setNewFiles((prev) => {
      const updated = prev.filter((file) => file.file !== fileToRemove.file);

      onFileChange(updated.map((item) => item.file));

      return updated;
    });

    URL.revokeObjectURL(fileToRemove.preview);
  };

  useEffect(() => {
    return () => {
      newFiles.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [newFiles]);

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps({
          className: `
            flex min-h-32 cursor-pointer flex-col
            items-center justify-center
            rounded-lg border-2 border-dashed p-6
            transition-colors
            ${
              isDragActive ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }
          `,
        })}
      >
        <input {...getInputProps()} />

        <p className="text-sm font-medium">
          {isDragActive ? "Upuść pliki tutaj..." : "Przeciągnij pliki tutaj"}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          lub kliknij, aby wybrać pliki
        </p>
      </div>

      {existingFiles.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium">Istniejące pliki</h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                {type === "img" ? (
                  <img
                    src={file.fileUrl}
                    alt={file.fileName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col items-center justify-center gap-2 p-4"
                  >
                    <FileText className="h-10 w-10" />

                    <span className="max-w-full truncate text-xs">
                      {file.fileName}
                    </span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => removeExistingFile(file.id)}
                  className="
                    absolute right-2 top-2
                    flex h-7 w-7 items-center justify-center
                    rounded-full bg-black/60 text-white
                    opacity-0 transition-opacity
                    hover:bg-black/80
                    group-hover:opacity-100
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {newFiles.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium">Nowe pliki</h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {newFiles.map((item) => (
              <div
                key={`${item.file.name}-${item.file.lastModified}`}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                {type === "img" ? (
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                    <FileText className="h-10 w-10" />

                    <span className="max-w-full truncate text-xs">
                      {item.file.name}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeNewFile(item)}
                  className="
                    absolute right-2 top-2
                    flex h-7 w-7 items-center justify-center
                    rounded-full bg-black/60 text-white
                    opacity-0 transition-opacity
                    hover:bg-black/80
                    group-hover:opacity-100
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
