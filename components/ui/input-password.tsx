
import React, { useState } from 'react';
import { Input } from './input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export const InputPassword = ({
  ...rest
}) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='relative'>
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder="************"
        {...rest}
      />
      {showPassword ?
        <EyeIcon
          className='w-4 absolute top-2 right-3 opacity-70 cursor-pointer'
          onClick={() => setShowPassword(prev => !prev)} /> :
        <EyeOffIcon
          className='w-4 absolute top-2 right-3 opacity-70 cursor-pointer'
          onClick={() => setShowPassword(prev => !prev)}
        />}
    </div>
  );
};

