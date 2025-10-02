import {
    bigint,
    check,
    integer,
    jsonb,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
  } from "drizzle-orm/pg-core";
  import { profiles } from "../users/schema";
  import { sql } from "drizzle-orm";
  
  export const pictures = pgTable("pictures", {
    picture_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    name: text().notNull(),
    tagline: text().notNull(),
    description: text().notNull(),
    how_it_works: text().notNull(),
    icon: text().notNull(),
    url: text().notNull(),
    stats: jsonb().notNull().default({ views: 0, reviews: 0 }),
    profile_id: uuid()
      .references(() => profiles.profile_id, { onDelete: "cascade" })
      .notNull(),
    category_id: bigint({ mode: "number" }).references(
      () => categories.category_id,
      { onDelete: "set null" }
    ),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  });
  
  export const categories = pgTable("categories", {
    category_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    name: text().notNull(),
    description: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  });
  
  export const picture_upvotes = pgTable(
    "picture_upvotes",
    {
      picture_id: bigint({ mode: "number" }).references(
        () => pictures.picture_id,
        {
          onDelete: "cascade",
        }
      ),
      profile_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
      }),
    },
    (table) => [primaryKey({ columns: [table.picture_id, table.profile_id] })]
  );
  
  export const reviews = pgTable(
    "reviews",
    {
      review_id: bigint({ mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),
      picture_id: bigint({ mode: "number" }).references(
        () => pictures.picture_id,
        {
          onDelete: "cascade",
        }
      ),
      profile_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
      }),
      rating: integer().notNull(),
      review: text().notNull(),
      created_at: timestamp().notNull().defaultNow(),
      updated_at: timestamp().notNull().defaultNow(),
    },
    (table) => [check("rating_check", sql`${table.rating} BETWEEN 1 AND 5`)]
  );