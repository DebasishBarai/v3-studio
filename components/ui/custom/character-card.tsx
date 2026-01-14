'use client'

import Image from 'next/image'
import Link from 'next/link'
import { RotateCcw, Trash2, WandSparkles, Pencil, ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/ui/custom/custom-button'
import { EditCharacterDialog } from '@/components/ui/custom/edit-character-dialog'
import { ModifyCharacterDialog } from './modify-character-dialog'
import { useState } from 'react'

export const CharacterCard = ({
  index,
  aspectRatio,
  character,
  removeCharacter,
  generateCharacterImage,
  updateNestedField,
  generatingCharacter,
  modifyingCharacter,
}: any) => {
  const [open, setOpen] = useState(false)
  const [modifyOpen, setModifyOpen] = useState(false)

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white">Character {index + 1}</h3>
        <div className="flex gap-2">
          <CustomButton
            icon={Pencil}
            tooltip="Edit Character"
            className="text-blue-400 hover:text-blue-500"
            onClick={() => setOpen(true)}
          />
          <CustomButton
            icon={Trash2}
            tooltip="Remove Character"
            className="text-red-400 hover:text-red-500"
            onClick={() => removeCharacter(index)}
          />
        </div>
      </div>

      {character.imageUrl ? (
        <div className={cn('w-full', aspectRatio === '16:9' ? 'aspect-video' : 'aspect-9/16')}>
          <Image
            src={character.imageUrl}
            alt={character.name}
            width={500}
            height={500}
            unoptimized
            className="w-full rounded-lg object-cover"
          />
          <div className="flex justify-between items-center mt-3">
            <Link href={character.imageUrl} target="_blank">
              <Button variant="ghost">View</Button>
            </Link>
            <div className="flex gap-2">
              <Button
                disabled={generatingCharacter === index}
                onClick={() =>
                  generateCharacterImage({
                    index,
                    prompt: character.imagePrompt,
                  })
                }
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all',
                  {
                    'bg-blue-600 hover:bg-blue-700 cursor-pointer': generatingCharacter !== index,
                    'bg-blue-600/60 opacity-60 cursor-not-allowed': generatingCharacter === index,
                  }
                )}
              >
                <RotateCcw className="w-4 h-4" />
                <span className='hidden md:inline'>{generatingCharacter === index ? 'Re-generating...' : 'Re-generate'}</span>
              </Button>

              <Button
                disabled={
                  generatingCharacter === index ||
                  modifyingCharacter === index ||
                  !character.imageStorageId
                }
                onClick={() =>
                  setModifyOpen(true)
                  /*
                  generateCharacterImage({
                    index,
                    prompt: modifyPrompts[index] || '',
                    baseImageId: character.imageStorageId,
                  })
                  */
                }
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all',
                  {
                    'bg-purple-600 hover:bg-purple-700 cursor-pointer':
                      !(
                        generatingCharacter === index ||
                        modifyingCharacter === index ||
                        !character.imageStorageId
                      ),
                    'bg-purple-600/60 opacity-60 cursor-not-allowed':
                      generatingCharacter === index ||
                      modifyingCharacter === index ||
                      !character.imageStorageId,
                  }
                )}
              >
                <WandSparkles className="w-4 h-4" />
                <span className='hidden md:inline'>{generatingCharacter === index ? 'Modifying...' : 'Modify'}</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={cn("w-full flex flex-col items-center justify-center text-muted-foreground", aspectRatio === '16:9' ? 'aspect-video' : 'aspect-9/16')}>
            <ImageOff className="w-12 h-12 mb-1 opacity-70" />
            <span className="text-sm">No image yet</span>
          </div>
          <Button
            disabled={generatingCharacter === index || !character.name.trim() || !character.imagePrompt.trim()}
            onClick={() =>
              generateCharacterImage({
                index,
                prompt: character.imagePrompt,
              })
            }
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white transition-all mt-4',
              {
                'bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 hover:shadow-lg cursor-pointer':
                  !(generatingCharacter === index || !character.name.trim() || !character.imagePrompt.trim()),
                'bg-gradient-to-r from-pink-400 to-purple-400 opacity-60 cursor-not-allowed':
                  generatingCharacter === index || !character.name.trim() || !character.imagePrompt.trim(),
              }
            )}
          >
            {generatingCharacter === index ? 'Generating...' : 'Generate Image'}
          </Button>
        </>
      )}

      <EditCharacterDialog
        open={open}
        setOpen={setOpen}
        index={index}
        character={character}
        updateNestedField={updateNestedField}
      />
      <ModifyCharacterDialog
        open={modifyOpen}
        setOpen={setModifyOpen}
        index={index}
        character={character}
        generateCharacterImage={generateCharacterImage}
        modifyingCharacter={modifyingCharacter === index}
      />
    </div>
  )
}

