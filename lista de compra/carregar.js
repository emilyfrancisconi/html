

// Botão para carregar lista
const btnCarregar = document.createElement('button');
btnCarregar.textContent = 'Carregar Lista';
btnCarregar.style.display = 'block';
btnCarregar.style.margin = '10px auto';
btnCarregar.style.padding = '6px 12px';
btnCarregar.style.cursor = 'pointer';
container.appendChild(btnCarregar);

// Input de arquivo oculto
const inputArquivo = document.createElement('input');
inputArquivo.type = 'file'; 
inputArquivo.accept = '.txt'; // apenas arquivos de texto
inputArquivo.style.display = 'none'; 
document.body.appendChild(inputArquivo);

// Função para processar o arquivo selecionado
function carregarListaDoArquivo(file){
    const reader = new FileReader();
    reader.onload = function (){
        //limpa a lista atual (opcional)
       lista.innerHTML = '';

       //divide o conteudo em linhas e adiciona cada uma como <li>
       const linha = reader.result.split(/\r?\n/).filter(l => l.trim() !=='');
       linhas.forEach(linha => {
        const li = document.createElement('li');
        li.textContent = linha;
        li.style.padding = '4px 0';

        li.style.borderBottom = '1px solid ###ccc'
        //linha fina cinza

        linha.appendChild(li)

       } );

    };
    reader.dAstext(file);
}

//eventos
btnCarregar;addEventListener('click', () => inputArquivo.click());