import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

type ConfirmDialogProps = {
  open: boolean
  action: string
  requiredCredits: number
  balanceCredits: number
  onConfirm: (value: boolean) => void
}

export function ConfirmDialog({
  open,
  action,
  requiredCredits,
  balanceCredits,
  onConfirm,
}: ConfirmDialogProps) {
  const router = useRouter()
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onConfirm(false)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Credit alert</DialogTitle>
          <DialogDescription>
            {balanceCredits < 0 ? `${action} requires ${requiredCredits} credits. Your credit balance is low. Do you want to upgrade?` : `${action} requires ${requiredCredits} credits. Your balance after this will be ${balanceCredits}. Do you want to proceed?`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onConfirm(false)}>
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            {balanceCredits < 0 ?
              <Button onClick={() => {
                onConfirm(false)
                router.push('/billing')
              }}>
                Upgrade
              </Button>
              :
              <Button onClick={() => onConfirm(true)}>
                Yes
              </Button>
            }
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

