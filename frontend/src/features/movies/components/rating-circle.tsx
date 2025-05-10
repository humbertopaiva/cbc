import React from 'react'

interface RatingCircleProps {
  rating: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  className?: string
}

export const RatingCircle: React.FC<RatingCircleProps> = ({
  rating,
  size = 60,
  strokeWidth = 6,
  showValue = true,
  className = '',
}) => {
  // Normalizar a classificação para escala 0-100
  const normalizedRating = (rating / 10) * 100

  // Calcular o raio e a circunferência
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // Calcular o tamanho do arco preenchido
  const fillPercentage = normalizedRating / 100
  const dashOffset = circumference * (1 - fillPercentage)

  // Determinar a cor com base na classificação
  const getColor = () => {
    if (normalizedRating >= 75) return '#22c55e' // Verde para boas avaliações
    if (normalizedRating >= 50) return '#eab308' // Amarelo para médias
    return '#ef4444' // Vermelho para baixas
  }

  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Círculo de fundo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={strokeWidth}
        />

        {/* Círculo de progresso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Texto da avaliação */}
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <span className="font-bold" style={{ fontSize: size * 0.3 }}>
            {rating.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  )
}
