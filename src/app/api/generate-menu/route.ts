import { supabase } from '../../../lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { FormData, Dish, MenuResponse } from '../../../types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json()
    const { people, budget, season, vegetarian, vegan, meals, newDishes, impact } = body

    console.log('Generate menu request:', { people, budget, season, vegetarian, vegan, meals, newDishes, impact })

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not configured')
    }
    let query = supabase
      .from('dishes')
      .select('*')

    const { data: dishes, error } = await query

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    if (!dishes) {
      throw new Error('No dishes found in database')
    }

    console.log('Fetched dishes count:', dishes.length)

    // Generate a random seed for variety
    const randomSeed = Math.floor(Math.random() * 1000000)

    const prompt = `
Tu es un générateur de menus intelligent. Tu dois OBLIGATOIREMENT répondre uniquement avec un JSON valide, sans aucun texte avant ou après.

Génère un menu pour ${people} personnes sur ${meals} repas avec les contraintes suivantes :
- Budget : ${budget}
- Saison : ${season}
- Végétarien : ${vegetarian ? 'Oui' : 'Non'}
- Végan : ${vegan ? 'Oui' : 'Non'}

Plats disponibles en base de données : ${JSON.stringify(dishes)}

IMPORTANT - Règle pour les nouveaux plats :
- Tu dois créer exactement ${newDishes} nouveaux plats qui ne sont PAS dans la base de données
- Ces nouveaux plats doivent respecter les contraintes (budget, saison, végétarien/végan)
- Tu peux adapter des plats existants en base suivant les contraintes pour certains plats (le but n'est pas de tout revisiter non plus, donc piano)
- Pour les autres plats, utilise prioritairement ceux de la base de données
- Les nouveaux plats peuvent être inspirés des plats existants mais doivent être différents
- Equilibre les nouveaux plats et les plats existants

Tu peux aussi donner des conseils sur l'impact du menu si demandé :
- Impact écologique et conseils : ${impact ? 'Oui' : 'Non'}

Seed de variabilité : ${randomSeed} (utilise ce nombre pour varier tes suggestions)

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

    console.log('Calling Anthropic API...')
    
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    })

    console.log('Anthropic API response received')
    
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    if (!responseText) {
      throw new Error('No response text from Anthropic API')
    }
    
    console.log('Response text length:', responseText.length)
    console.log('Response text preview:', responseText.substring(0, 200))
    
    let menuResponse: MenuResponse
    try {
      menuResponse = JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw response:', responseText)
      throw new Error(`Failed to parse menu response as JSON: ${parseError}`)
    }
        
    return Response.json(menuResponse)
  } catch (error: any) {
    console.error('Generate menu error:', error)
    console.error('Error stack:', error.stack)
    return Response.json({ 
      message: 'Error generating menu', 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}