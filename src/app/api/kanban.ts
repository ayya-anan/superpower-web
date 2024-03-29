export interface KanbanCard {
    id: string;
    dealName?: string;
    accountManager?: any;
    status?: string;
    org?: any;
    type?: any;
    progress?: number;
    value?: number;
    assignees?: Assignee[];
    attachments?: number;
    comments?: Comment[];
    startDate: Date | string;
    closeDate: Date | string;
    completed?: boolean;
    priority?: Object;
    taskList: TaskList;
    quotes?: []
}

export interface KanbanList {
    listId: string;
    name?: string;
    label?: string;
    cards: KanbanCard[];
}

export interface Comment {
    id?: string;
    name: string;
    image?: string;
    text: string;
}

export interface ListName {
    listId?: string;
    title: string;
}

export interface TaskList {
    id?: string;
    title: string;
    tasks: Task[];
}

export interface Task {
    text: string;
    completed: boolean;
}

export interface Assignee {
    name: string;
    image: string;
}