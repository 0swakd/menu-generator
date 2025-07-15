'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Dish } from '../../types'
import AddDishForm from '../../components/AddDishForm'

export default function ManageDishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchDishes()
  }, [])

  const fetchDishes = async () => {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching dishes:', error)
    } else {
      setDishes(data || [])
    }
    setLoading(false)
  }

  const deleteDish = async (id: number) => {
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting dish:', error)
    } else {
      fetchDishes()
    }
  }

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Chargement...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Gestion des Plats
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {showAddForm ? 'Annuler' : 'Ajouter un plat'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddDishForm 
            onDishAdded={() => {
              fetchDishes()
              setShowAddForm(false)
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="grid gap-4">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {dish.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {dish.description}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Catégorie: {dish.category}</span>
                  <span>Cuisine: {dish.cuisine_type}</span>
                  <span>Difficulté: {dish.difficulty}/5</span>
                  <span>Temps: {dish.prep_time}min</span>
                  <span>Prix: {dish.price_range}</span>
                </div>
              </div>
              <button
                onClick={() => deleteDish(dish.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}