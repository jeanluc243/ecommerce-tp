ALTER TABLE "Order"
ADD COLUMN "customerPhone" TEXT,
ADD COLUMN "customerCode" TEXT;

UPDATE "Order"
SET "customerPhone" = '0000000000',
    "customerCode" = '0000'
WHERE "customerPhone" IS NULL
   OR "customerCode" IS NULL;

ALTER TABLE "Order"
ALTER COLUMN "customerName" DROP NOT NULL,
ALTER COLUMN "customerEmail" DROP NOT NULL,
ALTER COLUMN "customerPhone" SET NOT NULL,
ALTER COLUMN "customerCode" SET NOT NULL;
