// pages/login.tsx or wherever this file is
import Navbar from '@/components/navbar';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store'; // adjust path if needed
import { loginUserRequest } from '@/features/user/user.slice';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    dispatch(loginUserRequest({ email, password }));
  };

  return (
    <>
      <div className="sticky top-0">
        <Navbar />
      </div>
      <main className="flex items-center justify-center max-w-[70vw] mx-auto p-20 text-dark-700">
        <div className="bg-surface-100 flex flex-col justify-center gap-4 px-16 py-20  rounded-lg">
          <h2 className="font-semibold text-lg">Log in</h2>
          <p>Please enter your details</p>

          <IconField iconPosition="left">
            <InputIcon className="pi pi-envelope" />
            <InputText
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </IconField>

          <IconField iconPosition="left">
            <InputIcon className="pi pi-lock" />
            <InputText
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </IconField>

          <Button label="Login" className="w-full" onClick={handleLogin} />
        </div>
      </main>
    </>
  );
}
