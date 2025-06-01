import { UserDTO } from '@/types/user';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Image from 'next/image';
import Link from 'next/link';
import { container, containerLargerPadding } from '@/const/containerStyle';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Key, useEffect } from 'react';
import { fetchUsers } from '@/features/users/users.slice';
import { fetchCompetitions } from '@/features/competitions/competitions.slice';
import { CompetitionDTO } from '@/types/competition';
import image1 from '@/public/images/1.jpg';
import image2 from '@/public/images/2.jpg';
import image3 from '@/public/images/3.jpg';
import image4 from '@/public/images/4.jpg';
import image5 from '@/public/images/5.jpg';
import image6 from '@/public/images/6.jpg';
import tdfBanner from '@/public/images/tdf_banner.webp';
import giroBanner from '@/public/images/giro_banner.jpg';
import vueltaBanner from '@/public/images/vuelta_banner.jpg';
import RaceChipBodyTemplate from '@/components/RaceChipBodyTemplate';

export default function Overview() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.data);
  const usersStatus = useSelector((state: RootState) => state.users.status);
  const competitions = useSelector(
    (state: RootState) => state.competitions.data,
  );
  const competitionsStatus = useSelector(
    (state: RootState) => state.competitions.status,
  );

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, usersStatus]);

  useEffect(() => {
    if (competitionsStatus === 'idle') {
      dispatch(fetchCompetitions());
    }
  }, [dispatch, competitionsStatus]);

  // Sort users by score descending and get top 3
  const sortedUsers = [...users].sort(
    (a: UserDTO, b: UserDTO) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0),
  );
  // Reorder: [2nd, 1st, 3rd]
  const topThreeUsers = [sortedUsers[1], sortedUsers[0], sortedUsers[2]];

  const nameBodyTemplate = (user: UserDTO) => {
    return (
      <div className="flex items-center gap-2">
        <p>
          {user.firstName} {user.lastName}
        </p>
      </div>
    );
  };

  if (!users || users.length === 0) {
    return <LoadingOverlay />;
  }

  return (
    <main className="max-w-[80vw] mx-auto p-20 text-dark-700 class flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Actieve Competities</h2>
        <div className="rounded-xl overflow-hidden">
          <div
            style={containerLargerPadding}
            className="w-full h-70 !flex-row !gap-8 overflow-x-auto"
          >
            {[...competitions]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((competition: CompetitionDTO) => (
                <div
                  className="relative rounded-xl shadow-md overflow-hidden h-full w-full min-w-75"
                  key={competition.name}
                >
                  <Link href={`competities/${competition.id}`}>
                    <Image
                      src={
                        competition.races.some((race) =>
                          race.name
                            .toLocaleLowerCase()
                            .includes('tour de france'),
                        )
                          ? tdfBanner
                          : competition.races.some((race) =>
                                race.name
                                  .toLocaleLowerCase()
                                  .includes("giro d'italia"),
                              )
                            ? giroBanner
                            : competition.races.some((race) =>
                                  race.name
                                    .toLocaleLowerCase()
                                    .includes('vuelta'),
                                )
                              ? vueltaBanner
                              : [
                                  image1,
                                  image2,
                                  image3,
                                  image4,
                                  image5,
                                  image6,
                                ][competitions.indexOf(competition) % 6]
                      }
                      alt={competition.name}
                      fill
                      className="object-cover"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />

                    {/* Text content positioned at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 text-white font-medium font-manrope z-10">
                      <div className="text-2xl">{competition.name}</div>
                      <div className="flex flex-wrap gap-2">
                        <RaceChipBodyTemplate competition={competition} />
                      </div>
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
          <div
            style={container}
            className="w-fit h-80 bg-surface flex flex-col justify-center gap-6 rounded-xl shadow-md overflow-hidden p-8"
          >
            <div className="flex flex-row gap-8 items-end justify-center">
              {topThreeUsers.map((user: UserDTO, index) => (
                <div className="flex flex-col items-center gap-1" key={user.id}>
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-secondary-container text-on-secondary-container font-semibold">
                    {user.firstName.slice(0, 1).toUpperCase()}
                    {user.lastName.slice(0, 1).toUpperCase()}
                  </div>
                  <p> {user.firstName} </p>
                  <div
                    className={`flex items-center justify-center font-semibold text-lg rounded-t-xl w-full shadow-md ${
                      index === 1
                        ? 'h-28 bg-primary'
                        : index === 0
                          ? 'h-21 bg-primary-fixed-dim'
                          : 'h-14 bg-primary-fixed'
                    }`}
                  >
                    <p className="bg-surface rounded-full p-4  h-6 w-6 flex items-center justify-center">
                      {index == 1 ? 1 : index == 0 ? 2 : 3}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center">
              {sortedUsers[0].firstName} staat op de eerste plaats{' '}
              {sortedUsers[0].totalPoints ??
                0 - (sortedUsers[1].totalPoints ?? 0)}{' '}
              punten voor op {sortedUsers[1].firstName}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full flex-3/4">
          <h2 className="text-xl font-semibold">Algemeen klassement</h2>
          <div className="overflow-hidden rounded-xl">
            <div
              style={container}
              className="overflow-auto h-80 overflow-y-auto w-full flex-3/4"
            >
              <DataTable value={sortedUsers} tableStyle={{ width: '100%' }}>
                <Column
                  header="Positie"
                  body={(rowData, { rowIndex }) => rowIndex + 1}
                />
                <Column header="Naam" body={nameBodyTemplate}></Column>
                <Column field="totalPoints" header="Punten"></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
