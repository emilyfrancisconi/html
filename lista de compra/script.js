// container de div
const container = document.createElement('div');
container.id = 'lista-container';
document.body.appendChild(container);

// estilo da div
container.style.backgroundColor = '';
container.style.border = '2px solid #f5feff';
container.style.borderRadius ='10px';
container.style.padding = '20px';
container.style.maxWidth ='450px';
container.style.margin = '20px auto';
container.style.boxShadow = '0 4px 8px #91bdbdd';


// titulo 
const titulo = document.createElement('h1');
titulo.textContent = 'Lista de Compras';
titulo.style.textAlign = 'center';
titulo.style.color ='white';
titulo.style.textShadow = '2px 2px 4px #000000';    
titulo.style.fontFamily = 'Arial, sans-serif';
titulo.style.fontWeight = 'bold';
container.appendChild(titulo);

// input de item
const inputItem = document.createElement('input');
inputItem.type = 'text';
inputItem.placeholder = ' Digite um item';
inputItem.style.textAlign = 'center';
inputItem.style.width = '70%';
inputItem.style.borderRadius = '15px';
inputItem.style.padding = '8px';
container.appendChild(inputItem);

// botao
const btnAdd = document.createElement('button');
btnAdd.textContent = 'Adicionar';
btnAdd.style.borderRadius = '15px';
btnAdd.style.margin ='1.5px';
btnAdd.style.padding ='6px 12px';
btnAdd.style.color = 'darkblue';
btnAdd.style.fontWeight = 'bold';
container.appendChild(btnAdd);

// criar lista
const lista = document.createElement('ol');
lista.style.marginTop = '15px';
container.appendChild(lista);

// criar a função da lista
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

// cria a função de clicar enter e funcionar
btnAdd.addEventListener('click', adicionarItem);

inputItem.addEventListener('keydown', (event) =>{
    if (event.key === 'Enter'){
        adicionarItem();
    }
});

// estilo da página inteira body
document.body.style.backgroundColor = '#5a5d61';