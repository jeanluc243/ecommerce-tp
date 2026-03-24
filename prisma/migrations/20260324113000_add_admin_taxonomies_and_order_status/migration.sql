CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

INSERT INTO "Category" ("name", "createdAt", "updatedAt")
SELECT DISTINCT "category", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Product"
WHERE "category" IS NOT NULL AND TRIM("category") <> '';

INSERT INTO "Brand" ("name", "createdAt", "updatedAt")
SELECT DISTINCT "brand", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Product"
WHERE "brand" IS NOT NULL AND TRIM("brand") <> '';

ALTER TABLE "Order"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN "validatedAt" TIMESTAMP(3);
