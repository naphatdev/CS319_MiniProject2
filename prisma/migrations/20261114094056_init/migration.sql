-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "name" VARCHAR(120),
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" VARCHAR(80) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "thaiName" VARCHAR(160) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "framework" VARCHAR(40) NOT NULL,
    "description" TEXT NOT NULL,
    "htmlCode" TEXT NOT NULL,
    "cssCode" TEXT NOT NULL,
    "tailwindCode" TEXT NOT NULL,
    "aiPrompt" TEXT NOT NULL,
    "accent" VARCHAR(32) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Component_categoryId_idx" ON "Component"("categoryId");

-- CreateIndex
CREATE INDEX "Component_framework_idx" ON "Component"("framework");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_componentId_idx" ON "Favorite"("componentId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_componentId_key" ON "Favorite"("userId", "componentId");

-- AddForeignKey
ALTER TABLE "Component" ADD CONSTRAINT "Component_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
