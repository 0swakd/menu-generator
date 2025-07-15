import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormData } from '../types'

interface MenuFormProps {
  onSubmit: (data: FormData) => Promise<void>
}

export default function MenuForm({ onSubmit }: MenuFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()
  const [isLoading, setIsLoading] = useState(false)
  const [newDishes, setNewDishes] = useState(0)
  
  const meals = watch('meals') || 4
  const maxNewDishes = meals * 3 // Assuming max 3 dishes per meal (entrée, plat, dessert)

  const submitForm = async (data: FormData) => {
    setIsLoading(true)
    const formDataWithNewDishes = { ...data, newDishes }
    await onSubmit(formDataWithNewDishes)
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6">Générateur de Menu</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Nombre de personnes</label>
        <input
          type="number"
          min="1"
          max="20"
          {...register('people', { required: true, min: 1 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          defaultValue="2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Budget par personne</label>
        <select {...register('budget')} className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="€">
          <option value="€">Économique (€)</option>
          <option value="€€">Moyen (€€)</option>
          <option value="€€€">Élevé (€€€)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Saison</label>
        <select {...register('season')} className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue="printemps">
          <option value="printemps">Printemps</option>
          <option value="été">Été</option>
          <option value="automne">Automne</option>
          <option value="hiver">Hiver</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Restrictions alimentaires</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" {...register('vegetarian')} className="mr-2" />
            Végétarien
          </label>
          <label className="flex items-center">
            <input type="checkbox" {...register('vegan')} className="mr-2" />
            Végan
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Nombre de repas</label>
        <input
          type="number"
          min="1"
          max="7"
          {...register('meals', { required: true, min: 1 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          defaultValue="4"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Nouveaux plats à créer: {newDishes}/{maxNewDishes}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={maxNewDishes}
            value={newDishes}
            onChange={(e) => setNewDishes(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-xs text-gray-600 flex justify-between">
            <span>0 (utiliser uniquement la base)</span>
            <span>{maxNewDishes} (tous nouveaux)</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Nombre de nouveaux plats que Claude peut créer au lieu d'utiliser ceux de la base de données
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Génération...' : 'Générer le menu'}
      </button>
    </form>
  )
}