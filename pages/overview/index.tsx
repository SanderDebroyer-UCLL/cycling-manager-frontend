import Navbar from '@/components/navbar2';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

export default function Overview() {
  return (
    <>
      <div className="sticky top-0">
        <Navbar />
      </div>
      <main className="flex items-center max-w-[70vw] mx-auto p-20 text-dark-700">
        <div>
          <h2 className="text-2xl font-semibold">Je actieve competities</h2>
          <div className="w-full bg-surface-100">{}</div>
        </div>
      </main>
    </>
  );
}
