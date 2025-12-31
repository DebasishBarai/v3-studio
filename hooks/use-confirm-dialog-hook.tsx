import { useState } from "react"

type ConfirmConfig = {
  action: string
  requiredCredits: number
  balanceCredits: number
}

export function useConfirmDialogHook() {
  const [open, setOpen] = useState(false)
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null)
  const [config, setConfig] = useState<ConfirmConfig | null>(null)

  const confirm = (config: ConfirmConfig) =>
    new Promise<boolean>((resolve) => {
      setConfig(config)
      setResolver(() => resolve)
      setOpen(true)
    })

  const handleConfirm = (value: boolean) => {
    setOpen(false)
    resolver?.(value)
  }

  return {
    open,
    config,
    confirm,
    handleConfirm,
  }
}

