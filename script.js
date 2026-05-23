//  captura elementos do formulário
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const priorityInput = document.getElementById('task-priority'); 

// Tenta buscar as tarefas salvas. Se não tiver nada, cria uma lista vazia ([])
let tasks = JSON.parse(localStorage.getItem('kanban_tasks')) || [];

// Salvando no LocalStorage
function saveTasks() {
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
}
function renderTasks() {
    document.querySelector('#todo .task-list').innerHTML = '';
    document.querySelector('#doing .task-list').innerHTML = '';
    document.querySelector('#done .task-list').innerHTML = '';

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.classList.add('task-card');

        // Configurando o Arrastar 
        card.setAttribute('draggable', 'true'); // Diz pro navegador que isso pode ser arrastado

        card.addEventListener('dragstart', (e) => {
           
            e.dataTransfer.setData('task-id', task.id);

            setTimeout(() => card.classList.add('dragging'), 0);
        });

        card.addEventListener('dragend', () => {
          
            card.classList.remove('dragging');
        });
      
       
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('task-content');

        const tag = document.createElement('span');
        tag.classList.add('priority-tag', `tag-${task.priority}`);
        tag.innerText = task.priority;

        const span = document.createElement('span');
        span.innerText = task.text;

        contentDiv.appendChild(tag);
        contentDiv.appendChild(span);
       

        const btn = document.createElement('button');
        if (task.status === 'todo') btn.innerText = 'Avançar ➔';
        else if (task.status === 'doing') btn.innerText = 'Concluir ✔';
        else if (task.status === 'done') btn.innerText = 'Excluir ✖';

        btn.addEventListener('click', () => {
            if (task.status === 'todo') task.status = 'doing';
            else if (task.status === 'doing') task.status = 'done';
            else if (task.status === 'done') tasks = tasks.filter(t => t.id !== task.id);
            
            saveTasks();  
            renderTasks(); 
        });

        card.appendChild(contentDiv); 
        card.appendChild(btn);
        document.querySelector(`#${task.status} .task-list`).appendChild(card);
    });
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    if (text === '') return;

    const newTask = {
        id: Date.now(),
        text: text,
        status: 'todo',
        priority: priorityInput.value // para pegar a prioridade selecionada
    };

    tasks.push(newTask);
    saveTasks();         
    renderTasks();       
    
    input.value = '';    
});


renderTasks();


const columns = document.querySelectorAll('.column');

columns.forEach(column => {
    
    column.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        column.classList.add('drag-over'); // Fundo mais escuro na coluna
    });

   
    column.addEventListener('dragleave', () => {
        column.classList.remove('drag-over');
    });

   
    column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('drag-over'); // Limpa a cor da coluna

        // id guardado no mouse
        const draggedTaskId = Number(e.dataTransfer.getData('task-id'));
        
        // usa o ID para procurar a tarefa
        const task = tasks.find(t => t.id === draggedTaskId);
        
        if (task) {

            task.status = column.id; 
            
            saveTasks();   // 
            renderTasks(); // redesenha a tela
        }
    });
});