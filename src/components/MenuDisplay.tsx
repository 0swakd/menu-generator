'use client'
import { useState } from 'react'
import { MenuResponse } from '../types'

interface MenuDisplayProps {
  menu: MenuResponse
  formData?: any
}

export default function MenuDisplay({ menu, formData }: MenuDisplayProps) {
  const [isPrintMode, setIsPrintMode] = useState(false)

  const handlePrint = () => {
    setIsPrintMode(true)
    setTimeout(() => {
      window.print()
      setIsPrintMode(false)
    }, 100)
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
          {menu.menu.map((meal, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-6 avoid-break">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {meal.meal}
              </h3>
              
              {/* Dishes */}
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  🍽️ Plats
                </h4>
                <ul className="space-y-1">
                  {meal.dishes.map((dish, dishIndex) => (
                    <li key={dishIndex} className="text-gray-700 dark:text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {dish}
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