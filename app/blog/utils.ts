import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)

  if (!match) {
    return { metadata: {}, content: fileContent }
  }

  let frontMatterBlock = match[1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function resolvePostsDir() {
  const candidates = [
    path.join(process.cwd(), 'app', 'blog', 'posts'),
    path.join(process.cwd(), 'blog', 'posts'),
    path.join(__dirname, 'posts'),
    path.join(__dirname, '../posts'),
    path.join(__dirname, '../../posts'),
    path.join(__dirname, '../../blog', 'posts'),
  ]

  for (const dir of candidates) {
    if (fs.existsSync(dir)) {
      return dir
    }
  }

  return null
}

function getMDXData(dir: string) {
  const files = fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')

  return files.map((file) => {
    const filePath = path.join(dir, file)
    const rawContent = fs.readFileSync(filePath, 'utf-8')
    const { metadata, content } = parseFrontmatter(rawContent)
    const slug = path.basename(file, path.extname(file))

    return { metadata: metadata as Metadata, slug, content }
  })
}

export function getBlogPosts() {
  const dir = resolvePostsDir()

  if (!dir) {
    return []
  }

  return getMDXData(dir)
}

