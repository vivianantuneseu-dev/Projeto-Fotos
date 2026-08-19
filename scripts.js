// ==========================================================================
// 1. VARIÁVEIS DE ESTADO E HISTÓRICO
// ==========================================================================
let totalGasto = 0;
let quantidadeComprovantes = 0;

// Lista onde guardamos todas as notas lidas para montar o relatório
let historicoNotas = [];

// ==========================================================================
// 2. FUNÇÃO PARA LER A FOTO E REGISTAR A NOTA
// ==========================================================================
function lerFoto(event) {
    const arquivo = event.target.files[0];

    if (arquivo) {
        // Criamos o objeto completo com os dados da nota fiscal lida
        const novaNota = {
            id: quantidadeComprovantes + 1,
            estabelecimento: "ELTON DE SOUSA SILVA MERCADO & CIA LTDA",
            data: new Date().toLocaleDateString('pt-BR'),
            itens: [
                { produto: "COENTRO UND", qtd: "2,000 UN", valor: 9.98 },
                { produto: "BATATA LAVADA KG", qtd: "1,000 KG", valor: 9.50 },
                { produto: "COSTELA P.A. KG", qtd: "4,000 KG", valor: 127.96 },
                { produto: "PICADAO KG", qtd: "3,500 KG", valor: 139.65 }
            ],
            acrescimo: 5.00,
            subtotalProdutos: 287.09,
            totalNota: 292.09
        };

        // Adiciona a nota ao histórico
        historicoNotas.push(novaNota);

        // Atualiza os totais acumulados
        totalGasto += novaNota.totalNota;
        quantidadeComprovantes += 1;

        // Atualiza a interface
        atualizarTela();
        
        console.log("Nota adicionada ao histórico!", novaNota);
    }
}

// ==========================================================================
// 3. FUNÇÃO PARA ATUALIZAR OS VALORES NA TELA
// ==========================================================================
function atualizarTela() {
    const valorFormatado = totalGasto.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    document.querySelector('.total-gasto').innerText = valorFormatado;

    const textoQuantidade = quantidadeComprovantes === 1 
        ? '1 comprovante lido' 
        : `${quantidadeComprovantes} comprovantes lidos`;

    document.querySelector('.comprovantes-lidos').innerText = textoQuantidade;
}

// ==========================================================================
// 4. FUNÇÃO PARA GERAR O RELATÓRIO GERAL EM PDF
// ==========================================================================
function gerarRelatorioPDF() {
    if (historicoNotas.length === 0) {
        alert("Por favor, fotografe pelo menos um comprovante antes de gerar o relatório.");
        return;
    }

    // 1. Cria a estrutura HTML do relatório
    let conteudoHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #22304a;">
            <h1 style="text-align: center; color: #0f766e; margin-bottom: 5px;">Relatório Geral de Gastos</h1>
            <p style="text-align: center; color: #6b7a94; font-size: 14px; margin-bottom: 20px;">
                Emitido em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
            </p>
            <hr style="border: 0; border-top: 1px solid #ccc; margin-bottom: 20px;" />
    `;

    // 2. Percorre cada nota fiscal do histórico para montar as tabelas
    historicoNotas.forEach((nota, index) => {
        conteudoHTML += `
            <div style="margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background-color: #fafafa;">
                <h3 style="color: #0f766e; margin-bottom: 8px;">
                    Nota #${nota.id} - ${nota.estabelecimento}
                </h3>
                <p style="font-size: 12px; color: #64748b; margin-bottom: 10px;">Data: ${nota.data}</p>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 10px;">
                    <thead>
                        <tr style="background-color: #0f766e; color: white;">
                            <th style="padding: 6px; text-align: left;">Item / Produto</th>
                            <th style="padding: 6px; text-align: center;">Qtd</th>
                            <th style="padding: 6px; text-align: right;">Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Adiciona cada item da nota
        nota.itens.forEach(item => {
            conteudoHTML += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 6px;">${item.produto}</td>
                    <td style="padding: 6px; text-align: center;">${item.qtd}</td>
                    <td style="padding: 6px; text-align: right;">R$ ${item.valor.toFixed(2)}</td>
                </tr>
            `;
        });

        // Adiciona o Subtotal e Acréscimo da nota
        conteudoHTML += `
                    </tbody>
                </table>
                
                <div style="text-align: right; font-size: 13px; margin-top: 8px;">
                    <p>Subtotal Produtos: <strong>R$ ${nota.subtotalProdutos.toFixed(2)}</strong></p>
                    <p>Acréscimo: <strong>R$ ${nota.acrescimo.toFixed(2)}</strong></p>
                    <p style="font-size: 15px; color: #0f766e; margin-top: 4px;">
                        <strong>SUBTOTAL DA NOTA: R$ ${nota.totalNota.toFixed(2)}</strong>
                    </p>
                </div>
            </div>
        `;
    });

    // 3. Adiciona o Total Geral Acumulado no final do relatório
    const totalGeralFormatado = totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    conteudoHTML += `
            <hr style="border: 0; border-top: 2px solid #0f766e; margin-top: 20px; margin-bottom: 15px;" />
            <div style="text-align: right; padding: 15px; background-color: #0f766e; color: white; border-radius: 8px;">
                <h2 style="margin: 0; font-size: 20px;">
                    TOTAL GERAL ACUMULADO: ${totalGeralFormatado}
                </h2>
                <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">
                    Total de Notas Processadas: ${quantidadeComprovantes}
                </p>
            </div>
        </div>
    `;

    // 4. Configuração e geração do ficheiro PDF
    const elementoTemporario = document.createElement('div');
    elementoTemporario.innerHTML = conteudoHTML;

    const opcoesPDF = {
        margin: 10,
        filename: `Relatorio_Gasto_na_Foto_${new Date().toISOString().slice(0,10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Executa o descarregamento do PDF
    html2pdf().set(opcoesPDF).from(elementoTemporario).save();
}