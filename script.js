/* CARROSSEL INDEX.HTML */

const itensCarrossel = [
    {
        titulo: "O que é?",
        texto: "Biotecnologia é o uso de seres vivos, células ou moléculas biológicas para criar produtos, processos ou soluções úteis para a sociedade. Ela não é algo necessariamente moderno: há milhares de anos, humanos já utilizavam microrganismos para produzir pão, queijo, vinho e cerveja. Hoje, com o avanço da genética, a biotecnologia ficou muito mais poderosa, permitindo produzir medicamentos, vacinas, alimentos geneticamente modificados, enzimas e até organismos modificados geneticamente."
    },
    {
        titulo: "Como funciona?",
        texto: "A biotecnologia funciona utilizando seres vivos, células ou componentes biológicos para criar produtos e soluções úteis. Os cientistas identificam características que podem ser aproveitadas e, quando necessário, modificam ou controlam esses organismos para obter o resultado desejado. Por exemplo, bactérias podem receber um gene humano e passar a produzir insulina, que depois é utilizada na fabricação de medicamentos."
    },
    {
        titulo: "Quais são suas aplicações?",
        texto: "A biotecnologia utiliza organismos vivos para criar soluções inovadoras e sustentáveis que transformam a saúde, a agricultura e a indústria. Ela impulsiona desde vacinas avançadas e medicamentos essenciais até lavouras mais resistentes, biocombustíveis e bioplásticos. Além disso, restaura o meio ambiente por meio da biorremediação, liderando a transição para um futuro mais eficiente e ecológico."
    },
    {
        titulo: "Se relaciona com mutação genética?",
        texto: "A mutação genética é a matéria-prima e o grande alvo da biotecnologia moderna. Ao compreender e reprogramar alterações no DNA, a ciência consegue corrigir mutações causadoras de doenças graves, desenvolver terapias personalizadas e criar lavouras mais fortes. Essa sinergia transforma a leitura do código genético na chave para curas inovadoras e soluções do futuro."
    }
]
let indiceAtual = 0

const setaDireita = document.getElementById("seta-direita")
const setaEsquerda = document.getElementById("seta-esquerda")
const titulo = document.getElementById("card-titulo")
const texto = document.getElementById("card-p")

setaDireita.addEventListener("click", atualizar_card_frente)
setaEsquerda.addEventListener("click", atualizar_card_tras)
function atualizar_card_frente() {
    console.log("Texto seguinte")
    indiceAtual = (indiceAtual + 1) % itensCarrossel.length
    titulo.innerText = itensCarrossel[indiceAtual].titulo
    texto.innerText = itensCarrossel[indiceAtual].texto
}
function atualizar_card_tras() {
    console.log("Texto Anterior")
    indiceAtual = (indiceAtual - 1 + itensCarrossel.length) % itensCarrossel.length
    titulo.innerText = itensCarrossel[indiceAtual].titulo
    texto.innerText = itensCarrossel[indiceAtual].texto
}