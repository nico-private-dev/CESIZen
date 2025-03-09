import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { BsLungs, BsEmojiSmile, BsGraphUp, BsPerson } from 'react-icons/bs';


interface Tool {
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tools: Tool[] = [
  {
    name: 'Exercice de respiration',
    description: 'Apprenez à gérer votre stress grâce à des exercices de respiration guidés',
    href: '/exercice-respiration',
    icon: BsLungs,
  },
  {
    name: 'Diagnostic',
    description: 'Évaluez votre niveau de stress',
    href: '#',
    icon: BsGraphUp,
  },
  {
    name: 'Tracker d\'émotions',
    description: 'Suivez vos émotions au quotidien',
    href: '#',
    icon: BsEmojiSmile,
  },
  {
    name: 'Activités détentes',
    description: 'Gérez votre stress grâce à des activités relaxantes',
    href: '#',
    icon: BsPerson,
  }
];

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 container">
        <div className="flex">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Cesizen</span>
            <img
              alt="Cesizen"
              src="/img/logo-cesizen.svg"
              className="h-16 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Ouvrir le menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link to="/about" className="text-sm font-semibold leading-6 text-gray-900">
            À propos
          </Link>
          <Popover className="relative flex">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
              Les outils
              <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4">
                {tools.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm hover:bg-gray-50"
                  >
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-secondary" />
                    </div>
                    <div className="flex-auto">
                      <Link to={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </Link>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          <Link to="/informations" className="text-sm font-semibold leading-6 text-gray-900">
            Informations
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:justify-end gap-4">
          {isAuthenticated ? (
            <>
              <Link 
                to="/mon-compte" 
                className="inline-flex items-center text-sm font-semibold leading-6 text-primary hover:text-secondary transition duration-300 ease"
              >
                <UserCircleIcon className="h-6 w-6" />
              </Link>
              <button onClick={logout} className="text-sm font-semibold leading-6 text-gray-900 bg-secondary py-2 px-6 rounded-lg border-2 border-secondary text-black hover:bg-transparent hover:border-secondary transition duration-300 ease">
                Se déconnecter <span aria-hidden="true">&rarr;</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="text-sm font-semibold leading-6 text-gray-900 bg-primary py-2 px-6 rounded-lg border-2 border-primary text-white hover:bg-transparent hover:border-primary hover:text-primary transition duration-300 ease">
                S'inscrire
              </Link>
              <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 bg-secondary py-2 px-6 rounded-lg border-2 border-secondary text-black hover:bg-transparent hover:border-secondary transition duration-300 ease">
                Se connecter <span aria-hidden="true">&rarr;</span>
              </Link>
            </>
          )}
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Cesizen</span>
              <img
                alt="Cesizen"
                src="/img/logo-cesizen.svg"
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Fermer le menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold text-gray-900 hover:bg-gray-50">
                    Les outils
                    <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {tools.map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <Link
                  to="/about"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  À propos
                </Link>
                <Link
                  to="/informations"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Informations
                </Link>
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <button onClick={logout} className="text-sm font-semibold leading-6 text-gray-900 bg-secondary py-2 px-6 rounded-lg border-2 border-secondary text-black hover:bg-transparent hover:border-secondary transition duration-300 ease">
                    Se déconnecter <span aria-hidden="true">&rarr;</span>
                  </button>
                ) : (
                  <>
                    <div className='flex gap-4'>
                      <Link to="/register" className="text-sm font-semibold leading-6 text-gray-900 bg-primary py-2 px-6 rounded-lg border-2 border-primary text-white hover:bg-transparent hover:border-primary hover:text-primary transition duration-300 ease">
                        S'inscrire
                      </Link>
                      <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 bg-secondary py-2 px-6 rounded-lg border-2 border-secondary text-black hover:bg-transparent hover:border-secondary transition duration-300 ease">
                        Se connecter <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Navbar;