'use client'
import { useState } from 'react'
import MenuForm from '../../components/MenuForm'
import MenuDisplay from '../../components/MenuDisplay'
import { FormData, MenuResponse } from '../../types'

export default function CreateMenuPage() {
  const [menu, setMenu] = useState<MenuResponse | null>(null)
  const [lastFormData, setLastFormData] = useState<FormData | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const response = await fetch('/api/generate-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    const result: MenuResponse = await response.json()
    setMenu(result)
    setLastFormData(formData)
  }

  return (
    <div className="container mx-auto py-8">
      <MenuForm onSubmit={handleSubmit} />
      {menu && (
        <MenuDisplay menu={menu} formData={lastFormData} />
      )}
    </div>
  )
}