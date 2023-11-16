import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

////* drizzle schemas ara very similar to SQL syntaxs

// // table name
export const workspaces = pgTable('workspaces', {
  // column's table
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  workspaceOwner: uuid('workspace_owner').notNull(), // relations/associations
  title: text('title').notNull(),
  iconId: text('icon_id').notNull(),
  data: text('data'), //
  inTrash: text('in_trash'),
  logo: text('logo'),
  bannerUrl: text('banner_url'),
});
