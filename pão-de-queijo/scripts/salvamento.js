// 1. Sua URL configurada corretamente
const URL_DO_GOOGLE = "https://script.google.com/macros/s/AKfycbyk2NPL8f9WgYCxRv2KrK7d4mOArJqiCOatTUxwRa6HUiOqdJQLedql1FjHPnT1K781/exec";

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formCadastro');

  if (formulario) {
    formulario.addEventListener('submit', function(e) {
      e.preventDefault(); 

      const formData = new FormData(this);
      const dadosCliente = Object.fromEntries(formData.entries());

      // Validação das senhas
      if (dadosCliente.senha !== dadosCliente.confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }

      // Envia os dados para a planilha
      fetch(URL_DO_GOOGLE, {
        method: "POST",
        mode: "no-cors", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosCliente)
      })
      .then(() => {
        alert("Cadastro enviado com sucesso!");
        this.reset(); 
      })
      .catch(erro => {
        console.error("Erro na conexão:", erro);
        alert("Ocorreu um erro técnico ao tentar salvar o cadastro.");
      });
    });
  }
});

