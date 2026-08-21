import { ImagePlus, Loader2, Save, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { carApi, type CarPayload } from "../../api/carApi";
import { uploadApi } from "../../api/uploadApi";
import type { CarStatus } from "../../api/types";
import { DashboardLayout, ErrorState } from "../components/dashboard/DashboardLayout";

const emptyForm: CarPayload = { name: "", brand: "", year: new Date().getFullYear(), description: "", images: [], location: "", fuelType: "Petrol", transmission: "Manual", ownerName: "", ownerPhone: "", ownerEmail: "", status: "available" };
const fields: Array<[keyof CarPayload, string, string]> = [["name", "Car Name", "text"], ["brand", "Brand", "text"], ["year", "Year", "number"], ["location", "Location", "text"], ["ownerName", "Owner Name", "text"], ["ownerPhone", "Owner Phone", "tel"], ["ownerEmail", "Owner Email", "email"]];
export function CarFormPage({ id }: { id?: string }) {
  const editing = Boolean(id), inputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<CarPayload>(emptyForm), [loading, setLoading] = useState(editing), [submitting, setSubmitting] = useState(false), [uploading, setUploading] = useState(false), [error, setError] = useState("");
  const uploadedFiles = useRef(new Set<string>());
  useEffect(() => { if (!id) return; carApi.getCar(id).then((car) => setForm(car)).catch((e: Error) => setError(e.message)).finally(() => setLoading(false)); }, [id]);
  function setField(name: keyof CarPayload, value: string) { setForm((current) => ({ ...current, [name]: name === "year" ? Number(value) : value })); }
  const [uploadStatus, setUploadStatus] = useState("");
  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const candidates = Array.from(files);
    if (candidates.length > 12 - form.images.length) return setError(`You can add ${12 - form.images.length} more image(s).`);
    if (candidates.some((file) => (file.type && !file.type.startsWith("image/") && !/\.(jpe?g|png|webp|gif|avif|heic|heif|bmp|tiff)$/i.test(file.name)) || file.size > 50 * 1024 * 1024)) return setError("Use image files no larger than 50 MB each.");
    const selected = candidates.filter((file) => !uploadedFiles.current.has(`${file.name}:${file.size}:${file.lastModified}`));
    if (!selected.length) return setError("Those images have already been selected.");
    setUploading(true); setError("");
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < selected.length; i++) {
        const file = selected[i];
        setUploadStatus(`Uploading image ${i + 1} of ${selected.length}...`);
        const result = await uploadApi.uploadImage(file);
        uploadedFiles.current.add(`${file.name}:${file.size}:${file.lastModified}`);
        uploadedUrls.push(result.url);
      }
      setForm((current) => ({ ...current, images: [...new Set([...current.images, ...uploadedUrls])] }));
    } catch (e) { setError((e as Error).message || "Image upload failed. Please try again."); }
    finally { setUploading(false); setUploadStatus(""); if (inputRef.current) inputRef.current.value = ""; }
  }
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!form.images.length) return setError("Upload at least one image before saving."); setSubmitting(true); setError(""); try { if (editing && id) await carApi.updateCar(id, form); else await carApi.createCar(form); window.location.href = "/dashboard"; } catch (e) { setError((e as Error).message); setSubmitting(false); } }
  return <DashboardLayout eyebrow={editing ? "EDIT LISTING" : "NEW LISTING"} title={editing ? "Edit car" : "Add a car"}>{loading ? <div className="bg-white p-10 text-center text-sm text-[#64748B]">Loading listing...</div> : <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_340px]"><div className="border border-[#DDE4EF] bg-white p-5 sm:p-7"><h2 className="text-xl font-extrabold">Car information</h2><div className="mt-6 grid gap-5 sm:grid-cols-2">{fields.map(([name, label, type]) => <label key={name} className="text-xs font-bold">{label} <span className="text-[#B42318] font-bold">*</span><input required value={String(form[name] ?? "")} onChange={(e) => setField(name, e.target.value)} type={type} min={type === "number" ? 1900 : undefined} className="mt-1 w-full border-b border-[#CBD5E1] px-1 py-3 text-sm font-normal outline-none focus:border-[#F9B900]" /></label>)}<label className="text-xs font-bold">Fuel type <span className="text-[#B42318] font-bold">*</span><select value={form.fuelType} onChange={(e) => setField("fuelType", e.target.value)} className="mt-1 w-full border-b border-[#CBD5E1] px-1 py-3 text-sm font-normal outline-none focus:border-[#F9B900]"><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></select></label><label className="text-xs font-bold">Transmission <span className="text-[#B42318] font-bold">*</span><select value={form.transmission} onChange={(e) => setField("transmission", e.target.value)} className="mt-1 w-full border-b border-[#CBD5E1] px-1 py-3 text-sm font-normal outline-none focus:border-[#F9B900]"><option>Manual</option><option>Automatic</option><option>AMT</option></select></label><label className="text-xs font-bold sm:col-span-2">Description <span className="text-[#B42318] font-bold">*</span><textarea required value={form.description} onChange={(e) => setField("description", e.target.value)} className="mt-1 h-32 w-full border border-[#CBD5E1] p-3 text-sm font-normal outline-none focus:border-[#F9B900]" /></label>{editing && <label className="text-xs font-bold">Status<select value={form.status} onChange={(e) => setField("status", e.target.value as CarStatus)} className="mt-1 w-full border-b border-[#CBD5E1] px-1 py-3 text-sm font-normal outline-none focus:border-[#F9B900]"><option value="available">Available</option><option value="sold">Sold</option><option value="inactive">Inactive</option></select></label>}</div></div><aside className="h-fit border border-[#DDE4EF] bg-white p-5 sm:p-7"><div className="flex items-center gap-2"><ImagePlus size={18} className="text-[#9a7100]" /><h2 className="font-extrabold">Car images <span className="text-[#B42318] font-bold">*</span></h2></div><p className="mt-2 text-xs leading-5 text-[#64748B]">Upload up to 12 images (50 MB each). They are securely stored in Cloudinary.</p><input ref={inputRef} className="hidden" type="file" accept="image/*,.heic,.heif,.jpg,.jpeg,.png,.webp,.avif" multiple onChange={(e) => void addFiles(e.target.files)} /><button type="button" disabled={uploading || form.images.length >= 12} onClick={() => inputRef.current?.click()} className="mt-5 flex w-full items-center justify-center gap-2 border border-dashed border-[#9a7100] bg-[#FFFDF3] px-4 py-3 text-xs font-bold text-[#805F00] disabled:opacity-50">{uploading ? <><Loader2 size={15} className="animate-spin" /> {uploadStatus || "Uploading images..."}</> : <><Upload size={15} /> Select images</>}</button><div className="mt-4 grid gap-3">{form.images.map((image, index) => <div key={image} className="flex items-center gap-2 border border-[#E8EDF5] p-2"><img src={image} alt={`Car preview ${index + 1}`} className="h-14 w-16 object-cover" /><span className="min-w-0 flex-1 text-xs">Image {index + 1}</span><button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== index) })} aria-label="Remove image" className="p-1 text-[#B42318]"><Trash2 size={14} /></button></div>)}</div><button disabled={submitting || uploading} className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-[#071D49] px-4 py-3.5 text-sm font-bold text-white disabled:opacity-60"><Save size={16} />{submitting ? "Saving..." : editing ? "Save changes" : "Create listing"}</button>{error && <div className="mt-4"><ErrorState message={error} /></div>}</aside></form>}</DashboardLayout>;
}
