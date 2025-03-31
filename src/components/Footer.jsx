import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary text-light py-4 mt-auto shadow-lg">
      <div className="container text-center">
        
        {/* Redes Sociais */}
        <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="text-light" aria-label="LinkedIn">
            <i className="bi bi-linkedin" style={{ fontSize: '1.4rem' }}></i>
          </a>
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="text-light" aria-label="GitHub">
            <i className="bi bi-github" style={{ fontSize: '1.4rem' }}></i>
          </a>
          <a href="mailto:contato@velocompra.com" className="text-light" aria-label="Email">
            <i className="bi bi-envelope-fill" style={{ fontSize: '1.4rem' }}></i>
          </a>
        </div>

        {/* SAC */}
        <div className="mb-2 fw-medium">
          SAC Velocompra: <span className="text-warning">0800 000 0000</span>
        </div>

        {/* Direitos autorais */}
        <div className="text-warning small">
          © {new Date().getFullYear()} Velocompra. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
