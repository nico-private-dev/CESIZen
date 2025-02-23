import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  PopoverGroup,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
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

          <Link to="/" className="text-sm font-semibold leading-6 text-gray-900">
            Exercice de respiration
          </Link>
          <Link to="/" className="text-sm font-semibold leading-6 text-gray-900">
            Diagnostique
          </Link>
          <Link to="/" className="text-sm font-semibold leading-6 text-gray-900">
            Tracking
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          {isAuthenticated ? (
            <button onClick={logout} className="text-sm font-semibold leading-6 text-gray-900 bg-secondary py-2 px-6 rounded border-2 border-secondary text-black hover:bg-transparent hover:border-secondary transition duration-300 ease">
              Se déconnecter <span aria-hidden="true">&rarr;</span>
            </button>
          ) : (
            <>
              <Link to="/register" className="text-sm font-semibold leading-6 text-gray-900 bg-primary py-2 px-6 rounded border-2 border-primary text-white hover:bg-transparent hover:border-primary hover:text-primary transition duration-300 ease">
                S'inscrire
              </Link>
              <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 bg-secondary py-2 px-6 rounded border-2 border-secondary text-black hover:bg-transparent hover:border-secondary transition duration-300 ease">
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
                <Link
                  to="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Exercice de respiration
                </Link>
                <Link
                  to="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Diagnostique
                </Link>
                <Link
                  to="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  tracking
                </Link>
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <button onClick={logout} className="text-sm font-semibold leading-6 text-gray-900 bg-secondary py-2 px-6 rounded border-2 border-secondary text-black hover:bg-transparent hover:border-secondary transition duration-300 ease">
                  Se déconnecter <span aria-hidden="true">&rarr;</span>
                </button>
                ) : (
                  <>
                  <div className='flex gap-4'>
                    <Link to="/register" className="text-sm font-semibold leading-6 text-gray-900 bg-primary py-2 px-6 rounded border-2 border-primary text-white hover:bg-transparent hover:border-primary hover:text-primary transition duration-300 ease">
                      S'inscrire
                    </Link>
                    <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 bg-secondary py-2 px-6 rounded border-2 border-secondary text-black hover:bg-transparent hover:border-secondary transition duration-300 ease">
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