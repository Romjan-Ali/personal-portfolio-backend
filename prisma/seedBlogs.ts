// prisma/seedBlogs.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting blog seeding...')

  // First, let's create a user to associate with the blogs
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  })

  if (!user) {
    throw new Error("Admin user with email 'admin@example.com' not found. Please seed users first.");
  }

  const blogs = [
    {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs-14',
      summary: 'Learn the fundamentals of Next.js 14 and how to build modern web applications with the latest features.',
      content: `
        <h1>Getting Started with Next.js 14</h1>
        <p>Next.js 14 introduces several exciting features that make building React applications even better. In this comprehensive guide, we'll explore the new App Router, Server Components, and more.</p>
        
        <h2>What's New in Next.js 14?</h2>
        <p>The latest version brings improved performance, better developer experience, and new conventions that streamline development.</p>
        
        <h3>Key Features:</h3>
        <ul>
          <li>App Router (Stable)</li>
          <li>Server Components</li>
          <li>Improved caching</li>
          <li>Better TypeScript support</li>
        </ul>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=400&fit=crop'
      ],
      authorId: user.id
    },
    {
      title: 'TypeScript Best Practices for 2024',
      slug: 'typescript-best-practices-2024',
      summary: 'Discover the latest TypeScript patterns and practices that will make your code more robust and maintainable.',
      content: `
        <h1>TypeScript Best Practices for 2024</h1>
        <p>TypeScript continues to evolve, and with it, our approaches to writing type-safe code. Here are the best practices you should follow in 2024.</p>
        
        <h2>1. Use Strict Mode</h2>
        <p>Always enable strict mode in your tsconfig.json to catch more potential errors at compile time.</p>
        
        <h2>2. Leverage Type Inference</h2>
        <p>TypeScript's type inference is powerful - let it do the work for you when possible.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Building Scalable APIs with GraphQL',
      slug: 'building-scalable-apis-with-graphql',
      summary: 'Learn how to design and implement scalable GraphQL APIs that can handle complex data requirements.',
      content: `
        <h1>Building Scalable APIs with GraphQL</h1>
        <p>GraphQL provides a flexible and efficient alternative to REST APIs. In this guide, we'll cover everything from basic queries to advanced patterns.</p>
        
        <h2>Why GraphQL?</h2>
        <p>GraphQL allows clients to request exactly the data they need, reducing over-fetching and under-fetching common in REST APIs.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Mastering CSS Grid and Flexbox',
      slug: 'mastering-css-grid-flexbox',
      summary: 'A comprehensive guide to modern CSS layout techniques using Grid and Flexbox for responsive designs.',
      content: `
        <h1>Mastering CSS Grid and Flexbox</h1>
        <p>CSS Grid and Flexbox have revolutionized how we create layouts on the web. Learn when to use each and how they work together.</p>
        
        <h2>CSS Grid for Two-Dimensional Layouts</h2>
        <p>Use Grid when you need control over both rows and columns simultaneously.</p>
        
        <h2>Flexbox for One-Dimensional Layouts</h2>
        <p>Flexbox excels at distributing space along a single axis.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Introduction to Cloud Computing with AWS',
      slug: 'introduction-cloud-computing-aws',
      summary: 'Get started with Amazon Web Services and learn the fundamentals of cloud computing infrastructure.',
      content: `
        <h1>Introduction to Cloud Computing with AWS</h1>
        <p>Cloud computing has become essential for modern applications. AWS provides a comprehensive suite of services for every need.</p>
        
        <h2>Core AWS Services</h2>
        <p>Learn about EC2, S3, RDS, and other fundamental services that power millions of applications worldwide.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'React Performance Optimization Techniques',
      slug: 'react-performance-optimization-techniques',
      summary: 'Discover advanced techniques to optimize your React applications for better performance and user experience.',
      content: `
        <h1>React Performance Optimization Techniques</h1>
        <p>As React applications grow, performance can become a concern. Learn how to identify and fix common performance bottlenecks.</p>
        
        <h2>UseMemo and UseCallback</h2>
        <p>Proper usage of these hooks can prevent unnecessary re-renders and computations.</p>
        
        <h2>Code Splitting</h2>
        <p>Reduce initial bundle size by splitting your code into smaller chunks.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Database Design Principles for Web Applications',
      slug: 'database-design-principles-web-apps',
      summary: 'Learn the fundamental principles of database design that will help you build scalable and maintainable applications.',
      content: `
        <h1>Database Design Principles for Web Applications</h1>
        <p>Good database design is crucial for application performance and maintainability. This guide covers normalization, indexing, and more.</p>
        
        <h2>Normalization</h2>
        <p>Learn the different normal forms and when to apply them to reduce data redundancy.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Docker for Development and Production',
      slug: 'docker-development-production',
      summary: 'A complete guide to using Docker for both development environments and production deployments.',
      content: `
        <h1>Docker for Development and Production</h1>
        <p>Docker has revolutionized how we build, ship, and run applications. Learn how to leverage containers in your workflow.</p>
        
        <h2>Development Benefits</h2>
        <p>Consistent environments across your team and CI/CD pipeline.</p>
        
        <h2>Production Considerations</h2>
        <p>Security, resource management, and orchestration with Docker Swarm or Kubernetes.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Building Accessible Web Applications',
      slug: 'building-accessible-web-applications',
      summary: 'Learn how to create web applications that are accessible to all users, including those with disabilities.',
      content: `
        <h1>Building Accessible Web Applications</h1>
        <p>Web accessibility is not just a legal requirement - it's a moral imperative. Learn how to make your applications usable by everyone.</p>
        
        <h2>Semantic HTML</h2>
        <p>Using the right HTML elements is the foundation of accessibility.</p>
        
        <h2>ARIA Attributes</h2>
        <p>When semantic HTML isn't enough, ARIA attributes can bridge the gap.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Modern JavaScript ES6+ Features You Should Know',
      slug: 'modern-javascript-es6-features',
      summary: 'Explore the essential ES6+ features that have transformed JavaScript development in recent years.',
      content: `
        <h1>Modern JavaScript ES6+ Features You Should Know</h1>
        <p>JavaScript has evolved significantly with ES6 and beyond. Master these features to write cleaner, more efficient code.</p>
        
        <h2>Arrow Functions</h2>
        <p>Concise syntax and lexical this binding.</p>
        
        <h2>Destructuring</h2>
        <p>Easily extract values from arrays and objects.</p>
        
        <h2>Async/Await</h2>
        <p>Write asynchronous code that looks synchronous.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Microservices Architecture: Benefits and Challenges',
      slug: 'microservices-architecture-benefits-challenges',
      summary: 'Understand when and why to use microservices architecture, and the challenges you might face along the way.',
      content: `
        <h1>Microservices Architecture: Benefits and Challenges</h1>
        <p>Microservices can provide scalability and flexibility, but they also introduce complexity. Learn the trade-offs.</p>
        
        <h2>Benefits</h2>
        <p>Independent deployment, technology diversity, and scalability.</p>
        
        <h2>Challenges</h2>
        <p>Distributed system complexity, data consistency, and operational overhead.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Testing Strategies for Full-Stack Applications',
      slug: 'testing-strategies-full-stack-applications',
      summary: 'Learn how to implement comprehensive testing strategies that cover your entire application stack.',
      content: `
        <h1>Testing Strategies for Full-Stack Applications</h1>
        <p>A robust testing strategy is essential for maintaining code quality. Learn about different testing types and when to use them.</p>
        
        <h2>Unit Testing</h2>
        <p>Test individual components and functions in isolation.</p>
        
        <h2>Integration Testing</h2>
        <p>Test how different parts of your application work together.</p>
        
        <h2>End-to-End Testing</h2>
        <p>Test complete user flows from start to finish.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Progressive Web Apps: The Future of Web Development',
      slug: 'progressive-web-apps-future',
      summary: 'Discover how PWAs combine the best of web and mobile apps to deliver native-like experiences.',
      content: `
        <h1>Progressive Web Apps: The Future of Web Development</h1>
        <p>PWAs provide reliable, fast, and engaging user experiences. Learn how to transform your web app into a PWA.</p>
        
        <h2>Service Workers</h2>
        <p>Enable offline functionality and background sync.</p>
        
        <h2>Web App Manifest</h2>
        <p>Make your app installable on users' devices.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'Serverless Computing with AWS Lambda',
      slug: 'serverless-computing-aws-lambda',
      summary: 'Explore the world of serverless computing and learn how to build applications without managing infrastructure.',
      content: `
        <h1>Serverless Computing with AWS Lambda</h1>
        <p>Serverless architecture allows you to focus on code while AWS handles the infrastructure. Learn the benefits and use cases.</p>
        
        <h2>Benefits of Serverless</h2>
        <p>No server management, automatic scaling, and pay-per-use pricing.</p>
        
        <h2>Common Use Cases</h2>
        <p>API backends, data processing, and scheduled tasks.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    },
    {
      title: 'The Complete Guide to DevOps Practices',
      slug: 'complete-guide-devops-practices',
      summary: 'Learn how to implement DevOps practices to improve collaboration between development and operations teams.',
      content: `
        <h1>The Complete Guide to DevOps Practices</h1>
        <p>DevOps is about culture, automation, and measurement. Discover the practices that can transform your development workflow.</p>
        
        <h2>Continuous Integration</h2>
        <p>Automatically build and test every code change.</p>
        
        <h2>Continuous Deployment</h2>
        <p>Automatically deploy changes that pass tests.</p>
        
        <h2>Infrastructure as Code</h2>
        <p>Manage infrastructure through code for consistency and reproducibility.</p>
      `,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
      images: [],
      authorId: user.id
    }
  ]

  console.log(`Creating ${blogs.length} blogs...`)

  for (const blogData of blogs) {
    const blog = await prisma.blog.upsert({
      where: { slug: blogData.slug },
      update: {},
      create: blogData,
    })
    console.log(`Created blog: ${blog.title}`)
  }

  console.log('Blog seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })