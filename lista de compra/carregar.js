

const btnCarregar = document.createElement('button');
btnCarregar.textContent = 'Carregar Lista';
btnCarregar.style.display ='block';
btnCarregar.style.margin ='20px auto';
btnCarregar.style.padding ='6px 12px';
btnCarregar.style.cursor = 'poiter';
btnCarregar.style.borderRadius = '15px';
btnCarregar.style.color = 'darkblue';
btnCarregar.style.fontWeight = 'bold';
btnCarregar.style.fontWeight = 'bold';
container.appendChild(btnCarregar);

//oculto
const inputArquivo = document.createElement('input');
inputArquivo.type = 'file';
inputArquivo.accept = '.txt';
inputArquivo.style.display = 'none';
document.body.appendChild(inputArquivo);

function carregarListaArquivo(file) {
    const reader = new FileReader();
    reader.onload = function() {
        lista.innerHTML = '';

        const linhas = reader.result.split(/\r?\n/).filter(l => l.trim() !== '');  
        linhas.forEach(linha => {
            const li = document.createElement('li');
            li.textContent = linha;
            li.style.padding = '4px 0';

            li.style.borderBottom = '1px solid #ccc';

            lista.appendChild(li);
        });  
    };
    reader.readAsText(file);

    btnCarregar.addEventListener('click', () => inputArquivo.click());
    inputArquivo.addEventListener('change', () => {
        const file = inputArquivo.files[0];
        if (file) {
            carregarListaArquivo(file);
            inputArquivo.value = ''; // limpa o valor para permitir carregar o mesmo arquivo novamente
        }
    });
}