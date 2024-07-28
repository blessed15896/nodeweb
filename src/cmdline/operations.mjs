import { input } from "@inquirer/prompts";

export const ops = {
  "Get All": async () => await sendRequest("GET", "/api/results"),
  "Get Name": async () => {
    const name = await input({ message: "Name?" });
    await sendRequest("GET", `/api/results?name=${name}`);
  },
  Store: async () => {
    const values = {
      name: await input({ message: "Name?" }),
      age: await input({ message: "Age?" }),
      years: await input({ message: "Years?" }),
    };
    await sendRequest("POST", "/api/results", values);
  },
  Replace: async () => {
    const id = await input({ message: "ID?" });
    const values = {
      name: await input({ message: "Name?" }),
      age: await input({ message: "Age?" }),
      years: await input({ message: "Years?" }),
      nextage: await input({ message: "Next Age?" }),
    };
    await sendRequest("PUT", `/api/results/${id}`, values);
  },
  Modify: async () => {
    const id = await input({ message: "ID?" });
    const values = {
      name: await input({ message: "Name?" }),
      age: await input({ message: "Age?" }),
      years: await input({ message: "Years?" }),
      nextage: await input({ message: "Next Age?" }),
    };
    await sendRequest(
      "PATCH",
      `/api/results/${id}`,
      Object.entries(values)
        .filter(([p, v]) => v !== "")
        .map(([p, v]) => ({ op: "replace", path: "/" + p, value: v })),
      "application/json-patch+json"
    );
  },
  Delete: async () => {
    const id = await input({ message: "ID?" });
    await sendRequest("DELETE", `/api/results/${id}`);
  },
  Test: () => {
    console.log("Test operation selected");
  },
  Exit: () => process.exit(),
};

const baseUrl = "http://localhost:5000";

const sendRequest = async (
  method,
  url,
  body,
  contentType = "application/json"
) => {
  const response = await fetch(baseUrl + url, {
    method,
    headers: { "Content-Type": contentType },
    body: JSON.stringify(body),
  });
  if (response.status == 200) {
    const data = await response.json();
    (Array.isArray(data) ? data : [data]).forEach((elem) =>
      console.log(JSON.stringify(elem))
    );
  } else console.log(response.status, " ", response.statusText);
};
