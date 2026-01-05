export function OnboardingTooltip({ title, description }: { title: string; description: string }) {
  return (
    <div className="fixed z-50 bg-neutral-900 text-white p-4 rounded-lg max-w-sm shadow-xl">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  )
}
