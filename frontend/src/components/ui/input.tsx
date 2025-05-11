import React, { forwardRef, useState } from 'react'
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  showClearButton?: boolean
  onClear?: () => void
  className?: string
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      icon,
      showClearButton = false,
      onClear,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPasswordInput = type === 'password'
    const inputType = isPasswordInput
      ? showPassword
        ? 'text'
        : 'password'
      : type

    const handleClear = () => {
      if (onClear) {
        onClear()
      }
    }

    const toggleShowPassword = () => {
      setShowPassword(!showPassword)
    }

    return (
      <div className={cn('relative w-full', containerClassName)}>
        <input
          type={inputType}
          className={cn(
            'w-full p-3 border bg-background/70 backdrop-blur-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'transition-colors duration-200',
            icon && 'pl-10',
            (showClearButton || isPasswordInput) && 'pr-10',
            className,
          )}
          ref={ref}
          {...props}
        />

        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        {isPasswordInput ? (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        ) : showClearButton && props.value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            <FiX size={18} />
          </button>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
