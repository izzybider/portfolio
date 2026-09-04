import Header from './Header';
import Footer from './Footer';

export default function PageShell({
  children,
  nav,
}: {
  children: React.ReactNode;
  /** Optional case-study sub-navigation rendered under the header. */
  nav?: React.ReactNode;
}) {
  return (
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      {nav}
      <main className="main" id="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
