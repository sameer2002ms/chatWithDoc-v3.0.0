import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { documentApi } from "../../api/documentApi";
import { formatBytes } from "../../utils/format";

const ACCEPTED_TYPES = [
  { label: "PDF", icon: FileText, ext: ".pdf" },
];


const ACCEPT_ATTR = ".pdf";

const STATUS_TONE = {
  idle: "neutral",
  uploading: "accent",
  success: "success",
  error: "error",
};

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
    <Card className="animate-fade-in overflow-hidden bg-gradient-to-br from-[rgba(246,36,64,0.08)] via-[rgba(246,36,64,0.03)] to-white shadow-[var(--shadow-lg)]">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between rounded-3xl bg-white/80 px-4 py-3 shadow-[var(--shadow-xs)] backdrop-blur-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-700)]">PDF upload</p>
            <p className="text-sm text-[var(--color-ink-700)]">Fast indexing for your knowledge base.</p>
          </div>
          <span className="rounded-full bg-[var(--color-accent-50)] px-3 py-1 text-xs font-medium text-[var(--color-accent-700)]">
            PDF only
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`group relative flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-[28px] border-2 border-dashed px-8 py-12 text-center transition-all duration-200 ${
            isDragging
              ? "border-[var(--color-accent-500)] bg-[var(--color-accent-50)] shadow-[0_0_0_4px_rgba(246,36,64,0.12)]"
              : "border-[var(--color-border-strong)] bg-[var(--color-surface)] hover:border-[var(--color-accent-500)] hover:bg-[var(--color-surface-alt)]"
          }`}
        >
          <div className="pointer-events-none absolute inset-x-10 top-6 h-24 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(246,36,64,0.18),transparent_55%)] opacity-80 blur-2xl" />
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--color-accent-100)] to-[var(--color-accent-50)] shadow-[var(--shadow-md)] transition-transform duration-300 group-hover:-translate-y-1">
            <UploadCloud className="h-7 w-7 text-[var(--color-accent-700)]" />
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-base font-semibold text-[var(--color-ink-900)]">Drag & drop your PDF here</p>
            <p className="text-sm text-[var(--color-ink-500)]">
              Or select a file to upload and index instantly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="relative z-10 inline-flex items-center justify-center rounded-full border border-[var(--color-accent-100)] bg-white px-5 py-2 text-sm font-semibold text-[var(--color-accent-700)] shadow-[var(--shadow-xs)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-accent-500)]"
          >
            Browse PDF
          </button>

          <p className="relative z-10 text-xs text-[var(--color-ink-500)]">Accepted format: PDF · Max 1MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_ATTR}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="relative z-10 mt-3 flex flex-wrap items-center justify-center gap-2">
            {ACCEPTED_TYPES.map(({ label, icon: Icon, ext }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/90 px-3 py-1.5 text-xs font-medium text-[var(--color-ink-500)] shadow-[var(--shadow-xs)]"
              >
                <Icon className="h-3.5 w-3.5 text-[var(--color-accent-600)]" />
                {label}
                <span className="text-[var(--color-ink-400)]">{ext}</span>
              </span>
            ))}
          </div>
        </div>

        {file && (
          <Card className="space-y-4 bg-white shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)]">
                <FileText className="h-5 w-5 text-[var(--color-accent-700)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--color-ink-900)]">{file.name}</p>
                <p className="text-xs text-[var(--color-ink-500)]">{formatBytes(file.size)}</p>
              </div>
              <button
                onClick={resetFileState}
                className="rounded-full p-2 text-[var(--color-ink-400)] transition-colors duration-150 hover:bg-[var(--color-surface-alt)]"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {status === "uploading" && (
              <div className="space-y-2">
                <div className="overflow-hidden rounded-full bg-[var(--color-surface-alt)]">
                  <div
                    className="h-2 rounded-full bg-[var(--color-accent-600)] transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-[var(--color-ink-600)]">Uploading {progress}%</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-start gap-3 rounded-3xl bg-[var(--color-emerald-50)] p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--color-emerald-600)]" />
                <div>
                  <p className="font-semibold text-[var(--color-emerald-700)]">Indexed successfully</p>
                  <p className="text-xs text-[var(--color-emerald-700)] opacity-90">
                    {result?.chunks ? `${result.chunks} chunks created.` : "Ready for questions."}
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-start gap-3 rounded-3xl bg-[var(--color-rose-50)] p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 text-[var(--color-rose-600)]" />
                <div>
                  <p className="font-semibold text-[var(--color-rose-600)]">Upload failed</p>
                  <p className="text-xs text-[var(--color-rose-600)] opacity-90">{errorMessage}</p>
                </div>
              </div>
            )}

            {status !== "success" && (
              <Button
                variant="accent"
                size="sm"
                className="w-full"
                isLoading={status === "uploading"}
                onClick={startUpload}
              >
                {status === "error" ? "Retry upload" : "Upload & index"}
              </Button>
            )}
          </Card>
        )}
      </div>
    </Card>
  );
}
