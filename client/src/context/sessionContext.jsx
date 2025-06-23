import { createContext, useContext } from "react";

const SessionContext=createContext();
export const useSession = ()=> useContext(SessionContext);

export const sessionProvider=({children})=>{
const [isLoggedIn, setIsLoggedIn] = useState(fasle);
const [user, setUser] = useState(null);
const login=(userData)=>{
setIsLoggedIn(true);
setUser(user);
};
const logout=(data)=>{
if(data){
    setIsLoggedIn(false);
    setUser(null)
}
}
}