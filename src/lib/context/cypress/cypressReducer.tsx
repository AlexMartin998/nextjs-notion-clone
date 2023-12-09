'use client';

import { CypressState } from './';

export type CypressAction = { type: CypressActionType.actionName };

export enum CypressActionType {
  actionName = '[Cypress] - ActionName',
}

export const cypressReducer = (
  state: CypressState,
  action: CypressAction
): CypressState => {
  switch (action.type) {
    case CypressActionType.actionName:
      return { ...state };

    default:
      return state;
  }
};
