import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudents, createStudent, updateStudent, deleteStudent } from "./api";
import type { Student } from "./types";
import StudentForm from "./StudentForm";
import { FaEdit, FaTrash } from "react-icons/fa";
 function App() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["students"], queryFn: getStudents });
  const students = data?.data ?? [];

  const createMut = useMutation({ mutationFn: createStudent, onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }) });
  const updateMut = useMutation({ mutationFn: ({ id, data }: any) => updateStudent(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }) });
  const deleteMut = useMutation({ mutationFn: deleteStudent, onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }) });

  const [selected, setSelected] = useState<Student | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return students.filter(s =>
      (s.fname + " " + s.lname + " " + s.address)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [students, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Student Management</h1>
          <button
            onClick={() => setSelected({ fname: "", lname: "", birthdate: "", address: "", phone_number: "" } as Student)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Student
          </button>
        </header>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400"/>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Birthdate</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s, i) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2">{(page - 1) * pageSize + i + 1}</td>
                  <td className="px-4 py-2">{s.fname}</td>
                  <td className="px-4 py-2">{s.lname}</td>
                  <td className="px-4 py-2">{new Date(s.birthdate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{s.address}</td>
                  <td className="px-4 py-2">{s.phone_number}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => setSelected(s)}
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => deleteMut.mutate(s.id)}
                      className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {selected !== null && (
          <div className="fixed inset-0 bg-[#00000055] bg-opacity-40 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">
                {selected.id ? "Edit Student" : "Add Student"}
              </h2>
              <StudentForm
                defaultValues={{
                  fname: selected.fname,
                  lname: selected.lname,
                  birthdate: selected.birthdate,
                  address: selected.address,
                  phone_number: selected.phone_number
                }}
                submitLabel={selected.id ? "Update" : "Add"}
                onSubmit={(form) => {
                  if (selected.id) {
                    updateMut.mutate({ id: selected.id, data: form });
                  } else {
                    createMut.mutate(form);
                  }
                  setSelected(null);
                }}
              />
              <button
                onClick={() => setSelected(null)}
                className="mt-4 text-gray-600 hover:text-gray-800 focus:underline"  >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App