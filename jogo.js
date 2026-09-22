/* KEYBOARD */
document.addEventListener("DOMContentLoaded", () => {
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
        else if (scrollAtual > ultimoScroll) {
            teclado.classList.remove('escondido')
        }

        ultimoScroll = scrollAtual
    })
})

/* TERMO */