module.exports = (doc) => (
`<h3>
  <div align="right"><sub><a href="http://jsig.biz/">JSIG</a></sub></div>
  <pre>${doc.data.tags
  .find(tag => tag.type === 'jsig')
  .string
  .replace(/^  /mg, '')
}</pre>
</h3>

${doc.data.description.full}
`);
