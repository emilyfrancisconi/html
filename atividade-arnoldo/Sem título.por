programa {
  funcao inicio() {
    // declaração de variaveis
    real salarioFixo, valordeVendas, bonus, salarioTotal, media
    cadeia nomeFuncionario

    escreva("informe nome do Funcionario")
    leia(nomeFuncionario)

    escreva("informe salario fixo: ")
    leia(salarioFixo)

    escreva("informe valor de vendas: ")
    leia(valordeVendas)

    escreva("informe o bonus")
    leia(bonus)

    escreva("informe salario total")
    leia(salarioTotal)

    //calculo da media
    media = (salarioFixo + valordeVendas + bonus + salarioTotal)/4
  }
}
