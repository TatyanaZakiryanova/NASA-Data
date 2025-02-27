'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';

import { useToast } from '@/app/context/toast-context';
import { auth, db } from '@/app/lib/firebase';
import Button from '@/app/ui/button';
import Input from '@/app/ui/input';

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { showToast } = useToast();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const { email, password } = values;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDocRef = doc(db, 'users', user.uid);

        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp(),
        });
        showToast(`You are signed in as ${user.email}`);
        router.replace('/main/profile');
      } catch {
        showToast('Incorrect email or password');
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
        <LogIn size={20} />
        Sign In
      </p>
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
        {isLoading ? 'In progress...' : 'Sign in'}
      </Button>
      <p className="text-xs">
        Not registered yet?{' '}
        <Link href="/main/registration" className="text-purple-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
