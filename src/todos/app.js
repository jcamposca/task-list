import todoStore, { Filters } from "../store/todo.store";
import html from "./app.html?raw";
import { renderPending, renderTodos } from "./use-cases";

const ElementIDs = {
    ClearCompletedButton: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId ) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( ElementIDs.TodoList, todos );
        updatePedingCount();
    }

    const updatePedingCount = () => {
        renderPending(ElementIDs.PendingCountLabel);
    }


    //cuando la funcion App() se llama 
    (()=>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector( elementId ).append(app);
        displayTodos( );
    })();

    //Referencias HTML
    const newDescriptionInput = document.querySelector( ElementIDs.NewTodoInput);
    const todoListUL = document.querySelector( ElementIDs.TodoList);
    const ClearCompletedButton = document.querySelector( ElementIDs.ClearCompletedButton);
    const filterLIs = document.querySelectorAll( ElementIDs.TodoFilters);


    //listeners
    newDescriptionInput.addEventListener('keyup', (event) => {
        if( event.keyCode !== 13) return;
        if( event.target.value.trim().length === 0) return;

        todoStore.addTodo( event.target.value );
        displayTodos();
        event.target.value = '';
    });

    todoListUL.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    todoListUL.addEventListener('click', (event) => {

        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');

        if( !element || !isDestroyElement ) {
            return;
        } else {
            todoStore.deleteTodo(element.getAttribute('data-id'));
            displayTodos();

        }
    });

    ClearCompletedButton.addEventListener('click', () => {
        
        todoStore.deleteCompleted();
        displayTodos();

    });

    filterLIs.forEach(element => {
        element.addEventListener('click', (element) => {
            filterLIs.forEach(e => e.classList.remove('selected'));
            element.target.classList.add('selected');

            switch(element.target.text) {
                case 'Todos':
                    todoStore.setFilter( Filters.All )
                break;
                case 'Pendientes':
                    todoStore.setFilter( Filters.Peding )
                break;
                case 'Completados':
                    todoStore.setFilter( Filters.Completed )
                break;
            }

            displayTodos();
        })
    });

}