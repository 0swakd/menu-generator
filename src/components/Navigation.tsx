'use client'
import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { name: 'Accueil', href: '/', id: 'home' },
  { name: 'Créer un menu', href: '/create-menu', id: 'create' },
  { name: 'Gérer les plats', href: '/manage-dishes', id: 'dishes' },
]

export default function Navigation() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Menu Generator
            </h1>
          </div>
          
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}