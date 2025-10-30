'use client'

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useAction, useQuery } from 'convex/react';
import { Download, Loader2Icon, LoaderCircle, Play, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Ad = Doc<'ads'>;

export const PreviewAds = () => {

  const ads = useQuery(api.ad.getAds)

  const generateAdVideo = useAction(api.generateAdVideo.generateAdVideo)

  const [loadingId, setLoadingId] = useState('');

  const DownloadImage = async (ad: Ad) => {
    try {
      if (!ad.adImageUrl) {
        throw new Error('No image URL found');
      }

      // Fetch the image
      const response = await fetch(ad.adImageUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      // Get the image blob
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Extract filename from URL or use a default
      const urlPath = new URL(ad.adImageUrl).pathname;
      const filename = urlPath.split('/').pop() || 'downloaded-image.jpg';

      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const GenerateVideo = async (ad: Ad) => {
    setLoadingId(ad._id);

    console.log('Generating video for ad:', ad);

    await generateAdVideo({ adId: ad._id });

    setLoadingId('');
  }

  return (
    <div className='p-5 rounded-2xl border'>
      <h2 className="font-bold text-2xl">Generated Result</h2>

      <div className='grid grid-cols-2 mt-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 h-[90vh] overflow-auto'>
        {ads?.map((ad, index) => (
          <div key={index}>
            {ad?.adImageStorageId ?
              <div>
                <Image src={ad.adImageUrl || ''}
                  alt={ad.adImageStorageId}
                  width={500}
                  height={500}
                  unoptimized
                  className='w-full h-[250px] rounded-lg object-cover'
                />
                <div className='flex justify-between items-center mt-2'>
                  <div className='flex items-center gap-2'>
                    <Button variant={'ghost'} onClick={() => DownloadImage(ad)}> <Download /> </Button>
                    <Link href={ad.adImageUrl || ''} target='_blank'>
                      <Button variant={'ghost'}>View</Button>
                    </Link>
                    {ad?.adVideoStorageId && <Link href={ad.adVideoUrl ?? ''} target='_blank'>
                      <Button variant={'ghost'}><Play /></Button>
                    </Link>}
                  </div>

                  {!ad?.adVideoStorageId && <Button
                    onClick={() => GenerateVideo(ad)}>
                    {ad._id === loadingId ? <LoaderCircle className='animate-spin' /> : <Sparkles />}
                    Animate</Button>}
                </div>
              </div>
              : <div className='flex flex-col items-center justify-center border rounded-xl
                             h-full min-h-[250px]
                            bg-zinc-800'>
                <Loader2Icon className='animate-spin' />
                <h2>Generating...</h2>

              </div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}
