document.addEventListener('DOMContentLoaded', () => {
    const tabuleiro = document.getElementById('tabuleiro');
    const infoJogador = document.getElementById('info-jogador');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const mensagemVencedor = document.getElementById('mensagem-vencedor');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    
    const pecas = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };

    let estadoTabuleiro = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    let casaSelecionada = null;
    let turnoAtual = 'branco';

    function getCorPeca(peca) {
        if (!peca) return null;
        return peca === peca.toUpperCase() ? 'branco' : 'preto';
    }

    function renderizarTabuleiro() {
        tabuleiro.innerHTML = '';
        estadoTabuleiro.forEach((linha, indiceLinha) => {
            linha.forEach((peca, indiceColuna) => {
                const casa = document.createElement('div');
                casa.classList.add('casa');
                casa.dataset.linha = indiceLinha;
                casa.dataset.coluna = indiceColuna;
                if ((indiceLinha + indiceColuna) % 2 === 0) {
                    casa.classList.add('claro');
                } else {
                    casa.classList.add('escuro');
                }
                
                if (peca) {
                    const pecaDiv = document.createElement('div');
                    pecaDiv.classList.add('peca');
                    pecaDiv.textContent = pecas[peca];
                    casa.appendChild(pecaDiv);
                }
                
                casa.addEventListener('click', onCasaClick);
                tabuleiro.appendChild(casa);
            });
        });
        
        infoJogador.textContent = `Turno: ${turnoAtual.charAt(0).toUpperCase() + turnoAtual.slice(1)}`;
    }

    function exibirFimDeJogo(vencedor) {
        gameOverOverlay.style.display = 'flex';
        mensagemVencedor.textContent = `O vencedor é o jogador ${vencedor}.`;
        infoJogador.style.display = 'none';
        tabuleiro.style.display = 'none';
    }

    function verificarFimDeJogo() {
        const reiBrancoVivo = estadoTabuleiro.flat().includes('K');
        const reiPretoVivo = estadoTabuleiro.flat().includes('k');

        if (!reiBrancoVivo) {
            exibirFimDeJogo('Preto');
            return true;
        }

        if (!reiPretoVivo) {
            exibirFimDeJogo('Branco');
            return true;
        }
        return false;
    }

    function isCaminhoLivre(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino) {
        const dLinha = linhaDestino - linhaOrigem;
        const dColuna = colunaDestino - colunaOrigem;
        const passoLinha = dLinha === 0 ? 0 : dLinha > 0 ? 1 : -1;
        const passoColuna = dColuna === 0 ? 0 : dColuna > 0 ? 1 : -1;
        
        let linhaAtual = linhaOrigem + passoLinha;
        let colunaAtual = colunaOrigem + passoColuna;

        while (linhaAtual !== linhaDestino || colunaAtual !== colunaDestino) {
            if (estadoTabuleiro[linhaAtual][colunaAtual] !== '') {
                return false;
            }
            linhaAtual += passoLinha;
            colunaAtual += passoColuna;
        }
        return true;
    }

    function isMovimentoValido(peca, linhaOrigem, colunaOrigem, linhaDestino, colunaDestino) {
        const dLinha = Math.abs(linhaDestino - linhaOrigem);
        const dColuna = Math.abs(colunaDestino - colunaOrigem);
        const pecaDestino = estadoTabuleiro[linhaDestino][colunaDestino];
        
        const isBrancaOrigem = getCorPeca(peca) === 'branco';
        const isBrancaDestino = getCorPeca(pecaDestino) === 'branco';
        if (pecaDestino && isBrancaOrigem === isBrancaDestino) {
            return false;
        }
        
        const pecaLowercase = peca.toLowerCase();

        if (pecaLowercase === 'n') {
            return (dLinha === 2 && dColuna === 1) || (dLinha === 1 && dColuna === 2);
        }

        if (pecaLowercase === 'p') {
            const direcao = peca === 'P' ? -1 : 1;
            const linhaInicial = peca === 'P' ? 6 : 1;

            if (dColuna === 0 && linhaDestino === linhaOrigem + direcao && pecaDestino === '') {
                return true;
            }
            if (dColuna === 0 && linhaDestino === linhaOrigem + 2 * direcao && linhaOrigem === linhaInicial && pecaDestino === '') {
                return true;
            }
            if (dColuna === 1 && linhaDestino === linhaOrigem + direcao && pecaDestino !== '') {
                return true;
            }
        }

        if (pecaLowercase === 'r') {
            if ((linhaOrigem === linhaDestino || colunaOrigem === colunaDestino) && isCaminhoLivre(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino)) {
                return true;
            }
        }
        
        if (pecaLowercase === 'b') {
            if (dLinha === dColuna && isCaminhoLivre(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino)) {
                return true;
            }
        }
        
        if (pecaLowercase === 'q') {
            if ((dLinha === dColuna || linhaOrigem === linhaDestino || colunaOrigem === colunaDestino) && isCaminhoLivre(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino)) {
                return true;
            }
        }

        if (pecaLowercase === 'k') {
            if (dLinha <= 1 && dColuna <= 1) {
                return true;
            }
        }
        return false;
    }

    function onCasaClick(evento) {
        const casaAtual = evento.currentTarget;
        const linha = parseInt(casaAtual.dataset.linha);
        const coluna = parseInt(casaAtual.dataset.coluna);
        const pecaNaCasa = estadoTabuleiro[linha][coluna];

        if (casaSelecionada) {
            const linhaOrigem = parseInt(casaSelecionada.dataset.linha);
            const colunaOrigem = parseInt(casaSelecionada.dataset.coluna);
            const pecaSelecionada = estadoTabuleiro[linhaOrigem][colunaOrigem];

            if (isMovimentoValido(pecaSelecionada, linhaOrigem, colunaOrigem, linha, coluna)) {
                estadoTabuleiro[linha][coluna] = pecaSelecionada;
                estadoTabuleiro[linhaOrigem][colunaOrigem] = '';
                
                const jogoTerminou = verificarFimDeJogo();
                
                if (!jogoTerminou) {
                    turnoAtual = (turnoAtual === 'branco') ? 'preto' : 'branco';
                    renderizarTabuleiro();
                }
            }
            
            casaSelecionada.classList.remove('selecionada');
            casaSelecionada = null;
            if (!verificarFimDeJogo()) {
                renderizarTabuleiro();
            }

        } else if (pecaNaCasa && getCorPeca(pecaNaCasa) === turnoAtual) {
            casaSelecionada = casaAtual;
            casaSelecionada.classList.add('selecionada');
        }
    }

    btnReiniciar.addEventListener('click', () => {
        window.location.reload();
    });

    renderizarTabuleiro();
});
btnReiniciar.addEventListener('click', () => {
    window.location.reload();
});
console.log("O script está funcionando!");
