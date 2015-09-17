module.exports = (doc) => (
`<div align="right"><sub>JSIG SIGNATURE <a href="http://jsig.biz/">(?)</a></sub></div>
\`\`\`js
${doc.data.tags
  .find(tag => tag.type === 'jsig')
  .string
  .replace(/^  /mg, '')
}
\`\`\`

${doc.data.description.full}
`);
