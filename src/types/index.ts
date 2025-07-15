export interface FormData {
    people: number
    budget: '€' | '€€' | '€€€'
    season: 'printemps' | 'été' | 'automne' | 'hiver'
    vegetarian: boolean
    vegan: boolean
    meals: number
    newDishes: number
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
  }
  
  export interface MenuMeal {
    meal: string
    dishes: string[]
    ingredients: string[]
    instructions: string
  }
  
  export interface MenuResponse {
    menu: MenuMeal[]
  }