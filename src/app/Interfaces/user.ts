export interface User {
  fullname: string;
  email: string;
  id: string;
  password: string;
  role: string;
  phone: number;
  tasks?: task[];
}

export interface task {
  id: string;
  title: string;
  taskDesc: string;
  dueDate: Date;
  priority: string;
  daysLeft: number;
  status: string;
}
