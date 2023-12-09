'use client';

import { AppWorkspacesType, CypressState } from './CypressProvider';

export type CypressAction = {
  type: CypressActionType.setWorkspaces;
  payload: { workspaces: AppWorkspacesType[] };
};

export enum CypressActionType {
  setWorkspaces = 'SET_WORKSPACES',
}

export const cypressReducer = (
  state: CypressState,
  action: CypressAction
): CypressState => {
  switch (action.type) {
    case CypressActionType.setWorkspaces:
      return { ...state, workspaces: action.payload.workspaces };

    default:
      return state;
  }
};
