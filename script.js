// Definir variáveis globais
const mapaDiv = document.getElementById('mapa');
const cidades = {}; // Objeto para armazenar as coordenadas das cidades
const distancias = {}; // Objeto para armazenar as distâncias entre as cidades

// Adicionar event listener para o clique nos blocos do mapa
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        const bloco = document.createElement('div');
        bloco.classList.add('bloco');
        bloco.dataset.coluna = i;
        bloco.dataset.linha = j;
        // bloco.addEventListener('click', adicionarCidade);
        mapaDiv.appendChild(bloco);
    }
}

// Função para adicionar uma cidade ao mapa
function adicionarCidade(letra) {
    const coluna = Math.floor(Math.random() * 8); // Gera um número aleatório entre 0 e 7 para a coluna
    const linha = Math.floor(Math.random() * 8); // Gera um número aleatório entre 0 e 7 para a linha

    const bloco = document.querySelector(`.bloco[data-coluna="${coluna}"][data-linha="${linha}"]`);
    bloco.innerText = letra;
    bloco.classList.add('cidade-selecionada');

    cidades[letra] = { posicao: { coluna, linha }, letra };
    console.log(cidades["A"].posicao)
    // Calcular e exibir as distâncias entre as cidades
    calcularDistanciasEntreCidades();
}

// Gerar 5 cidades aleatórias ao carregar o projeto
window.onload = function () {
    for (let i = 0; i < 5; i++) {
        let letra = String.fromCharCode(65 + i); // Gera a próxima letra do alfabeto
        adicionarCidade(letra);
    }
};

// Função para obter a próxima letra disponível para uma cidade
function obterProximaLetra() {
    let letra = 'A';
    while (cidades[letra]) {
        letra = String.fromCharCode(letra.charCodeAt(0) + 1);
    }
    return letra;
}

// Função para calcular as distâncias entre as cidades
function calcularDistanciasEntreCidades() {
    const letrasCidades = Object.keys(cidades);
    for (let i = 0; i < letrasCidades.length; i++) {
        const cidadeA = letrasCidades[i];
        const posicaoA = cidades[cidadeA].posicao;
        for (let j = i + 1; j < letrasCidades.length; j++) {
            const cidadeB = letrasCidades[j];
            const posicaoB = cidades[cidadeB].posicao;
            const distancia = calcularDistanciaEntrePosicoes(posicaoA, posicaoB);
            distancias[`${cidadeA}-${cidadeB}`] = distancia;
            distancias[`${cidadeB}-${cidadeA}`] = distancia;
        }
    }
    exibirDistancias();
}

// Função para calcular a distância entre duas posições
function calcularDistanciaEntrePosicoes(posicaoA, posicaoB) {
    const colunaA = posicaoA.coluna;
    const linhaA = posicaoA.linha;
    const colunaB = posicaoB.coluna;
    const linhaB = posicaoB.linha;

    const distancia = Math.abs(colunaB - colunaA) + Math.abs(linhaB - linhaA);
    return distancia;
}

// Função para exibir as distâncias entre as cidades
function exibirDistancias() {
    const distanciasInfoDiv = document.getElementById('distanciasInfo');
    distanciasInfoDiv.innerHTML = '<h3>Distâncias entre as cidades:</h3>';

    for (let cidadeA in cidades) {
        for (let cidadeB in cidades) {
            if (cidadeA !== cidadeB) {
                const distancia = distancias[`${cidadeA}-${cidadeB}`];
                const posicaoA = cidades[cidadeA].posicao;
                const posicaoB = cidades[cidadeB].posicao;
                const distanciaHTML = `<p>${cidadeA} (${posicaoA.linha},${posicaoA.coluna}) - ${cidadeB} (${posicaoB.linha},${posicaoB.coluna}): ${distancia}</p>`;
                distanciasInfoDiv.innerHTML += distanciaHTML;
            }
        }
    }
}

// Função para calcular o Rota mais próximo até a cidade destino
function calcularRotaMaisProximo(origem, destino) {
    const vertices = Object.keys(cidades);
    const Rota = [origem]; // Inicia o Rota com a cidade de origem
    let cidadeAtual = origem;
    console.log(origem)
    // Adiciona a cidade de origem ao Rota e marca como percorrida

    const blocoOrigem = document.querySelector(`.bloco[data-coluna="${cidades[origem].posicao.coluna}"][data-linha="${cidades[origem].posicao.linha}"]`);
    blocoOrigem.classList.add('cidade-percorrida');

    
    while (cidadeAtual !== destino) {
        let cidadeMaisProxima = null;
        let menorDistancia = Infinity;

        for (const cidade in cidades) {
            if (!Rota.includes(cidade)) {
                const distancia = distancias[`${cidadeAtual}-${cidade}`];
                if (distancia < menorDistancia) {
                    menorDistancia = distancia;
                    cidadeMaisProxima = cidade;
                }
            }
        }

        Rota.push(cidadeMaisProxima);
        cidadeAtual = cidadeMaisProxima;
        // Alterar a cor do bloco no mapa
        const bloco = document.querySelector(`.bloco[data-coluna="${cidades[cidadeAtual].posicao.coluna}"][data-linha="${cidades[cidadeAtual].posicao.linha}"]`);
        bloco.classList.add('cidade-percorrida');
    }

    return Rota;
}

function limparCores() {
    const blocos = document.querySelectorAll('.bloco');
    blocos.forEach(bloco => {
        bloco.classList.remove('cidade-percorrida');
    });
}

// Adicionar event listener para o botão de calcular Rota mais próximo até a cidade destino
document.getElementById('calcularRotaBtn').addEventListener('click', function () {
    const origem = document.getElementById('cidadeOrigemInput').value.toUpperCase();
    const destino = document.getElementById('cidadeDestinoInput').value.toUpperCase(); // Obtendo a cidade destino do input

    // Verificar se a cidade destino é válida
    if (!cidades.hasOwnProperty(destino)) {
        alert('Cidade destino inválida.');
        return;
    }

    limparCores(); // Limpar as cores das cidades antes de calcular a Rota mais próxima
    const RotaMaisProximo = calcularRotaMaisProximo(origem, destino);
    alert('O Rota mais próximo até ' + destino + ' é: ' + RotaMaisProximo.join(' -> '));
});



document.getElementById('cidadeOrigemInput').addEventListener('input', function () {
    const origem = this.value.toUpperCase(); // Obtendo o valor do campo de entrada e convertendo para maiúsculas
    if (cidades.hasOwnProperty(origem)) { // Verificar se a cidade de origem existe
        const posicaoOrigem = cidades[origem].posicao; // Obtendo a posição da cidade de origem
        const larguraDoBloco = mapaDiv.offsetWidth / 8; // Largura de cada bloco do mapa
        const alturaDoBloco = mapaDiv.offsetHeight / 8; // Altura de cada bloco do mapa
        const carrinho = document.getElementById('carrinho'); // Obtendo o elemento do carro
        console.log("Largura:", mapaDiv.offsetWidth, "Altura:", mapaDiv.offsetHeight);
        console.log(mapaDiv)
        // Calculando as coordenadas x e y do carro com um pequeno deslocamento para o centro do bloco
        const x = posicaoOrigem.coluna * larguraDoBloco + (larguraDoBloco / 2) - (carrinho.offsetWidth / 2);
        const y = posicaoOrigem.linha * alturaDoBloco + (alturaDoBloco / 2) - (carrinho.offsetHeight / 2);

        // Atualizando a posição do carro
        carrinho.style.left = x + 'px';
        carrinho.style.top = y + 'px';
    }
});
