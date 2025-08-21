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

    // Separate multi-day dishes from regular dishes
    const multiDayDishes = dishes?.filter(dish => dish.can_be_multi_day) || []
    const regularDishes = dishes?.filter(dish => !dish.can_be_multi_day) || []

    // Generate a random seed for variety
    const randomSeed = Math.floor(Math.random() * 1000000)

    const prompt = `
Tu es un générateur de menus intelligent. Tu dois OBLIGATOIREMENT répondre uniquement avec un JSON valide, sans aucun texte avant ou après.

Génère un menu pour ${people} personnes sur ${meals} repas avec les contraintes suivantes :
- Budget : ${budget}
- Saison : ${season}
- Végétarien : ${vegetarian ? 'Oui' : 'Non'}
- Végan : ${vegan ? 'Oui' : 'Non'}

Plats réguliers disponibles : ${JSON.stringify(regularDishes)}
Plats multi-jours disponibles : ${JSON.stringify(multiDayDishes)}

NOUVEAUTÉ IMPORTANTE - Gestion des plats multi-jours :
Les plats multi-jours peuvent être consommés sur plusieurs repas. Pour ces plats :
- servings_per_dish : nombre total de portions du plat
- servings_per_person : portions qu'une personne mange par repas
- storage_days : durée maximale de conservation
- Exemple : Une tarte aux pommes (8 portions) pour 1 personne = 8 repas possibles

IMPORTANT - Règles pour les plats :
- Tu dois créer exactement ${newDishes} nouveaux plats qui ne sont PAS dans la base de données
- OPTIMISE l'utilisation des plats multi-jours pour réduire les efforts de cuisine
- Pour un plat multi-jours, calcule combien de repas il peut couvrir : servings_per_dish ÷ (servings_per_person × people)
- Utilise les plats multi-jours de manière intelligente sur plusieurs repas consécutifs
- Les nouveaux plats doivent respecter les contraintes (budget, saison, végétarien/végan)
- Equilibre nouveaux plats, plats réguliers et plats multi-jours

Tu peux aussi donner des conseils sur l'impact du menu si demandé :
- Impact écologique et conseils : ${impact ? 'Oui' : 'Non'}

Seed de variabilité : ${randomSeed} (utilise ce nombre pour varier tes suggestions)

Crée un menu équilibré et varié. Pour les plats multi-jours, indique clairement quand ils sont utilisés sur plusieurs repas.
Format la réponse en JSON avec cette structure :
{
  "menu": [
    {
      "meal": "Repas 1",
      "dishes": [
        {
          "name": "nom du plat",
          "servings_used": 2,
          "remaining_servings": 6,
          "days_remaining": 2,
          "is_multi_day": true
        }
      ],
      "ingredients": ["liste des ingrédients principaux"],
      "advice": "conseil sur l'impact écologique",
      "instructions": "conseils de préparation",
      "day": 1
    }
  ]
}

Pour les plats normaux, utilise juste le nom comme string : "dishes": ["salade", "steak"]
Pour les plats multi-jours, utilise l'objet détaillé ci-dessus.
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