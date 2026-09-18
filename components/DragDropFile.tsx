"use client";

import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { type Accept } from "react-dropzone";

type PreviewFile = File & {
  preview: string;
};

export const DragDrop = ({
  onFileChange,
  fileSize,
  type,
}: {
  onFileChange: (file: File[]) => void;
  fileSize: number;
  type: "text" | "img";
}) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [filesToSend, setFiilesToSend] = useState<File[]>([]);
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
    accept: accept,

    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file: File) => {
        setFiilesToSend((prev) => [...prev, file]);

        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });

      setFiles((previous) => [...previous, ...newFiles]);
    },
    maxFiles: 3,
  });

  useEffect(() => {
    if (!filesToSend.length) return;

    onFileChange(filesToSend);
  }, [filesToSend]);

  const removeFile = (fileToRemove: PreviewFile) => {
    setFiles((files) => {
      const newFiles = files.filter((file) => file !== fileToRemove);

      URL.revokeObjectURL(fileToRemove.preview);

      return newFiles;
    });
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <div className="space-y-4 w-full">
      <div
        {...getRootProps({
          className: `
            flex min-h-32 cursor-pointer flex-col items-center justify-center
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
          {isDragActive
            ? "Upuść zdjęcia tutaj..."
            : "Przeciągnij zdjęcia tutaj"}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          lub kliknij, aby wybrać zdjęcia
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.map((file) => (
            <div
              key={`${file.name}-${file.lastModified}`}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
            >
              <img
                src={file.preview}
                alt={file.name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  removeFile(file);
                }}
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

              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-2 pt-6">
                <p className="truncate text-xs text-white">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
