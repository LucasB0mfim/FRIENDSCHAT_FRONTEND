document.addEventListener('DOMContentLoaded', () => {
    const backendUrl = 'https://tarefas-backend-d0w6.onrender.com/tasks';

    // Função para buscar tarefas do backend
    async function fetchTasks() {
        console.log("Fetching tasks..."); // Adicionado para verificar se a função está sendo chamada
        try {
            const response = await fetch(backendUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tasks = await response.json();

            // Verifique se os dados estão sendo recebidos corretamente
            console.log('Dados recebidos:', tasks);

            // Seleciona o elemento tbody onde as tarefas serão exibidas
            const tasksTableBody = document.getElementById('tasks-table-body');

            // Limpa a tabela de tarefas
            tasksTableBody.innerHTML = '';

            // Adiciona cada tarefa na tabela
            tasks.forEach(task => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.task}</td>
                    <td>${new Date(task.created_at).toLocaleString()}</td>
                `;
                tasksTableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    }

    // Chama a função para buscar tarefas quando a página é carregada
    fetchTasks();

    // Evento de envio de formulário para adicionar tarefa
    document.getElementById('task-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita o comportamento padrão de recarregar a página ao enviar o formulário

        const taskInput = document.getElementById('task-input');
        const task = taskInput.value.trim(); // Obtém o valor do campo de entrada e remove espaços em branco extras

        if (task === '') {
            alert('O campo de tarefa é obrigatório.'); // Verifica se a tarefa não está vazia
            return;
        }

        try {
            const response = await fetch(backendUrl, {
                method: 'POST', // Método POST para enviar dados ao backend
                headers: {
                    'Content-Type': 'application/json' // Define o tipo de conteúdo do corpo como JSON
                },
                body: JSON.stringify({ task }) // Envia a tarefa como um objeto JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newTask = await response.json();

            // Adiciona a nova tarefa à lista de tarefas sem recarregar a página
            const tasksTableBody = document.getElementById('tasks-table-body');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${newTask.id}</td>
                <td>${newTask.task}</td>
                <td>${new Date(newTask.created_at).toLocaleString()}</td>
            `;
            tasksTableBody.appendChild(tr);

            // Limpa o campo de entrada após adicionar a tarefa
            taskInput.value = '';

            // Exibe mensagem de sucesso
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = 'Tarefa adicionada com sucesso.';
            messageDiv.classList.remove('error');
            messageDiv.classList.add('success');

            console.log('Tarefa adicionada:', newTask);
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
            alert('Erro ao adicionar tarefa. Por favor, tente novamente.');
        }
    });
});
