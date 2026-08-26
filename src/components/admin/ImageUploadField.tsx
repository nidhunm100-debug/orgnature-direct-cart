import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/admin";

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const id = `upload-${folder}-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Please choose an image under 10MB.");
      return;
    }
    setBusy(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1.5 flex items-start gap-3">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-ivory">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-contain p-1.5" />
          ) : (
            <span className="text-[0.6rem] text-muted-foreground">No image</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <Input
            id={id}
            ref={inputRef}
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(event) => void handleFile(event.target.files?.[0])}
            className="h-11"
          />
          <div className="flex items-center gap-2">
            {busy && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…
              </span>
            )}
            {!busy && !value && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Upload className="h-3.5 w-3.5" /> JPG or PNG, up to 10MB
              </span>
            )}
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" /> Remove image
              </button>
            )}
          </div>
          <Input
            value={value ?? ""}
            placeholder="…or paste an image URL"
            onChange={(event) => onChange(event.target.value || null)}
            className="h-10 text-xs"
          />
        </div>
      </div>
      <Button type="button" className="hidden" aria-hidden="true" tabIndex={-1} />
    </div>
  );
}
