const DropdownTeste = () => {
  return (
    <div className="dropdown mt-5 text-center">
      <button
        className="btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Menu de Teste
      </button>
      <ul className="dropdown-menu show">
        <li><a className="dropdown-item" href="#">Ação</a></li>
        <li><a className="dropdown-item" href="#">Outra ação</a></li>
      </ul>
    </div>
  );
};

export default DropdownTeste;
