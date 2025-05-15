import Navbar from '@/components/navbar';

const DefaultWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="sticky top-0">
        <Navbar />
      </div>
      {children}
    </>
  );
};

export default DefaultWrapper;
