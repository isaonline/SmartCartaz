const formContainer = document.querySelector('#dados-form')
const inputFoto = document.querySelector('#form-enviar-foto')
const cartazImagem = document.querySelector('#cartaz-imagem')
const cartazFrase = document.querySelector('#cartaz-frase')
const cartazValor = document.querySelector('#cartaz-valor')
const cartazTitulo = document.querySelector('#cartaz-titulo')
const buttonTrocarTipo = document.querySelector("#buttons-trocar-tipo")
const inputsDadosPet = document.querySelector('#dados-pet')
const racaPetPrevia = document.querySelector('#cartaz-raca')
const corPetPrevia = document.querySelector('#cartaz-cor')
const camposObrigatorios = ['nome', 'idade', 'descricao', 'local', 'data', 'telefone', 'foto']
let fotoUrlAtual = null

// Estado que vai ler cada informação colocada nos inputs
const state = {}

// Listener para alterações realizadas nos inputs
formContainer.addEventListener('input', (event) => {
    const field = event.target.dataset.field;

    if (!field) return;

    if (field === 'telefone') {
        const digitos = event.target.value.replace(/\D/g, '')

        if (digitos.length > 11) {
            digitos = digitos.slice(0, 11)
        }

        if (!digitos) {
            event.target.value = ''
            state[field] = ''
        } else {
            const formatado = formatarTelefone(digitos)
            event.target.value = formatado
            state[field] = formatado
        }
    } else if (field === 'idade') {
        const numero = parseInt(event.target.value)
        if (numero > 120) {
            event.target.value = 120 
            state[field] = '120'
        } else if (numero < 0) {
            event.target.value = 0
            state[field] = '0'
        } else {
            state[field] = event.target.value
        }
    } else if (field === 'recompensa') {
        const numeros = event.target.value.replace(/\D/g, '')
        if (numeros.length > 10) {  
            event.target.value = event.target.value.slice(0, -1)
            return
        }
        const numero = parseInt(numeros)
        const avisoRecompensa = document.querySelector('#aviso-recompensa')

        if (!event.target.value || numero === 0) {
            state[field] = ''
            avisoRecompensa.classList.add('hidden')
        } else if (numero < 1000) {
            state[field] = ''
            avisoRecompensa.classList.remove('hidden')   // ← mostra o aviso
        } else {
            state[field] = formatarRecompensa(event.target.value)
            avisoRecompensa.classList.add('hidden')
        }
    } else if (field === 'data') {
        const partes = event.target.value.split('-')
        const ano = partes[0]
        if (ano && ano.length > 4) {
            event.target.value = `${ano.slice(0, 4)}-${partes[1]}-${partes[2]}`
        }
        state[field] = event.target.value
    } else {
        state[field] = event.target.value
    }

    renderPreview()
})

// Listener para especificamente a foto
inputFoto.addEventListener('change', (event) => {
    const arquivo = event.target.files[0]
    if (!arquivo) return

    if (fotoUrlAtual) {
        URL.revokeObjectURL(fotoUrlAtual)
    }

    const urlTemporaria = URL.createObjectURL(arquivo)
    fotoUrlAtual = urlTemporaria
    const img = new Image()
    
    img.onload = () => {
        const ehRetrato = img.height > img.width
        const cartaz = document.querySelector('#prev-cartaz')
        
        if (ehRetrato) {
            preview.foto.style.height = '240px'
            cartaz.style.gap = '2px'         // ← reduz o gap entre elementos
            cartaz.style.padding = '8px 0'   // ← reduz o padding
        } else {
            preview.foto.style.height = '230px'
            cartaz.style.gap = '8px'         // ← volta ao normal
            cartaz.style.padding = '16px 0'
        }
        
        preview.foto.src = urlTemporaria

        const container = document.querySelector('#container-preview-foto')
        const previewInput = document.querySelector('#preview-foto-input')
        const areaEnviarFoto = document.querySelector('#button-enviar-foto')
        previewInput.src = urlTemporaria
        container.classList.remove('hidden')
        areaEnviarFoto.classList.add('hidden')
    }
    
    img.src = urlTemporaria
})

// Listener do botão para excluir a imagem
document.querySelector('#button-excluir-foto').addEventListener('click', () => {
    const container = document.querySelector('#container-preview-foto')
    const areaEnviarFoto = document.querySelector('#button-enviar-foto')
    
    if (fotoUrlAtual) {
        URL.revokeObjectURL(fotoUrlAtual)
        fotoUrlAtual = null
    }

    inputFoto.value = ''
    preview.foto.src = placeholders.foto
    container.classList.add('hidden')
    areaEnviarFoto.classList.remove('hidden')
})


// Todos os campos da prévia de cartaz
const preview = {
    nome: document.querySelector('#cartaz-nome'),
    idade: document.querySelector('#cartaz-idade'),
    raca: document.querySelector('#cartaz-raca'),
    cor: document.querySelector('#cartaz-cor'),
    descricao: document.querySelector('#cartaz-desc'),
    local: document.querySelector('#cartaz-texto-local'),
    data: document.querySelector('#cartaz-texto-data'),
    telefone: document.querySelector('#cartaz-tel-escolhido'),
    recompensa: document.querySelector('#cartaz-recompensa'),
    foto: document.querySelector('#cartaz-imagem')
}

// Espaço para guardar cada placeholder dos campos
const placeholders = {
    nome: "Nome da pessoa aqui",
    idade: "Idade aqui",
    descricao: "A descrição do desaparecimento com detalhes aparecerá aqui, não esqueça de escrever características físicas marcantes da pessoa.",
    local: "Bairro, Cidade - Estado",
    data: "00/00/0000",
    telefone: "(11) 99999-9999",
    recompensa: "",
    foto: "/src/img/Person_facing_forward_soft_light.jpeg"   
}

// Função para ajustar as fontes
function ajustarFontesCartaz() {
    const cartaz = document.querySelector('#prev-cartaz')
    const alturaMaxima = 792 - 16

    const clone = cartaz.cloneNode(true)
    clone.style.position = 'fixed'
    clone.style.top = '-9999px'
    clone.style.left = '-9999px'
    clone.style.overflow = 'visible'
    clone.style.height = 'auto'
    clone.style.minHeight = 'unset'
    clone.style.maxHeight = 'unset'
    clone.style.visibility = 'hidden'
    document.body.appendChild(clone)

    const cloneNome = clone.querySelector('#cartaz-nome')
    const cloneDesc = clone.querySelector('#cartaz-desc')
    const cloneTel = clone.querySelector('#cartaz-tel-escolhido')
    const cloneTitulo = clone.querySelector('#cartaz-titulo')
    const cloneFrase = clone.querySelector('#cartaz-frase')
    const cloneValor = clone.querySelector('#cartaz-valor')
    const cloneIdade = clone.querySelector('#cartaz-idade')
    const cloneRaca = clone.querySelector('#cartaz-raca')
    const cloneCor = clone.querySelector('#cartaz-cor')

    cloneFrase.style.fontSize = '24px'
    cloneValor.style.fontSize = '30px'
    cloneNome.style.fontSize = '40px'
    cloneDesc.style.fontSize = '18px'
    cloneTel.style.fontSize = '40px'
    cloneTitulo.style.fontSize = '60px'
    cloneIdade.style.fontSize = '16px'
    cloneRaca.style.fontSize = '16px'
    cloneCor.style.fontSize = '16px'

    let tamanhoFrase = 24
    let tamanhoValor = 30
    let tamanhoNome = 40
    let tamanhoDesc = 18
    let tamanhoTel = 40
    let tamanhoTitulo = 60
    let tamanhoDadosBasicos = 16

    while (clone.scrollHeight > alturaMaxima && tamanhoNome > 16) {
        tamanhoNome -= 0.5    
        tamanhoDesc = Math.max(16, tamanhoDesc - 0.3)  
        tamanhoTel = Math.max(35, tamanhoTel - 1.5)     
        tamanhoTitulo = Math.max(36, tamanhoTitulo - 1.5)
        tamanhoFrase = Math.max(16, tamanhoFrase - 1)
        tamanhoValor = Math.max(20, tamanhoValor - 1)
        tamanhoDadosBasicos = Math.max(12, tamanhoDadosBasicos - 0.3)

        cloneIdade.style.fontSize = tamanhoDadosBasicos + 'px'
        cloneRaca.style.fontSize = tamanhoDadosBasicos + 'px'
        cloneCor.style.fontSize = tamanhoDadosBasicos + 'px'
        cloneValor.style.fontSize = tamanhoValor + 'px'
        cloneFrase.style.fontSize = tamanhoFrase + 'px'
        cloneNome.style.fontSize = tamanhoNome + 'px'
        cloneDesc.style.fontSize = tamanhoDesc + 'px'
        cloneTel.style.fontSize = tamanhoTel + 'px'
        cloneTitulo.style.fontSize = tamanhoTitulo + 'px'
    }

    preview.nome.style.fontSize = tamanhoNome + 'px'
    preview.descricao.style.fontSize = tamanhoDesc + 'px'
    preview.telefone.style.fontSize = tamanhoTel + 'px'
    cartazTitulo.style.fontSize = tamanhoTitulo + 'px'
    cartazFrase.style.fontSize = tamanhoFrase + 'px'
    cartazValor.style.fontSize = tamanhoValor + 'px'
    preview.idade.style.fontSize = tamanhoDadosBasicos + 'px'
    preview.raca.style.fontSize = tamanhoDadosBasicos + 'px'
    preview.cor.style.fontSize = tamanhoDadosBasicos + 'px'

    document.body.removeChild(clone)
}

// Debounce para poupar recursos

function debounce(funcao, atraso) {
    let temporizador

    return function(...args) {
        clearTimeout(temporizador)
        temporizador = setTimeout(() => {
            funcao.apply(this, args)
        }, atraso)
    }
}

const ajustarFontesCartazComAtraso = debounce(ajustarFontesCartaz, 100)

// Função para renderizar as mudanças na prévia
function renderPreview() {
    for (const campo in preview) {
            if (campo === 'foto') continue
            if (campo === 'raca' || campo === 'cor') continue

            if (campo === 'idade') {
                preview[campo].textContent = state[campo] 
                ? `${state[campo]} anos` 
                : placeholders[campo]
            } else if (campo === 'data') {
                if (!state[campo]) continue
                const [ano, mes, dia] = state[campo].split('-')
                preview[campo].textContent = `${dia}/${mes}/${ano}`
            } else {
                preview[campo].textContent = state[campo] || placeholders[campo]
            }
        }

        if (state.raca) {
            preview.raca.textContent = state.raca
        } else {
            preview.raca.textContent = 'Raça do pet aqui'
        }

        if (state.cor) {
            preview.cor.textContent = state.cor
        } else {
            preview.cor.textContent = 'Cor do pet aqui'
        }

        if (state.recompensa) {
            cartazFrase.classList.add('hidden')
            cartazValor.classList.remove('hidden')
        } else {
            cartazFrase.classList.remove('hidden')
            cartazValor.classList.add('hidden')
        }

        ajustarFontesCartazComAtraso()
}

// Função para formatar o telefone digitado
function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, '')
    
    if (numeros.length <= 2) return `(${numeros}`
    if (numeros.length <= 10) {
        if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
    }
    
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`
}

// Função para formatar valores na recompensa
function formatarRecompensa(valor) {
    const numeros = valor.replace(/\D/g, '')
    if (!numeros || numeros < 1000) return ''
    
    const numero = parseInt(numeros) / 100
    return numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

// Funcionalidade dos botões de Baixar PNG e PDF

function validarCampos() {
    const camposFaltando = camposObrigatorios.filter(campo => !state[campo])
    return camposFaltando.length === 0
}

document.querySelector('#button-baixar-png').addEventListener('click', () => {
    if (!validarCampos()) {
        alert('Preencha todos os campos obrigatórios antes de baixar: foto, nome, idade, descrição, local, data e telefone.')
        return
    }
    baixarPNG()
})

document.querySelector('#button-baixar-pdf').addEventListener('click', () => {
    if (!validarCampos()) {
        alert('Preencha todos os campos obrigatórios antes de baixar: foto, nome, idade, descrição, local, data e telefone.')
        return
    }
    baixarPDF()
})

async function prepararCartazParaCaptura() {
    const imgCartaz = document.querySelector('#cartaz-imagem')
    
    const srcOriginal = imgCartaz.src
    const alturaOriginal = imgCartaz.style.height
    
    const imgElement = new Image()
    imgElement.crossOrigin = 'anonymous'
    imgElement.src = srcOriginal
    
    await new Promise(resolve => imgElement.onload = resolve)
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    const larguraExibicao = imgCartaz.offsetWidth
    const alturaExibicao = imgCartaz.offsetHeight
    const escalaCanvas = 2
    canvas.width = larguraExibicao * escalaCanvas
    canvas.height = alturaExibicao * escalaCanvas
    ctx.scale(escalaCanvas, escalaCanvas)
    
    const escala = Math.min(larguraExibicao / imgElement.naturalWidth, alturaExibicao / imgElement.naturalHeight)
    const w = imgElement.naturalWidth * escala
    const h = imgElement.naturalHeight * escala
    const x = (larguraExibicao - w) / 2
    const y = (alturaExibicao - h) / 2
    
    ctx.fillStyle = '#FAFAFA'
    ctx.fillRect(0, 0, larguraExibicao, alturaExibicao)
    ctx.drawImage(imgElement, x, y, w, h)
    
    imgCartaz.src = canvas.toDataURL('image/png', 1.0)
    imgCartaz.style.objectFit = 'fill'
    
    return { imgCartaz, srcOriginal, alturaOriginal }
}

function restaurarCartaz({ imgCartaz, srcOriginal, alturaOriginal }) {
    imgCartaz.src = srcOriginal
    imgCartaz.style.objectFit = 'contain'
    imgCartaz.style.height = alturaOriginal
}

function ocultarCamposVaziosParaExport() {
    const camposEscondidos = []

    if (!state.raca && !racaPetPrevia.classList.contains('hidden')) {
        racaPetPrevia.classList.add('hidden')
        camposEscondidos.push(racaPetPrevia)
    }
    if (!state.cor && !corPetPrevia.classList.contains('hidden')) {
        corPetPrevia.classList.add('hidden')
        camposEscondidos.push(corPetPrevia)
    }

    return camposEscondidos
}

function restaurarCamposVazios(camposEscondidos) {
    camposEscondidos.forEach(campo => campo.classList.remove('hidden'))
}

async function baixarPNG() {
    const camposEscondidos = ocultarCamposVaziosParaExport()
    const { imgCartaz, srcOriginal, alturaOriginal } = await prepararCartazParaCaptura()
    const cartaz = document.querySelector('#prev-cartaz')
    const canvas = await html2canvas(cartaz, { scale: 2, useCORS: true })
    restaurarCartaz({ imgCartaz, srcOriginal, alturaOriginal })
    restaurarCamposVazios(camposEscondidos)
    
    const link = document.createElement('a')
    link.download = `cartaz-${state.nome.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
}

async function baixarPDF() {
    const camposEscondidos = ocultarCamposVaziosParaExport()
    const { imgCartaz, srcOriginal, alturaOriginal } = await prepararCartazParaCaptura()
    const cartaz = document.querySelector('#prev-cartaz')
    const canvas = await html2canvas(cartaz, { scale: 2, useCORS: true })
    restaurarCartaz({ imgCartaz, srcOriginal, alturaOriginal })
    restaurarCamposVazios(camposEscondidos)
    
    const imgData = canvas.toDataURL('image/png')
    const { jsPDF } = window.jspdf
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const larguraMM = pdf.internal.pageSize.getWidth()
    const alturaMM = pdf.internal.pageSize.getHeight()
    pdf.addImage(imgData, 'PNG', 0, 0, larguraMM, alturaMM)
    pdf.save(`cartaz-${state.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}

// Funcionalidades relacionadas à trocar para o modo de Pet do cartaz

buttonTrocarTipo.addEventListener('click', (event) => {
    const botaoClicado = event.target.closest('button')
    if (!botaoClicado) return

    switch (botaoClicado.id) {
        case 'button-pessoa':
            const buttonPet = botaoClicado.nextElementSibling
            const imgIconeAtualPessoa = botaoClicado.querySelector('img')
            const imgIconePet = buttonPet.querySelector('img')

            botaoClicado.classList.add('button-tipo-active')
            buttonPet.classList.remove('button-tipo-active')
            imgIconeAtualPessoa.src = '/src/img/person-white-fill.svg'
            imgIconePet.src = '/src/img/paw-black-fill.svg'
            cartazImagem.src = '/src/img/Person_facing_forward_soft_light.jpeg'
            inputsDadosPet.classList.add('hidden')
            racaPetPrevia.classList.add('hidden')
            corPetPrevia.classList.add('hidden')

            break
        case 'button-pet':
            const buttonPessoa = botaoClicado.previousElementSibling
            const imgIconeAtualPet = botaoClicado.querySelector('img')
            const imgIconePessoa = buttonPessoa.querySelector('img')

            botaoClicado.classList.add('button-tipo-active')
            buttonPessoa.classList.remove('button-tipo-active')
            imgIconeAtualPet.src = '/src/img/paw-white-fill.svg'
            imgIconePessoa.src = '/src/img/person-black-fill.svg'
            cartazImagem.src = '/src/img/Dog_facing_forward_soft_light.jpeg'
            inputsDadosPet.classList.remove('hidden')
            racaPetPrevia.classList.remove('hidden')
            corPetPrevia.classList.remove('hidden')

            break
        default:
            break
    }
})