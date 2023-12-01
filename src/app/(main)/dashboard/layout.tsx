export type MainLayoutProps = {
  children: React.ReactNode;
  params: any;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return <main className="flex overflow-hidden h-screen">{children}</main>;
};

export default MainLayout;
