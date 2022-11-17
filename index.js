const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
const YAML = require('yaml')
const fetch = require('node-fetch')
const btoa = require('btoa')

const configPath = `${process.env.HOME}/jira/config.yml`

function stripEndQuotes(s) {
	var t = s.length;
	if (s.charAt(0) == '"') s = s.substring(1, t--);
	if (s.charAt(--t) == '"') s = s.substring(0, t);
	return s;
}

async function exec() {
  try {
    if (!fs.existsSync(configPath)) {
      core.setFailed('Please sign in with atlassian/gajira-login@master')
      return
    } 
    const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))
    const key = core.getInput('issue')
    const escapeQuote = core.getInput('escape_single_quote')
    const shouldEscapeQuote = (escapeQuote === "true")
    console.log(`shouldEscapeQuote is ${shouldEscapeQuote}`)
    if (key.length == 0) {
      core.setFailed('No issue found')
      return
    }
    console.log(`Issue key is ${key}`)
  
    const response = await fetch(`${config.baseUrl}rest/api/2/issue/${key}`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${config.email}:${config.token}`)
      }
    })
    const body = await response.text()
    console.log(body)
    const issue = JSON.parse(body)
    var title = stripEndQuotes(JSON.stringify(issue.fields.summary))
    if (shouldEscapeQuote) {
      title = title.replace(/'/g, "'\\''")
    } 
    console.log(`issue.summary ${title}`)
    console.log(`issuetype.name ${issue.fields.issuetype.name}`)
    core.setOutput("title", title)
    core.setOutput("type_name", issue.fields.issuetype.name)
    core.setOutput("labels", issue.fields.labels)
  } catch (error) {
    console.log(error)
    core.setFailed(error.message)
  }
}

exec()