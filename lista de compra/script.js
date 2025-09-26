//cria uma div "conteiner" e adicionar ao body
const conteiner = document.createElement('div');
conteiner.id = 'lista-conteiner';
document.body.appendChild(conteiner);

//=====Estilos direto no js =====
conteiner.style.backgroundColor = '#f9f9f9'; //cor de fundo 
conteiner.style.border = '2px solid #ccc'; //borda
conteiner.style.borderRadius = '10px'; //cantos arredondados
conteiner.style.padding = '10px'; //espaçamento interno
conteiner.style.maxWidth = '500px'; //largura maxima
conteiner.style.margin = '50px auto'; //centralizar horizontal
conteiner.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; //sombra


//cria o titulo
const titulo = document.createElement('h1');
titulo.textContent = 'Lista de Compras';
titulo.style.textAlign = 'center'; //exemplo de estilo no titulo 
conteiner.appendChild(titulo);

//cria input de texto
const inputItem = document.createElement('input');
inputItem.type = 'text';
inputItem.placeholder = ' Digite um item';
inputItem.style.width = '50%'
document.body.appendChild(inputItem);

const btnAdd = document.createElement('button');
btnAdd.textContent = 'Adicionar';
document.body.appendChild(btnAdd);

const lista = document.createElement('ul');
document.body.appendChild(lista);


function adicionarItem() {
    const valor =  inputItem.value.trim();
    if (valor !== '') {
        const li = document.createElement('li');
        li.textContent= valor;
        lista.appendChild(li);
        inputItem.value = '';
        inputItem.focus(); // volta o foco para o campo
    }
};

btnAdd.addEventListener('click', adicionarItem);

inputItem.addEventListener('keydown', (event) =>{
    if (event.key === 'Enter'){
        adicionarItem();
    }
});


document.body.style.backgroundColor = 'gray';
document.body.style.textAlign = 'center';
document.body.style.alignItems = 'center';



