# Jira Issue Details

Find issue title and type name with key. 

Example action:
```yaml
on:
  push

name: Test Transition Issue depends on issue type

jobs:
  test-transition-issue:
    name: Transition Issue
    runs-on: ubuntu-latest
    steps:
    - name: Login
      uses: atlassian/gajira-login@master
      env:
        JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
        JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
        JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
        
    - name: Find issue details
      id: issue
      uses: byunguk/jira-issue-details@main
      with:
        issue: LLP-689

    - name: Print issue title
      run: echo "Issue title is ${{ steps.issue.outputs.title }}"

    - name: Transition issue(Story)
      if: steps.issue.outputs.type_name == 'Story'
      uses: atlassian/gajira-transition@master
      with:
        issue: LLP-689
        transition: 'Done'

    - name: Transition issue(Bug)
      if: steps.issue.outputs.type_name == 'Bug'
      uses: atlassian/gajira-transition@master
      with:
        issue: LLP-689
        transition: 'Resolve'
```

# Action Spec:
### Environment variables
* None

### Inputs
* `issue` (required) - issue key to perform a transition on
* `escape_single_quote` - escape single quote for bash shell (default: true)

### Outpus
* title - issue title
* type_name - issue type name

### Reads fields from config file at $HOME/jira/config.yml
- `JIRA_BASE_URL`
- `JIRA_USER_EMAIL`
- `JIRA_API_TOKEN`

### Writes fields to config file at $HOME/jira/config.yml
- None