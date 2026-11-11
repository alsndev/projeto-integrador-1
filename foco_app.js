/* ============================================================
   FOCO - Plataforma de Estudos
   JavaScript funcional com localStorage
   ============================================================ */

// Estado da aplicação
let estado = {
    materias: [],
    cronograma: [],
    materiais: [],
    tarefas: [],
    simulados: [
        {
            id: 0,
            titulo: 'Simulado de Matemática',
            descricao: '10 questões sobre funções, equações e geometria.',
            questoes: [
                {
                    pergunta: 'Qual é o valor de x na equação 2x + 5 = 15?',
                    opcoes: ['x = 3', 'x = 5', 'x = 7', 'x = 10'],
                    correta: 1
                },
                {
                    pergunta: 'Quanto mede o ângulo reto?',
                    opcoes: ['45°', '90°', '180°', '360°'],
                    correta: 1
                },
                {
                    pergunta: 'Qual é a área de um quadrado com lado 4 cm?',
                    opcoes: ['8 cm²', '12 cm²', '16 cm²', '20 cm²'],
                    correta: 2
                }
            ]
        },
        {
            id: 1,
            titulo: 'Simulado de Português',
            descricao: '10 questões sobre interpretação de texto e gramática.',
            questoes: [
                {
                    pergunta: 'Qual é o plural de "papel"?',
                    opcoes: ['papeis', 'papéis', 'papels', 'papel'],
                    correta: 1
                },
                {
                    pergunta: 'Qual palavra é sinônimo de "alegre"?',
                    opcoes: ['triste', 'contente', 'bravo', 'cansado'],
                    correta: 1
                },
                {
                    pergunta: 'Qual é o verbo na frase: "Ela estuda todos os dias"?',
                    opcoes: ['Ela', 'estuda', 'todos', 'dias'],
                    correta: 1
                }
            ]
        }
    ],
    resultadosSimulados: [],
    horasEstudadas: 0,
    tarefasConcluidas: 0
};

// Chave do localStorage
const LS_KEY = 'foco_estudos_v1';

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    carregarEstado();
    inicializarNavegacao();
    inicializarMenuMobile();
    renderizarTodasPaginas();
});

// Carrega dados do localStorage
function carregarEstado() {
    const salvo = localStorage.getItem(LS_KEY);
    if (salvo) {
        try {
            estado = JSON.parse(salvo);
        } catch (e) {
            console.warn('Erro ao carregar estado salvo:', e);
        }
    }
    // Garante que arrays existam
    estado.materias = estado.materias || [];
    estado.cronograma = estado.cronograma || [];
    estado.materiais = estado.materiais || [];
    estado.tarefas = estado.tarefas || [];
    estado.simulados = estado.simulados || [];
    estado.resultadosSimulados = estado.resultadosSimulados || [];
}

// Salva estado no localStorage
function salvarEstado() {
    localStorage.setItem(LS_KEY, JSON.stringify(estado));
}

// ==================== NAVEGAÇÃO ====================
function inicializarNavegacao() {
    const links = document.querySelectorAll('.nav-link');
    const secoes = document.querySelectorAll('.secao');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const secaoAlvo = this.getAttribute('data-secao');

            // Atualiza links ativos
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Exibe seção alvo
            secoes.forEach(s => {
                s.classList.remove('conteudo-ativo');
                s.style.display = 'none';
            });

            const secao = document.getElementById(secaoAlvo);
            if (secao) {
                secao.style.display = 'block';
                secao.classList.add('conteudo-ativo');
            }

            // Re-renderiza a seção alvo
            renderizarSecao(secaoAlvo);

            // Fecha menu mobile se aberto
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            sidebar.classList.remove('aberto');
            overlay.classList.remove('aberto');
        });
    });
}

// Renderiza uma seção específica
function renderizarSecao(secao) {
    switch(secao) {
        case 'inicio': renderizarInicio(); break;
        case 'cronograma': renderizarCronograma(); break;
        case 'materiais': renderizarMateriais(); break;
        case 'tarefas': renderizarTarefas(); break;
        case 'progresso': renderizarProgresso(); break;
    }
}

// Renderiza todas as páginas inicialmente
function renderizarTodasPaginas() {
    renderizarInicio();
    renderizarCronograma();
    renderizarMateriais();
    renderizarTarefas();
    renderizarProgresso();
}

// ==================== MENU MOBILE ====================
function inicializarMenuMobile() {
    const btn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    btn.addEventListener('click', function() {
        sidebar.classList.toggle('aberto');
        overlay.classList.toggle('aberto');
    });

    overlay.addEventListener('click', function() {
        sidebar.classList.remove('aberto');
        overlay.classList.remove('aberto');
    });
}

// ==================== INÍCIO / DASHBOARD ====================
function renderizarInicio() {
    // Resumo
    const totalMaterias = estado.materias.length;
    const tarefasPendentes = estado.tarefas.filter(t => !t.concluida).length;
    const tarefasConcluidas = estado.tarefas.filter(t => t.concluida).length;

    const elTotalMaterias = document.getElementById('dashboard-total-materias');
    const elTarefasConcluidas = document.getElementById('dashboard-tarefas-concluidas');
    const elTarefasPendentes = document.getElementById('dashboard-tarefas-pendentes');
    const elHorasEstudadas = document.getElementById('dashboard-horas-estudadas');

    if (elTotalMaterias) elTotalMaterias.textContent = totalMaterias;
    if (elTarefasConcluidas) elTarefasConcluidas.textContent = tarefasConcluidas;
    if (elTarefasPendentes) elTarefasPendentes.textContent = tarefasPendentes;
    if (elHorasEstudadas) elHorasEstudadas.textContent = estado.horasEstudadas;

    // Progresso geral
    const totalTarefas = estado.tarefas.length;
    const percentual = totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;

    const elPercentual = document.getElementById('progresso-percentual');
    const elBarra = document.getElementById('barra-progresso-geral');
    if (elPercentual) elPercentual.textContent = percentual + '%';
    if (elBarra) elBarra.style.width = percentual + '%';

    // Próximas tarefas (próximas 3 pendentes ordenadas por prazo)
    const listaProximas = document.getElementById('lista-proximas-tarefas');
    if (listaProximas) {
        const proximas = [...estado.tarefas]
            .filter(t => !t.concluida)
            .sort((a, b) => new Date(a.prazo) - new Date(b.prazo))
            .slice(0, 3);

        if (proximas.length === 0) {
            listaProximas.innerHTML = '<li class="estado-vazio" style="padding:20px;">Não há tarefas pendentes no momento.</li>';
        } else {
            listaProximas.innerHTML = proximas.map(t => `
                <li style="padding:12px; border-bottom:1px solid var(--borda); font-size:14px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:600; color:var(--titulo);">${t.nome}</div>
                        <div style="font-size:12px; color:var(--texto-secundario);">${t.disciplina || 'Sem disciplina'} • Prazo: ${formatarData(t.prazo)}</div>
                    </div>
                    <span class="prioridade-badge prioridade-${t.prioridade}">${t.prioridade}</span>
                </li>
            `).join('');
        }
    }

    // Resumo cronograma hoje
    const hoje = new Date().toISOString().split('T')[0];
    const atividadesHoje = estado.cronograma.filter(c => c.data === hoje);
    const elResumoCronograma = document.getElementById('resumo-cronograma');
    if (elResumoCronograma) {
        if (atividadesHoje.length === 0) {
            elResumoCronograma.textContent = 'Nenhuma atividade agendada para hoje.';
        } else {
            elResumoCronograma.innerHTML = atividadesHoje.map(a =>
                `${a.inicio} - ${a.fim}: ${a.disciplina}`
            ).join('<br>');
        }
    }
}

// ==================== CRONOGRAMA ====================
function renderizarCronograma() {
    const tbody = document.getElementById('tbody-cronograma');
    if (!tbody) return;

    const atividades = [...estado.cronograma].sort((a, b) => {
        if (a.data !== b.data) return a.data.localeCompare(b.data);
        return a.inicio.localeCompare(b.inicio);
    });

    if (atividades.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="estado-vazio" style="padding:24px;">Nenhuma atividade cadastrada.</td></tr>';
        return;
    }

    tbody.innerHTML = atividades.map((a, index) => `
        <tr>
            <td style="font-size:14px; color:var(--texto-principal);">${formatarDataExibicao(a.data)}</td>
            <td style="font-size:14px; color:var(--texto-principal);">${a.inicio} - ${a.fim}</td>
            <td style="font-size:14px; font-weight:600; color:var(--titulo);">${a.disciplina}</td>
            <td style="font-size:14px;">
                <button class="btn btn-secondary btn-sm" onclick="editarCronograma(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="removerCronograma(${index})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Adicionar atividade cronograma
document.addEventListener('DOMContentLoaded', function() {
    const formCronograma = document.getElementById('form-cronograma');
    if (formCronograma) {
        formCronograma.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = document.getElementById('cron-data').value;
            const inicio = document.getElementById('cron-inicio').value;
            const fim = document.getElementById('cron-fim').value;
            const disciplina = document.getElementById('cron-disciplina').value.trim();

            if (!data || !inicio || !fim || !disciplina) {
                mostrarMensagem('Preencha todos os campos.', 'erro');
                return;
            }

            const editIndex = formCronograma.dataset.editIndex;
            if (editIndex !== undefined && editIndex !== '') {
                // Modo edição
                estado.cronograma[parseInt(editIndex)] = { data, inicio, fim, disciplina };
                delete formCronograma.dataset.editIndex;
                const btnSubmit = formCronograma.querySelector('button[type="submit"]');
                if (btnSubmit) btnSubmit.textContent = 'Adicionar';
                mostrarMensagem('Atividade atualizada com sucesso!', 'sucesso');
            } else {
                // Modo adicionar
                estado.cronograma.push({ data, inicio, fim, disciplina });
                mostrarMensagem('Atividade adicionada com sucesso!', 'sucesso');
            }

            salvarEstado();
            renderizarCronograma();
            renderizarInicio();
            formCronograma.reset();
        });
    }
});

window.removerCronograma = function(index) {
    if (confirm('Deseja excluir esta atividade?')) {
        estado.cronograma.splice(index, 1);
        salvarEstado();
        renderizarCronograma();
        renderizarInicio();
        mostrarMensagem('Atividade removida.', 'sucesso');
    }
};

window.editarCronograma = function(index) {
    const atividade = estado.cronograma[index];
    document.getElementById('cron-data').value = atividade.data;
    document.getElementById('cron-inicio').value = atividade.inicio;
    document.getElementById('cron-fim').value = atividade.fim;
    document.getElementById('cron-disciplina').value = atividade.disciplina;

    // Marca índice de edição no formulário
    document.getElementById('form-cronograma').dataset.editIndex = index;

    // Muda o texto do botão de submit
    const btnSubmit = document.getElementById('form-cronograma').querySelector('button[type="submit"]');
    if (btnSubmit) btnSubmit.textContent = 'Salvar alterações';

    // Scroll para o formulário
    document.getElementById('form-cronograma').scrollIntoView({ behavior: 'smooth' });
};

// ==================== MATERIAIS ====================
function renderizarMateriais() {
    const container = document.getElementById('lista-materiais');
    if (!container) return;

    if (estado.materiais.length === 0) {
        container.innerHTML = '<div class="estado-vazio" style="grid-column:1/-1; padding:40px 20px;">Nenhum material cadastrado.</div>';
        return;
    }

    container.innerHTML = estado.materiais.map((m, index) => `
        <div class="material-card">
            <h4>${m.titulo}</h4>
            <p>${m.descricao || 'Sem descrição.'}</p>
            <div class="meta">
                <span><strong>Disciplina:</strong> ${m.disciplina}</span>
                <span><strong>Categoria:</strong> ${m.categoria}</span>
            </div>
            ${m.link ? `<a href="${m.link}" target="_blank" class="link">🔗 Acessar link</a>` : ''}
            <div class="acoes">
                <button class="btn btn-danger btn-sm" onclick="removerMaterial(${index})">Excluir</button>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    const formMaterial = document.getElementById('form-material');
    if (formMaterial) {
        formMaterial.addEventListener('submit', function(e) {
            e.preventDefault();
            const titulo = document.getElementById('mat-titulo').value.trim();
            const disciplina = document.getElementById('mat-disciplina').value.trim();
            const categoria = document.getElementById('mat-categoria').value;
            const link = document.getElementById('mat-link').value.trim();

            if (!titulo || !disciplina) {
                mostrarMensagem('Título e disciplina são obrigatórios.', 'erro');
                return;
            }

            estado.materiais.push({ titulo, disciplina, categoria, link, descricao: link });
            salvarEstado();
            renderizarMateriais();
            formMaterial.reset();
            mostrarMensagem('Material adicionado com sucesso!', 'sucesso');
        });
    }
});

window.removerMaterial = function(index) {
    if (confirm('Deseja excluir este material?')) {
        estado.materiais.splice(index, 1);
        salvarEstado();
        renderizarMateriais();
        mostrarMensagem('Material removido.', 'sucesso');
    }
};

// ==================== TAREFAS ====================
function renderizarTarefas() {
    const container = document.getElementById('lista-tarefas');
    if (!container) return;

    const tarefasFiltradas = window.filtroTarefasAtual === 'pendentes'
        ? estado.tarefas.filter(t => !t.concluida)
        : window.filtroTarefasAtual === 'concluidas'
            ? estado.tarefas.filter(t => t.concluida)
            : estado.tarefas;

    const ordenadas = [...tarefasFiltradas].sort((a, b) => new Date(a.prazo) - new Date(b.prazo));

    if (ordenadas.length === 0) {
        container.innerHTML = '<li class="estado-vazio" style="padding:20px;">Nenhuma tarefa encontrada.</li>';
        return;
    }

    container.innerHTML = ordenadas.map((t, indiceOriginal) => `
        <li class="lista-item">
            <div class="lista-item-conteudo">
                <label class="checkbox-custom" style="cursor:pointer;">
                    <input type="checkbox" ${t.concluida ? 'checked' : ''} onchange="alternarTarefa(${indiceOriginal})">
                    <div class="check-box"></div>
                    <span>${t.nome}</span>
                </label>
                <div style="font-size:12px; color:var(--texto-secundario); margin-top:4px;">
                    ${t.disciplina ? t.disciplina + ' • ' : ''}Prazo: ${formatarDataExibicao(t.prazo)}
                </div>
            </div>
            <div class="lista-item-acao">
                <span class="prioridade-badge prioridade-${t.prioridade}">${t.prioridade}</span>
                <button class="btn btn-danger btn-sm" onclick="removerTarefa(${indiceOriginal})">Excluir</button>
            </div>
        </li>
    `).join('');
}

window.filtroTarefasAtual = 'todas';

window.filtrarTarefas = function(filtro) {
    window.filtroTarefasAtual = filtro;
    renderizarTarefas();
};

document.addEventListener('DOMContentLoaded', function() {
    const formTarefa = document.getElementById('form-tarefa');
    if (formTarefa) {
        formTarefa.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('tarefa-nome').value.trim();
            const disciplina = document.getElementById('tarefa-disciplina').value.trim();
            const prazo = document.getElementById('tarefa-prazo').value;
            const prioridade = document.getElementById('tarefa-prioridade').value;

            if (!nome || !prazo) {
                mostrarMensagem('Nome e prazo são obrigatórios.', 'erro');
                return;
            }

            estado.tarefas.push({ nome, disciplina, prazo, prioridade, concluida: false });
            salvarEstado();
            renderizarTarefas();
            renderizarInicio();
            formTarefa.reset();
            mostrarMensagem('Tarefa adicionada com sucesso!', 'sucesso');
        });
    }
});

window.alternarTarefa = function(index) {
    estado.tarefas[index].concluida = !estado.tarefas[index].concluida;
    salvarEstado();
    renderizarTarefas();
    renderizarInicio();
};

window.removerTarefa = function(index) {
    if (confirm('Deseja excluir esta tarefa?')) {
        estado.tarefas.splice(index, 1);
        salvarEstado();
        renderizarTarefas();
        renderizarInicio();
        mostrarMensagem('Tarefa removida.', 'sucesso');
    }
};

// ==================== SIMULADOS ====================
window.iniciarSimulado = function(indice) {
    const simulado = estado.simulados[indice];
    if (!simulado) return;

    let questaoAtual = 0;
    let respostas = [];

    const area = document.getElementById('area-simulado');
    const container = document.getElementById('simulado-pergunta-container');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnProximo = document.getElementById('btn-proximo');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const resultado = document.getElementById('resultado-simulado');

    area.classList.remove('hidden');
    resultado.classList.add('hidden');
    resultado.innerHTML = '';

    function renderQuestao() {
        const q = simulado.questoes[questaoAtual];
        container.innerHTML = `
            <div class="questao">
                <h4>Questão ${questaoAtual + 1} de ${simulado.questoes.length}</h4>
                <p style="margin-bottom:16px; font-weight:600;">${q.pergunta}</p>
                ${q.opcoes.map((op, i) => `
                    <div class="opcao">
                        <input type="radio" name="q${simulado.id}" id="op${i}" value="${i}" ${respostas[questaoAtual] === i ? 'checked' : ''} onchange="responderSimulado(${indice}, ${questaoAtual}, ${i})">
                        <label for="op${i}">${op}</label>
                    </div>
                `).join('')}
            </div>
        `;

        btnAnterior.style.display = questaoAtual === 0 ? 'none' : 'inline-block';
        btnProximo.style.display = questaoAtual === simulado.questoes.length - 1 ? 'none' : 'inline-block';
        btnFinalizar.style.display = questaoAtual === simulado.questoes.length - 1 ? 'inline-block' : 'none';
    }

    window.responderSimulado = function(simIdx, qIdx, opIdx) {
        respostas[qIdx] = opIdx;
    };

    btnAnterior.onclick = function() {
        if (questaoAtual > 0) {
            questaoAtual--;
            renderQuestao();
        }
    };

    btnProximo.onclick = function() {
        if (questaoAtual < simulado.questoes.length - 1) {
            questaoAtual++;
            renderQuestao();
        }
    };

    btnFinalizar.onclick = function() {
        let acertos = 0;
        simulado.questoes.forEach((q, i) => {
            if (respostas[i] === q.correta) acertos++;
        });

        const resultadoObj = {
            simuladoId: simulado.id,
            simuladoTitulo: simulado.titulo,
            acertos,
            total: simulado.questoes.length,
            data: new Date().toISOString()
        };
        estado.resultadosSimulados.push(resultadoObj);
        salvarEstado();

        area.classList.add('hidden');
        resultado.classList.remove('hidden');
        const percentual = Math.round((acertos / simulado.questoes.length) * 100);
        resultado.innerHTML = `
            <div class="resultado-simulado">
                <h3>Simulado finalizado!</h3>
                <div class="pontuacao">${acertos} / ${simulado.questoes.length}</div>
                <p>Taxa de acertos: ${percentual}%</p>
                <button class="btn btn-secondary" onclick="document.getElementById('area-simulado').classList.add('hidden'); renderizarProgresso();">Voltar</button>
            </div>
        `;
    };

    renderQuestao();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ==================== PROGRESSO ====================
function renderizarProgresso() {
    const total = estado.tarefas.length;
    const concluidas = estado.tarefas.filter(t => t.concluida).length;
    const taxa = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    document.getElementById('progresso-total-concluidas').textContent = concluidas;
    document.getElementById('progresso-taxa').textContent = taxa + '%';
    document.getElementById('progresso-horas').textContent = estado.horasEstudadas + 'h';
    document.getElementById('progresso-simulados').textContent = estado.resultadosSimulados.length;

    // Gráfico semanal (últimos 7 dias baseados em tarefas concluídas por dia)
    const barrasContainer = document.getElementById('grafico-barras');
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const hoje = new Date();
    const dadosSemana = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - i);
        const dataStr = d.toISOString().split('T')[0];
        const concluidasDia = estado.tarefas.filter(t =>
            t.concluida && t.prazo === dataStr
        ).length;
        dadosSemana.push(concluidasDia);
    }

    const max = Math.max(...dadosSemana, 1);

    barrasContainer.innerHTML = dadosSemana.map((valor, i) => {
        const altura = (valor / max) * 100;
        return `
            <div class="barra-dia">
                <div class="barra-valor" style="height:${altura}%; background-color:var(--destaque);"></div>
                <div class="barra-label">${dias[i]}<br><span style="font-size:11px; color:var(--texto-secundario);">${valor}</span></div>
            </div>
        `;
    }).join('');

    // Desempenho simulados
    const containerDesempenho = document.getElementById('lista-desempenho-simulados');
    if (estado.resultadosSimulados.length === 0) {
        containerDesempenho.innerHTML = '<div class="estado-vazio" style="padding:20px;">Nenhum simulado realizado.</div>';
    } else {
        containerDesempenho.innerHTML = estado.resultadosSimulados.map(r => `
            <div class="lista-item" style="padding:12px;">
                <div style="flex:1;">
                    <div style="font-weight:600; color:var(--titulo);">${r.simuladoTitulo}</div>
                    <div style="font-size:13px; color:var(--texto-escuro);">${r.acertos} / ${r.total} acertos</div>
                </div>
                <div style="font-weight:600; color:var(--destaque);">${Math.round((r.acertos / r.total) * 100)}%</div>
            </div>
        `).join('');
    }
}

// ==================== MENSAGENS ====================
function mostrarMensagem(texto, tipo = 'info') {
    // Remove mensagem existente
    const existente = document.querySelector('.mensagem');
    if (existente) existente.remove();

    const div = document.createElement('div');
    div.className = `mensagem mensagem-${tipo}`;
    div.textContent = texto;
    div.style.position = 'fixed';
    div.style.top = '100px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.zIndex = '1000';
    div.style.maxWidth = '400px';

    document.body.appendChild(div);

    setTimeout(() => {
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

// ==================== UTILITÁRIOS ====================
function formatarData(dataISO) {
    if (!dataISO) return '-';
    const d = new Date(dataISO + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
}

function formatarDataExibicao(dataISO) {
    if (!dataISO) return '-';
    const d = new Date(dataISO + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
