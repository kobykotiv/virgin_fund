import fs from 'fs'
import path from 'path'

export async function getDocContent(slug: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'docs', `${slug}.md`)
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return content
  } catch (error) {
    console.error('Error reading doc file:', error)
    return '# Document Not Found\n\nThe requested documentation could not be found.'
  }
}

export async function getAllDocSlugs(): Promise<string[]> {
  const docsDirectory = path.join(process.cwd(), 'docs')
  const filenames = fs.readdirSync(docsDirectory)
  
  return filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => filename.replace(/\.md$/, ''))
}
