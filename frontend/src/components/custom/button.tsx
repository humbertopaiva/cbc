import React from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { Button as ShadcnButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CustomButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'
  | 'default'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'

type ButtonProps = Omit<
  ComponentPropsWithoutRef<typeof ShadcnButton>,
  'variant'
> & {
  variant?: CustomButtonVariant
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-primary text-primary-white hover:bg-primary/90',
      secondary: 'bg-primary/20 text-secondary-foreground hover:bg-primary/50',
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-amber-500 text-white hover:bg-amber-600',
      info: 'bg-sky-500 text-white hover:bg-sky-600',
      danger:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      default: '',
      destructive: '',
      outline: '',
      ghost: '',
      link: '',
    }

    const useCustomClass = [
      'primary',
      'secondary',
      'success',
      'warning',
      'info',
      'danger',
    ].includes(variant)

    const combinedClassName = cn(
      'font-sans text-xs cursor-pointer px-6 py-2',
      'rounded-xs',
      '',
      'border',
      'flex items-center justify-center',
      'min-h-[42px]',
      useCustomClass ? variantClasses[variant] : '',
      className,
    )

    const buttonProps = {
      ...props,
      className: combinedClassName,
      variant: useCustomClass ? undefined : (variant as any),
    }

    return <ShadcnButton ref={ref} {...buttonProps} />
  },
)

Button.displayName = 'CustomButton'
