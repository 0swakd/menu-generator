'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabase'
import { Dish } from '../types'

interface AddDishFormProps {
  editingDish?: Dish | null
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
  servings_per_dish: number
  servings_per_person: number
  can_be_multi_day: boolean
  storage_days: number
}

export default function AddDishForm({ editingDish, onDishAdded, onCancel }: AddDishFormProps) {
  const [loading, setLoading] = useState(false)
  const [autoFillLoading, setAutoFillLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<DishFormData>({
    defaultValues: editingDish ? {
      name: editingDish.name,
      category: editingDish.category,
      cuisine_type: editingDish.cuisine_type,
      difficulty: editingDish.difficulty,
      prep_time: editingDish.prep_time,
      is_vegetarian: editingDish.is_vegetarian,
      is_vegan: editingDish.is_vegan,
      price_range: editingDish.price_range,
      season: editingDish.season,
      description: editingDish.description,
      servings_per_dish: editingDish.servings_per_dish || 1,
      servings_per_person: editingDish.servings_per_person || 1,
      can_be_multi_day: editingDish.can_be_multi_day || false,
      storage_days: editingDish.storage_days || 1
    } : {
      servings_per_dish: 1,
      servings_per_person: 1,
      can_be_multi_day: false,
      storage_days: 1
    }
  })
  const dishName = watch('name')

  const onSubmit = async (data: DishFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      if (editingDish) {
        // Update existing dish
        const { error } = await supabase
          .from('dishes')
          .update(data)
          .eq('id', editingDish.id)
        
        if (error) {
          throw error
        }
      } else {
        // Create new dish
        const { error } = await supabase
          .from('dishes')
          .insert([data])
        
        if (error) {
          throw error
        }
      }
      
      reset()
      onDishAdded()
    } catch (err) {
      setError(editingDish ? 'Erreur lors de la modification du plat' : 'Erreur lors de l\'ajout du plat')
      console.error('Error saving dish:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoFill = async () => {
    if (!dishName?.trim()) {
      setError('Veuillez d\'abord saisir le nom du plat')
      return
    }

    setAutoFillLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auto-fill-dish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dishName: dishName.trim() }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'auto-remplissage')
      }

      const dishInfo = await response.json()
      
      // Fill the form with the received data
      setValue('category', dishInfo.category)
      setValue('cuisine_type', dishInfo.cuisine_type)
      setValue('difficulty', dishInfo.difficulty)
      setValue('prep_time', dishInfo.prep_time)
      setValue('is_vegetarian', dishInfo.is_vegetarian)
      setValue('is_vegan', dishInfo.is_vegan)
      setValue('price_range', dishInfo.price_range)
      setValue('season', dishInfo.season)
      setValue('description', dishInfo.description)
      setValue('servings_per_dish', dishInfo.servings_per_dish || 1)
      setValue('servings_per_person', dishInfo.servings_per_person || 1)
      setValue('can_be_multi_day', dishInfo.can_be_multi_day || false)
      setValue('storage_days', dishInfo.storage_days || 1)
      
    } catch (err) {
      setError('Erreur lors de l\'auto-remplissage du formulaire')
      console.error('Error auto-filling dish:', err)
    } finally {
      setAutoFillLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        {editingDish ? 'Modifier le plat' : 'Ajouter un nouveau plat'}
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
            <div className="flex gap-2">
              <input
                {...register('name', { required: 'Le nom est obligatoire' })}
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Ex: Risotto aux champignons"
              />
              {!editingDish && (
                <button
                  type="button"
                  onClick={handleAutoFill}
                  disabled={autoFillLoading || !dishName?.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {autoFillLoading ? 'Auto-remplissage...' : 'Auto-remplir'}
                </button>
              )}
            </div>
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

        {/* Multi-day fields */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Gestion multi-jours
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Portions par plat *
              </label>
              <input
                {...register('servings_per_dish', { required: 'Le nombre de portions est obligatoire', valueAsNumber: true, min: 1 })}
                type="number"
                min="1"
                max="20"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Ex: 8"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Nombre de portions que ce plat fournit quand préparé une fois
              </p>
              {errors.servings_per_dish && (
                <p className="mt-1 text-sm text-red-600">{errors.servings_per_dish.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Portions par personne *
              </label>
              <input
                {...register('servings_per_person', { required: 'Le nombre de portions par personne est obligatoire', valueAsNumber: true, min: 1 })}
                type="number"
                min="1"
                max="5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Ex: 1"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Nombre de portions qu'une personne mange par repas
              </p>
              {errors.servings_per_person && (
                <p className="mt-1 text-sm text-red-600">{errors.servings_per_person.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Durée de conservation *
              </label>
              <input
                {...register('storage_days', { required: 'La durée de conservation est obligatoire', valueAsNumber: true, min: 1, max: 7 })}
                type="number"
                min="1"
                max="7"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Ex: 3"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Nombre de jours que ce plat peut être conservé
              </p>
              {errors.storage_days && (
                <p className="mt-1 text-sm text-red-600">{errors.storage_days.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                {...register('can_be_multi_day')}
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Ce plat peut être consommé sur plusieurs jours (ex: tarte, lasagne)
              </span>
            </label>
          </div>
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
            {loading ? 
              (editingDish ? 'Modification en cours...' : 'Ajout en cours...') : 
              (editingDish ? 'Modifier le plat' : 'Ajouter le plat')
            }
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