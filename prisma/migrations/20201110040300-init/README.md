# Migration `20201110040300-init`

This migration has been generated by Rodrigo Castrejon at 11/9/2020, 10:03:00 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Account" (
"id" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"name" text   NOT NULL ,
"email" text   NOT NULL ,
"password" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "Account.email_unique" ON "public"."Account"("email")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201110040300-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,19 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Account {
+  id        String   @id @default(cuid())
+  createdAt DateTime @default(now())
+  name      String
+  email     String   @unique
+  password  String
+}
```


