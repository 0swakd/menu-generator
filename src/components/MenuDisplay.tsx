'use client'
import { useState, useEffect } from 'react'
import { MenuResponse } from '../types'
import { saveGeneratedMenu } from '../lib/utils'

interface MenuDisplayProps {
  menu: MenuResponse
  formData?: any
}

export default function MenuDisplay({ menu, formData }: MenuDisplayProps) {
  const [isPrintMode, setIsPrintMode] = useState(false)
  const [dishStatus, setDishStatus] = useState<{[key: string]: boolean}>({})
  const [addingDish, setAddingDish] = useState<string | null>(null)
  const [addSuccessMessage, setAddSuccessMessage] = useState<string | null>(null)
  const [regeneratingDish, setRegeneratingDish] = useState<string | null>(null)
  const [regeneratedMenu, setRegeneratedMenu] = useState<MenuResponse>(menu)

  // Update regenerated menu when menu prop changes
  useEffect(() => {
    setRegeneratedMenu(menu)
  }, [menu])

  // Check which dishes exist in the database
  useEffect(() => {
    const checkDishes = async () => {
      const allDishes = regeneratedMenu.menu.flatMap(meal => meal.dishes)
      const uniqueDishes = [...new Set(allDishes)]
      
      try {
        const response = await fetch('/api/check-dishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dishNames: uniqueDishes })
        })
        
        const result = await response.json()
        
        if (result.dishes) {
          const statusMap: {[key: string]: boolean} = {}
          result.dishes.forEach((dish: {name: string, exists: boolean}) => {
            statusMap[dish.name] = dish.exists
          })
          setDishStatus(statusMap)
        }
      } catch (error) {
        console.error('Error checking dishes:', error)
      }
    }
    
    checkDishes()
  }, [regeneratedMenu])

  const handlePrint = () => {
    setIsPrintMode(true)
    setTimeout(() => {
      window.print()
      setIsPrintMode(false)
    }, 100)
  }

  const handleAddDish = async (dishName: string) => {
    setAddingDish(dishName)
    
    try {
      const response = await fetch('/api/quick-add-dish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishName })
      })
      
      if (response.ok) {
        // Update the dish status to show it now exists
        setDishStatus(prev => ({ ...prev, [dishName]: true }))
        setAddSuccessMessage(`"${dishName}" a été ajouté à la base de données!`)
        setTimeout(() => setAddSuccessMessage(null), 3000)
      } else {
        console.error('Failed to add dish')
      }
    } catch (error) {
      console.error('Error adding dish:', error)
    } finally {
      setAddingDish(null)
    }
  }

  const handleRegenerateDish = async (dishName: string, mealIndex: number, dishIndex: number) => {
    setRegeneratingDish(dishName)
    
    try {
      const response = await fetch('/api/regenerate-dish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dishName, 
          mealIndex, 
          dishIndex, 
          currentMenu: regeneratedMenu,
          formData 
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        
        // Update the regenerated menu with the new dish
        setRegeneratedMenu(prev => {
          const newMenu = { ...prev }
          newMenu.menu[mealIndex].dishes[dishIndex] = result.newDish
          
          // Save the updated menu to localStorage
          if (formData) {
            saveGeneratedMenu(newMenu, formData)
          }
          
          return newMenu
        })
        
        setAddSuccessMessage(`"${dishName}" a été régénéré en "${result.newDish}"!`)
        setTimeout(() => setAddSuccessMessage(null), 3000)
      } else {
        console.error('Failed to regenerate dish')
      }
    } catch (error) {
      console.error('Error regenerating dish:', error)
    } finally {
      setRegeneratingDish(null)
    }
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Votre Menu</h2>
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 no-print"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a1 1 0 001-1v-4a1 1 0 00-1-1H9a1 1 0 00-1 1v4a1 1 0 001 1zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimer
        </button>
      </div>

      {/* Success Message */}
      {addSuccessMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md no-print">
          {addSuccessMessage}
        </div>
      )}

      {/* Dish Status Summary */}
      {Object.keys(dishStatus).length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg no-print">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            📊 Statut des plats
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            {Object.values(dishStatus).filter(exists => exists).length} plats dans la base de données, {' '}
            {Object.values(dishStatus).filter(exists => !exists).length} nouveaux plats
          </div>
        </div>
      )}

      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 ${isPrintMode ? 'print-mode' : ''}`}>
        {/* Header Section */}
        <div className="text-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Menu Personnalisé
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Généré le {formatDate()}
          </p>
          {formData && (
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-block mx-2">👥 {formData.people} personne{formData.people > 1 ? 's' : ''}</span>
              <span className="inline-block mx-2">💰 {formData.budget}</span>
              <span className="inline-block mx-2">🌱 {formData.season}</span>
              {formData.vegetarian && <span className="inline-block mx-2">🥬 Végétarien</span>}
              {formData.vegan && <span className="inline-block mx-2">🌿 Vegan</span>}
            </div>
          )}
        </div>

        {/* Menu Content */}
        <div className="space-y-8">
          {regeneratedMenu.menu.map((meal, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-6 avoid-break">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {meal.meal}
              </h3>
              
              {/* Dishes */}
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  🍽️ Plats
                </h4>
                <ul className="space-y-2">
                  {meal.dishes.map((dish, dishIndex) => (
                    <li key={dishIndex} className="text-gray-700 dark:text-gray-300 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        <span>{dish}</span>
                        {dishStatus[dish] === true && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Dans la base
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegenerateDish(dish, index, dishIndex)}
                          disabled={regeneratingDish === dish}
                          className="px-3 py-1 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors no-print"
                        >
                          {regeneratingDish === dish ? 'Régénération...' : 'Régénérer'}
                        </button>
                        {dishStatus[dish] === false && (
                          <button
                            onClick={() => handleAddDish(dish)}
                            disabled={addingDish === dish}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors no-print"
                          >
                            {addingDish === dish ? 'Ajout...' : 'Ajouter à la base'}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients */}
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  🛒 Ingrédients principaux
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {meal.ingredients.map((ingredient, ingredientIndex) => (
                    <span 
                      key={ingredientIndex} 
                      className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Impact */}
              {formData?.impact === true && (
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  💚 Considération écologique
                </h4>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  {meal.advice}
                </p>
              </div>
              )}

              {/* Instructions */}
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  📝 Conseils de préparation
                </h4>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  {meal.instructions}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menu généré par le Générateur de Menus Intelligent
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .print-mode {
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
            color: black !important;
            padding: 20px !important;
            margin: 0 !important;
            max-width: none !important;
          }
          
          .print-mode * {
            color: black !important;
            background: white !important;
          }
          
          .print-mode .bg-gray-50,
          .print-mode .bg-gray-100,
          .print-mode .bg-gray-700 {
            background: #f5f5f5 !important;
            border: 1px solid #e5e5e5 !important;
          }
          
          .print-mode .border-blue-500 {
            border-color: #3b82f6 !important;
          }
          
          .print-mode .bg-blue-500 {
            background: #3b82f6 !important;
          }
          
          .print-mode h1 {
            color: #1f2937 !important;
          }
          
          .print-mode h3,
          .print-mode h4 {
            color: #374151 !important;
          }
          
          .print-mode p,
          .print-mode li,
          .print-mode span {
            color: #4b5563 !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      `}</style>
    </div>
  )
}