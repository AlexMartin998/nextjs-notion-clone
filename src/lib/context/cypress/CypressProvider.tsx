'use client';

import { useReducer } from 'react';

import { Folder, workspace } from '../../supabase/supabase.types';
import { CypressContext, cypressReducer } from './';

export type appFoldersType = Folder & { files: File[] | [] };
export type appWorkspacesType = workspace & {
  folders: appFoldersType[] | [];
};

export interface CypressState {
  workspaces: appWorkspacesType[] | [];
}

interface CypressProviderProps {
  children: React.ReactNode;
}

const CYPRESS_INIT_STATE: CypressState = { workspaces: [] };

export const CypressProvider = ({ children }: CypressProviderProps) => {
  const [state, dispatch] = useReducer(cypressReducer, CYPRESS_INIT_STATE);

  return (
    <CypressContext.Provider value={{ state }}>
      {children}
    </CypressContext.Provider>
  );
};
