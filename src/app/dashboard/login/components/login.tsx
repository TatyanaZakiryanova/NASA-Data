'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFormik } from 'formik';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import * as Yup from 'yup';

import { auth } from '@/app/lib/firebase';
import Button from '@/app/ui/button';
import Input from '@/app/ui/input';
import Modal from '@/app/ui/modal';

export default function Login() {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        openModal(`Login successful! User: ${user.email}`);
      } catch {
        openModal('Error logging');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const openModal = (message: string) => {
    setModalMessage(message);
    setModalIsOpen(true);
    setTimeout(() => {
      setModalIsOpen(false);
    }, 2000);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 text-center">
        <p className="flex items-center justify-center gap-2 text-xl">
          <LogIn size={20} />
          Sign In
        </p>
        <Input
          id="email-input"
          name="email"
          type="email"
          placeholder="Email"
          inputValue={formik.values.email}
          handleInput={formik.handleChange}
          handleBlur={formik.handleBlur}
          className={`w-full p-2 shadow-md md:w-[300px]`}
        />
        {formik.touched.email && formik.errors.email ? (
          <span className="text-sm text-red-500">{formik.errors.email}</span>
        ) : null}
        <Input
          id="password-input"
          name="password"
          type="password"
          placeholder="Password"
          inputValue={formik.values.password}
          handleInput={formik.handleChange}
          handleBlur={formik.handleBlur}
          className={`w-full p-2 shadow-md md:w-[300px]`}
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
        <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
          <p>{modalMessage}</p>
        </Modal>
      </form>
    </>
  );
}
