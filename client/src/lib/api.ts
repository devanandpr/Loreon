const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* =====================================================
   PRODUCTS
===================================================== */

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getProduct(id: string) {
  const response = await fetch(
    `${API_URL}/products/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}


/* =====================================================
   AUTHENTICATION
===================================================== */

/* ---------------- REGISTER ---------------- */

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to register user"
    );
  }

  return data;
}


/* ---------------- LOGIN ---------------- */

export async function loginUser(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to login"
    );
  }

  return data;
}


/* =====================================================
   ORDERS
===================================================== */

export async function createOrder(
  orderData: {
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    };

    items: {
      id: string;
      quantity: number;
    }[];

    subtotal: number;
    shipping: number;
    total: number;
    paymentMethod: string;
  },

  token: string
) {
  const response = await fetch(
    `${API_URL}/orders`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(orderData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create order"
    );
  }

  return data;
}