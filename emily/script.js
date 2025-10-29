 const titulo = document.createElement=('div');
titulo.id='titulo';
titulo.color = 'white';
titulo.style.fontSize = '32px';
titulo.style.fontFamily = 'Arial, sans-serif';
titulo.style.textAlign = 'center';
titulo.style.marginTop ='100px';
// Cria um elemento div para o título
const titulo = document.createElement('div');
titulo.id = 'titulo';

// Estilo visual do título
titulo.style.color = 'white';
titulo.style.fontSize = '32px';
titulo.style.fontFamily = 'monospace';
titulo.style.textAlign = 'center';
titulo.style.marginTop = '100px';

// Adiciona o título ao corpo da página
document.body.appendChild(titulo);

// Texto que será digitado
const texto = 'Quanto mais você o segura mais o tempo te consome';

// Variável para controlar o índice das letras
let i = 0;

// Função que "digita" as letras uma por uma
function digitar() {
  if (i < texto.length) {
    titulo.textContent += texto.charAt(i); // adiciona uma letra
    i++;
    setTimeout(digitar, 100); // chama a função novamente após 100ms
  }
}

// Inicia o efeito de digitação
digitar();