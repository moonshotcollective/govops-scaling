const server = "http://localhost:4001";

export const sayHello = () => {
  fetch(server + "/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: "{hello}" }),
  })
    .then(r => r.json())
    .then(data => console.log("data returned", data));
};

export const getGaugeScore = id => {
  fetch(server + "/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ ID: id, query: "{gaugeScore}" }),
  })
    .then(r => r.json())
    .then(data => console.log("data returned", data));
};
