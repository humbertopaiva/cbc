import React from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { Button as ShadcnButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Aqui estamos pegando os props do botão original
type ButtonProps = ComponentPropsWithoutRef<typeof ShadcnButton> & {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-amber-500 text-white hover:bg-amber-600',
      info: 'bg-sky-500 text-white hover:bg-sky-600',
      danger:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    }

    const buttonVariant = variantClasses[variant as keyof typeof variantClasses]
      ? undefined
      : variant

    const combinedClassName = cn(
      'rounded-none',
      variantClasses[variant as keyof typeof variantClasses],
      className,
    )

    return (
      <ShadcnButton
        ref={ref}
        className={combinedClassName}
        variant={buttonVariant}
        {...props}
      />
    )
  },
)

Button.displayName = 'CustomButton'
