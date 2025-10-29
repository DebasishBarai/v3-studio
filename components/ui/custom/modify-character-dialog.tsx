import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ModifyCharacterDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  index: number
  character: any
  generateCharacterImage: (params: {
    index: number
    prompt: string
    baseImageId?: string
  }) => void
  modifyingCharacter?: boolean
}

export const ModifyCharacterDialog = ({
  open,
  setOpen,
  index,
  character,
  generateCharacterImage,
  modifyingCharacter
}: ModifyCharacterDialogProps) => {
  const [modifyPrompt, setModifyPrompt] = useState("")

  const handleModify = () => {
    if (!modifyPrompt.trim()) return

    generateCharacterImage({
      index,
      prompt: modifyPrompt,
      baseImageId: character.imageStorageId,
    })

    setModifyPrompt("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg bg-zinc-900 border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">
            Modify Image for {character.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Modify Prompt
          </label>
          <Textarea
            value={modifyPrompt}
            onChange={(e) => setModifyPrompt(e.target.value)}
            placeholder="Describe how you want to modify the image..."
            rows={4}
            className="bg-zinc-950 border border-zinc-800 text-white resize-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!modifyPrompt.trim() || modifyingCharacter}
            onClick={handleModify}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white"
          >
            {modifyingCharacter ? "Modifying..." : "Modify"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

