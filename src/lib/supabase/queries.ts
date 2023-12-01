'use server';

import { workspaces } from '../../../migrations/schema';
import db from './db';
import { Subscription, workspace } from './supabase.types';

export const createWorkspace = async (workspace: workspace) => {
  try {
    await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: 'Error' };
  }
};

export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    // drizzle orm queries
    const data = await db.query.subscriptions.findFirst({
      where: (subscription, { eq }) => eq(subscription.userId, userId),
    });
    if (!data) return { data: null, error: null };

    return { data: data as Subscription, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error` };
  }
};
