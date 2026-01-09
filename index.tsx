import React from "react";
import { createRoot } from "react-dom/client";
import { ThreeViewer } from "./src/components/ThreeViewer";

const root = createRoot(document.getElementById("root")!);
root.render(<ThreeViewer />);
