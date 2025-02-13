import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import { Dispatch, useState } from 'react';
import * as Yup from 'yup';

import { useToast } from '@/app/context/toast-context';
import { auth, db } from '@/app/lib/firebase';
import Button from '@/app/ui/button';
import Input from '@/app/ui/input';

import { UserData } from '../types';

interface ProfileEditProps {
  userData: UserData;
  setUserData: Dispatch<React.SetStateAction<UserData | null>>;
  onClose: () => void;
}

export default function EditProfile({ userData, setUserData, onClose }: ProfileEditProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const { showToast } = useToast();

  const formik = useFormik({
    initialValues: {
      name: userData.name,
      email: userData.email,
      currentPassword: '',
      newPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string().min(6, 'Password must be at least 6 characters'),
    }),
    onSubmit: async (values) => {
      setUploading(true);
      const { name, email, currentPassword, newPassword } = values;
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User is not logged in');

        await updateDoc(doc(db, 'users', userData.uid), {
          name: name,
        });

        if (email && email !== user.email) {
          await sendEmailVerification(user);
          showToast('Please verify your new email');
          return;
        }

        if (newPassword && newPassword !== currentPassword) {
          const credential = EmailAuthProvider.credential(user.email!, currentPassword);
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, newPassword);
        }

        if (email && email !== user.email && user.emailVerified) {
          const credential = EmailAuthProvider.credential(user.email!, currentPassword);
          await reauthenticateWithCredential(user, credential);
          await updateEmail(user, email);
        }

        setUserData((prev) => ({
          ...prev!,
          name: name,
          email: email,
        }));
        onClose();
        showToast('Changes saved');
      } catch (error) {
        console.error('Error update profile:', error);
        showToast('Error update profile');
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-2 p-4">
        <h1 className="mb-3">Editing profile</h1>
        <label htmlFor="name" className="text-sm">
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          inputValue={formik.values.name}
          handleInput={formik.handleChange}
          handleBlur={formik.handleBlur}
          placeholder="Name"
          className="w-64 p-1"
        />
        {formik.touched.name && formik.errors.name ? (
          <span className="text-sm text-red-500">{formik.errors.name}</span>
        ) : null}
        <label htmlFor="email" className="text-sm">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          inputValue={formik.values.email}
          handleInput={formik.handleChange}
          handleBlur={formik.handleBlur}
          placeholder="Email"
          className="p-1"
        />
        {formik.touched.email && formik.errors.email ? (
          <span className="text-sm text-red-500">{formik.errors.email}</span>
        ) : null}
        <label htmlFor="currentPassword" className="text-sm">
          Current password*
        </label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          inputValue={formik.values.currentPassword}
          handleInput={formik.handleChange}
          handleBlur={formik.handleBlur}
          placeholder="Current password"
          className="p-1"
        />
        {formik.touched.currentPassword && formik.errors.currentPassword ? (
          <span className="text-sm text-red-500">{formik.errors.currentPassword}</span>
        ) : null}
        <label htmlFor="newPassword" className="text-sm">
          New password
        </label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          inputValue={formik.values.newPassword}
          handleInput={formik.handleChange}
          handleBlur={formik.handleBlur}
          placeholder="New password"
          className="p-1"
        />
        {formik.touched.newPassword && formik.errors.newPassword ? (
          <span className="text-sm text-red-500">{formik.errors.newPassword}</span>
        ) : null}
        <Button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || uploading}
          className="mt-3 py-2 text-sm"
        >
          {uploading ? 'Updating profile...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
