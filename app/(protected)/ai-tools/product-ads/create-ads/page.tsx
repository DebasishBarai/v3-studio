"use client"

import { useState } from 'react'
import { FormInput } from '@/components/ai-tools/product-ads/form-input'
import { PreviewAds } from '@/components/ai-tools/product-ads/preview-ads'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { toast } from 'sonner'

// Updated FormData structure - removed file, added base64Image
type FormData = {
  product: string | File,
  description?: string,
  resolution: string,
  avatarId?: string,
}

export default function CreateAdsPage() {
  const [formData, setFormData] = useState<FormData>();
  const [loading, setLoading] = useState(false);

  const createAd = useAction(api.generateAdImage.createAd)

  const generateProductImageUrl = useMutation(api.ad.generateProductImageUrl)

  // Updated handler to process file uploads and convert to base64
  const onHandleInputChange = async (field: string, value: string) => {
    console.log('on handle input change called')
    console.log({ formData })
    // Handle other form fields normally
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  }

  const OnGenerate = async () => {
    // Updated validation: check for base64Image OR imageUrl
    if (!formData?.product) {
      alert('Please upload a Product Image');
      return;
    }

    setLoading(true);

    // const productId = formData.productId as Id<'_storage'>
    const avatarId = formData.avatarId as Id<'_storage'>;

    let productId: Id<'_storage'>;

    if (formData?.product instanceof File) {
      const file = formData?.product as File;
      const productUrl = await generateProductImageUrl();

      const result = await fetch(productUrl, {
        method: "POST",
        headers: { "Content-Type": file!.type },
        body: file,
      });

      const { storageId } = await result.json();
      productId = storageId;
    } else {
      productId = formData?.product as Id<'_storage'>;
    }

    await createAd({
      productId: productId,
      description: formData?.description,
      resolution: formData?.resolution || '1024x1024',
      avatarId: avatarId,
    });

    toast.success('Ad created successfully');

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
