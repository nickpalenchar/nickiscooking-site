const { readFile, writeFile } = require('fs/promises')
const path = require('path')

const [, , ...args] = process.argv
if (args.length === 0) {
  console.error('Usage: npm run new-recipe <filename>')
  process.exit(1)
}

const templatePath = path.join(__dirname, '../src/templates/recipe.md')
const outputPath = path.join(__dirname, `../src/content/recipes/${args[0]}.md`)

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const snakeToTitleCase = (str) => {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

;(async () => {
  try {
    const data = await readFile(templatePath, 'utf8')

    const processedContent = data.replace(/<<([\s\S]*?)>>/g, (match, code) => {
      try {
        const context = { Date, formatDate, snakeToTitleCase, args }
        return Function(
          ...Object.keys(context),
          `return (${code.trim()})`,
        )(...Object.values(context))
      } catch (e) {
        console.error(`Error evaluating template code: ${code}\n${e.message}`)
        process.exit(1)
      }
    })

    await writeFile(outputPath, processedContent, 'utf8')
    console.log(`Recipe created at: ${outputPath}`)
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
})()
