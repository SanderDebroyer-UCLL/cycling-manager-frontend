import Navbar from '@/components/navbar';

import { grandTours, users } from '@/const/data';
import { GrandTour } from '@/types/grandtour';
import { User } from '@/types/user';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Image from 'next/image';
import Link from 'next/link';

export default function Overview() {
  // Sort users by score descending and get top 3
  const sortedUsers = users.sort(
    (a: User, b: User) => (b.score ?? 0) - (a.score ?? 0),
  );
  // Reorder: [2nd, 1st, 3rd]
  const topThreeUsers = [sortedUsers[1], sortedUsers[0], sortedUsers[2]];

  const nameBodyTemplate = (user: User) => {
    return (
      <div className="flex items-center gap-2">
        <img
          src={user.profilePicture}
          alt={user.firstName}
          height={32}
          width={32}
          className="rounded-full"
        />
        <p>
          {user.firstName} {user.lastName}
        </p>
      </div>
    );
  };

  return (
    <main className="max-w-[70vw] mx-auto p-20 text-dark-700 class flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Actieve Competities</h2>
        <div className="rounded-lg overflow-hidden">
          <div className="w-full h-70 bg-surface-100 flex items-center justify-between gap-4 shadow-md overflow-x-auto p-8">
            {grandTours.map((tour: GrandTour) => (
              <div
                className="relative rounded-lg shadow-md overflow-hidden h-full w-full min-w-75"
                key={tour.name}
              >
                <Link href={`${tour.href}`} key={tour.name}>
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent" />

                  <div className="relative  p-4 flex items-center gap-4 text-2xl text-white font-medium font-manrope">
                    <Image
                      src={tour.iconLight}
                      className="object-contain h-12 w-12"
                      alt={''}
                    />
                    {tour.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4 w-full flex-1/4">
          <h2 className="text-xl font-semibold">Klassement</h2>
          <div className="w-fit h-80 bg-surface-100 flex flex-col justify-center gap-6 rounded-lg shadow-md overflow-hidden p-8">
            <div className="flex flex-row gap-6 items-end justify-between">
              {topThreeUsers.map((user: User, index) => (
                <div className="flex flex-col items-center gap-1" key={user.id}>
                  <Image
                    src={user.profilePicture!}
                    alt={user.firstName!}
                    width={56}
                    height={56}
                    className="object-cover rounded-full"
                  />
                  <p> {user.firstName} </p>
                  <div
                    className={`flex items-center justify-center font-semibold text-lg rounded-t-xl w-full shadow-md ${
                      index === 1
                        ? 'h-28 bg-blue-500'
                        : index === 0
                          ? 'h-21 bg-blue-400'
                          : 'h-14 bg-blue-300'
                    }`}
                  >
                    <p className="bg-surface-100 rounded-full p-4  h-6 w-6 flex items-center justify-center">
                      {index == 1 ? 1 : index == 0 ? 2 : 3}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center">
              {sortedUsers[0].firstName} is in first place{' '}
              {sortedUsers[0].score ?? 0 - (sortedUsers[1].score ?? 0)} points
              ahead of {sortedUsers[1].firstName}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full flex-3/4">
          <h2 className="text-xl font-semibold">Huidig klassement</h2>
          <div className="overflow-hidden rounded-lg">
            <div className="overflow-auto max-h-80 shadow-md w-full flex-3/4">
              <DataTable value={sortedUsers} tableStyle={{ width: '100%' }}>
                <Column
                  header="Position"
                  body={(rowData, { rowIndex }) => rowIndex + 1}
                />
                <Column header="Name" body={nameBodyTemplate}></Column>
                <Column field="score" header="Score"></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
