import React, { createContext, useState, useContext } from 'react';

// Criação do contexto
const DataContext = createContext();

// Provedor do contexto
export const DataProvider = ({ children }) => {
    const [clientEmployeeData, setClientEmployeeData] = useState([]);
    const [companyData, setCompanyData] = useState([]);

    return (
        <DataContext.Provider value={{ clientEmployeeData, setClientEmployeeData, companyData, setCompanyData }}>
            {children}
        </DataContext.Provider>
    );
};

// Hook para usar o contexto
export const useData = () => useContext(DataContext);
