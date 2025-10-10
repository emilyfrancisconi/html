//botão para salvar
const btnSalvar = document.createElement('button');
btnaSlvar.textContent = 'Salvar lista';
btnSalvar.style.display = 'block';
btnSalvar.style.margin = '10px auto';
btnSalvar.style.padding = '6px 12px';
btnSalvar.style.cursor = 'poninter';
btnSalvar.style.border = 'nome'
conteriner.appendchild(btnSalvar);

//função para salvar a lista em um arquivo .txt
function salvarlista() {
    //pega todos os <li> e monta o texto (cada item em uma linha)
    const itens = Array.from(lista.queryselectorAll ('li span:first-child'))
                        .map(spam => spam.textContent)
                        .join('\n');
if (!itens){
    alert('a lista esta vazia!');
    return;
}

const blob = new blob([itens], {type:  'text/plain'});
const url = URL.createObjectURL(blob);

const a = document.createElement ('a');
a.href = url;
a.download = 'lista.text'; 
document.body.appendChild(a);
a.click(); 
document.body.removeChild(a);

URL.revokeObjectURL(url);

//limpa a lista
lista.innerHTML = '';

}

//evento do botão
btnsalvar.addEventListener('click',Salvarlista);
