//adiciona evento de carregamento do conteudo da página para monitorar
document.addEventListener('DOMContentLoaded', function() {

    //carrega em variável o elemento hamburguer peli ID
    const hamburger = document.getElementById('hamburger');

    //carrega o elemento navMenu pelo ID
    const navMenu = document.getElementById('navMenu');

    //seleciona o evento "Click" para atribuir uma função aele
    hamburger.addEventListener('click', function() {
       
        // ativa o menu hamburguer
        hamburger.classList.toggle('active');
        //ativa o menu de navegação
        navMenu.classList.toggle('active');
    });
   
    // Fechar o menu quando um item for clicado
    //seleciona todos os itens do elemento
    const navItems = document.querySelectorAll('.nav-item');
   
    // executa enquanto houver itens
    navItems.forEach(item => {
        item.addEventListener('click', function() {

            //remove a condição de "active" do item
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});
