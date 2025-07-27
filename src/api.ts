import axios from "axios";
import type { Student } from "./types";

const API = axios.create({
  baseURL: "https://68861e2cf52d34140f6b7041.mockapi.io/crud",
});

export const getStudents = () => API.get<Student[]>("/crud");
export const createStudent = (data: Omit<Student, "id">) => API.post<Student>("/crud", data);
export const updateStudent = (id: string, data: Partial<Student>) => API.put<Student>(`/crud/${id}`, data);
export const deleteStudent = (id: string) => API.delete(`/crud/${id}`);
