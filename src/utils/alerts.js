// src/utils/alerts.js
import Swal from 'sweetalert2';

const AlertUtils = {
  sucesso: (mensagem = 'Ação realizada com sucesso!') => {
    return Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: mensagem,
    });
  },

  erro: (mensagem = 'Algo deu errado.') => {
    return Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: mensagem,
    });
  },

  aviso: (mensagem = 'Atenção!') => {
    return Swal.fire({
      icon: 'warning',
      title: 'Aviso!',
      text: mensagem,
    });
  },

  info: (mensagem = 'Informação importante.') => {
    return Swal.fire({
      icon: 'info',
      title: 'Informação',
      text: mensagem,
    });
  },

  confirmar: async (mensagem = 'Tem certeza?', titulo = 'Confirmação') => {
    const resultado = await Swal.fire({
      title: titulo,
      text: mensagem,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    });

    return resultado.isConfirmed;
  },

  promptTexto: async (titulo = 'Digite algo:', placeholder = '') => {
    const { value: texto } = await Swal.fire({
      title: titulo,
      input: 'text',
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    });

    return texto;
  },
};

export default AlertUtils;
