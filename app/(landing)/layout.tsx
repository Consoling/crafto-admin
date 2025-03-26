const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen bg-[#111827] overflow-auto">
      <div className="mx-auto max-w-screen-xl  w-full items-center justify-center flex h-full">
        {children}
      </div>
    </main>
  );
};

export default LandingLayout;
