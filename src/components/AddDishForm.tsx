'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase'
import { Dish } from '../types'

interface AddDishFormProps {
  onDishAdded: () => void
  onCancel: () => void
}

interface DishFormData {
  name: string
  category: string
  cuisine_type: string
  difficulty: number
  prep_time: number
  is_vegetarian: boolean
  is_vegan: boolean
  price_range: string
  season: string
  description: string
}

export default function AddDishForm({ onDishAdded, onCancel }: AddDishFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<DishFormData>()

  const onSubmit = async (data: DishFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('dishes')
        .insert([data])
      
      if (error) {
        throw error
      }
      
      reset()
      onDishAdded()
    } catch (err) {
      setError('Erreur lors de l\'ajout du plat')
      console.error('Error adding dish:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Ajouter un nouveau plat
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom du plat *
            </label>
            <input
              {...register('name', { required: 'Le nom est obligatoire' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Ex: Risotto aux champignons"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Catégorie *
            </label>
            <select
              {...register('category', { required: 'La catégorie est obligatoire' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Entrée">Entrée</option>
              <option value="Plat principal">Plat principal</option>
              <option value="Dessert">Dessert</option>
              <option value="Accompagnement">Accompagnement</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type de cuisine *
            </label>
            <select
              {...register('cuisine_type', { required: 'Le type de cuisine est obligatoire' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Sélectionner un type</option>
              <option value="Française">Française</option>
              <option value="Italienne">Italienne</option>
              <option value="Asiatique">Asiatique</option>
              <option value="Méditerranéenne">Méditerranéenne</option>
              <option value="Internationale">Internationale</option>
            </select>
            {errors.cuisine_type && (
              <p className="mt-1 text-sm text-red-600">{errors.cuisine_type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulté (1-5) *
            </label>
            <select
              {...register('difficulty', { required: 'La difficulté est obligatoire', valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Sélectionner</option>
              <option value={1}>1 - Très facile</option>
              <option value={2}>2 - Facile</option>
              <option value={3}>3 - Moyen</option>
              <option value={4}>4 - Difficile</option>
              <option value={5}>5 - Très difficile</option>
            </select>
            {errors.difficulty && (
              <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Temps de préparation (minutes) *
            </label>
            <input
              {...register('prep_time', { required: 'Le temps de préparation est obligatoire', valueAsNumber: true, min: 1 })}
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Ex: 30"
            />
            {errors.prep_time && (
              <p className="mt-1 text-sm text-red-600">{errors.prep_time.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gamme de prix *
            </label>
            <select
              {...register('price_range', { required: 'La gamme de prix est obligatoire' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Sélectionner</option>
              <option value="€">€ - Économique</option>
              <option value="€€">€€ - Moyen</option>
              <option value="€€€">€€€ - Cher</option>
            </select>
            {errors.price_range && (
              <p className="mt-1 text-sm text-red-600">{errors.price_range.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Saison *
            </label>
            <select
              {...register('season', { required: 'La saison est obligatoire' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Sélectionner</option>
              <option value="printemps">Printemps</option>
              <option value="été">Été</option>
              <option value="automne">Automne</option>
              <option value="hiver">Hiver</option>
              <option value="toute l'année">Toute l'année</option>
            </select>
            {errors.season && (
              <p className="mt-1 text-sm text-red-600">{errors.season.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'La description est obligatoire' })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Décrivez le plat..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              {...register('is_vegetarian')}
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Végétarien</span>
          </label>
          
          <label className="flex items-center">
            <input
              {...register('is_vegan')}
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Vegan</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Ajout en cours...' : 'Ajouter le plat'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}