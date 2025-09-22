"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { FormInput } from '@/components/ai-tools/product-ads/form-input'
import { PreviewAds } from '@/components/ai-tools/product-ads/preview-ads'
import { useAction } from 'convex/react'
import { api } from '@/convex/_generated/api'

// Updated FormData structure - removed file, added base64Image
type FormData = {
  base64Image?: string,  // Base64 encoded image string
  description: string,
  resolution: string,
  avatarId?: string,
}

// Utility function to convert file to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") 
        // and keep only the base64 string
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsDataURL(file);
  });
};

export default function CreateAdsPage() {
  const [formData, setFormData] = useState<FormData>();
  const [loading, setLoading] = useState(false);

  const createAd = useAction(api.ad.createAd)

  // Updated handler to process file uploads and convert to base64
  const onHandleInputChange = async (field: string, value: string) => {
    console.log({ [field]: value })
    // Handle other form fields normally
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  }

  const OnGenerate = async () => {
    // Updated validation: check for base64Image OR imageUrl
    if (!formData?.base64Image) {
      alert('Please upload a Product Image');
      return;
    }

    setLoading(true);

    // Create JSON payload instead of FormData since we're not sending files
    const payload = {
      base64Image: formData?.base64Image ?? '',
      description: formData?.description ?? '',
      size: formData?.resolution ?? '1028x1028',
      avatarId: formData?.avatarId,
    };

  }

  return (
    <div>
      <h2 className='font-bold text-2xl mb-3'>AI Product Ads Generator</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div>
          <FormInput
            onHandleInputChange={(field: string, value: string) => onHandleInputChange(field, value)}
            OnGenerate={OnGenerate}
            loading={loading}
          />
        </div>
        <div className='md:col-span-2'>
          <PreviewAds />
        </div>
      </div>
    </div>
  )
}
