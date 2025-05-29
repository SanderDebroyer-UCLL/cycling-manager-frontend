import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { ReactNode, use, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { loginUserRequest, resetUserStatus } from '@/features/user/user.slice';
import { useRouter } from 'next/router';
import { validateEmail } from '@/utils/email';
import { showErrorToast, showSuccessToast } from '@/services/toast.service';
import HomeLayout from '@/components/homeLayout';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const router = useRouter();
  const status = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);
  const user = useSelector((state: RootState) => state.user.userDTO);
  const jwtRes = useSelector((state: RootState) => state.user.jwtRes);

  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');

    if (!email && !password) {
      setEmailError('Email is verplicht');
      setPasswordError('Wachtwoord is verplicht');
      return;
    }
    if (!email) {
      setEmailError('Email is verplicht');
      return;
    }

    if (!password) {
      setPasswordError('Password is verplicht');
      return;
    }

    if (validateEmail(email) === false) {
      setEmailError('Ongeldig emailadres');
    }

    dispatch(loginUserRequest({ email, password }));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      if (!jwtRes || !jwtRes.jwtToken) {
        return;
      }
      showSuccessToast({
        summary: 'Login succesvol',
        detail: 'Herleiden naar de overzicht pagina...',
      });
      sessionStorage.setItem('jwtToken', jwtRes.jwtToken);
      sessionStorage.setItem('email', jwtRes.email);
      router.push('/overzicht');
      dispatch(resetUserStatus());
    } else if (status === 'failed') {
      showErrorToast({
        summary: 'Login mislukt',
        detail: error || 'Er is iets misgegaan.',
      });
      dispatch(resetUserStatus()); // reset status to avoid repeated error messages
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
        <div className="bg-surface-container flex flex-col justify-center gap-4 px-16 py-20  rounded-xl">
          <h2 className="font-semibold text-lg">Log in</h2>
          <p>Vul uw gegeven in a.u.b.</p>

          <div>
            <IconField iconPosition="left">
              <InputIcon>
                <Mail className="w-4 h-4 stroke-[2.5]" />
              </InputIcon>
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
              <InputIcon>
                <Lock className="w-4 h-4 stroke-[2.5]" />
              </InputIcon>
              <InputText
                type="password"
                placeholder="Wachtwoord"
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

Login.getLayout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;
