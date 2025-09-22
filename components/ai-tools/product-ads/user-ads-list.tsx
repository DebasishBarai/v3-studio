"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react'
import { Play } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

export const UsersAdsList = () => {

  const ads = useQuery(api.ad.getAds)

  const user = useQuery(api.user.getUser)

  return (
    <div>
      <h2 className='font-bold text-2xl mb-2 mt-5'>My Ads</h2>

      {ads?.length == 0 &&
        <div className='p-5 border-dashed border-2 rounded-2xl flex flex-col items-center justify-center mt-6 gap-3'>
          <Image src={'/products/signboard.png'} alt='empty'
            width={200}
            height={200}
            className='w-20'
          />
          <h2 className='text-xl'>You don&apos;t have any ads created</h2>
          <Link href={user ? '/creative-ai-tools/product-images' : '/login'}>
            <Button>Create New Ads</Button>
          </Link>
        </div>
      }

      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
        {ads && ads.map((ad, index) => (
          <div key={index}>
            <Image src={ad.adImage} alt={ad.adImage}
              width={'400'}
              height={400}
              className='w-full h-[250px] lg:h-[370px] object-cover rounded-xl'
            />
            <div className='flex items-center mt-2 justify-between'>
              <Link href={ad.adImage} target='_blank' >
                <Button className='' variant={'outline'}>View</Button>
              </Link>

              {ad?.adVideo &&
                <Link href={ad.adVideo} target='_blank' >
                  <Button><Play /></Button></Link>}
            </div>
          </div>
        ))}
      </div>


    </div>
  )
}

