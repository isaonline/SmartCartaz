const formContainer = document.querySelector('#dados-form')
const inputFoto = document.querySelector('#form-enviar-foto')

// Estado que vai ler cada informação colocada nos inputs
const state = {}

// Listener para alterações realizadas nos inputs
formContainer.addEventListener('input', (event) => {
    const field = event.target.dataset.field;

    if (!field) return;

    state[field] = event.target.value;
    renderPreview()
})

// Listener para especificamente a foto
inputFoto.addEventListener('change', (event) => {
    const arquivo = event.target.files[0]
    if (!arquivo) return

    const urlTemporaria = URL.createObjectURL(arquivo)
    const img = new Image()
    
    img.onload = () => {
        const ehRetrato = img.height > img.width
        const cartaz = document.querySelector('#prev-cartaz')
        
        if (ehRetrato) {
            preview.foto.style.height = '280px'
            cartaz.style.gap = '4px'         // ← reduz o gap entre elementos
            cartaz.style.padding = '8px 0'   // ← reduz o padding
        } else {
            preview.foto.style.height = '230px'
            cartaz.style.gap = '8px'         // ← volta ao normal
            cartaz.style.padding = '16px 0'
        }
        
        preview.foto.src = urlTemporaria

        const previewInput = document.querySelector('#preview-foto-input')
        const iconeFoto = document.querySelector('#icon-foto')
        previewInput.src = urlTemporaria
        previewInput.classList.remove('hidden')
        iconeFoto.classList.add('hidden')
    }
    
    img.src = urlTemporaria
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
    
    preview.nome.style.fontSize = '40px'
    preview.descricao.style.fontSize = '18px'
    
    let tamanhoNome = 40
    let tamanhoDesc = 18
    
    while (cartaz.scrollHeight > cartaz.clientHeight && tamanhoNome > 18) {
        tamanhoNome -= 1
        tamanhoDesc = Math.max(10, tamanhoDesc - 0.5)
        preview.nome.style.fontSize = tamanhoNome + 'px'
        preview.descricao.style.fontSize = tamanhoDesc + 'px'
    }
}

// Função para renderizar as mudanças na prévia
function renderPreview() {
    for (const campo in preview) {
            if (campo === 'idade') {
                preview[campo].textContent = state[campo] 
                ? `${state[campo]} anos` 
                : placeholders[campo]
            } else if (campo === 'data') {
                if (!state[campo]) return
                const [ano, mes, dia] = state[campo].split('-')
                preview[campo].textContent = `${dia}/${mes}/${ano}`
            } else {
                preview[campo].textContent = state[campo] || placeholders[campo]
            }
        }
        ajustarFontesCartaz()
}