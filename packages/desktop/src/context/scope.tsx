import React, { createContext } from 'react';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';

import { Component } from '../interfaces/Components';
import { Scope } from '../interfaces/Scopes';

interface ScopeProviderProps {
  children: React.ReactNode;
}

interface ScopeState {
  [name: string]: Scope;
}

const scopeContext = createContext<{
  open: boolean;
  toggle: () => void;
  addScopes: (scopes: Component[]) => void;
  removeScope: (nameParams: string) => void;
  scopes: ScopeState;
}>({
  open: false,
  toggle: () => {},
  addScopes: () => {},
  removeScope: () => {},
  scopes: {}
});

const formatComponentToScope = (comp: Component) => {
  const scope = omit<Scope>(comp, ['_id', 'name', 'page', '__v', 'type']) as Scope;
  scope.value = scope.value || scope.defaultValue || '';
  return scope;
};

const ScopeProvider: React.FC<ScopeProviderProps> = ({ children }) => {
  const [open, setOpen] = React.useState<boolean>(true);
  const [scopes, setScopes] = React.useState<ScopeState>({});

  const toggle = () => setOpen(!open);
  const removeScope = (nameParams: string) => {
    const scopesTmp: ScopeState = {};
    Object.keys(scopes).forEach(name => {
      if (name !== nameParams) {
        scopesTmp[name] = scopes[name];
      }
    });
    setScopes(scopesTmp);
  };
  const addScopes = (scopesParam: Component[]) => {
    const scopesToAdd: ScopeState = {};
    for (const scope of scopesParam) {
      scopesToAdd[scope.name] = formatComponentToScope(scope);
    }
    setScopes({ ...scopes, ...scopesToAdd });
  };

  return (
    <scopeContext.Provider value={{ open, toggle, scopes, removeScope, addScopes }}>
      {React.useMemo(() => children, [children])}
    </scopeContext.Provider>
  );
};

export { ScopeProvider, scopeContext };
