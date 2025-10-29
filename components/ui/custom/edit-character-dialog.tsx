'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export const EditCharacterDialog = ({
  open,
  setOpen,
  index,
  character,
  updateNestedField,
}: any) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-zinc-900 border border-zinc-800">
        <DialogHeader>
          <DialogTitle>Edit Character</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => updateNestedField(`characters[${index}].name`, e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image Prompt</label>
            <textarea
              value={character.imagePrompt}
              onChange={(e) => updateNestedField(`characters[${index}].imagePrompt`, e.target.value)}
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)} className="bg-purple-600 hover:bg-purple-700 text-white">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
