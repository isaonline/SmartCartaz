const formContainer = document.querySelector('#dados-form')

// Estado que vai ler cada informação colocada nos inputs
const state = {}

// Listener para alterações realizadas nos inputs
formContainer.addEventListener('input', (event) => {
    const field = event.target.dataset.field;

    if (!field) return;

    state[field] = event.target.value;
    renderPreview()
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
    idade: "Idade da pessoa aqui",
    descricao: "A descrição do desaparecimento com detalhes aparecerá aqui, não esqueça de escrever características físicas marcantes da pessoa",
    local: "Bairro, Cidade - Estado",
    data: "00/00/0000",
    telefone: "(11) 99999-9999",
    recompensa: "",
    foto: ""   
}

// Função para renderizar as mudanças na prévia
function renderPreview() {
    for (const campo in preview) {
            if (campo === 'idade') {
                preview[campo].textContent = `${state[campo]} anos`
            } else if (campo === 'data') {
                const [ano, mes, dia] = state[campo].split('-')
                preview[campo].textContent = `${dia}/${mes}/${ano}`
            } else {
                preview[campo].textContent = state[campo] || placeholders[campo]
            }
        }
}