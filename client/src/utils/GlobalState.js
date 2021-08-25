import React, { createContext, useContext } from "react";
import { useHFReducer } from './reducers';

const StoreContext = createContext();
const StoreProvider = (props) => {
  const [state, dispatch] = useHFReducer({
    user: {},
    homes: [],
    transfers: []
  });

  return <StoreContext.Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
  return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
