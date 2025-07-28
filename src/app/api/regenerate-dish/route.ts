import { supabase } from '../../../lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  const { dishName, mealIndex, dishIndex, currentMenu, formData } = await request.json()

  try {
    // Get all dishes from database
    const { data: dishes, error } = await supabase
      .from('dishes')
      .select('*')

    if (error) throw error

    // Get all current dishes from the menu to avoid duplicates
    const currentDishes = currentMenu.menu.flatMap((meal: any) => meal.dishes)

    // Generate a random seed for variety
    const randomSeed = Math.floor(Math.random() * 1000000)
    
    const prompt = `
Tu es un générateur de plats. Tu dois OBLIGATOIREMENT répondre uniquement avec un JSON valide, sans aucun texte avant ou après.

Je veux remplacer le plat "${dishName}" par un nouveau plat similaire mais différent.

Contraintes du menu original :
- Nombre de personnes : ${formData?.people || 4}
- Budget : ${formData?.budget || '€€'}
- Saison : ${formData?.season || 'automne'}
- Végétarien : ${formData?.vegetarian ? 'Oui' : 'Non'}
- Végan : ${formData?.vegan ? 'Oui' : 'Non'}

Plats disponibles en base de données : ${JSON.stringify(dishes)}

Plats déjà utilisés dans le menu actuel : ${JSON.stringify(currentDishes)}

IMPORTANT :
- Le nouveau plat doit être différent de "${dishName}" et de tous les plats déjà utilisés dans le menu
- Il doit respecter les contraintes (budget, saison, végétarien/végan)
- Il doit être dans le même style/catégorie que le plat original
- Privilégie les plats de la base de données si possible, sinon crée un nouveau plat
- Seed de variabilité : ${randomSeed} (utilise ce nombre pour varier tes suggestions)

Réponds uniquement avec ce format JSON :
{
  "newDish": "nom du nouveau plat"
}
`

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const result = JSON.parse(responseText)
        
    return Response.json(result)
  } catch (error: any) {
    return Response.json({ message: 'Error regenerating dish', error: error.message }, { status: 500 })
  }
}