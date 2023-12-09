'use client';

import { useContext } from 'react';

import { CypressContext } from '../context/cypress';

export const useCypress = () => useContext(CypressContext);
