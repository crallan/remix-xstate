import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Trash2, Check, X, PlusCircle, SaveAll, ArrowLeft } from 'lucide-react';
import { Todo, TodoMachineContext } from '../machines/todo'

const initialTodos: Todo[] = [
	{ id: 1, text: 'Learn Remix', completed: false },
	{ id: 2, text: 'Build a todo app', completed: false },
	{ id: 3, text: 'Deploy to Vercel', completed: false },
];

export const loader = async () => {
	return { initialTodos };
};

export default function TodoList() {
	const { initialTodos } = useLoaderData<typeof loader>();
	const todos = TodoMachineContext.useSelector((state) => state.context.todos);
	const state = TodoMachineContext.useSelector((state) => state.value);
  	const todoActorRef = TodoMachineContext.useActorRef();
	
	useEffect(() => {
		todoActorRef.send({ type: 'SET_TODOS', todos: initialTodos });
	}, [initialTodos]);

	const [newTodo, setNewTodo] = useState("")
	
	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-2xl mx-auto p-6">
				<h1 className="text-3xl font-bold text-gray-800 mb-2">Todo List</h1>
				<h4 className="text-sm font-bold text-gray-400 mb-8">{`Current State: ${state}`}</h4>

				{
					state === "editing" ?  
					(<div>
						<form onSubmit={e => {
							e.preventDefault();
							todoActorRef.send({ type: "ADD_TODO", text: newTodo });
							setTimeout(() => setNewTodo(''), 100);
						}} className="mb-8">
						<div className="flex items-center gap-2">
							<input
								type="text"
								name="text"
								value={newTodo}
								onChange={e => setNewTodo(e.target.value)}
								placeholder="Add a new todo..."
								className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="submit"
								className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-colors"
							>
								<PlusCircle size={18} />
								<span>Add</span>
							</button>
						</div>
					</form>

					<div className="bg-white rounded-lg shadow-md overflow-hidden">
						{todos.length === 0 ? (
							<p className="p-6 text-gray-500 text-center">No todos yet. Add one above!</p>
						) : (
							<ul className="divide-y divide-gray-200">
								{todos.map(todo => (
									<li
										key={todo.id}
										className={`flex items-center justify-between p-4 ${
											todo.completed ? 'bg-gray-50' : ''
										}`}
									>
										<span
											className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
										>
											{todo.text}
										</span>
										<div className="flex items-center gap-2">
											<form onSubmit={e => {
													e.preventDefault()
													const selected = todos.find(t => t.id === todo.id);

													if (selected) {
														selected.completed = !selected.completed;
														todoActorRef.send({ type: "UPDATE_TODO", todo: selected });
													}
												}} className="inline">
												<input type="hidden" name="id" value={todo.id} />
												<button
													type="submit"
													value="toggle"
													className={`p-1 rounded-full ${
														todo.completed
															? 'bg-gray-200 hover:bg-gray-300 text-gray-600'
															: 'bg-green-100 hover:bg-green-200 text-green-600'
													}`}
													title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
												>
													{todo.completed ? <X size={18} /> : <Check size={18} />}
												</button>
											</form>
											<form onSubmit={e => {
													e.preventDefault()
													todoActorRef.send({ type: "REMOVE_TODO", id: todo.id });
												}} className="inline">
												<input type="hidden" name="id" value={todo.id} />
												<button
													type="submit"
													value="delete"
													className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
													title="Delete todo"
												>
													<Trash2 size={18} />
												</button>
											</form>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
					<div className="mt-4">
						<form onSubmit={e => {
							e.preventDefault();
							todoActorRef.send({ type: "SAVE_TODO" });
						}} className="mb-8">
								<button
									type="submit"
									className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-colors"
								>
									<SaveAll size={18} />
									<span>Save</span>
								</button>
				
						</form>
					</div>
					
					</div>) : (
						<div>
							<h2 className="text-3xl font-bold text-gray-700 mb-8">Saving!</h2>
							<div className="mt-4">
								<form onSubmit={e => {
									e.preventDefault();
									todoActorRef.send({ type: "EDIT_TODOS" });
								}} className="mb-8">
										<button
											type="submit"
											className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-colors"
										>
											<ArrowLeft size={18} />
											<span>Edit Todos</span>
										</button>
						
								</form>
							</div>
						</div>)
				}
			</div>
		</div>
	);
}
