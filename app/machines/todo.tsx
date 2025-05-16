import { createActorContext } from '@xstate/react';
import { createMachine, assign, assertEvent } from 'xstate';

export type Todo = {
	id: number;
	text: string;
	completed: boolean;
};
type MachineContext = { todos: Array<Todo> };
type EventTypes =
	| { type: 'ADD_TODO'; text: Todo['text'] }
	| { type: 'SET_TODOS'; todos: Array<Todo> }
	| { type: 'REMOVE_TODO'; id: Todo['id'] }
	| { type: 'UPDATE_TODO'; todo: Todo }
	| { type: 'SAVE_TODO' }
	| { type: 'EDIT_TODOS' };

const todoMachine = createMachine({
	id: 'todos',
	types: {
		context: {} as MachineContext,
		events: {} as EventTypes,
	},
	initial: 'editing',
	context: {
		todos: [],
	},
	states: {
		editing: {
			on: {
				ADD_TODO: {
					actions: assign(({ context, event }) => {
						assertEvent(event, 'ADD_TODO');

						return {
							todos: context.todos.concat({
								id: context.todos.length + 1,
								text: event.text,
								completed: false,
							}),
						};
					}),
				},
				SET_TODOS: {
					actions: assign(({ event }) => {
						assertEvent(event, 'SET_TODOS');

						return {
							todos: event.todos,
						};
					}),
				},
				REMOVE_TODO: {
					actions: assign(({ context, event }) => {
						assertEvent(event, 'REMOVE_TODO');

						return {
							todos: context.todos.filter(todo => todo.id !== event.id),
						};
					}),
				},
				UPDATE_TODO: {
					actions: assign(({ context, event }) => {
						assertEvent(event, 'UPDATE_TODO');
						

						const index = context.todos.findIndex(t => t.id === event.todo.id);
						const newTodos = [...context.todos];
						newTodos[index] = event.todo;

						return {
							todos: newTodos,
						};
					}),
				},
				SAVE_TODO: {
					target: 'saving'
				},
			},
		},
		saving: {
			on: {
				EDIT_TODOS: {
					target: 'editing'
				},
			}
		},
	},
});

export const TodoMachineContext = createActorContext(todoMachine);
