import NavbarBackoffice from './NavbarBackoffice.jsx';
import Footer from './Footer.jsx';


const BackofficeLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <NavbarBackoffice />
      <main className="flex-grow-1 d-flex justify-content-center align-items-center bg-light">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BackofficeLayout;
