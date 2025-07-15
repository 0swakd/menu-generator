import { supabase } from '../../../lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { FormData, Dish, MenuResponse } from '../../../types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  const body: FormData = await request.json()
  const { people, budget, season, vegetarian, vegan, meals } = body

  try {
    let query = supabase
      .from('dishes')
      .select('*')
      .eq('price_range', budget)
      .eq('season', season)

    if (vegetarian) query = query.eq('is_vegetarian', true)
    if (vegan) query = query.eq('is_vegan', true)

    const { data: dishes, error } = await query

    if (error) throw error

    const prompt = `
Tu es un générateur de menus. Tu dois OBLIGATOIREMENT répondre uniquement avec un JSON valide, sans aucun texte avant ou après.

Génère un menu pour ${people} personnes sur ${meals} repas avec les contraintes suivantes :
- Budget : ${budget}
- Saison : ${season}
- Végétarien : ${vegetarian ? 'Oui' : 'Non'}
- Végan : ${vegan ? 'Oui' : 'Non'}

Plats disponibles en base : ${JSON.stringify(dishes)}

Crée un menu équilibré et varié avec des suggestions d'accompagnements et d'ingrédients.
Format la réponse en JSON avec cette structure :
{
  "menu": [
    {
      "meal": "Repas 1",
      "dishes": ["entrée", "plat", "dessert"],
      "ingredients": ["liste des ingrédients principaux"],
      "instructions": "conseils de préparation"
    }
  ]
}
`

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    })


    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const menuResponse: MenuResponse = JSON.parse(responseText)
        
    return Response.json(menuResponse)
  } catch (error: any) {
    return Response.json({ message: 'Error generating menu', error: error.message }, { status: 500 })
  }
}