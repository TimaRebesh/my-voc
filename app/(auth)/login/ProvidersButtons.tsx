'use client';

import { useEffect, useState } from 'react';
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Preloader } from '@/components/Preloader/Preloader';

export const ProvidersButtons = () =>
  // { loading }: { loading: () => void; }
  {
    const [providers, setProviders] = useState<Record<
      LiteralUnion<BuiltInProviderType, string>,
      ClientSafeProvider
    > | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      (async () => {
        const res = await getProviders();
        setProviders(res);
      })();
    }, []);

    const onGoogleLogin = () => {
      setLoading(true);
      providers?.google && signIn(providers.google.id);
    };

    return (
      <>
        <Button
          className="w-full h-10"
          disabled={!providers?.google || loading}
          onClick={onGoogleLogin}
        >
          <Image
            src="/icons/google.svg"
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain pr-2"
          />
          Login with Google
          {/* {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ArrowRightIcon className="ml-2 h-4" />
      )} */}
        </Button>
        <Preloader isLoading={loading} />
      </>
    );
  };
