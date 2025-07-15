import Link from 'next/link'
import LastGeneratedMenu from '../components/LastGeneratedMenu'

export default function HomePage() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Générateur de Menus Intelligent
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
        Créez des menus personnalisés en quelques clics grâce à l'intelligence artificielle. 
        Gérez vos plats et générez des suggestions adaptées à vos contraintes.
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Créer un Menu
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Générez un menu personnalisé selon vos préférences et contraintes.
          </p>
          <Link 
            href="/create-menu"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Commencer
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Gérer les Plats
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ajoutez, modifiez ou supprimez des plats de votre base de données.
          </p>
          <Link 
            href="/manage-dishes"
            className="inline-block bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Gérer
          </Link>
        </div>
      </div>

      {/* Last Generated Menu Section */}
      <div className="mt-16">
        <LastGeneratedMenu 
          title="Votre Dernier Menu" 
          showClearButton={false}
        />
      </div>
    </div>
  )
}