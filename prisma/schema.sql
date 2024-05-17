CREATE TABLE "data_source" (
  "id" serial4,
  "code" text NOT NULL,
  "url" text NOT NULL,
  "query" text NOT NULL,
  CONSTRAINT "pk_data_source" PRIMARY KEY ("id"),
  CONSTRAINT "ak_data_source" UNIQUE ("code")
);

CREATE TABLE "service" (
  "id" serial4,
  "name" text NOT NULL,
  "url" text NOT NULL,
  "query_url" text NOT NULL,
  CONSTRAINT "pk_service" PRIMARY KEY ("id")
);

CREATE TABLE "template" (
  "id" serial4,
  "question" text NOT NULL,
  "query" text NOT NULL,
  "url" text NOT NULL,
  "variables" jsonb,
  "author_name" text,
  "author_email" text,
  "category_id" int4,
  CONSTRAINT "pk_template" PRIMARY KEY ("id")
);

CREATE TABLE "template_category" (
  "id" serial4,
  "name" text NOT NULL,
  "parent_id" int4,
  CONSTRAINT "pk_template_category" PRIMARY KEY ("id")
);

ALTER TABLE "template" ADD CONSTRAINT "fk_template_category_id" FOREIGN KEY ("category_id") REFERENCES "template_category" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "template_category" ADD CONSTRAINT "fk_template_category_parent_id_1" FOREIGN KEY ("parent_id") REFERENCES "template_category" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

