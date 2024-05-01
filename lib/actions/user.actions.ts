'use server';

import { UserFields } from '@/constants';
import { connectToDB } from '@/lib/database';
import User, { UserType } from '@/lib/database/models/user.model';
import { handleError } from '@/lib/utils';
import { Configurations } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getUserById(userId: string) {
  try {
    await connectToDB();

    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function createUser({
  name,
  email,
  password = null,
  image = '',
}: {
  name: string;
  email: string;
  password?: string | null;
  image?: string;
}) {
  try {
    await connectToDB();

    const configurationsData: Configurations = {
      studyID: null,
      vocabularies: [],
      modeWrite: true,
      hints: true,
      limitAll: 30,
      limitNew: 10,
      theme: 'white',
    };
    const newUser = new User({
      [UserFields.NAME]: name,
      [UserFields.PASSWORD]: password,
      [UserFields.EMAIL]: email,
      [UserFields.AVATAR]: image,
      [UserFields.IS_ADMIN]: false,
      [UserFields.CONFIGURATION]: configurationsData,
    });

    await newUser.save();
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}
