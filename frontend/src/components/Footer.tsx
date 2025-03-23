// Footer.tsx
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white mt-auto py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 w-full">
            <h3 className="text-xl font-bold">CESIZen</h3>
            <p className="text-sm mt-1">Votre compagnon pour la gestion du stress</p>
            <div className='flex gap-2 mt-2'>
              <img src="/img/cesi_CMJN-e1673249263164.png" alt="" className="w-12 h-auto" />
              <img src="/img/logo-ministere-sante.png" alt="" className="w-12 h-auto" />
            </div>
          </div>
          
          <div className="flex gap-8 w-full md:justify-end">
            <div>
              <h4 className="text-lg font-semibold mb-2">Navigation</h4>
              <ul className="space-y-1">
                <li><Link to="/" className="hover:text-secondary transition-colors">Accueil</Link></li>
                <li><Link to="/exercice-respiration" className="hover:text-secondary transition-colors">Exercices de respiration</Link></li>
                <li><Link to="/informations" className="hover:text-secondary transition-colors">Informations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2">Compte</h4>
              <ul className="space-y-1">
                <li><Link to="/mon-compte" className="hover:text-secondary transition-colors">Mon profil</Link></li>
                <li><Link to="/login" className="hover:text-secondary transition-colors">Connexion</Link></li>
                <li><Link to="/register" className="hover:text-secondary transition-colors">Inscription</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/20 text-center text-sm">
          <p>&copy; {currentYear} CESIZen. Tous droits réservés. <Link to="/mentions-legales" className="hover:text-secondary transition-colors">mentions légales</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;