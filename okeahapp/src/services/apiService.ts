const API_URL = "http://localhost:8000/";

export const fetchData = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data from the API");
  }
  return response.json();
};

export const sendData = async (data: object): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/api/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to send data to the API");
    }
    return response.json();
  };