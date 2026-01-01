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
import { Coins, TrendingUp, AlertTriangle } from "lucide-react"

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
  const isLowBalance = balanceCredits < 0

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onConfirm(false)
      }}
    >
      <DialogContent className="sm:max-w-[450px] border-2 border-purple-500/50 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 shadow-2xl shadow-purple-500/20">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className={`relative p-4 rounded-full ${isLowBalance ? 'bg-red-500/20' : 'bg-purple-500/20'} animate-pulse`}>
              {isLowBalance ? (
                <AlertTriangle className="w-8 h-8 text-red-400" />
              ) : (
                <Coins className="w-8 h-8 text-purple-400" />
              )}
              <div className={`absolute inset-0 rounded-full ${isLowBalance ? 'bg-red-500' : 'bg-purple-500'} opacity-20 animate-ping`}></div>
            </div>
          </div>

          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {isLowBalance ? "⚠️ Insufficient Credits" : "Credit Transaction"}
          </DialogTitle>

          <DialogDescription className="text-center text-slate-300 space-y-3">
            <div className="text-base">
              <span className="font-semibold text-white">{action}</span> requires
            </div>

            <div className="flex items-center justify-center gap-2 text-xl font-bold">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400">{requiredCredits}</span>
              <span className="text-slate-400">credits</span>
            </div>

            {!isLowBalance ? (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between px-6 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400">New Balance:</span>
                  <span className="font-bold text-green-400 flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    {balanceCredits}
                  </span>
                </div>
              </div>
            ) : (
              <div className="pt-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Upgrade to continue your adventure!
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => onConfirm(false)}
              className="border-slate-600 bg-slate-800/50 hover:bg-slate-800 text-slate-200 hover:text-white transition-all duration-200"
            >
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            {isLowBalance ? (
              <Button
                onClick={() => {
                  onConfirm(false)
                  router.push('/billing')
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg shadow-purple-500/50 transition-all duration-200 hover:scale-105"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            ) : (
              <Button
                onClick={() => onConfirm(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-500/50 transition-all duration-200 hover:scale-105"
              >
                ✓ Confirm
              </Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
