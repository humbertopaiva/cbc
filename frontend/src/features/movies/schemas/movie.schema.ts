import { z } from 'zod'

// Esquema para validar os filtros
export const movieFiltersSchema = z.object({
  search: z.string().optional(),
  minDuration: z.number().int().positive().optional(),
  maxDuration: z.number().int().positive().optional(),
  releaseDateFrom: z.string().optional(),
  releaseDateTo: z.string().optional(),
  genreIds: z.array(z.string().uuid()).optional(),
})

// Esquema para criar um filme
export const createMovieSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  originalTitle: z.string().optional(),
  description: z.string().optional(),
  budget: z
    .number()
    .positive('O orçamento deve ser um valor positivo')
    .optional(),
  releaseDate: z.string().optional(),
  duration: z
    .number()
    .int()
    .positive('A duração deve ser um valor inteiro positivo')
    .optional(),
  genreIds: z.array(z.string().uuid()).optional(),
  imageUrl: z.string().url('A URL da imagem deve ser válida').optional(),
  backdropUrl: z.string().url('A URL do backdrop deve ser válida').optional(),
  rating: z
    .number()
    .min(0, 'A avaliação mínima é 0')
    .max(10, 'A avaliação máxima é 10')
    .optional(),
})

// Esquema para atualizar um filme
export const updateMovieSchema = createMovieSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
})

// Esquema para o formulário de filme (com conversões de string para número)
export const movieFormSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  originalTitle: z.string().optional(),
  description: z.string().optional(),
  budget: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  releaseDate: z.string().optional(),
  duration: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  genreIds: z.array(z.string().uuid()).optional(),
  imageUrl: z.string().url('A URL da imagem deve ser válida').optional(),
  backdropUrl: z.string().url('A URL do backdrop deve ser válida').optional(),
  rating: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
})

export type MovieFiltersFormData = z.infer<typeof movieFiltersSchema>
export type CreateMovieFormData = z.infer<typeof movieFormSchema>
export type UpdateMovieFormData = z.infer<typeof movieFormSchema> & {
  id: string
}
