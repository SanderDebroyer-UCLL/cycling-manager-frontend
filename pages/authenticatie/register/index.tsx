import Navbar from '@/components/navbar';
import { selectCurrentUser } from '@/features/user/user.selector';
import { registerUserRequest, resetUserStatus } from '@/features/user/user.slice';
import { AppDispatch, RootState } from '@/store/store';
import { validateEmail } from '@/utils/email';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { showErrorToast, showSuccessToast } from '@/services/toast.service';

export default function Login() {
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
  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = () => {
    setEmailError('');
    setPasswordError('');
    setRepeatPasswordError('');

    if (!name && !email && !password && !repeatPassword) {
      setEmailError('Email is verplicht');
      setPasswordError('Wachtwoord is verplicht');
      setRepeatPasswordError('Herhalen van wachtwoord is verplicht');
      if (!firstName && !lastName && !email && !password && !repeatPassword) {
        setFirstNameError('Voornaam is verplicht');
        setLastNameError('Achternaam is verplicht');
        setEmailError('Email is verplicht');
        setPasswordError('Wachtwoord is verplicht');
        setRepeatPasswordError('herhalen van wachtwoord is verplicht');
        return;
      }
      if (!firstName) {
        setFirstNameError('Voornaam is verplicht');
        return;
      }

      if (!lastName) {
        setLastNameError('Achternaam is verplicht');
        return;
      }

      if (!email) {
        setEmailError('Email  is verplicht');
        return;
      }

      if (!password) {
        setPasswordError('Wachtwoord is verplicht');
        return;
      }

      if (!repeatPassword) {
        setRepeatPasswordError('Herhalen van wachtwoord is verplicht');
        return;
      }

      if (password !== repeatPassword) {
        setPasswordError('Wachtwoorden komen niet overeen');
        return;
      }

      if (validateEmail(email) === false) {
        setEmailError('Ongeldig emailadres');
        return;
      }

    }
    dispatch(registerUserRequest({ firstName, lastName, email, password }));
  }

  useEffect(() => {
    if (status === 'succeeded') {
      setTimeout(() => {
        router.push('/authenticatie/login'); // Replace 
      }, 3000);
      showSuccessToast({
        summary: 'Registratie succesvol.',
        detail: 'Login in met je nieuwe account.',
      });
      dispatch(resetUserStatus()); // reset status to avoid repeated redirects
    } else if (status === 'failed') {
      showErrorToast({"summary": "Registreren mislukt.", "detail": error || "Er is een fout opgetreden."});
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
              <p className="text-red-500 text-sm pt-2">{firstNameError}</p>
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
              <p className="text-red-500 text-sm pt-2">{lastNameError}</p>
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
              <p className="text-red-500 text-sm pt-2">{emailError}</p>
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
              <p className="text-red-500 text-sm pt-2">{passwordError}</p>
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
              <p className="text-red-500 text-sm pt-2">{repeatPasswordError}</p>
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

