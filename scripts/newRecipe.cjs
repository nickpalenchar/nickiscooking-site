const { readFile, writeFile } = require('fs/promises')
const path = require('path')

// Get the target filename from the command line arguments
const [, , targetFileName] = process.argv
if (!targetFileName) {
  console.error('Usage: npm run new-recipe <snake-case-name>')
  process.exit(1)
}

const templatePath = path.join(__dirname, '../src/templates/recipe.md')
const outputPath = path.join(
  __dirname,
  `../src/content/recipes/${targetFileName}.md`,
)

// Some functions available

/** Format dates in astros YYYY-MM-DD Format */
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Converts snake-case to "Title Case" */
const snakeToTitleCase = (str) => {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

;(async () => {
  try {
    const data = await readFile(templatePath, 'utf8')

    const processedContent = data.replace(/<<([\s\S]*?)>>/g, (match, code) => {
      try {
        return eval(code.trim())
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
