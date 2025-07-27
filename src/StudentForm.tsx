import { useState } from "react";
import type { Student } from "./types";

interface Props {
  onSubmit: (data: Omit<Student, "id">) => void;
  defaultValues?: Omit<Student, "id">;
  submitLabel: string;
}
 function StudentForm({ onSubmit, defaultValues, submitLabel }: Props) {
  const [form, setForm] = useState<Omit<Student, "id">>(
    defaultValues || {
      fname: "",
      lname: "",
      birthdate: "",
      address: "",
      phone_number: ""
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="fname"
          value={form.fname}
          onChange={handleChange}
          placeholder="First name"
          className="input-field"
          required
        />
        <input
          name="lname"
          value={form.lname}
          onChange={handleChange}
          placeholder="Last name"
          className="input-field"
          required
        />
      </div>
      <input
        type="date"
        name="birthdate"
        value={form.birthdate}
        onChange={handleChange}
        className="input-field"
        required
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="input-field"
      />
      <input
        name="phone_number"
        value={form.phone_number}
        onChange={handleChange}
        placeholder="Phone number"
        className="input-field"
        required
      />
      <button type="submit" className="btn-primary w-full">{submitLabel}</button>
    </form>
  );
}

export default StudentForm