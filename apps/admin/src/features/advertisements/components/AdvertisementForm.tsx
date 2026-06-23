"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { AdvertisementRow } from "../types";
import { 
  createAdvertisementAction, 
  updateAdvertisementAction, 
  getAdvertisementUploadUrlAction,
  deleteAdvertisementImageAction,
  getAdvertisementSlotsAction
} from "../actions";
import { supabase } from "@repo/api/src/supabase/client";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Dropzone } from "@/components/ui/Dropzone";
import { Switch } from "@/components/ui/Switch";
import { motion } from "framer-motion";
import { AdSlot } from "../actions";

const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

interface AdvertisementFormProps {
  initialData?: AdvertisementRow;
}

/**
 * A form for creating or updating advertisements with image upload, date scheduling, and placement slot configuration.
 *
 * @param initialData - Pre-populated form values when editing an existing advertisement
 */
export function AdvertisementForm({ initialData }: AdvertisementFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image_url || "");

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > IMAGE_MAX_BYTES) {
      setError("File exceeds 5 MB limit.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const ext = file.name.split('.').pop() || "jpg";
    const res = await getAdvertisementUploadUrlAction(ext);
    
    if (res.success && res.signedUrl && res.token && res.path) {
      const { error: uploadError } = await supabase.storage
        .from("advertisements")
        .uploadToSignedUrl(res.path, res.token, file);

      if (uploadError) {
        const msg = uploadError.message || "Failed to upload file to storage";
        setError(msg);
        toast.error(msg);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from("advertisements")
          .getPublicUrl(res.path);

        if (imageUrl && imageUrl !== initialData?.image_url) {
          await deleteAdvertisementImageAction(imageUrl);
        }
        setImageUrl(publicUrl);
      }
    } else {
      const msg = res.error || "Failed to initiate file upload";
      setError(msg);
      toast.error(msg);
    }

    setIsUploading(false);
  };

  const handleDeleteImage = async () => {
    if (imageUrl && imageUrl !== initialData?.image_url) {
      setIsUploading(true);
      await deleteAdvertisementImageAction(imageUrl);
      setIsUploading(false);
    }
    setImageUrl("");
  };
  
  const formatDateForInput = (isoString?: string | null) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  const getMinEndDate = (start: string) => {
    if (!start) return undefined;
    try {
      const d = new Date(start);
      d.setDate(d.getDate() + 1);
      return d.toISOString().split('T')[0];
    } catch {
      return undefined;
    }
  };

  const [startDate, setStartDate] = useState<string>(formatDateForInput(initialData?.start_date));
  const [endDate, setEndDate] = useState<string>(formatDateForInput(initialData?.end_date));
  
  const [slots, setSlots] = useState<AdSlot[]>([]);
  const [occupiedIds, setOccupiedIds] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(
    initialData?.advertisement_placements?.map(p => p.slot_identifier) || []
  );

  const initialOrientation = selectedSlots.some(s => s.startsWith("fixed:vertical_")) ? "vertical" : "horizontal";
  const [orientationFilter, setOrientationFilter] = useState<"horizontal" | "vertical">(initialOrientation);

  const handleOrientationChange = (val: "horizontal" | "vertical") => {
    if (val !== orientationFilter) {
      setOrientationFilter(val);
      setSelectedSlots([]);
    }
  };

  const filteredSlots = slots.filter(s => {
    if (orientationFilter === "vertical") {
      return s.id.startsWith("fixed:vertical_");
    } else {
      return !s.id.startsWith("fixed:vertical_");
    }
  });

  const availableFilteredSlots = filteredSlots.filter(s => !occupiedIds.includes(s.id));
  const isAllSelected = availableFilteredSlots.length > 0 && availableFilteredSlots.every(s => selectedSlots.includes(s.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      const visibleIds = filteredSlots.map(s => s.id);
      setSelectedSlots(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      const visibleUnoccupiedIds = availableFilteredSlots.map(s => s.id);
      setSelectedSlots(prev => {
        const newSet = new Set([...prev, ...visibleUnoccupiedIds]);
        return Array.from(newSet);
      });
    }
  };

  useEffect(() => {
    async function fetchSlots() {
      const res = await getAdvertisementSlotsAction(startDate, endDate, initialData?.id);
      if (res.success && res.slots) {
        setSlots(res.slots);
        setOccupiedIds(res.occupiedIds || []);
        
        // If currently selected slots became occupied, unselect them?
        // Let's just rely on the UI to show them disabled and prevent submission.
      }
    }
    fetchSlots();
  }, [startDate, endDate, initialData?.id]);

  const toggleSlot = (id: string) => {
    setSelectedSlots(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl) {
      setError("Please upload an advertisement image");
      return;
    }
    
    // Check if any selected slots are occupied
    const invalidSlots = selectedSlots.filter(s => occupiedIds.includes(s));
    if (invalidSlots.length > 0) {
      setError("Some of the selected placement slots are occupied during these dates.");
      return;
    }
    
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("image_url", imageUrl);
    
    selectedSlots.forEach(slot => {
      formData.append("slot_identifiers", slot);
    });

    const startDateStr = formData.get("start_date") as string;
    const endDateStr = formData.get("end_date") as string;

    if (!startDateStr || !endDateStr) {
      setError("Start date and End date are required.");
      return;
    }

    if (new Date(endDateStr) <= new Date(startDateStr)) {
      setError("End date must be after Start date.");
      return;
    }

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateAdvertisementAction(initialData.id, formData);
      } else {
        result = await createAdvertisementAction(formData);
      }

      if (result.success) {
        if (result.warning) {
          toast.warning(result.warning);
        } else {
          toast.success(initialData ? "Advertisement updated." : "Advertisement created.");
        }
        router.push("/advertisements");
        router.refresh();
      } else {
        const msg = result.error || "Something went wrong";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <>
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6 pb-12 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm max-w-4xl font-medium">
            {error}
          </div>
        )}

        <fieldset disabled={isPending || isUploading} className="group-disabled:opacity-70 transition-opacity space-y-6">
          
          <FormSection 
            title="Advertisement Details" 
            description="Basic info about the advertisement and the advertiser."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Advertisement Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  required
                  defaultValue={initialData?.title}
                  placeholder="e.g. Diwali Special Sale Banner"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="advertiser_name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Advertiser Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="advertiser_name"
                  name="advertiser_name"
                  required
                  defaultValue={initialData?.advertiser_name}
                  placeholder="e.g. ABC Electronics"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="advertiser_phone" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Advertiser Phone
                </label>
                <Input
                  type="tel"
                  id="advertiser_phone"
                  name="advertiser_phone"
                  defaultValue={initialData?.advertiser_phone || ""}
                  placeholder="e.g. +91 9876543210"
                />
              </div>
            </div>
          </FormSection>

          <FormSection 
            title="Visual & Link" 
            description="Upload the creative and set the click destination."
          >
            <div className="flex flex-col gap-1.5 mb-6">
              <label htmlFor="redirect_url" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Redirect URL
              </label>
              <Input
                type="url"
                id="redirect_url"
                name="redirect_url"
                defaultValue={initialData?.redirect_url || ""}
                placeholder="https://example.com (Optional)"
              />
              <p className="text-xs text-slate-500">Must start with http:// or https://. If empty, the ad will not be clickable.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Advertisement Image <span className="text-red-500">*</span>
              </label>
              {imageUrl ? (
                <div className="flex flex-col gap-3 p-4 bg-surface-container-low border border-gray-200 rounded-lg">
                  <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Advertisement preview" className="object-contain w-full h-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={handleDeleteImage}
                      disabled={isUploading}
                    >
                      Remove & Upload New
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full relative">
                  {isUploading && (
                    <div className="absolute inset-0 bg-surface/50 z-10 flex items-center justify-center rounded-xl">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </div>
                    </div>
                  )}
                  <Dropzone
                    label="Click or drag to upload Image"
                    helperText="JPG, PNG, WEBP · Max 5 MB"
                    accept="image/*"
                    disabled={isUploading}
                    onFileSelect={handleFileUpload}
                  />
                </div>
              )}
            </div>
          </FormSection>

          <FormSection
            title="Schedule & Status"
            description="Control when this advertisement is active."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="start_date" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  id="start_date"
                  name="start_date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="end_date" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  id="end_date"
                  name="end_date"
                  required
                  min={getMinEndDate(startDate)}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Ad Orientation & Placement Slots <span className="text-red-500">*</span>
                </label>
                
                <div className="flex bg-slate-100 p-1 rounded-lg w-fit mb-3 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => handleOrientationChange("horizontal")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      orientationFilter === "horizontal" 
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" 
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    Horizontal (Topics & Regions)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOrientationChange("vertical")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      orientationFilter === "vertical" 
                        ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" 
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    Vertical (Sidebars)
                  </button>
                </div>

                {filteredSlots.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      disabled={availableFilteredSlots.length === 0}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                      Select All {orientationFilter === "horizontal" ? "Topics & Regions" : "Vertical Slots"}
                    </label>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredSlots.length === 0 && slots.length > 0 && (
                     <div className="col-span-full text-sm text-gray-500">No slots available for this orientation.</div>
                  )}
                  {slots.length === 0 && (
                    <div className="col-span-full text-sm text-gray-500">Loading available slots...</div>
                  )}
                  {filteredSlots.map(slot => {
                    const isOccupied = occupiedIds.includes(slot.id);
                    const isSelected = selectedSlots.includes(slot.id);
                    return (
                      <div 
                        key={slot.id} 
                        onClick={() => !isOccupied && toggleSlot(slot.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-sm transition-colors cursor-pointer ${
                          isOccupied 
                            ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700' 
                            : isSelected 
                              ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700' 
                              : 'bg-white border-gray-200 hover:border-blue-300 dark:bg-surface dark:border-gray-700 dark:hover:border-blue-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isOccupied}
                          onChange={() => {}} // handled by div click
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className={`font-medium ${isOccupied ? 'text-gray-500 dark:text-gray-400' : 'text-slate-700 dark:text-slate-200'} truncate`}>
                            {slot.name}
                          </span>
                          {isOccupied && (
                            <span className="text-xs text-red-500 mt-0.5">Occupied</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Select where this advertisement should appear. Slots already booked during the selected dates are disabled.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 md:col-span-2">
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={initialData?.is_active ?? true}
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Active (Manually enable or disable)
                </label>
              </div>
            </div>
          </FormSection>

        </fieldset>

        <div className="mt-6 flex items-center justify-end gap-x-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.push("/advertisements")}
            disabled={isPending || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isPending}
            disabled={isUploading}
          >
            {initialData ? "Update Advertisement" : "Create Advertisement"}
          </Button>
        </div>
      </motion.form>
    </>
  );
}
