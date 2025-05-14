import Navbar from '@/components/navbar';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

export default function Login() {
  return (
    <>
      <div className="sticky top-0">
        <Navbar />
      </div>
      <main className="flex items-center justify-center max-w-[70vw] mx-auto p-20 text-dark-700">
        <div className="bg-surface-100 flex flex-col justify-center gap-4 px-16 py-20  rounded-lg">
          <h2 className="font-semibold text-lg">Register</h2>
          <p>Please enter your details</p>
          <IconField iconPosition="left">
            <InputIcon className="pi pi-user"> </InputIcon>
            <InputText placeholder="Username" />
          </IconField>

          <IconField iconPosition="left">
            <InputIcon className="pi pi-envelope"> </InputIcon>
            <InputText placeholder="E-mail" />
          </IconField>

          <IconField iconPosition="left">
            <InputIcon className="pi pi-lock"> </InputIcon>
            <InputText type="password" placeholder="Password" />
          </IconField>

          <IconField iconPosition="left">
            <InputIcon className="pi pi-lock"> </InputIcon>
            <InputText type="password" placeholder="Repeat password" />
          </IconField>

          <Button label="Login" className="w-full" />
        </div>
      </main>
    </>
  );
}
