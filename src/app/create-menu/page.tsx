'use client'
import { useState } from 'react'
import MenuForm from '../../components/MenuForm'
import { FormData, MenuResponse } from '../../types'

export default function CreateMenuPage() {
  const [menu, setMenu] = useState<MenuResponse | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const response = await fetch('/api/generate-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    const result: MenuResponse = await response.json()
    setMenu(result)
  }

  return (
    <div className="container mx-auto py-8">
      <MenuForm onSubmit={handleSubmit} />
      {menu && (
        <div className="mt-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Votre Menu</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(menu, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}