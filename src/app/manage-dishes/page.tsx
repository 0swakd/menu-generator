'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Dish } from '../../types'
import AddDishForm from '../../components/AddDishForm'
import LastGeneratedMenu from '../../components/LastGeneratedMenu'

interface DishFilters {
  category: string
  cuisine_type: string
  difficulty: string
  price_range: string
  season: string
  vegetarian: boolean | null
  vegan: boolean | null
  search: string
}

export default function ManageDishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [filters, setFilters] = useState<DishFilters>({
    category: '',
    cuisine_type: '',
    difficulty: '',
    price_range: '',
    season: '',
    vegetarian: null,
    vegan: null,
    search: ''
  })

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
      setFilteredDishes(data || [])
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = dishes.filter(dish => {
      // Search filter
      if (filters.search && !dish.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !dish.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      
      // Category filter
      if (filters.category && dish.category !== filters.category) {
        return false
      }
      
      // Cuisine type filter
      if (filters.cuisine_type && dish.cuisine_type !== filters.cuisine_type) {
        return false
      }
      
      // Difficulty filter
      if (filters.difficulty && dish.difficulty.toString() !== filters.difficulty) {
        return false
      }
      
      // Price range filter
      if (filters.price_range && dish.price_range !== filters.price_range) {
        return false
      }
      
      // Season filter
      if (filters.season && dish.season !== filters.season) {
        return false
      }
      
      // Vegetarian filter
      if (filters.vegetarian !== null && dish.is_vegetarian !== filters.vegetarian) {
        return false
      }
      
      // Vegan filter
      if (filters.vegan !== null && dish.is_vegan !== filters.vegan) {
        return false
      }
      
      return true
    })
    
    setFilteredDishes(filtered)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      cuisine_type: '',
      difficulty: '',
      price_range: '',
      season: '',
      vegetarian: null,
      vegan: null,
      search: ''
    })
    setFilteredDishes(dishes)
  }

  const updateFilter = (key: keyof DishFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    applyFilters()
  }, [filters, dishes])

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

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Filtres
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Nom ou description..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Catégorie
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Toutes les catégories</option>
              <option value="Entrée">Entrée</option>
              <option value="Plat principal">Plat principal</option>
              <option value="Dessert">Dessert</option>
              <option value="Accompagnement">Accompagnement</option>
            </select>
          </div>

          {/* Cuisine Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type de cuisine
            </label>
            <select
              value={filters.cuisine_type}
              onChange={(e) => updateFilter('cuisine_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Tous les types</option>
              <option value="Française">Française</option>
              <option value="Italienne">Italienne</option>
              <option value="Asiatique">Asiatique</option>
              <option value="Méditerranéenne">Méditerranéenne</option>
              <option value="Internationale">Internationale</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulté
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => updateFilter('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Toutes les difficultés</option>
              <option value="1">1 - Très facile</option>
              <option value="2">2 - Facile</option>
              <option value="3">3 - Moyen</option>
              <option value="4">4 - Difficile</option>
              <option value="5">5 - Très difficile</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prix
            </label>
            <select
              value={filters.price_range}
              onChange={(e) => updateFilter('price_range', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Tous les prix</option>
              <option value="€">€ - Économique</option>
              <option value="€€">€€ - Moyen</option>
              <option value="€€€">€€€ - Cher</option>
            </select>
          </div>

          {/* Season Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Saison
            </label>
            <select
              value={filters.season}
              onChange={(e) => updateFilter('season', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Toutes les saisons</option>
              <option value="printemps">Printemps</option>
              <option value="été">Été</option>
              <option value="automne">Automne</option>
              <option value="hiver">Hiver</option>
              <option value="toute l'année">Toute l'année</option>
            </select>
          </div>

          {/* Vegetarian Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Végétarien
            </label>
            <select
              value={filters.vegetarian === null ? '' : filters.vegetarian.toString()}
              onChange={(e) => updateFilter('vegetarian', e.target.value === '' ? null : e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Tous</option>
              <option value="true">Végétarien</option>
              <option value="false">Non végétarien</option>
            </select>
          </div>

          {/* Vegan Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vegan
            </label>
            <select
              value={filters.vegan === null ? '' : filters.vegan.toString()}
              onChange={(e) => updateFilter('vegan', e.target.value === '' ? null : e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Tous</option>
              <option value="true">Vegan</option>
              <option value="false">Non vegan</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredDishes.length} plat{filteredDishes.length > 1 ? 's' : ''} trouvé{filteredDishes.length > 1 ? 's' : ''}
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Effacer les filtres
          </button>
        </div>
      </div>

      {(showAddForm || editingDish) && (
        <div className="mb-8">
          <AddDishForm 
            editingDish={editingDish}
            onDishAdded={() => {
              fetchDishes()
              setShowAddForm(false)
              setEditingDish(null)
            }}
            onCancel={() => {
              setShowAddForm(false)
              setEditingDish(null)
            }}
          />
        </div>
      )}

      <div className="grid gap-4">
        {filteredDishes.map((dish) => (
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
                  <span>Saison: {dish.season}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {dish.is_vegetarian && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Végétarien
                    </span>
                  )}
                  {dish.is_vegan && (
                    <span className="px-2 py-1 bg-green-200 text-green-900 text-xs rounded-full">
                      Vegan
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingDish(dish)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteDish(dish.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Last Generated Menu Section */}
      <div className="mt-12">
        <LastGeneratedMenu />
      </div>
    </div>
  )
}