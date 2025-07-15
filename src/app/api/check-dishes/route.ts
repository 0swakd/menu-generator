import { supabase } from '../../../lib/supabase'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { dishNames } = await request.json()

  if (!dishNames || !Array.isArray(dishNames)) {
    return Response.json({ message: 'Dish names array is required' }, { status: 400 })
  }

  try {
    // Query database for dishes with matching names
    const { data: existingDishes, error } = await supabase
      .from('dishes')
      .select('name')
      .in('name', dishNames)
    
    if (error) {
      throw error
    }

    // Create a set of existing dish names for quick lookup
    const existingNames = new Set(existingDishes?.map(dish => dish.name.toLowerCase()) || [])
    
    // Check which dishes exist and which don't
    const dishStatus = dishNames.map(name => ({
      name: name,
      exists: existingNames.has(name.toLowerCase())
    }))

    return Response.json({ dishes: dishStatus })
  } catch (error: any) {
    return Response.json({ message: 'Error checking dishes', error: error.message }, { status: 500 })
  }
}