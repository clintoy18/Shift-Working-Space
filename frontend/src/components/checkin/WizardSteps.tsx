import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface WizardStep {
  id: string
  label: string
  description?: string
}

interface WizardStepsProps {
  steps: WizardStep[]
  currentStep: number
  onNext: () => void
  onBack: () => void
  onSubmit?: () => void
  isNextDisabled?: boolean
  isSubmitDisabled?: boolean
  loading?: boolean
}

/**
 * WizardSteps Component
 * Displays progress indicator and navigation buttons for multi-step forms
 * Shows current step, total steps, and handles step validation
 */
export const WizardSteps: React.FC<WizardStepsProps> = ({
  steps,
  currentStep,
  onNext,
  onBack,
  onSubmit,
  isNextDisabled = false,
  isSubmitDisabled = false,
  loading = false,
}) => {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const currentStepData = steps[currentStep]

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {currentStepData?.label}
            </h3>
            {currentStepData?.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {currentStepData.description}
              </p>
            )}
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Progress Bar Visual */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex gap-2 justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex-1 h-2 rounded-full transition-all",
              index <= currentStep ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onBack}
          disabled={isFirstStep || loading}
          variant="outline"
          className="flex-1 gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        {isLastStep ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitDisabled || loading}
            className="flex-1 gap-2"
          >
            <span>Complete</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled || loading}
            className="flex-1 gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default WizardSteps
