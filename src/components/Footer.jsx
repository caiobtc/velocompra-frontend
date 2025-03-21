import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary text-light py-4 mt-auto shadow-lg">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* Logo ou Nome da Empresa */}
        <div className="mb-3 mb-md-0 d-flex align-items-center">
          <i className="bi bi-lightning-charge-fill text-warning me-2" style={{ fontSize: '1.5rem' }}></i>
          <span className="fw-bold fs-5">Velocompra Backoffice</span>
        </div>

        {/* Links Rápidos */}
        <ul className="nav mb-3 mb-md-0">
          <li className="nav-item">
            <a href="/backoffice" className="nav-link px-2 text-light">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/produtos" className="nav-link px-2 text-light">
              Produtos
            </a>
          </li>
          <li className="nav-item">
            <a href="/usuarios" className="nav-link px-2 text-light">
              Usuários
            </a>
          </li>
        </ul>

        {/* Redes Sociais / Direitos */}
        <div className="d-flex align-items-center">
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="text-light me-3"
            aria-label="LinkedIn"
          >
            <i className="bi bi-linkedin" style={{ fontSize: '1.4rem' }}></i>
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="text-light me-3"
            aria-label="GitHub"
          >
            <i className="bi bi-github" style={{ fontSize: '1.4rem' }}></i>
          </a>
          <a
            href="mailto:contato@velocompra.com"
            className="text-light"
            aria-label="Email"
          >
            <i className="bi bi-envelope-fill" style={{ fontSize: '1.4rem' }}></i>
          </a>
        </div>
      </div>

      <div className="container mt-3 text-center .text-warning small">
        © {new Date().getFullYear()} Velocompra. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
