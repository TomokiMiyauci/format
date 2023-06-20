# Contributing

We welcome and appreciate all contributions.

We follow the [code of conduct](./.github/CODE_OF_CONDUCT.md).

## Submitting a pull request

Before submitting a PR to any of the repos, please make sure the following is
done:

1. Give the PR a descriptive title
2. Run [fmt](#format) in the root of repository
3. Run [lint](#lint)
4. Run [test](#test)

## Coding rules

We follow the
[style guide](https://deno.com/manual/references/contributing/style_guide).

### Source code

To ensure consistency and quality throughout the source code, all code
modifications must have:

- No [linting](#lint) errors
- A [test](#test) for every possible case introduced by your code change
- 100% test coverage
- [Valid commit message](#commit-message-guidelines)

### Format

This will format all of the code to adhere to the consistent style in the
repository.

```bash
deno fmt
```

### Lint

This will check TypeScript code for common mistakes and errors.

```bash
deno lint
```

### Test

This will run all logic test and document test.

```bash
deno test --import-map=./_test_import_map.json --doc
```

or

```bash
deno task test
```

### Commit message guidelines

Each commit message consists of a **header**, a **body** and a **footer**. The
header has a special format that includes a **type**, a **scope** and a
**subject**:

```commit
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

The **footer** can contain a
[closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages).

#### Type

The type must be one of the following:

| Type         | Description                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| **build**    | Changes that affect the build system or external dependencies                                          |
| **ci**       | Changes to our CI configuration files and scripts                                                      |
| **docs**     | Documentation only changes                                                                             |
| **feat**     | A new feature                                                                                          |
| **fix**      | A bug fix                                                                                              |
| **perf**     | A code change that improves performance                                                                |
| **refactor** | A code change that neither fixes a bug nor adds a feature                                              |
| **style**    | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| **test**     | Adding missing tests or correcting existing tests                                                      |

#### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

#### Body

Just as in the **subject**, use the imperative, present tense: "change" not
"changed" nor "changes". The body should include the motivation for the change
and contrast this with previous behavior.

#### Footer

The footer should contain any information about **Breaking Changes** and is also
the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space
or two newlines. The rest of the commit message is then used for this.

#### Examples

```commit
fix(pencil): stop graphite breaking when too much pressure applied
```

```commit
feat(pencil): add 'graphiteWidth' option

Fix #42
```

```commit
perf(pencil): remove graphiteWidth option

BREAKING CHANGE: The graphiteWidth option has been removed.

The default graphite width of 10mm is always used for performance reasons.
```
