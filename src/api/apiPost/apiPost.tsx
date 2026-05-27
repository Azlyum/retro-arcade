import { useState } from "react";

const URL = "http://127.0.0.1:8000/scores";

export const ApiPost = () => {
  const [clicked, setClicked] = useState<boolean>(false);

  async function getData() {
    try {
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (clicked !== false) {
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  getData();
};
