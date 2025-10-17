const btnSalvar = document.createElement('button');
btnSalvar.textContent = 'Salvar Lista';
btnSalvar.style.display ='block';
btnSalvar.style.margin ='20px auto';
btnSalvar.style.padding ='6px 12px';
btnSalvar.style.cursor = 'poiter';
btnSalvar.style.borderRadius = '15px';
btnSalvar.style.color = 'darkblue';
btnSalvar.style.fontWeight = 'bold';
container.appendChild(btnSalvar);

function salvarLista() {
    const itens = Array.from(lista.querySelectorAll('li'))
                       .map(li => li.textContent)
                       .join('\n');

    if (!itens){
        alert('A lista está vazia!');
        return;
    }

    //criar um blob com o conteúdo do texto
    const blob = new Blob([itens], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);

    //cria um link temporário para download 
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista.txt';
    document.body.appendChild(a);
    a.click();//dispara o download
    document.body.removeChild(a);

    //libera o objeto URL
    URL.revokeObjectURL(url);

    lista.innerHTML = '';
}

btnSalvar.addEventListener('click', salvarLista);