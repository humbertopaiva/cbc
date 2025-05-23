import React, { Fragment, useCallback, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface ModalProps {
  title?: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  showCloseButton?: boolean
  position?: 'center' | 'right' // Nova propriedade para controlar a posição
}

export function Modal({
  title,
  open,
  onClose,
  children,
  footer,
  className,
  maxWidth = 'md',
  showCloseButton = true,
  position = 'right', // Valor padrão é centralizado
}: ModalProps) {
  // Fechar o modal ao pressionar Escape
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose],
  )

  // Adicionar/remover event listener para keyboard
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [open, handleKeyDown])

  if (!open) return null

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  }[maxWidth]

  // Classes condicionais para posicionamento
  const containerPositionClass =
    position === 'right'
      ? 'justify-end items-stretch' // Alinhar à direita
      : 'justify-center items-center' // Centralizado (comportamento padrão)

  const modalPositionClass =
    position === 'right'
      ? 'h-full ml-auto' // Altura completa e arredondamento apenas à esquerda
      : 'h-full' // Comportamento padrão

  return (
    <Fragment>
      {/* Backdrop com blur */}
      <div
        className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className={`fixed inset-0 z-50 flex p-0 ${containerPositionClass}`}>
        <div
          className={cn(
            modalPositionClass,
            'w-full',
            maxWidthClass,
            'bg-card shadow-lg overflow-hidden',
            'flex flex-col',
            position === 'right'
              ? 'animate-in slide-in-from-right duration-300'
              : 'animate-in fade-in-0 zoom-in-95 duration-300',
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-card z-10">
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                  aria-label="Fechar"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content with scroll */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-4 border-t sticky bottom-0 bg-card z-10">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}
