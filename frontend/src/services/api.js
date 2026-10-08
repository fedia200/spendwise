
const API_URL = "http://127.0.0.1:8000";

export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erreur lors de l'inscription");
  }

  return response.json();
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "", email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Email ou mot de passe incorrect");
  }

  return response.json();
}

export async function getExpenses() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/expenses`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les dépenses");
  }

  return response.json();
}
export async function createExpense(expense) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erreur lors de la création");
  }

  return response.json();
}

export async function deleteExpense(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression");
  }

  return response.json();
}