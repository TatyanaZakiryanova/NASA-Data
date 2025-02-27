'use client';

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';

import { useToast } from '@/app/context/toast-context';
import { auth, db } from '@/app/lib/firebase';
import Button from '@/app/ui/button';
import Input from '@/app/ui/input';

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { showToast } = useToast();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const { name, email, password } = values;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          name: name,
          profilePicture: user.photoURL || null,
          createdAt: new Date(),
          lastLogin: new Date(),
          roles: ['user'],
        });
        showToast('Registration successful! Please confirm your email');
        router.replace('/main/profile');
      } catch {
        showToast('Error registering user');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex w-full max-w-[300px] flex-col gap-4 text-center"
    >
      <p className="flex items-center justify-center gap-2 text-xl">
        <UserPlus size={20} />
        Sign Up
      </p>
      <Input
        id="name"
        name="name"
        type="text"
        placeholder="Name"
        inputValue={formik.values.name}
        handleInput={formik.handleChange}
        handleBlur={formik.handleBlur}
        className={`p-2 shadow-md`}
      />
      {formik.touched.name && formik.errors.name ? (
        <span className="text-sm text-red-500">{formik.errors.name}</span>
      ) : null}
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        inputValue={formik.values.email}
        handleInput={formik.handleChange}
        handleBlur={formik.handleBlur}
        className={`p-2 shadow-md`}
        autoComplete="email"
      />
      {formik.touched.email && formik.errors.email ? (
        <span className="text-sm text-red-500">{formik.errors.email}</span>
      ) : null}
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        inputValue={formik.values.password}
        handleInput={formik.handleChange}
        handleBlur={formik.handleBlur}
        className={`p-2 shadow-md`}
        autoComplete="current-password"
      />
      {formik.touched.password && formik.errors.password ? (
        <span className="text-sm text-red-500">{formik.errors.password}</span>
      ) : null}
      <Button
        type="submit"
        className="px-5 py-2"
        disabled={!formik.isValid || !formik.dirty || isLoading}
      >
        {isLoading ? 'In progress...' : 'Sign up'}
      </Button>
      <p className="text-xs">
        Already registered?{' '}
        <Link href="/main/login" className="text-purple-600 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
