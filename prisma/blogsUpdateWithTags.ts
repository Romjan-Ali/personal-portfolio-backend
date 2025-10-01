import { PrismaClient } from '@prisma/client'
import { extractTags } from '../src/utils/tags-extractor'

const prisma = new PrismaClient()

async function main() {
  const blogs = await prisma.blog.findMany()

  await Promise.all(
    blogs.map((blog) =>
      prisma.blog.update({
        where: { id: blog.id },
        data: { tags: extractTags(blog.content) },
      })
    )
  )

  console.log("All blogs updated successfully!")
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
