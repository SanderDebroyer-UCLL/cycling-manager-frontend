import { UserDTO } from '@/types/user';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Image from 'next/image';
import Link from 'next/link';
import { container, containerLargerPadding } from '@/const/containerStyle';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useEffect } from 'react';
import { fetchUsers } from '@/features/users/users.slice';
import { fetchCompetitions } from '@/features/competitions/competitions.slice';
import { CompetitionDTO, CompetitionStatus } from '@/types/competition';
import image1 from '@/public/images/1.webp';
import image2 from '@/public/images/2.webp';
import image3 from '@/public/images/3.webp';
import image4 from '@/public/images/4.webp';
import image5 from '@/public/images/5.webp';
import image6 from '@/public/images/6.webp';
import image7 from '@/public/images/7.webp';
import image8 from '@/public/images/8.webp';
import tdfBanner from '@/public/images/tdf_banner.webp';
import giroBanner from '@/public/images/giro_banner.webp';
import vueltaBanner from '@/public/images/vuelta_banner.webp';
import RaceChipBodyTemplate from '@/components/template/RaceChipBodyTemplate';
import AnimatedContent from '@/components/AnimatedContent';

export default function Overview() {
  const dispatch = useDispatch<AppDispatch>();
  const users: UserDTO[] = useSelector((state: RootState) => state.users.data);
  const usersStatus = useSelector((state: RootState) => state.users.status);
  const competitions: CompetitionDTO[] = useSelector(
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
  const topThreeUsers =
    sortedUsers.length >= 3
      ? [sortedUsers[1], sortedUsers[0], sortedUsers[2]]
      : sortedUsers.slice(0, 3);

  const nameBodyTemplate = (user: UserDTO) => {
    return (
      <div className="flex items-center gap-2">
        {user.firstName} {user.lastName}
      </div>
    );
  };

  if (!users || !competitions || users.length === 0) {
    return <LoadingOverlay />;
  }

  return (
    <main className="p-20 flex flex-col gap-4 max-w-[80vw] mx-auto">
      <div className="flex flex-col gap-4">
        <AnimatedContent
          distance={15}
          direction="vertical"
          reverse={false}
          duration={0.7}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          delay={0}
        >
          <h2 className="text-xl font-semibold ">Actieve Competities</h2>
        </AnimatedContent>
        <div className="rounded-xl overflow-hidden">
          <div
            style={containerLargerPadding}
            className="w-full !h-70 !flex-row !gap-8 overflow-x-auto overflow-y-hidden"
          >
            {[
              ...competitions.filter(
                (competition: CompetitionDTO) =>
                  competition.competitionStatus !== CompetitionStatus.FINISHED,
              ),
            ]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((competition: CompetitionDTO, index) => (
                <AnimatedContent
                  distance={0}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="power3.out"
                  initialOpacity={0.7}
                  animateOpacity
                  scale={0.98}
                  delay={index * 0.2}
                  key={competition.name}
                >
                  <div className="relative rounded-xl shadow-md overflow-hidden h-full w-full min-w-95">
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
                                    image8,
                                    image3,
                                    image4,
                                    image5,
                                    image6,
                                    image7,
                                  ][index % 8]
                        }
                        alt={competition.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />

                      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 text-white font-medium font-manrope z-10">
                        <div className="text-2xl">{competition.name}</div>
                        <div className="flex flex-wrap gap-2">
                          <RaceChipBodyTemplate competition={competition} />
                        </div>
                      </div>
                    </Link>
                  </div>
                </AnimatedContent>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-4 w-full flex-1/4">
          <AnimatedContent
            distance={15}
            direction="vertical"
            reverse={false}
            duration={0.7}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={1}
            delay={0}
          >
            <h2 className="text-xl font-semibold">Klassement</h2>
          </AnimatedContent>
          <div
            style={container}
            className="w-fit h-80 bg-surface flex flex-col justify-center gap-6 rounded-xl overflow-hidden p-8"
          >
            <div className="flex flex-row gap-8 items-end justify-center">
              {topThreeUsers.map((user: UserDTO | undefined, index) =>
                user ? (
                  <div
                    className="flex flex-col items-center gap-1"
                    key={user.id}
                  >
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
                ) : null,
              )}
            </div>
            <div className="text-center">
              {sortedUsers[0] && sortedUsers[1] ? (
                <p className="text-center">
                  {sortedUsers[0].firstName} staat op de eerste plaats{' '}
                  {(sortedUsers[0].totalPoints ?? 0) -
                    (sortedUsers[1].totalPoints ?? 0)}{' '}
                  punten voor op {sortedUsers[1].firstName}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full flex-3/4">
          <AnimatedContent
            distance={15}
            direction="vertical"
            reverse={false}
            duration={0.7}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={1}
            delay={0}
          >
            <h2 className="text-xl font-semibold">Algemeen klassement</h2>
          </AnimatedContent>
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
