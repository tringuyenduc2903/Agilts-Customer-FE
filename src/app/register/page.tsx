'use client';
import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { useRouter } from 'next/navigation';
const DynamicRegister = dynamic(() => import('./_components/Register'), {
  ssr: false,
  loading: () => <main className='relative skeleton h-screen w-full'></main>,
});
function RegisterPage() {
  const router = useRouter();
  const { user, isSuccessUser, isLoadingUser } = useContext(FetchDataContext);
  if (user || isSuccessUser) {
    router.replace('/');
  }
  if (isLoadingUser)
    return <main className='relative skeleton h-screen w-full'></main>;
  return <DynamicRegister />;
}

export default RegisterPage;
