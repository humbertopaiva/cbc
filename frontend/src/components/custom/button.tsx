import React from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { Button as ShadcnButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Adicionamos um tipo específico para nossas variantes customizadas
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

// Aqui removemos a restrição de tipo para o variant
type ButtonProps = Omit<
  ComponentPropsWithoutRef<typeof ShadcnButton>,
  'variant'
> & {
  variant?: CustomButtonVariant
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      primary:
        'bg-[var(--color-primary)] text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-amber-500 text-white hover:bg-amber-600',
      info: 'bg-sky-500 text-white hover:bg-sky-600',
      danger:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      default: '', // Deixe vazio para usar a variante padrão do shadcn
      destructive: '',
      outline: '',
      ghost: '',
      link: '',
    }

    // Determine se devemos usar nossas classes personalizadas ou passar a variante para o Button original
    const useCustomClass = [
      'primary',
      'secondary',
      'success',
      'warning',
      'info',
      'danger',
    ].includes(variant)

    // Ajusta a combinação de classes
    const combinedClassName = cn(
      'rounded-none',
      useCustomClass ? variantClasses[variant] : '',
      className,
    )

    // Passa a variante original apenas se não for uma das nossas customizadas
    const buttonProps = {
      ...props,
      className: combinedClassName,
      variant: useCustomClass ? undefined : (variant as any),
    }

    return <ShadcnButton ref={ref} {...buttonProps} />
  },
)

Button.displayName = 'CustomButton'
