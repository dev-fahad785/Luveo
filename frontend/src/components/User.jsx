import { useEffect, useState } from "react";
import axios from 'axios';
import AdminBackLink from "./AdminBackLink";

const User = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", cart: "", role: "user" });
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = user;
    if (!name || !email || !password || !role) {
      alert("Please fill all the required fields");
      return;
    }
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) {
        alert("Authentication failed. Please log in again.");
        return;
      }
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ name, email, password, role }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        alert("User added successfully!");
        setUsers(prev => [...prev, data.user]);
        setUser({ name: "", email: "", password: "", cart: "", role: "user" });
      } else {
        alert(data.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding user");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/user/get-users");
      setUsers(await response.json());
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/admin/delete-user/" + userId);
    } catch (error) {
      console.error("Delete user error:", error.response?.data || error.message);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    alert("are you sure you want to update the role");
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/user/update-role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (response.ok) {
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
        alert("Role updated successfully!");
      } else {
        alert("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Error updating role");
    }
  };

  return (
    <div className="px-[clamp(16px,4vw,40px)] py-8">
      <AdminBackLink />

      <div className="max-w-lg mx-auto border border-[var(--prada-border)] bg-white p-6 sm:p-8">
        <h2 className="text-sm font-bold tracking-[0.05em] uppercase text-[var(--prada-black)] mb-6 text-center">
          Add User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {["name", "email", "password", "cart"].map((field) => (
            <div key={field}>
              <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                name={field}
                value={user[field]}
                onChange={handleChange}
                className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors"
                required={field !== "cart"}
              />
            </div>
          ))}

          <div>
            <label className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--prada-black)] block mb-1.5">
              Role
            </label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full border border-[var(--prada-border)] px-3 py-2.5 text-sm text-[var(--prada-black)] outline-none focus:border-[var(--prada-black)] transition-colors bg-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="text-center pt-2">
            <button
              type="submit"
              className="px-6 py-3 text-[10px] font-semibold tracking-[0.1em] uppercase bg-[var(--prada-black)] text-white border border-[var(--prada-black)] hover:bg-black/90 transition-colors active:scale-[0.98]"
            >
              Add User
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-bold tracking-[0.05em] uppercase text-[var(--prada-black)] mb-4">
          User List
        </h2>
        <div className="overflow-x-auto border border-[var(--prada-border)]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--prada-black)] text-white text-[10px] tracking-[0.08em] uppercase">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Email</th>
                <th className="py-3 px-4 font-medium">Cart</th>
                <th className="py-3 px-4 font-medium">Orders</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-[var(--prada-border)] text-sm">
                  <td className="py-3 px-4 text-[var(--prada-black)]">{u.name}</td>
                  <td className="py-3 px-4 text-[var(--prada-mid-gray)]">{u.email}</td>
                  <td className="py-3 px-4 text-[var(--prada-mid-gray)]">
                    {u.cart && u.cart.length > 0
                      ? u.cart.map((item) => item.name).join(", ")
                      : "\u2014"}
                  </td>
                  <td className="py-3 px-4 text-[var(--prada-mid-gray)]">
                    {u.orderHistory && u.orderHistory.length > 0
                      ? u.orderHistory.flatMap((item) => item.orderedProducts.map((p) => p.productName)).join(", ")
                      : "\u2014"}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border border-[var(--prada-border)] px-2 py-1 text-xs text-[var(--prada-black)] outline-none bg-white"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--prada-border)] text-[var(--prada-mid-gray)] hover:border-[var(--prada-black)] hover:text-[var(--prada-black)] transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase border border-[var(--brand-accent)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;
