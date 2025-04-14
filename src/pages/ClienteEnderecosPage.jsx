import { useEffect, useState } from 'react';
import api from '../services/api';
import AlertUtils from '../utils/alerts';
import NavbarLoja from '../components/NavbarLoja';

const ClienteEnderecosPage = () => {
  const [enderecos, setEnderecos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const buscarEnderecos = async () => {
    try {
      const res = await api.get('/clientes/meus-enderecos');
      setEnderecos(res.data);
    } catch (err) {
      AlertUtils.erro('Erro ao carregar endereços.');
    } finally {
      setCarregando(false);
    }
  };

  const definirPadrao = async (id) => {
    try {
      await api.patch(`/clientes/meus-enderecos/${id}/definir-padrao`);
      AlertUtils.sucesso('Endereço definido como padrão!');
      buscarEnderecos();
    } catch (err) {
      AlertUtils.erro('Erro ao definir endereço padrão.');
    }
  };

  useEffect(() => {
    buscarEnderecos();
  }, []);

  return (
    <>
      <NavbarLoja />
      <div className="container mt-5">
        <h3 className="text-primary text-center mb-4">Meus Endereços de Entrega</h3>

        {carregando ? <p>Carregando...</p> : (
          <div className="row">
            {enderecos.map((end, idx) => (
              <div className="col-md-6 mb-4" key={idx}>
                <div className={`card shadow p-3 ${end.padrao ? 'border-success' : ''}`}>
                  <p className="mb-1"><strong>CEP:</strong> {end.cep}</p>
                  <p className="mb-1"><strong>Logradouro:</strong> {end.logradouro}, {end.numero}</p>
                  <p className="mb-1"><strong>Bairro:</strong> {end.bairro}</p>
                  <p className="mb-1"><strong>Cidade:</strong> {end.cidade}/{end.uf}</p>
                  <p className="mb-1"><strong>Complemento:</strong> {end.complemento || '-'}</p>
                  <p className="mb-2"><strong>Padrão:</strong> {end.padrao ? 'Sim' : 'Não'}</p>
                  {!end.padrao && (
                    <button className="btn btn-outline-success w-100" onClick={() => definirPadrao(end.id)}>
                      Definir como padrão
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ClienteEnderecosPage;