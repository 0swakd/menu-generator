import { FormData, MenuResponse } from '../types'

interface StoredMenu {
  menu: MenuResponse
  formData: FormData
  generatedAt: string
}

export function getCurrentSeason(): 'printemps' | 'été' | 'automne' | 'hiver' {
  const now = new Date()
  const month = now.getMonth() + 1 // getMonth() returns 0-11, we want 1-12
  const day = now.getDate()

  // Season boundaries (approximate for France)
  if (month === 3 && day >= 20 || month === 4 || month === 5 || month === 6 && day < 21) {
    return 'printemps' // Spring: March 20 - June 20
  } else if (month === 6 && day >= 21 || month === 7 || month === 8 || month === 9 && day < 23) {
    return 'été' // Summer: June 21 - September 22
  } else if (month === 9 && day >= 23 || month === 10 || month === 11 || month === 12 && day < 21) {
    return 'automne' // Autumn: September 23 - December 20
  } else {
    return 'hiver' // Winter: December 21 - March 19
  }
}

export function saveFormPreferences(formData: FormData): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('menuFormPreferences', JSON.stringify(formData))
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error)
    }
  }
}

export function loadFormPreferences(): Partial<FormData> | null {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('menuFormPreferences')
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.warn('Failed to load preferences from localStorage:', error)
      return null
    }
  }
  return null
}

export function getFormDefaults(): Partial<FormData> {
  const saved = loadFormPreferences()
  const currentSeason = getCurrentSeason()
  
  return {
    people: saved?.people || 2,
    budget: saved?.budget || '€',
    season: currentSeason, // Always use current season
    vegetarian: saved?.vegetarian || false,
    vegan: saved?.vegan || false,
    meals: saved?.meals || 4,
    newDishes: saved?.newDishes || 0,
    ...saved,
    season: currentSeason // Override saved season with current season
  }
}

export function saveGeneratedMenu(menu: MenuResponse, formData: FormData): void {
  if (typeof window !== 'undefined') {
    try {
      const storedMenu: StoredMenu = {
        menu,
        formData,
        generatedAt: new Date().toISOString()
      }
      localStorage.setItem('lastGeneratedMenu', JSON.stringify(storedMenu))
    } catch (error) {
      console.warn('Failed to save menu to localStorage:', error)
    }
  }
}

export function loadGeneratedMenu(): StoredMenu | null {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('lastGeneratedMenu')
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.warn('Failed to load menu from localStorage:', error)
      return null
    }
  }
  return null
}

export function clearGeneratedMenu(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('lastGeneratedMenu')
    } catch (error) {
      console.warn('Failed to clear menu from localStorage:', error)
    }
  }
}