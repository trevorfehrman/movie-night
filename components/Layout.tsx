import * as React from 'react';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon, MenuIcon, XIcon, FilmIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import { auth, db, signInWithGoogle, signOut } from 'lib/firebase';
import { AnimateSharedLayout } from 'framer-motion';

import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import ActiveLink from './ActiveLink';
import { Participant } from './Participant';
import { ParticipantsContext } from 'pages/_app';
import { Participants, useParticipants } from 'hooks/useParticipants';
import {
  FirestoreDataConverter,
  WithFieldValue,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  query,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

<svg
  xmlns='http://www.w3.org/2000/svg'
  className='w-6 h-6'
  fill='none'
  viewBox='0 0 24 24'
  stroke='currentColor'
>
  <path
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth={2}
    d='M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z'
  />
</svg>;

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function Layout({ children }: { children: JSX.Element }) {
  const [page, setPage] = React.useState([
    { name: 'Dashboard', href: '/' },
    { name: 'Add Movie', href: '/add-movie' },
  ]);
  const [user, authLoading, authError] = useAuthState(auth);

  const { participantsCollection } = useParticipants();

  return (
    <>
      <div className='min-h-full'>
        <Disclosure as='nav' className='bg-gray-800'>
          {({ open }) => (
            <>
              <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <FilmIcon
                        className='w-8 h-8 text-yellow-400'
                        aria-hidden='true'
                      />
                    </div>
                    <div className='hidden md:block'>
                      <div className='flex items-baseline ml-10 space-x-4'>
                        {page.map((item) => (
                          <ActiveLink
                            activeClassName={
                              'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                            }
                            key={item.name}
                            href={item.href}
                          >
                            <a
                              className={
                                'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                              }
                            >
                              {item.name}
                            </a>
                          </ActiveLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='hidden md:block'>
                    <div className='flex items-center ml-4 md:ml-6'>
                      <button
                        type='button'
                        className='p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                      >
                        <span className='sr-only'>View notifications</span>
                        <BellIcon className='w-6 h-6' aria-hidden='true' />
                      </button>
                      {/* Profile dropdown */}
                      {!user ? (
                        <button
                          className='px-4 py-2 ml-4 font-bold text-gray-900 transition bg-yellow-400 rounded hover:bg-yellow-600 hover:ease-out'
                          onClick={signInWithGoogle}
                        >
                          Sign In
                        </button>
                      ) : (
                        <Menu as='div' className='relative ml-3'>
                          <div>
                            <Menu.Button className='flex items-center max-w-xs text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
                              <span className='sr-only'>Open user menu</span>
                              {user?.photoURL && (
                                <Image
                                  width={32}
                                  height={32}
                                  className='rounded-full'
                                  src={user.photoURL}
                                  alt=''
                                />
                              )}
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter='transition ease-out duration-100'
                            enterFrom='transform opacity-0 scale-95'
                            enterTo='transform opacity-100 scale-100'
                            leave='transition ease-in duration-75'
                            leaveFrom='transform opacity-100 scale-100'
                            leaveTo='transform opacity-0 scale-95'
                          >
                            <Menu.Items className='absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <Link href={item.href}>
                                      <a
                                        className={classNames(
                                          active ? 'bg-gray-100' : '',
                                          'block px-4 py-2 text-sm text-gray-700'
                                        )}
                                      >
                                        {item.name}
                                      </a>
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    onClick={signOut}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    Signout
                                  </a>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      )}
                    </div>
                  </div>
                  <div className='flex -mr-2 md:hidden'>
                    {/* Mobile menu button */}
                    {user ? (
                      <Disclosure.Button className='inline-flex items-center justify-center p-2 text-gray-400 bg-gray-800 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
                        <span className='sr-only'>Open main menu</span>
                        {open ? (
                          <XIcon className='block w-6 h-6' aria-hidden='true' />
                        ) : (
                          <MenuIcon
                            className='block w-6 h-6'
                            aria-hidden='true'
                          />
                        )}
                      </Disclosure.Button>
                    ) : (
                      <button
                        className='px-4 py-2 ml-4 font-bold text-gray-900 transition bg-yellow-400 rounded hover:bg-yellow-600 hover:ease-out'
                        onClick={signInWithGoogle}
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <Disclosure.Panel className='md:hidden'>
                <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                  {page.map((item) => (
                    <ActiveLink
                      activeClassName={
                        'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                      }
                      key={item.name}
                      href={item.href}
                    >
                      <a
                        className={
                          'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                        }
                      >
                        {item.name}
                      </a>
                    </ActiveLink>
                  ))}
                </div>
                {user && (
                  <div className='pt-4 pb-3 border-t border-gray-700'>
                    <div className='flex items-center px-5'>
                      {user.photoURL && (
                        <div className='flex-shrink-0'>
                          <Image
                            height={32}
                            width={32}
                            className='w-10 h-10 rounded-full'
                            src={user.photoURL}
                            alt=''
                          />
                        </div>
                      )}
                      <div className='ml-3'>
                        <div className='text-base font-medium leading-none text-white'>
                          {user.displayName}
                        </div>
                        <div className='text-sm font-medium leading-none text-gray-400'>
                          {user.email}
                        </div>
                      </div>
                      <button
                        type='button'
                        className='flex-shrink-0 p-1 ml-auto text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                      >
                        <span className='sr-only'>View notifications</span>
                        <BellIcon className='w-6 h-6' aria-hidden='true' />
                      </button>
                    </div>
                    <div className='px-2 mt-3 space-y-1'>
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as='a'
                          href={item.href}
                          className='block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:text-white hover:bg-gray-700'
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className=' bg-gray-800 shadow bg-gradient-to-r from-yellow-400 to-yellow-200'>
          <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 hidden md:flex flex-wrap '>
            <AnimateSharedLayout>
              {participantsCollection.participants
                .slice(participantsCollection.cursor)
                .concat(
                  participantsCollection.participants.slice(
                    0,
                    participantsCollection.cursor
                  )
                )
                .map((participant) => (
                  <Participant key={participant} participant={participant} />
                ))}
            </AnimateSharedLayout>
          </div>
        </header>
        <main>
          <div className='py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

export { Layout };
