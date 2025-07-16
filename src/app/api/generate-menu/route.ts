import { supabase } from '../../../lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { FormData, Dish, MenuResponse } from '../../../types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  const body: FormData = await request.json()
  const { people, budget, season, vegetarian, vegan, meals, newDishes, impact } = body

  try {
    let query = supabase
      .from('dishes')
      .select('*')

    const { data: dishes, error } = await query

    if (error) throw error

    const prompt = `
Tu es un générateur de menus. Tu dois OBLIGATOIREMENT répondre uniquement avec un JSON valide, sans aucun texte avant ou après.

Génère un menu pour ${people} personnes sur ${meals} repas avec les contraintes suivantes :
- Budget : ${budget}
- Saison : ${season}
- Végétarien : ${vegetarian ? 'Oui' : 'Non'}
- Végan : ${vegan ? 'Oui' : 'Non'}

Plats disponibles en base de données : ${JSON.stringify(dishes)}

IMPORTANT - Règle pour les nouveaux plats :
- Tu dois créer exactement ${newDishes} nouveaux plats qui ne sont PAS dans la base de données
- Ces nouveaux plats doivent respecter les contraintes (budget, saison, végétarien/végan)
- Pour les autres plats, utilise prioritairement ceux de la base de données
- Les nouveaux plats peuvent être inspirés des plats existants mais doivent être différents
- Equilibre les nouveaux plats et les plats existants

Tu peux aussi donner des conseils sur l'impact du menu si demandé :
- Impact écologique et conseils : ${impact ? 'Oui' : 'Non'}

Crée un menu équilibré et varié avec des suggestions d'accompagnements et d'ingrédients.
Format la réponse en JSON avec cette structure :
{
  "menu": [
    {
      "meal": "Repas 1",
      "dishes": ["entrée", "plat", "dessert"],
      "ingredients": ["liste des ingrédients principaux"],
      "advice": "conseil sur l'impact écologique",
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