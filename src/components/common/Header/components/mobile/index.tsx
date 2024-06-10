'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/borko-logo-black.png';
import { useRouter } from 'next/navigation';
import { FaAlignRight } from 'react-icons/fa6';
import MenuRoutes from './components/MenuRoutes';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
function MobileNavigation({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const headerRef = useRef<HTMLElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  useGSAP(
    () => {
      if (headerRef.current && isMobile) {
        gsap.fromTo(
          headerRef.current,
          {
            translateY: -100,
          },
          {
            translateY: 0,
            duration: 0.5,
          }
        );
      }
    },
    { dependencies: [isMobile], scope: headerRef }
  );
  return (
    <header
      ref={headerRef}
      className='fixed h-[72px] w-full top-0 left-0 px-4 flex justify-between items-center z-[999] bg-white'
    >
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
