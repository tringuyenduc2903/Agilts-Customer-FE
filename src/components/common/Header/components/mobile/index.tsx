'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/borko-logo-black.png';
import { useRouter } from 'next/navigation';
import { FaAlignRight } from 'react-icons/fa6';
import MenuRoutes from './components/MenuRoutes';
function MobileNavigation() {
  const router = useRouter();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  return (
    <header className='fixed h-[72px] w-full top-0 left-0 px-4 flex justify-between items-center z-50 bg-white'>
      <button aria-label='btn-back-home' onClick={() => router.push('/')}>
        <Image width={170} height={70} src={logo} alt='logo' />
      </button>
      <button onClick={() => setIsOpenMenu(true)} aria-label='open-menu-routes'>
        <FaAlignRight className='text-2xl' />
      </button>
      <MenuRoutes
        isOpenMenu={isOpenMenu}
        closeMenu={() => setIsOpenMenu(false)}
      />
    </header>
  );
}

export default MobileNavigation;
