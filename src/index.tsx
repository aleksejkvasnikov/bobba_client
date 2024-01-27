import React from 'react';
import BobbaUI from './ui/BobbaUI';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement); 
root.render(<BobbaUI />);
