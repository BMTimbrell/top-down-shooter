import { createRoot } from "react-dom/client";
import React from "react";
import initGame from "./initGame";
import ReactUI from './ReactUI';

const ui = document.getElementById("ui");
const root = createRoot(ui);
root.render(
    <React.StrictMode>
        <ReactUI />
    </React.StrictMode>
);

initGame();
