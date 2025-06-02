import {
  registerUserRequest,
  resetUserStatus,
} from '@/features/user/user.slice';
import { AppDispatch, RootState } from '@/store/store';
import { validateEmail } from '@/utils/email';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showErrorToast, showSuccessToast } from '@/services/toast.service';
import HomeLayout from '@/components/homeLayout';

export default function Register() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<string>('');
  const [lastNameError, setLastNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [repeatPasswordError, setRepeatPasswordError] = useState<string>('');

  const router = useRouter();
  const status = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);
  const user = useSelector((state: RootState) => state.user.userDTO);

  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = () => {
    // Clear previous error messages
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setRepeatPasswordError('');

    // Track whether there are any validation issues
    let hasError = false;

    // Validate each field individually
    if (!firstName) {
      setFirstNameError('Voornaam is verplicht');
      hasError = true;
    }

    if (!lastName) {
      setLastNameError('Achternaam is verplicht');
      hasError = true;
    }

    if (!email) {
      setEmailError('Email is verplicht');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Ongeldig emailadres');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Wachtwoord is verplicht');
      hasError = true;
    }

    if (!repeatPassword) {
      setRepeatPasswordError('Herhalen van wachtwoord is verplicht');
      hasError = true;
    } else if (password && password !== repeatPassword) {
      setRepeatPasswordError('Wachtwoorden komen niet overeen');
      hasError = true;
    }

    if (hasError) return;

    // All validations passed, proceed with dispatch
    dispatch(registerUserRequest({ firstName, lastName, email, password }));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      showSuccessToast({
        summary: 'Registratie succesvol',
        detail: 'Login in met je nieuwe account.',
      });
      dispatch(resetUserStatus());
      setTimeout(() => {
        router.push('/authenticatie/login');
      }, 0);
    } else if (status === 'failed') {
      showErrorToast({
        summary: 'Registreren mislukt',
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
        <div className="bg-surface flex flex-col justify-center gap-4 px-16 py-20  rounded-xl">
          <h2 className="font-semibold text-lg">Registreer</h2>
          <p>Vul uw gegevens in a.u.b.</p>
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-user"> </InputIcon>
              <InputText
                placeholder="Voornaam"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </IconField>
            {firstNameError && (
              <p className="text-error text-sm pt-2">{firstNameError}</p>
            )}
          </div>
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-user"> </InputIcon>
              <InputText
                placeholder="Achternaam"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </IconField>
            {lastNameError && (
              <p className="text-error text-sm pt-2">{lastNameError}</p>
            )}
          </div>
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-envelope"> </InputIcon>
              <InputText
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </IconField>
            {emailError && (
              <p className="text-error text-sm pt-2">{emailError}</p>
            )}
          </div>

          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-lock"> </InputIcon>
              <InputText
                type="password"
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </IconField>
            {passwordError && (
              <p className="text-error text-sm pt-2">{passwordError}</p>
            )}
          </div>
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-lock"> </InputIcon>
              <InputText
                type="password"
                placeholder="Herhaal wachtwoord"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </IconField>
            {repeatPasswordError && (
              <p className="text-error text-sm pt-2">{repeatPasswordError}</p>
            )}
          </div>
          <Button
            label="Registreer"
            loading={loading}
            className="w-full"
            onClick={handleRegister}
          />
        </div>
      </main>
    </>
  );
}

Register.getLayout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;
