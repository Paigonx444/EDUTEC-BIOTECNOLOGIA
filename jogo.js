document.addEventListener("DOMContentLoaded", () => {
    // 1. BANCO DE PALAVRAS E ESTADOS
    const BANCO_PALAVRAS = [
        { palavra: "CRISPR", semAcento: "CRISPR" },
        { palavra: "CÉLULA", semAcento: "CELULA" },
        { palavra: "ÓRGÃOS", semAcento: "ORGAOS" },
        { palavra: "VACINA", semAcento: "VACINA" }
    ];

    let palavraSorteada = BANCO_PALAVRAS[Math.floor(Math.random() * BANCO_PALAVRAS.length)];
    let palavraAlvo = palavraSorteada.semAcento;

    let tentativaAtual = 1;
    const maxTentativas = 4;
    let jogoFinalizado = false;

    // Elementos DOM
    const inputs = Array.from(document.querySelectorAll('.input-termo'));
    const teclado = document.querySelector('.keyboard');
    const botoesTeclas = document.querySelectorAll('.keys');
    const btnEnter = document.getElementById('Enter');
    const btnDelete = document.getElementById('Delete');
    const btnReset = document.getElementById('btn-reset');

    // Mapeamento dos botões para facilitar atualização de cor
    const mapaTeclas = {};
    botoesTeclas.forEach(btn => {
        const txt = btn.innerText.trim().toUpperCase();
        if (txt.length === 1) {
            mapaTeclas[txt] = btn;
        }
    });

    if (inputs.length > 0) inputs[0].focus();

    // 2. DIGITAÇÃO E NAVEGAÇÃO DOS INPUTS
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (jogoFinalizado) return;

            input.value = input.value.toUpperCase().replace(/[^A-Z]/g, '');

            if (input.value.length >= 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (jogoFinalizado) return;

            if (e.key === 'Backspace') {
                if (input.value === '' && index > 0) {
                    inputs[index - 1].focus();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                validarTentativa();
            }
        });
    });

    // 3. TECLADO VIRTUAL E BOTÃO DELETE
    botoesTeclas.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (jogoFinalizado) return;

            const letra = btn.innerText.trim().toUpperCase();

            if (letra === 'ENTER') {
                validarTentativa();
            } else {
                inserirLetra(letra);
            }
        });
    });

    if (btnDelete) {
        btnDelete.addEventListener('click', (e) => {
            e.preventDefault();
            apagarLetra();
        });
    }

    function inserirLetra(letra) {
        const inputVazio = inputs.find(inp => inp.value === '');
        if (inputVazio) {
            inputVazio.value = letra;
            const idx = inputs.indexOf(inputVazio);
            if (idx < inputs.length - 1) {
                inputs[idx + 1].focus();
            }
        }
    }

    function apagarLetra() {
        if (jogoFinalizado) return;

        const inputAtivo = document.activeElement;
        const idxAtivo = inputs.indexOf(inputAtivo);

        if (idxAtivo !== -1 && inputAtivo.value !== '') {
            inputAtivo.value = '';
        } else {
            for (let i = inputs.length - 1; i >= 0; i--) {
                if (inputs[i].value !== '') {
                    inputs[i].value = '';
                    inputs[i].focus();
                    break;
                }
            }
        }
    }

    // 4. VALIDAÇÃO DO TERMO
    function validarTentativa() {
        if (jogoFinalizado) return;

        const palpite = inputs.map(i => i.value.toUpperCase()).join('');

        if (palpite.length < 6) {
            alert("Preencha todas as 6 letras antes de pressionar Enter!");
            return;
        }

        const letrasAlvoArr = palavraAlvo.split('');
        const palpiteArr = palpite.split('');
        const resultado = Array(6).fill('incorreto');

        const contagemAlvo = {};
        letrasAlvoArr.forEach(l => {
            contagemAlvo[l] = (contagemAlvo[l] || 0) + 1;
        });

        // Passada 1: Posições Corretas (Verde)
        palpiteArr.forEach((char, i) => {
            if (char === letrasAlvoArr[i]) {
                resultado[i] = 'correto';
                contagemAlvo[char]--;
            }
        });

        // Passada 2: Letras Presentes (Amarelo)
        palpiteArr.forEach((char, i) => {
            if (resultado[i] !== 'correto' && contagemAlvo[char] > 0) {
                resultado[i] = 'presente';
                contagemAlvo[char]--;
            }
        });

        // Preenche a linha correspondente na grade
        for (let col = 1; col <= 6; col++) {
            const idCelula = `F${tentativaAtual}C${col}`;
            const pElemento = document.getElementById(idCelula);

            if (pElemento) {
                const celulaContainer = pElemento.parentElement;
                pElemento.innerText = palpiteArr[col - 1];
                celulaContainer.classList.add(resultado[col - 1]);
            }

            // Atualiza botões do teclado
            const char = palpiteArr[col - 1];
            const teclaBtn = mapaTeclas[char];
            const status = resultado[col - 1];

            if (teclaBtn) {
                if (status === 'correto') {
                    teclaBtn.classList.remove('presente', 'incorreto');
                    teclaBtn.classList.add('correto');
                } else if (status === 'presente' && !teclaBtn.classList.contains('correto')) {
                    teclaBtn.classList.remove('incorreto');
                    teclaBtn.classList.add('presente');
                } else if (!teclaBtn.classList.contains('correto') && !teclaBtn.classList.contains('presente')) {
                    teclaBtn.classList.add('incorreto');
                }
            }
        }

        // Limpa inputs
        inputs.forEach(inp => inp.value = '');
        inputs[0].focus();

        if (palpite === palavraAlvo) {
            jogoFinalizado = true;
            setTimeout(() => alert(`🎉 Parabéns! Você acertou a palavra: ${palavraSorteada.palavra}`), 300);
        } else if (tentativaAtual === maxTentativas) {
            jogoFinalizado = true;
            setTimeout(() => alert(`❌ Fim de jogo! A palavra era: ${palavraSorteada.palavra}`), 300);
        } else {
            tentativaAtual++;
        }
    }

    // 5. FUNÇÃO DE RESET/NOVO JOGO
    function resetarJogo() {
        // Limpa inputs
        inputs.forEach(inp => inp.value = '');

        // Limpa grade (linhas 1 a 4)
        for (let f = 1; f <= maxTentativas; f++) {
            for (let c = 1; c <= 6; c++) {
                const pElemento = document.getElementById(`F${f}C${c}`);
                if (pElemento) {
                    pElemento.innerText = '';
                    pElemento.parentElement.classList.remove('correto', 'presente', 'incorreto');
                }
            }
        }

        // Limpa cores do teclado
        botoesTeclas.forEach(btn => {
            btn.classList.remove('correto', 'presente', 'incorreto');
        });

        // Sorteia nova palavra garantindo que seja diferente da atual
        let novaPalavra;
        do {
            novaPalavra = BANCO_PALAVRAS[Math.floor(Math.random() * BANCO_PALAVRAS.length)];
        } while (BANCO_PALAVRAS.length > 1 && novaPalavra.semAcento === palavraSorteada.semAcento);

        palavraSorteada = novaPalavra;
        palavraAlvo = palavraSorteada.semAcento;

        tentativaAtual = 1;
        jogoFinalizado = false;

        inputs[0].focus();
    }

    if (btnReset) {
        btnReset.addEventListener('click', resetarJogo);
    }

    // 6. SCROLL DETECTOR DO TECLADO
    let ultimoScroll = window.scrollY || document.documentElement.scrollTop;

    window.addEventListener('scroll', () => {
        if (!teclado) return;
        const scrollAtual = window.scrollY || document.documentElement.scrollTop;

        if (scrollAtual > ultimoScroll && scrollAtual > 10) {
            teclado.classList.add('escondido');
        } else if (scrollAtual < ultimoScroll) {
            teclado.classList.remove('escondido');
        }
        ultimoScroll = scrollAtual;
    });
});

/* KEYBOARD */
/* document.addEventListener("DOMContentLoaded", () => {
    let ultimoScroll = window.scrollY || document.documentElement.scrollTop
    const teclado = document.querySelector('.keyboard')

    if (!teclado) {
        console.error("Elemento .keyboard não foi encontrado no HTML!");
        return;
    }

    window.addEventListener('scroll', () => {
        const scrollAtual = window.scrollY || document.documentElement.scrollTop

        
        if (scrollAtual < ultimoScroll && scrollAtual > 10) {
            teclado.classList.add('escondido')
            console.log("Escondido")
        }
        else if (scrollAtual < 0 ){
            teclado.classList.remove('escondido')
        }
        else if (scrollAtual > ultimoScroll) {
            teclado.classList.remove('escondido')
        }
        

        ultimoScroll = scrollAtual
    })
})



/*
const Q = document.getElementById("Button-Q")
const W = document.getElementById("Button-W")
const E = document.getElementById("Button-E")
const R = document.getElementById("Button-R")
const T = document.getElementById("Button-T")
const Y = document.getElementById("Button-Y")
const U = document.getElementById("Button-U")
const I = document.getElementById("Button-I")
const O = document.getElementById("Button-O")
const P = document.getElementById("Button-P")
const A = document.getElementById("Button-A")
const S = document.getElementById("Button-S")
const D = document.getElementById("Button-D")
const F = document.getElementById("Button-F")
const G = document.getElementById("Button-G")
const H = document.getElementById("Button-H")
const J = document.getElementById("Button-J")
const K = document.getElementById("Button-K")
const L = document.getElementById("Button-L")
const Z = document.getElementById("Button-Z")
const X = document.getElementById("Button-X")
const C = document.getElementById("Button-C")
const V = document.getElementById("Button-V")
const B = document.getElementById("Button-B")
const N = document.getElementById("Button-N")
const M = document.getElementById("Button-M")
*/


/* TERMO */

/*
const inputs = document.querySelectorAll('.input-termo')

const Letras = [document.getElementById("Button-Q"), document.getElementById("Button-W"), document.getElementById("Button-E"), document.getElementById("Button-R"), document.getElementById("Button-T"),
document.getElementById("Button-Y"), document.getElementById("Button-U"), document.getElementById("Button-I"), document.getElementById("Button-O"), document.getElementById("Button-P"), document.getElementById("Button-A"),
document.getElementById("Button-S"), document.getElementById("Button-D"), document.getElementById("Button-F"), document.getElementById("Button-G"), document.getElementById("Button-H"), document.getElementById("Button-J"),
document.getElementById("Button-K"), document.getElementById("Button-L"), document.getElementById("Button-Z"), document.getElementById("Button-X"), document.getElementById("Button-C"),
document.getElementById("Button-V"), document.getElementById("Button-B"), document.getElementById("Button-N"), document.getElementById("Button-M")]


/*  inputs.forEach((input, index) () => {
            input.addEventListener('input', () => {
                if (input.value.length >= 1 && index < inputs.length - 1){
                    inputs[index + 1].focus();
                }
            })
        })*/
/*
let inputFocado = inputs[0];
*/ /*
for (let i = 0; i <= 25; i++) {
    Letras[i].addEventListener("click", Escrever)

    function Escrever() {

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                inputFocado = input
                inputFocado.value = Letras[i].innerText
            })
        })
    }/*
}
    */
