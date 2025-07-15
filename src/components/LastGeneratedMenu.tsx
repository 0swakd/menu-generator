'use client'
import { useState, useEffect } from 'react'
import { loadGeneratedMenu, clearGeneratedMenu } from '../lib/utils'
import MenuDisplay from './MenuDisplay'

interface LastGeneratedMenuProps {
  title?: string
  showClearButton?: boolean
}

export default function LastGeneratedMenu({ 
  title = "Dernier Menu Généré", 
  showClearButton = true 
}: LastGeneratedMenuProps) {
  const [storedMenu, setStoredMenu] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMenu = () => {
      const menu = loadGeneratedMenu()
      setStoredMenu(menu)
      setIsLoading(false)
    }
    
    loadMenu()
  }, [])

  const handleClearMenu = () => {
    clearGeneratedMenu()
    setStoredMenu(null)
  }

  const formatGeneratedDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!storedMenu) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">Aucun menu généré</h3>
          <p className="text-sm">Générez votre premier menu pour le voir apparaître ici</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Généré le {formatGeneratedDate(storedMenu.generatedAt)}
          </p>
        </div>
        {showClearButton && (
          <button
            onClick={handleClearMenu}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Effacer le menu
          </button>
        )}
      </div>
      
      <MenuDisplay 
        menu={storedMenu.menu} 
        formData={storedMenu.formData} 
      />
    </div>
  )
}