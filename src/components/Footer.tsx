import { site } from '@/content/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>{site.footerLine}</span>
        <div className="footer__links">
          <a href={site.links.email}>Email</a>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={site.links.resume}>Resume</a>
        </div>
      </div>
    </footer>
  );
}
