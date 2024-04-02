// Definir variáveis globais
const mapaDiv = document.getElementById('mapa');
const cidades = {}; // Objeto para armazenar as coordenadas das cidades
const distancias = {}; // Objeto para armazenar as distâncias entre as cidades

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        const bloco = document.createElement('div');
        bloco.classList.add('bloco');
        bloco.dataset.coluna = i;
        bloco.dataset.linha = j;
        const id = `bloco_${i}_${j}`; // Cria um ID único para cada div
        bloco.id = id; // Atribui o ID à div
        mapaDiv.appendChild(bloco);
    }
}

// Função para adicionar uma cidade ao mapa
function adicionarCidade(letra, coluna, linha) {
    const bloco = document.querySelector(`.bloco[data-coluna="${coluna}"][data-linha="${linha}"]`);
    bloco.innerText = letra;
    bloco.classList.add('cidade-selecionada');

    cidades[letra] = { posicao: { coluna, linha }, letra };
    // Calcular e exibir as distâncias entre as cidades
    calcularDistanciasEntreCidades();
}

// Array estático de posições para as cidades
const posicoesCidades = [
    { coluna: 1, linha: 3 },
    { coluna: 6, linha: 7 },
    { coluna: 5, linha: 5 },
    { coluna: 3, linha: 3 },
    { coluna: 6, linha: 1 }
];

// Gerar 5 cidades com posições estáticas ao carregar o projeto
window.onload = function () {
    const letras = ['A', 'B', 'C', 'D', 'E'];
    for (let i = 0; i < 5; i++) {
        const letra = letras[i];
        const { coluna, linha } = posicoesCidades[i];
        adicionarCidade(letra, coluna, linha);
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
        pintarRota(cidadeAtual,cidadeMaisProxima);
       
        Rota.push(cidadeMaisProxima);
        cidadeAtual = cidadeMaisProxima;
        // Alterar a cor do bloco no mapa
        const bloco = document.querySelector(`.bloco[data-coluna="${cidades[cidadeAtual].posicao.coluna}"][data-linha="${cidades[cidadeAtual].posicao.linha}"]`);
        bloco.classList.add('cidade-percorrida');
    }

    return Rota;
}
function pintarRota(a,p){ //calcula os blocos que vai percorrer para ir de uma cidade a outra
    
    // linha e coluna de ambas as cidades 
    let pac = cidades[a].posicao.linha //coluna cidade 
    let pal = cidades[a].posicao.coluna //linha cidade atual
    let ppc = cidades[p].posicao.linha //coluna cidade mais proxima
    let ppl = cidades[p].posicao.coluna //linha cidade mais proxima
    console.log("coluna atual:",pac)
    console.log("linha atual:",pal)
    console.log("coluna proxima:",ppc)
    console.log("linha proxima:",ppl)

    let qpvertical = Math.abs(pal - ppl); 
    let qphorizontal = Math.abs(pac - ppc); 
    if(pal>ppl){ //PINTAR PARA CIMA
        let sub =1
        while(qpvertical>0,qpvertical--){ //pintando para cima 
            console.log("PINTANDO PRA CIMA")

            const bloco = document.querySelector(`.bloco[data-coluna="${(pal =pal-1)}"][data-linha="${pac}"]`);
            
            bloco.style.backgroundImage = "url('fim.png')";

            const blocoId = bloco.getAttribute('id');
            console.log('id do bloco: '+blocoId)

            var posicaoBloco = document.getElementById(blocoId);
            var car = document.getElementById("carrinho")

            var movimento = posicaoBloco.getBoundingClientRect();

            car.style.top = movimento.top + 'px';
            car.style.left = movimento.left + 'px';

        }
        if(pac>ppc){// PINTAR PARA ESQUERDA
            console.log("PINTANDO PRA ESQUERDA")
            while(qphorizontal>0,qphorizontal--){ //pintando para esquerda
                const bloco = document.querySelector(`.bloco[data-coluna="${pal}"][data-linha="${(pac = pac-1)}"]`);
               
                bloco.style.backgroundImage = "url('fim.png')";

                const blocoId = bloco.getAttribute('id');
                console.log('id do bloco: '+blocoId)

                var posicaoBloco = document.getElementById(blocoId);
                var car = document.getElementById("carrinho")

                var movimento = posicaoBloco.getBoundingClientRect();

                car.style.top = movimento.top + 'px';
                car.style.left = movimento.left + 'px';

            }
        }else if(pac<ppc){ //PINTAR PARA DIREITA
            console.log("PINTANDO PRA DIREITA")
            while(qphorizontal>0,qphorizontal--){ //pintando para cima 
                const bloco = document.querySelector(`.bloco[data-coluna="${pal}"][data-linha="${(pac = pac+1)}"]`);
                
                bloco.style.backgroundImage = "url('fim.png')";

                const blocoId = bloco.getAttribute('id');
                console.log('id do bloco: '+blocoId)

                var posicaoBloco = document.getElementById(blocoId);
                var car = document.getElementById("carrinho")

                var movimento = posicaoBloco.getBoundingClientRect();

                car.style.top = movimento.top + 'px';
                car.style.left = movimento.left + 'px';
            }
        }

    }else if(pal<ppl){ //PINTAR PARA BAIXO

        while(qpvertical>0,qpvertical--){ 
            console.log("PINTANDO PRA BAIXO")
            
            const bloco = document.querySelector(`.bloco[data-coluna="${(pal = pal+1)}"][data-linha="${pac}"]`);

            bloco.style.backgroundImage = "url('fim.png')";

            const blocoId = bloco.getAttribute('id');
            console.log('id do bloco: '+blocoId)

            var posicaoBloco = document.getElementById(blocoId);
            var car = document.getElementById("carrinho")

            var movimento = posicaoBloco.getBoundingClientRect();

            car.style.top = movimento.top + 'px';
            car.style.left = movimento.left + 'px';

        }
        if(pac>ppc){// PINTAR PARA 
            while(qphorizontal>0,qphorizontal--){ 
                console.log("PINTANDO PRA ESQUERDA")
                const bloco = document.querySelector(`.bloco[data-coluna="${pal}"][data-linha="${(pac =pac-1)}"]`);
                
                bloco.style.backgroundImage = "url('fim.png')";

                const blocoId = bloco.getAttribute('id');
                console.log('id do bloco: '+blocoId)

                var posicaoBloco = document.getElementById(blocoId);
                var car = document.getElementById("carrinho")

                var movimento = posicaoBloco.getBoundingClientRect();

                car.style.top = movimento.top + 'px';
                car.style.left = movimento.left + 'px';
                
                        }
        }else if(pac<ppc){ //PINTAR PARA DIREITA
                while(qphorizontal>0,qphorizontal--){ 
                console.log("PINTANDO PRA DIREITA")
                const bloco = document.querySelector(`.bloco[data-coluna="${pal}"][data-linha="${(pac=pac+1)}"]`);
                
                bloco.style.backgroundImage = "url('fim.png')";

                const blocoId = bloco.getAttribute('id');
                console.log('id do bloco: '+blocoId)

                var posicaoBloco = document.getElementById(blocoId);
                var car = document.getElementById("carrinho")

                var movimento = posicaoBloco.getBoundingClientRect();

                car.style.top = movimento.top + 'px';
                car.style.left = movimento.left + 'px';

                }
        }
    }else{
        
        if(pac>ppc){// PINTAR PARA 
            while(qphorizontal>0,qphorizontal--){ 
                console.log("PINTANDO PRA ESQUERDA")
                const bloco = document.querySelector(`.bloco[data-coluna="${pal}"][data-linha="${(pac =pac-1)}"]`);
                
                bloco.style.backgroundImage = "url('fim.png')";

                const blocoId = bloco.getAttribute('id');
                console.log('id do bloco: '+blocoId)

                var posicaoBloco = document.getElementById(blocoId);
                var car = document.getElementById("carrinho")

                var movimento = posicaoBloco.getBoundingClientRect();

                car.style.top = movimento.top + 'px';
                car.style.left = movimento.left + 'px';

                        }
        }else if(pac<ppc){ //PINTAR PARA DIREITA
                while(qphorizontal>0,qphorizontal--){ 
                console.log("PINTANDO PRA DIREITA")
                const bloco = document.querySelector(`.bloco[data-coluna="${pal}"][data-linha="${(pac=pac+1)}"]`);
                
                bloco.style.backgroundImage = "url('fim.png')";
            

                const blocoId = bloco.getAttribute('id');
                console.log('id do bloco: '+blocoId)

                var posicaoBloco = document.getElementById(blocoId);
                var car = document.getElementById("carrinho")

                var movimento = posicaoBloco.getBoundingClientRect();

                car.style.top = movimento.top + 'px';
                car.style.left = movimento.left + 'px';            
            }

    }
}
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
       
        // id="bloco07" de cada bloco  --> posicaoOrigem {coluna: 7, linha: 1}

        //console.log('bloco'+'_'+posicaoOrigem.coluna+'_'+posicaoOrigem.linha)

        var originalDiv = document.getElementById('bloco'+'_'+posicaoOrigem.coluna+'_'+posicaoOrigem.linha);
        var overlayDiv = document.getElementById('carrinho');

        var rect = originalDiv.getBoundingClientRect();

        overlayDiv.style.top = rect.top + 'px';
        overlayDiv.style.left = rect.left + 'px';
    }
});
