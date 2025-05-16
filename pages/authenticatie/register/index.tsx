import Navbar from '@/components/navbar';
import { selectCurrentUser } from '@/features/user/user.selector';
import { registerUserRequest, resetStatus } from '@/features/user/user.slice';
import { AppDispatch, RootState } from '@/store/store';
import { validateEmail } from '@/utils/email';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Login() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [repeatPasswordError, setRepeatPasswordError] = useState<string>('');

  const router = useRouter();
  const status = useSelector((state: RootState) => state.user.status);
  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setRepeatPasswordError('');

    if (!name && !email && !password && !repeatPassword) {
      setNameError('Naam is verplicht');
      setEmailError('Email is verplicht');
      setPasswordError('Wachtwoord is verplicht');
      setRepeatPasswordError('Herhalen van wachtwoord is verplicht');
    if (!firstName && !lastName && !email && !password && !repeatPassword) {
      setFirstNameError('First name is required');
      setLastNameError('Last name is required');
      setEmailError('Email is required');
      setPasswordError('Password is required');
      setRepeatPasswordError('Repeat password is required');
      return;
    }
    if (!name) {
      setNameError('Naam is verplicht');
    if (!firstName) {
      setFirstNameError('First name is required');
      return;
    }

    if (!lastName) {
      setLastNameError('Last name is required');
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

    dispatch(registerUserRequest({ name, email, password }));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      if (!user || !user.jwtToken) {
        setEmailError('Ongeldige inloggegevens');
        return;
      }
      sessionStorage.setItem('jwtToken', user.jwtToken);
      sessionStorage.setItem('email', user.email);

      router.push('/overzicht'); // Replace with your target page
      router.push('/authenticatie/login'); // Replace with your target page
      dispatch(resetStatus()); // reset status to avoid repeated redirects
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
                placeholder="Gebruikersnaam"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            {nameError && (
              <p className="text-red-500 text-sm pt-2">{nameError}</p>
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
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </IconField>
            {repeatPasswordError && (
              <p className="text-red-500 text-sm pt-2">{repeatPasswordError}</p>
            )}
          </div>
          <Button
            label="Register"
            loading={loading}
            className="w-full"
            onClick={handleRegister}
          />
        </div>
      </main>
    </>
  );
}
