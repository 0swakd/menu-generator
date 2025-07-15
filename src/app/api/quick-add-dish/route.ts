import { supabase } from '../../../lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  const { dishName } = await request.json()

  if (!dishName) {
    return Response.json({ message: 'Dish name is required' }, { status: 400 })
  }

  try {
    // First, use Claude to get dish information
    const prompt = `
Tu es un expert culinaire. Pour le plat "${dishName}", fournis les informations suivantes dans un JSON valide uniquement, sans aucun texte avant ou après :

{
  "category": "une de ces valeurs: Entrée, Plat principal, Dessert, Accompagnement",
  "cuisine_type": "une de ces valeurs: Française, Italienne, Asiatique, Méditerranéenne, Internationale",
  "difficulty": "nombre entre 1 et 5",
  "prep_time": "temps de préparation en minutes (nombre)",
  "is_vegetarian": "true ou false",
  "is_vegan": "true ou false", 
  "price_range": "une de ces valeurs: €, €€, €€€",
  "season": "une de ces valeurs: printemps, été, automne, hiver, toute l'année",
  "description": "description courte du plat (2-3 phrases)"
}

Réponds uniquement avec le JSON, pas d'autre texte.
`

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const dishInfo = JSON.parse(responseText)
    
    // Add the dish name to the info
    const dishData = {
      name: dishName,
      ...dishInfo
    }

    // Insert the dish into the database
    const { data, error } = await supabase
      .from('dishes')
      .insert([dishData])
      .select()

    if (error) {
      throw error
    }

    return Response.json({ 
      message: 'Dish added successfully', 
      dish: data[0] 
    })
  } catch (error: any) {
    return Response.json({ 
      message: 'Error adding dish', 
      error: error.message 
    }, { status: 500 })
  }
}