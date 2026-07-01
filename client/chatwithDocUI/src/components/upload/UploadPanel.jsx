import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "../ui/Button";
import { documentApi } from "../../api/documentApi";
import { formatBytes } from "../../utils/format";

const ACCEPTED_TYPES = [
  { label: "PDF", icon: FileText, ext: ".pdf" },
];

const ACCEPT_ATTR = ".pdf";

export default function UploadPanel({ onUploaded }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);

  const resetFileState = () => {
    setFile(null);
    setProgress(0);
    setStatus("idle");
    setErrorMessage("");
    setResult(null);
  };

  const handleFiles = useCallback((fileList) => {
    const selected = fileList?.[0];
    if (!selected) return;
    setFile(selected);
    setStatus("idle");
    setErrorMessage("");
    setResult(null);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const startUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setProgress(0);
    try {
      const data = await documentApi.uploadFile(file, (evt) => {
        if (evt.total) {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      });
      setStatus("success");
      setResult(data);
      toast.success("Document uploaded and indexed");
      onUploaded?.(data);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err?.response?.data?.detail || "Upload failed. Check the file and try again."
      );
    }
  };


  return (
    <div className="flex flex-col gap-5">
      {/* Drag & drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-150 ${
          isDragging
            ? "border-[var(--color-accent-500)] bg-[var(--color-accent-50)]"
            : "border-[var(--color-border-strong)] bg-[var(--color-surface)]"
        }`}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[var(--shadow-xs)]">
          <UploadCloud className="h-5 w-5 text-[var(--color-accent-600)]" />
        </div>
        <p className="text-sm font-medium text-[var(--color-ink-900)]">
          Drag and drop a file, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-medium text-[var(--color-accent-600)] hover:underline"
          >
            browse
          </button>
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-500)]">PDF only · up to 25MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {ACCEPTED_TYPES.map(({ label, icon: Icon, ext }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs text-[var(--color-ink-500)]"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              <span className="text-[var(--color-ink-400)]">{ext}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Selected file / progress / result */}
      {file && (
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-alt)]">
              <FileText className="h-5 w-5 text-[var(--color-ink-700)]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">{file.name}</p>
              <p className="text-xs text-[var(--color-ink-500)]">{formatBytes(file.size)}</p>
            </div>
            {status !== "uploading" && (
              <button
                onClick={resetFileState}
                className="rounded-md p-1.5 text-[var(--color-ink-400)] hover:bg-[var(--color-surface-alt)]"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {status === "uploading" && (
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-alt)]">
                <div
                  className="h-full rounded-full bg-[var(--color-accent-600)] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-[var(--color-ink-500)]">Uploading… {progress}%</p>
            </div>
          )}

          {status === "success" && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-[var(--color-emerald-50)] p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-emerald-600)]" />
              <div className="text-sm text-[var(--color-emerald-600)]">
                <p className="font-medium">Indexed successfully</p>
                <p className="text-xs opacity-80">
                  {result?.chunks ? `${result.chunks} chunks created. ` : ""}
                  Ready for questions.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-[var(--color-rose-50)] p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-rose-600)]" />
              <div className="text-sm text-[var(--color-rose-600)]">
                <p className="font-medium">Upload failed</p>
                <p className="text-xs opacity-80">{errorMessage}</p>
              </div>
            </div>
          )}

          {status !== "success" && (
            <Button
              variant="accent"
              size="sm"
              className="mt-4 w-full"
              isLoading={status === "uploading"}
              onClick={startUpload}
            >
              {status === "error" ? "Retry upload" : "Upload & index"}
            </Button>
          )}
        </div>
      )}

    </div>
  );
}
