//botão para salvar
const btnSalvar = document.createElement('button');
btnaSlvar.textContent = 'Salvar lista';
btnSalvar.style.display = 'block';
btnSalvar.style.margin = '20px auto';
btnSalvar.style.padding = '6px 12px';
btnSalvar.style.cursor = 'poninter';
conteriner.appendchild(btnSalvar);

//função para salvar a lista em um arquivo .txt
function salvarlista() {
    //pega todos os <li> e monta o texto (cada item em uma linha)
    const itens = Array.from(lista.queryselectorall ('li'))
                        .map(li=> li.textContent)
                        .join('/n');
if (!itens){
    alert('a lista esta vazia!');
    return;
}

//cria um blob com o conteudo de texto
const blob = new blob([itens], {type:  'text/plain'});
const url = url.creteobjecturl(blob);

//cria um link temporario para download
const a = document.createElement ('a');
a.href = url;
a.download = 'lista.text'; // nome do arquivo
document.body.appendChild(a);
a.click(); // dispara o download
document.body.removeChild(a);

//libera o objeto url
url.revokeobjecturl(url);

}

//evento do botão
btnsalvar.addEventListener('click',Salvarlista);
