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
  "description": "description courte du plat (2-3 phrases)",
  "servings_per_dish": "nombre de portions que ce plat fournit quand préparé une fois (généralement 1-12)",
  "servings_per_person": "nombre de portions qu'une personne mange typiquement pour un repas (généralement 1-2)",
  "can_be_multi_day": "true si ce plat peut être mangé sur plusieurs jours (comme une tarte, lasagne, etc.), false sinon",
  "storage_days": "nombre maximum de jours que ce plat peut être conservé et consommé (1-7)"
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
        
    return Response.json(dishInfo)
  } catch (error: any) {
    return Response.json({ message: 'Error auto-filling dish information', error: error.message }, { status: 500 })
  }
}