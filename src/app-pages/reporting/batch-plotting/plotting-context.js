import { createContext } from 'react';

const defaultProvider = {
  selectedConfiguration: null,
  setSelectedConfiguration: () => {},
};

const PlottingContext = createContext(defaultProvider);

export default PlottingContext;
