// pages/login.tsx or wherever this file is
import Navbar from '@/components/navbar';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store'; // adjust path if needed
import { loginUserRequest, resetStatus } from '@/features/user/user.slice';
import { useRouter } from 'next/router';
import { validateEmail } from '@/utils/email';
import { selectCurrentUser } from '@/features/user/user.selector';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const router = useRouter();
  const status = useSelector((state: RootState) => state.user.status);
  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');

    if (!email && !password) {
      setEmailError('Email is required');
      setPasswordError('Password is required');
      return;
    }
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    if (validateEmail(email) === false) {
      setEmailError('Invalid email format');
    }

    dispatch(loginUserRequest({ email, password }));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      if (!user || !user.jwtToken) {
        setEmailError('Invalid email or password');
        return;
      }
      sessionStorage.setItem('jwtToken', user.jwtToken);
      sessionStorage.setItem('email', user.email);
      router.push('/overzicht'); // Replace with your target page
      dispatch(resetStatus());
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);

  return (
    <>
      <main className="flex items-center justify-center max-w-[70vw] mx-auto p-20 text-dark-700">
        <div className="bg-surface-100 flex flex-col justify-center gap-4 px-16 py-20  rounded-lg">
          <h2 className="font-semibold text-lg">Log in</h2>
          <p>Please enter your details</p>

          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-envelope" />
              <InputText
                placeholder="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </IconField>
            {emailError && (
              <div className="text-red-500 text-sm pt-2">{emailError}</div>
            )}
          </div>

          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-lock" />
              <InputText
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </IconField>

            {passwordError && (
              <div className="text-red-500 text-sm pt-2">{passwordError}</div>
            )}
          </div>

          <Button
            label="Login"
            className="w-full"
            loading={loading}
            onClick={handleLogin}
          />
        </div>
      </main>
    </>
  );
}
