import { useQuizState } from '../../hooks/useQuizState'
import { BUDGETS } from '../../data/budgets'
import Card from '../shared/Card'
import Button from '../shared/Button'

export default function BudgetStep() {
  const { budget, openToDeals, setBudget, setOpenToDeals, setStep } = useQuizState()

  const canContinue = budget !== null

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-display text-gray-900 dark:text-white mb-2">
          What's your budget?
        </h2>
        <p className="text-sm text-gray-500 dark:text-[#8a9a8e]">
          Price per eighth (3.5g). This helps us match quality and value.
        </p>
      </div>

      {/* Budget tier grid - 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        {BUDGETS.map((tier) => {
          const isSelected = budget === tier.id

          return (
            <Card
              key={tier.id}
              hoverable
              active={isSelected}
              onClick={() => setBudget(tier.id)}
              className="p-5 text-center"
              aria-pressed={isSelected}
              aria-label={`${tier.label} budget: ${tier.desc}`}
            >
              <p
                className={[
                  'text-3xl font-bold mb-1 transition-colors duration-200',
                  isSelected
                    ? 'text-leaf-500'
                    : 'text-gray-700 dark:text-white',
                ].join(' ')}
              >
                {tier.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-[#6a7a6e]">{tier.desc}</p>
            </Card>
          )
        })}
      </div>

      {/* Open to deals toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-surface-border bg-white dark:bg-surface p-4">
        <div className="min-w-0 pr-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Open to deals outside your tier?
          </p>
          <p className="text-xs text-gray-500 dark:text-[#6a7a6e] mt-0.5">
            We may show great value options slightly outside your range.
          </p>
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          role="switch"
          aria-checked={openToDeals}
          aria-label="Open to deals outside your preferred tier"
          onClick={() => setOpenToDeals(!openToDeals)}
          className={[
            'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-leaf-900',
            openToDeals ? 'bg-leaf-500' : 'bg-gray-300 dark:bg-white/10',
          ].join(' ')}
        >
          <span
            className={[
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200',
              openToDeals ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
          />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="md" onClick={() => setStep(3)} aria-label="Go back to consumption step">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>

        <Button size="lg" disabled={!canContinue} onClick={() => setStep(5)} aria-label="Continue to optional preferences step">
          Continue
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
