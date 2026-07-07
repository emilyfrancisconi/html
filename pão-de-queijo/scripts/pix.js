/**
 * ==============================================
 * scripts/pix.js
 * ==============================================
 * Responsabilidades:
 * - Gerar payload Pix “copia e cola” (linha digitável EMV/BR) sem bibliotecas externas.
 * - Ler o carrinho do localStorage (chave: 'carrinho'), calcular total e preencher:
 *   - #pix-valor
 *   - #pix-copia-e-cola
 *
 * Observações:
 * - Valores como KEY_PIX, MERCHANT_NAME e TXID estão fixos/parametrizados no próprio arquivo.
 * - O CRC16 é calculado localmente para fechar o payload.
 */

/*
  pix.js - Pix “copia e cola” (sem bibliotecas externas)

  - Lê o carrinho do localStorage (chave: carrinho)
  - Atualiza #pix-valor
  - Preenche #pix-copia-e-cola com um payload Pix simples
*/

(function () {
  function readCarrinho() {
    try {
      return JSON.parse(localStorage.getItem('carrinho') || '[]');
    } catch {
      return [];
    }
  }

  function formatBRL(value) {
    const n = Number(value || 0);
    return n.toFixed(2);
  }

function buildPixCopyPaste({ amount, merchant, txid, key }) {  
    // Este payload é um “linha copia e cola” compatível com leitores Pix.
    // Parâmetros usados aqui são exemplificações (ajuste conforme sua chave Pix e dados).

    const valor = formatBRL(amount);


    // Funções auxiliares do EMV
    const pad2 = (num) => String(num).padStart(2, '0');
    const tlv = (tag, value) => {
      const v = String(value ?? '');
      return `${tag}${pad2(v.length)}${v}`;
    };

    // Merchant Account Information - 26
    // Subelementos usados (exemplificados):
    // - 00: CP (chave)
    // - 01: chave Pix
    const gui = key ? tlv('01', key) : '';
    const merchantAccountInfo = tlv('00', 'BR.GOV.BCB.PIX') + gui;

    // Merchant Category Code - 52 (ex.: 0000)
    const merchantCategoryCode = tlv('52', '0000');

    // Transaction Currency - 53 (BRL)
    const transactionCurrency = tlv('53', '986');

    // Transaction Amount - 54
    const transactionAmount = tlv('54', valor);

    // Country Code - 58 (BR)
    const countryCode = tlv('58', 'BR');

    // Merchant Name - 59
    const merchantName = tlv('59', merchant || 'Pão de Queijo Mineiro');

    // Merchant City - 60
    const merchantCity = tlv('60', 'Curitiba');

    // Additional Data Field - 62
    // - 05: txid
    const additionalData = tlv('05', txid || `pedido-${Date.now()}`);
    const additionalDataField = `62${pad2(additionalData.length)}${additionalData}`;

    // Monta direto com componentes (EMV/linha copia e cola)
    const parts = [];
    parts.push('000201');

    if (merchantAccountInfo) {
      parts.push(`26${pad2(merchantAccountInfo.length)}${merchantAccountInfo}`);
    }

    parts.push(merchantCategoryCode);
    parts.push(transactionCurrency);
    parts.push(transactionAmount);
    parts.push(countryCode);
    parts.push(merchantName);
    parts.push(merchantCity);
    parts.push(additionalDataField);

    // CRC precisa ser calculado sobre tudo acima
    const payloadBase = parts.join('');

    // CRC16-CCITT (0x1021) com inicial 0xFFFF
    function crc16ccitt(str) {
      let crc = 0xFFFF;
      for (let i = 0; i < str.length; i++) {
        crc ^= (str.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
          crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : (crc << 1);
          crc &= 0xFFFF;
        }
      }
      return crc;
    }

    const crc = crc16ccitt(payloadBase);
    const crcStr = String(crc).padStart(4, '0').toUpperCase();
    return `${payloadBase}6304${crcStr}`;
  }

  function computeTotal(carrinho) {
    return carrinho.reduce((acc, item) => acc + (Number(item.preco || 0) * Number(item.quantidade || 0)), 0);
  }

  function init() {
    const carrinho = readCarrinho();
    const total = computeTotal(carrinho);

    const valorEl = document.getElementById('pix-valor');
    if (valorEl) valorEl.textContent = `R$ ${formatBRL(total).replace('.', ',')}`;

    const copiaEl = document.getElementById('pix-copia-e-cola');
    if (!copiaEl) return;

    // Ajuste os valores abaixo conforme sua conta Pix:
    const KEY_PIX = '00000000000';
    const MERCHANT_NAME = 'Pão de Queijo Mineiro';
    const TXID = `pedido-${Date.now()}`;

    // Observação: muitos leitores aceitam payload mesmo com dados fixos.
    const payload = buildPixCopyPaste({
      amount: total,
      merchant: MERCHANT_NAME,
      txid: TXID,
      key: KEY_PIX
    });

    copiaEl.value = payload;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

