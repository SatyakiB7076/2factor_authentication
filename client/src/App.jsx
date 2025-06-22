import { router } from "./routes";
import "./App.css";
import {RouterProvider} from 'react-router-dom'
function App() {
  return (
    <div className="bg-slate-900 h-screen">
      <div className="flex justify-center items-center h-screen">
        <RouterProvider router={router}/>

        
        
      </div>
    </div>
  );
}

export default App;
