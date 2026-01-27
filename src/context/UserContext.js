import { createContext, useReducer } from "react";
import { deleteUser, setUser } from "../storage/UserAsyncStorage";

const initialState = {
  user: {
    name: "",
    password: "",
  },
  logged: false,
};

const userReducer = (state = initialState, payload) => {
  switch (payload.type) {
    case "sign-in":
      return {
        ...state,
        user: payload.data,
        logged: true,
      };
    case "sign":
      setUser(payload.data).then((message) => {});
      return { ...state, user: payload.data, logged: true };

    case "sign-out":
      deleteUser(payload.data).then((message) => {});
      return { ...state, user: payload.data, logged: false };
    default:
      return state;
  }
};

const UserContext = createContext(initialState);

function UserProvider(props) {
  const [login, loginAction] = useReducer(userReducer, initialState);
  return <UserContext.Provider value={[login, loginAction]}>{props.children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
