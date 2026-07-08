// pagamento-qr.js
// Responsável por ações da página de pagamento via Pix.
// Atualmente: copiar o código Pix (texto do textarea #pix-copia-e-cola) para a área de transferência.

function copyPix(){
    const el = document.getElementById('pix-copia-e-cola');
    if(!el) return;

    if(!el.value){
        alert('Código Pix ainda não carregou.');
        return;
    }

    // Seleciona e copia (compatível com navegadores que ainda suportam document.execCommand)
    el.focus();
    el.select();
    document.execCommand('copy');
    alert('Código Pix copiado!');
}

// expõe para o inline onclick="copyPix()" continuar funcionando
window.copyPix = copyPix;

