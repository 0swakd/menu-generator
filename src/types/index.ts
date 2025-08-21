export interface FormData {
    people: number
    budget: '€' | '€€' | '€€€'
    season: 'printemps' | 'été' | 'automne' | 'hiver'
    vegetarian: boolean
    vegan: boolean
    meals: number
    newDishes: number
    impact: boolean
    advice: string
  }
  
  export interface Dish {
    id: number
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
    created_at: string
    servings_per_dish: number  // How many servings this dish provides
    servings_per_person: number  // How many servings one person needs for one meal
    can_be_multi_day: boolean  // Whether this dish can span multiple days
    storage_days: number  // How many days this dish can be stored/eaten
  }
  
  export interface MenuDish {
    name: string
    servings_used: number
    remaining_servings: number
    days_remaining: number
    is_multi_day: boolean
  }

  export interface MenuMeal {
    meal: string
    dishes: string[] | MenuDish[]  // Support both string[] for backward compatibility and MenuDish[] for multi-day
    ingredients: string[]
    instructions: string
    advice: string
    day?: number  // Optional day number for multi-day menus
  }
  
  export interface MenuResponse {
    menu: MenuMeal[]
  }