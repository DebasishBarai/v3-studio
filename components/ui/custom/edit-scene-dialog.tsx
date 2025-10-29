'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export const EditSceneDialog = ({
  open,
  setOpen,
  index,
  scene,
  updateNestedField,
}: any) => {
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

          {/* Characters In Scene */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Characters in this Scene
            </label>
            <input
              type="text"
              value={(scene.charactersInTheScene || []).join(', ')}
              onChange={(e) =>
                updateNestedField(
                  `scenes[${index}].charactersInTheScene`,
                  e.target.value.split(',').map((c) => c.trim())
                )
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Comma-separated names (optional)"
            />
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

