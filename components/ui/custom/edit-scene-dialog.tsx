'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface EditSceneDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  index: number
  scene: any
  updateNestedField: (path: string, value: any) => void
  availableCharacters: string[]
}

export const EditSceneDialog = ({
  open,
  setOpen,
  index,
  scene,
  updateNestedField,
  availableCharacters,
}: EditSceneDialogProps) => {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const charactersInScene: string[] = scene.charactersInTheScene || []

  const removeCharacter = (name: string) => {
    updateNestedField(
      `scenes[${index}].charactersInTheScene`,
      charactersInScene.filter((c: string) => c !== name)
    )
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-zinc-900 border border-zinc-800">
        <DialogHeader>
          <DialogTitle>Edit Scene</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* Image Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image Prompt</label>
            <textarea
              value={scene.imagePrompt}
              onChange={(e) =>
                updateNestedField(`scenes[${index}].imagePrompt`, e.target.value)
              }
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              placeholder="Describe what should appear in the scene image..."
            />
          </div>

          {/* Video Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video Prompt</label>
            <textarea
              value={scene.videoPrompt}
              onChange={(e) =>
                updateNestedField(`scenes[${index}].videoPrompt`, e.target.value)
              }
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Describe the scene’s video version or motion details..."
            />
          </div>

          {/* Narration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Narration</label>
            <textarea
              value={scene.narration}
              onChange={(e) =>
                updateNestedField(`scenes[${index}].narration`, e.target.value)
              }
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Describe the scene's voice over narration..."
            />
          </div>

          {/* Characters In Scene */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Characters in this Scene
            </label>
            <div className="flex flex-wrap gap-2 p-3 min-h-12 bg-zinc-900 border border-zinc-800 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
              {charactersInScene.map((char: string) => (
                <span
                  key={char}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm"
                >
                  {char}
                  <button
                    type="button"
                    onClick={() => removeCharacter(char)}
                    className="ml-1 hover:bg-purple-600/50 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    const name = inputValue.trim()
                    if (!name) return

                    if (!availableCharacters.includes(name)) {
                      setError(`Character "${name}" not found in character list`)
                      return
                    }

                    if (!charactersInScene.includes(name)) {
                      updateNestedField(`scenes[${index}].charactersInTheScene`, [...charactersInScene, name])
                      setInputValue('')
                    }
                  }
                }}
                onBlur={() => {
                  const name = inputValue.trim()
                  if (name && availableCharacters.includes(name) && !charactersInScene.includes(name)) {
                    updateNestedField(`scenes[${index}].charactersInTheScene`, [...charactersInScene, name])
                  }
                  setInputValue('')
                  setError(null)
                }}
                placeholder={charactersInScene.length === 0 ? "Type character name..." : ""}
                className="flex-1 bg-transparent outline-none text-sm text-gray-300 placeholder-gray-500 min-w-48"
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => setOpen(false)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

