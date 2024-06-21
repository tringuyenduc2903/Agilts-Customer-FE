'use client';
import 'react-phone-number-input/style.css';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import {
  useResendVerifyAccountMutation,
  useUpdateUserMutation,
} from '@/lib/redux/query/userQuery';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import withAuth from '@/protected-page/withAuth';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { defaultTimezone } from '@/config/timezone';

type Form = {
  name: string;
  email: string;
  phone_number: string | null;
  birthday: string | null;
  gender: string | number | null;
  timezone: string;
};

function AccountsPage() {
  const t = useTranslations('common');
  const { user, handleGetCSRFCookie, isLoadingCSRF } =
    useContext(FetchDataContext);
  const { setVisibleModal } = useContext(ModalContext);
  const [sendVerify, setSendVerify] = useState(false);
  const [
    resendVerifyAccount,
    {
      isLoading: isLoadingPostData,
      isSuccess: isSuccessPostData,
      isError: isErrorPostData,
      error: errorPostData,
    },
  ] = useResendVerifyAccountMutation();
  const { register, handleSubmit, reset, watch, control } = useForm<Form>({
    defaultValues: { ...user, timezone: defaultTimezone },
  });

  const watchedValues = watch();
  const isChangeUser = useMemo(() => {
    const string1 = JSON.stringify(user);
    const string2 = JSON.stringify(watchedValues);
    return string1 !== string2;
  }, [watchedValues, user]);

  const [
    updateUser,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateUserMutation();

  const errors = useMemo(() => {
    if (isErrorUpdate && errorUpdate) {
      const error = errorUpdate as any;
      return error?.data?.errors;
    }
    return null;
  }, [isErrorUpdate, errorUpdate]);
  const handleResendVerify = useCallback(async () => {
    setSendVerify(true);
    await handleGetCSRFCookie();
    await resendVerifyAccount(null);
  }, [handleGetCSRFCookie, resendVerifyAccount, sendVerify]);

  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await handleGetCSRFCookie();
      await updateUser({
        ...data,
      });
    },
    [handleGetCSRFCookie, updateUser]
  );

  useEffect(() => {
    if (user) {
      reset({ ...user });
    }
  }, [user, reset]);
  useEffect(() => {
    if (isSuccessUpdate) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: `${t('mess_change_profile')}`,
        },
      });
    }
    if (isErrorUpdate && errorUpdate) {
      const error = errorUpdate as any;
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [isSuccessUpdate, isErrorUpdate, errorUpdate, setVisibleModal, t]);
  useEffect(() => {
    if (isLoadingCSRF && sendVerify) {
      setVisibleModal({ visibleLoadingModal: isLoadingCSRF });
    }
    if (isLoadingPostData && sendVerify) {
      setVisibleModal({ visibleLoadingModal: isLoadingPostData });
    }
    if (isSuccessPostData) {
      setSendVerify(false);
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: `${t('mess_success_send_verify')}`,
        },
      });
    }
    if (isErrorPostData && errorPostData) {
      setSendVerify(false);
      const error = errorPostData as any;
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    sendVerify,
    isLoadingCSRF,
    isLoadingPostData,
    isSuccessPostData,
    isErrorPostData,
    errorPostData,
    setVisibleModal,
    t,
  ]);
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl py-2 font-bold'>{t('user_information')}</h1>
        <p>
          ({t('last_updated_at')} {user?.updated_at})
        </p>
      </div>
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit(onSubmit)}
        method='POST'
      >
        <div className='flex flex-col gap-2'>
          <label htmlFor='name'>{t('name')}</label>
          <input
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
            type='text'
            id='name'
            {...register('name')}
            disabled={isLoadingUpdate || isLoadingCSRF}
          />
          {errors?.name && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.name[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label className='flex flex-col sm:flex-row gap-2' htmlFor='email'>
            <span>Email</span>
            {user?.email_verified_at ? (
              <span className='font-bold'>
                ({t('verified_at')} {user?.email_verified_at})
              </span>
            ) : (
              <>
                <span className='font-bold'>({t('not_verified')})</span>
                <button
                  type='button'
                  className='w-max sm:ml-auto text-red-500 font-bold'
                  onClick={handleResendVerify}
                  disabled={isLoadingCSRF || isLoadingPostData}
                >
                  {t('verify')}
                </button>
              </>
            )}
          </label>
          <input
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
            type='text'
            id='email'
            {...register('email')}
            disabled
          />
          {errors?.email && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.email[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='birthday'>{t('birthday')}</label>
          <input
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
            type='date'
            id='birthday'
            {...register('birthday')}
            disabled={isLoadingUpdate || isLoadingCSRF || isLoadingPostData}
          />
          {errors?.birthday && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.birthday[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='phone'>{t('phone')}</label>
          <PhoneInputWithCountry
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base focus:outline-none'
            name='phone_number'
            control={control}
            rules={{ required: true }}
            defaultCountry='VN'
            defaultValue={watchedValues.phone_number as string}
          />
          {errors?.phone_number && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.phone_number[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='gender'>{t('gender')}</label>
          <select
            id='gender'
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base focus:outline-none'
            {...register('gender')}
            disabled={isLoadingUpdate || isLoadingCSRF || isLoadingPostData}
          >
            <option value=''>{t('select_gender')}</option>
            <option value={0}>{t('male')}</option>
            <option value={1}>{t('female')}</option>
            <option value={2}>{t('unknown')}</option>
          </select>
          {errors?.gender && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.gender[0]}
            </p>
          )}
        </div>
        <div className='flex justify-end items-center gap-4'>
          {isChangeUser && (
            <button
              className='font-bold bg-red-500 hover:bg-red-600 transition-colors text-white px-6 py-3 rounded-sm'
              type='button'
              onClick={() => reset({ ...user })}
              disabled={isLoadingUpdate || isLoadingCSRF || isLoadingPostData}
            >
              {t('cancel')}
            </button>
          )}
          <button
            className='font-bold bg-neutral-800 text-white px-4 py-3 rounded-sm'
            type='submit'
            disabled={isLoadingUpdate || isLoadingCSRF || isLoadingPostData}
          >
            {isLoadingUpdate || (isLoadingCSRF && !sendVerify)
              ? `...${t('loading')}`
              : t('update')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(AccountsPage);