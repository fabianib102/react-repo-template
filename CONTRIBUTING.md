# Contributing Guidelines

- [Contributing Guidelines](#contributing-guidelines)
  - [Documentation](#documentation)
  - [Naming Convention](#naming-convention)
  - [Branch name](#branch-name)
  - [Pull request](#pull-request)
  - [Conventional Commits](#conventional-commits)
    - [Commit Message Format](#commit-message-format)
    - [Commit Message Example](#commit-message-example)
  - [Code style](#code-style)
    - [Some code style guidelines](#code-style-check)
    - [Enforcing code style standards](#enforcing-code-style-standards)
  - [Testing](#testing)
  - [Logging](#logging)
  - [Dependencies](#dependencies)
    - [Dependabot tool](#dependabot-tool)
    - [Useful recommendations](#useful-recommendations)
  - [HTML and style sheets](#html-and-style-sheets)
    - [HTML](#html)
    - [CSS](#css)
    - [SASS](#sass)

## Documentation

- For projects with more than one repository, provide links to them in their respective `README.md` files.
- Keep `README.md` updated as a project evolves.
- Comment your code. Try to make it as clear as possible what you are intending with each major section.
- If there is an open discussion on github or stackoverflow about the code or approach you're using, include the link in your comment.
- Do not use comments as an excuse for a bad code. Keep your code clean.
- Do not use clean code as an excuse to not comment at all.
- Keep comments relevant as your code evolves.

## Naming convention

Whenever you are creating a new folder or file, please use the following conventions:

- For folders use the `lowerCamelCase` convention (e.g. '`newFolder`')
- For files (Components/Services) use the `UpperCamelCase` convention (e.g. '`NewFile`')
- For third-party libraries use the `lowerCamelCase` convention for both files and folders (e.g. '`newFile.config.js`')
- For config files use the `lowerCamelCase` convention (e.g. '`newFile.config.js`')

## Branch name

We use [GitHub Flow](https://guides.github.com/introduction/flow/), so feature branching is mandatory.

Branches should follow the following naming convention: `<name>-<work item id>-<short description>`

- **name:** authors short name (e.g. John Doe's branch name will be `jdoe`)
- **work item id:** task / bug / story id (e.g. `4123`, without `#`)
- **short description:** task / bug / story short description (e.g. _Add README file to the repository_ short description will be `add-readme`)

## Pull request

All proposed changes should be reviewed by opening a pull request.
Please try to keep pull requests small to decrease the time required to review and merge.
Pull requests will be merged as linear history, so please **rebase your local branch before creating a pull request**.
After a branch is merged, it **must be deleted**.

### How to use rebase

A brief summary of how to apply `git rebase`:

- Commit all your changes into your current branch
- Checkout the master branch and update it
- Checkout the feature branch
- Execute: `git rebase master`
- Solve conflicts if needed

### How to share code

If you need to use code that is not on the master branch, you must avoid merge branches or starting from features branches. In order to achive sharing code, you can use `git cherry-pick`, with this command you are able to reproduce a single commit into another branch. If you need more than one commit you can repeat the process more than once.

A brief summary of how to apply `git cherry-pick`:

- Checkout the feauture branch
- Execute: `git cherry-pick commitSha​` where _commitSha_ is the commit hash of the desire commit

## Conventional Commits

This project implements the Conventional Commits 1.0.0 specification. We describe the most relevant points in this document. For further details, please refer to the [official documentation](https://www.conventionalcommits.org/en/v1.0.0/).

### Commit types

- fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in semantic versioning).
- feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in semantic versioning).
- docs: a commit of the type docs is for documentation only changes
- refactor: a commit of the type refactor is for a code change that neither fixes a bug nor adds a feature

### Commit footer

- BREAKING CHANGE: a commit that has a footer `BREAKING CHANGE:`, or appends a `!` after the type/scope, introduces a breaking API change (correlating with MAJOR in semantic versioning). A BREAKING CHANGE can be part of commits of any type.

### Commit Message Format

Always write a clear log message for your commits, otherwise the pull request will not pass. One-line messages are fine for small changes, but bigger changes should look like this:

The commit message should be structured as follows:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.
Just as in the **summary**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Commit Message Example

- Commit message with description and breaking change footer

  ```text
  feat: allow provided config object to extend other configs

  BREAKING CHANGE: `extends` key in config file is now used for extending other config files
  ```

- Commit message with ! to draw attention to breaking change

  ```text
  refactor!: drop support for Node 6
  ```

- Commit message with scope

  ```text
  feat(lang): add polish language
  ```

- Commit message with no body

  ```text
  docs: correct spelling of CHANGELOG
  ```

## Code style

### Some code style guidelines

- Use stage-2 and higher JavaScript (modern) syntax for new projects. For old project stay consistent with existing syntax unless you intend to modernise the project.

  _Why:_

  > This is all up to you. We use transpilers to use advantages of new syntax. stage-2 is more likely to eventually become part of the spec with only minor revisions.

- Include code style check in your build process.

  _Why:_

  > Breaking your build is one way of enforcing code style to your code. It prevents you from taking it less seriously. Do it for both client and server-side code. [read more...](https://www.robinwieruch.de/react-eslint-webpack-babel/)

- Use [ESLint - Pluggable JavaScript linter](http://eslint.org/) to enforce code style.

  _Why:_

  > We simply prefer `eslint`, you do not must. It has more rules supported, the ability to configure the rules, and ability to add custom rules.

- Use `.eslintignore` to exclude files or folders from code style checks.

  _Why:_

  > You do not must pollute your code with `eslint-disable` comments whenever you need to exclude a couple of files from style checking.

- Remove any of your `eslint` disable comments before making a Pull Request.

  _Why:_

  > It is normal to disable style check while working on a code block to focus more on the logic. Just remember to remove those `eslint-disable` comments and follow the rules.

- Depending on the size of the task use `//TODO:` comments or open a ticket.

  _Why:_

  > So then you can remind yourself and others about a small task (like refactoring a function or updating a comment). For larger tasks use `//TODO(#3456)` which is enforced by a lint rule and the number is an open ticket.

- Always comment and keep them relevant as code changes. Remove commented blocks of code.

  _Why:_

  > Your code should be as readable as possible, you should get rid of anything distracting. If you refactored a function, do not just comment out the old one, remove it.

- Avoid irrelevant or funny comments, logs or naming.

  _Why:_

  > While your build process may(should) get rid of them, sometimes your source code may get handed over to another company/client and they may not share the same banter.

- Make your names search-able with meaningful distinctions avoid shortened names. For functions use long, descriptive names. A function name should be a verb or a verb phrase, and it needs to communicate its intention.

  _Why:_

  > It makes it more natural to read the source code.

- Organize your functions in a file according to the step-down rule. Higher level functions should be on top and lower levels below.

  _Why:_

  > It makes it more natural to read the source code.

### Enforcing code style standards

- Use a [.editorconfig](http://editorconfig.org/) file which helps developers define and maintain consistent coding styles between different editors and IDEs on the project.

  _Why:_

  > The EditorConfig project consists of a file format for defining coding styles and a collection of text editor plugins that enable editors to read the file format and adhere to defined styles. EditorConfig files are easily readable and they work nicely with version control systems.

- Have your editor notify you about code style errors. Use [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) and [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) with your existing ESLint configuration. [read more...](https://github.com/prettier/eslint-config-prettier#installation)

## Testing

- Have a `test` mode environment if needed.

  _Why:_

  > While sometimes end to end testing in `production` mode might seem enough, there are some exceptions: One example is you may not want to enable analytical information on a 'production' mode and pollute someone's dashboard with test data. The other example is that your API may have rate limits in `production` and blocks your test calls after a certain amount of requests.

- Place your test files next to the tested modules using `*.test.js` or `*.spec.js` naming convention, like `moduleName.spec.js`.

  _Why:_

  > You do not want to dig through a folder structure to find a unit test. [read more...](https://hackernoon.com/structure-your-javascript-code-for-testability-9bc93d9c72dc)

- Put your additional test files into a separate test folder to avoid confusion.

  _Why:_

  > Some test files do not particularly relate to any specific implementation file. You must put it in a folder that is most likely to be found by other developers: `__test__` folder. This name: `__test__` is also standard now and gets picked up by most JavaScript testing frameworks.

- Write testable code, avoid side effects, extract side effects, write pure functions

  _Why:_

  > You want to test a business logic as separate units. You must "minimize the impact of randomness and nondeterministic processes on the reliability of your code". [read more...](https://medium.com/javascript-scene/tdd-the-rite-way-53c9b46f45e3)

  > A pure function is a function that always returns the same output for the same input. Conversely, an impure function is one that may have side effects or depends on conditions from the outside to produce a value. That makes it less predictable. [read more...](https://hackernoon.com/structure-your-javascript-code-for-testability-9bc93d9c72dc)

- Use a static type checker

  _Why:_

  > Sometimes you may need a Static type checker. It brings a certain level of reliability to your code. [read more...](https://medium.freecodecamp.org/why-use-static-types-in-javascript-part-1-8382da1e0adb)

- Run tests locally before making any pull requests to `develop`.

  _Why:_

  > You do not want to be the one who caused production-ready branch build to fail. Run your tests after your `rebase` and before pushing your feature-branch to a remote repository.

- Document your tests including instructions in the relevant section of your `README.md` file.

  _Why:_

  > It is a handy note you leave behind for other developers or DevOps experts or QA or anyone who gets lucky enough to work on your code.

## Logging

- Avoid client-side console logs in production

  _Why:_

  > Even though your build process can (should) get rid of them, make sure that your code style checker warns you about leftover console logs.

- Produce readable production logging. Ideally use logging libraries to be used in production mode.

  _Why:_

  > It makes your troubleshooting less unpleasant with colorization, timestamps, log to a file in addition to the console or even logging to a file that rotates daily. [read more...](https://blog.risingstack.com/node-js-logging-tutorial/)

## Dependencies

### Dependabot tool

This repository counts with a dependency updater tool that will generate pull requests automatically when finds newer versions in the dependencies declared in the package.json file.

This PRs' name will be like:

```text
Bump eslint-plugin-import from 2.20.2 to 2.21.1 in /source/hello-world
```

Note: every location of package.json file must be added in the .github/dependabot.yml file

```code
directory: "/source/hello-world" # Location of package manifests
```

### Useful recommendations

- Keep track of your currently available packages: e.g., `npm ls --depth=0`. [read more...](https://docs.npmjs.com/cli/ls)
- See if any of your packages have become unused or irrelevant: `depcheck`. [read more...](https://www.npmjs.com/package/depcheck)

  _Why:_

  > You may include an unused library in your code and increase the production bundle size. Find unused dependencies and get rid of them.

- Before using a dependency, check its download statistics to see if it is heavily used by the community: `npm-stat`. [read more...](https://npm-stat.com/)

  _Why:_

  > More usage mostly means more contributors, which usually means better maintenance, and all of these result in quickly discovered bugs and quickly developed fixes.

- Before using a dependency, check to see if it has a good, mature version release frequency with a large number of maintainers: e.g., `npm view async`. [read more...](https://docs.npmjs.com/cli/view)

  _Why:_

  > Having loads of contributors won't be as effective if maintainers do not merge fixes and patches quickly enough.

- If a less known dependency is needed, discuss it with the team before using it.
- Always make sure your app works with the latest version of its dependencies without breaking: `npm outdated`. [read more...](https://docs.npmjs.com/cli/outdated)

  _Why:_

  > Dependency updates sometimes contain breaking changes. Always check their release notes when updates show up. Update your dependencies one by one, that makes troubleshooting easier if anything goes wrong. Use a cool tool such as [npm-check-updates](https://github.com/tjunnone/npm-check-updates).

- Check to see if the package has known security vulnerabilities with, e.g., [Snyk](https://snyk.io/test?utm_source=risingstack_blog).

## HTML and style sheets

## HTML

- Classes should be written lowercase, and words hyphen-separated. When possible, consider this for IDs too
  ```html
  <div id="some-id" class="everything-is-lowercase"><div></div></div>
  ```
- When using classes from frameworks/libraries and custom classes in the same element, write first the framework classes, and then the custom ones. For instance:
  ```html
  <div class="btn btn-warning my-custom-class"><div></div></div>
  ```
- Always try to respect a good order regarding the "specificity" of the classes. For example, "btn" is more general than "btn-warning", "col-xs-xx" is more general than "col-sm-xx":
  ```html
  <div class="btn btn-warning btn-border">
    <div>
      <div class="col-xs-12 col-sm-6 col-lg-3"><div></div></div>
    </div>
  </div>
  ```
- When dealing with column classes, use them in ascending order (e.g. "xs", "sm", "md", "lg"). Take into account the fact that (generally) they work for that resolution **onwards**. So, this...

  ```html
  <div class="col-xs-12 col-md-4"><div></div></div>
  ```

  ...is exactly the same as this:

  ```html
  <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4"><div></div></div>
  ```

  Always choose the short option. If, for example, you have a "sm" and a "md" with the same number, omit the "md" class.

## CSS

### **Media queries**

- For media queries, we rely on the breakpoints Bootstrap proposes (among many other libraries on the Internet), which are:

  - \>= 768px
  - \>= 992px
  - \>= 1200px

  So, you should use media queries like these:

  ```css
  @media (min-width: 768px) {
    ...;
  }

  @media (min-width: 992px) {
    ...;
  }

  @media (min-width: 1200px) {
    ...;
  }
  ```

- You can write separated media queries which are the same if there's a good reason to do that.
- As we are working "mobile first", try to avoid media queries with max-width. Leave the code for mobile outside any media query if possible.

  ```css
  .my-div {
    /* mobile styles */
  }

  @media (min-width: 768px) {
    .my-div {
      /* styles for viewport >= 768px */
    }
  }

  @media (min-width: 992px) {
    .my-div {
      /* styles for viewport >= 992px */
    }
  }

  @media (min-width: 1200px) {
    .my-div {
      /* styles for viewport >= 1200px */
    }
  }
  ```

- Only for landscape orientation cases, we use a max-width media query combined with the orientation feature. Even though we recommend sticking to mobile landscape cases (using max-width: 767px and landscape), it's not strictly prohibited to use another max-width. This is valid:

  ```css
  @media (max-width: 767px) and (orientation: landscape) {
    ...;
  }

  @media (min-width: 768px) {
    ...;
  }

  @media (min-width: 992px) {
    ...;
  }

  @media (min-width: 1200px) {
    ...;
  }
  ```

  This is valid too:

  ```css
  @media (min-width: 768px) {
    ...;
  }

  @media (max-width: 991px) and (orientation: landscape) {
    ...;
  }

  @media (min-width: 992px) {
    ...;
  }

  @media (min-width: 1200px) {
    ...;
  }
  ```

  And this, again, is valid:

  ```css
  @media (max-width: 767px) and (orientation: landscape) {
    ...;
  }

  @media (min-width: 768px) {
    ...;
  }

  @media (max-width: 991px) and (orientation: landscape) {
    ...;
  }

  @media (min-width: 992px) {
    ...;
  }

  @media (min-width: 1200px) {
    ...;
  }
  ```

  But it's very important to note that adding more and more complexity to the stylesheet is something we **strongly** disencourage. For most cases, relying on min-width: 767px and landscape is enough, as mobile phones on landscape are a generally considered scenario.

### **Code styling**

- Leave two line breaks between rulesets:

  ```css
  #an-element {
    ...;
  }

  .something {
    ...;
  }

  .something .child {
    ...;
  }
  ```

- Regarding spaces, indentation and line breaks, follow this general code styling for a CSS ruleset:
  ```css
  /* Space between operators like ">" */
  .an-element > .another + .others {
    /* Space before opening curly bracket */
    /* Tab inside ruleset */
    width: 100px; /* Space after colon */
    height: 100px;
  }
  ```
- Avoid specifying measuring units next to zero values
  ```css
  span {
    margin: 0px; /* This is wrong */
    border-width: 0px 1px 0px 2px; /* This is wrong */
    padding: 0 10px 0 5px; /* This is OK */
    font-size: 0; /* This is OK */
  }
  ```

### **Styles order**

- Always try to order your selectors by specificity:

  ```css
  input {
    ...;
  }

  input:active {
    ...;
  }

  .a-div {
    ...;
  }

  .a-div .another-div {
    ...;
  }

  .a-div .another-div span {
    ...;
  }

  .a-div .another-div span:hover {
    ...;
  }

  .a-div .another-div .element-with-class {
    ...;
  }
  ```

- In "before" and "after" pseudoelements, try to put the content property first, always:

  ```css
  .something::before {
    content: '';
    ...;
  }
  ```

## SASS

### **Files format**

- Generally, we rely on `.scss` files as they look more like CSS than `.sass`. None of them is bad. What we disencourage is having a mix of both. It's better to keep homogeneous.
- It's possible to block the processing of one of two formats, editing the bundler configuration file. This example is a widely used regular expression for a configuration in Webpack.

  ```javascript
  ...

  module.exports = () => {
    return {
      ...,
      module: {
        rules: [
          {
            ...
          },
          {
            ...
          },
          {
            test: /\.s[ac]ss$/i,
            use: ...,
          },
        ],
      },
      ...,
    };
  };
  ```
  As you can see, the `[ac]` allows `a` or `c` in the second character of the file format. We recommend keeping that. But, if for any reason, you need to block one type, change `/\.s[ac]ss$/i` for `/\.scss$/i` or `/\.sass$/i`

### **Code styling**

- It's OK to concatenate a selector with something more, but we disencourage using that feature as much as possible. Use it only when it really improves readability and maintainability:

  ```scss
  /* In various cases, this would be OK */
  .btn {
    /* Styles for .btn */
    ...

    &-success {
      /* Styles for .btn-success */
      ...
    }

    &-dark {
      /* Styles for .btn-dark */
      ...
    }

    &-warning {
      /* Styles for .btn-warning */
      ...
    }
  }

  
  /* We find this harder to read and understand */
  .container {
    /* Styles for .container */
    ...

    &-video {
      /* Styles for .container-video */
      ...

      &s button {
        /* Styles for .container-videos button */
        ...
      }
    }

    &-topbar {
      /* Styles for .container-topbar, which can be totally not-related to .container and/or .container-video */
      ...
    }
  }
  ```

- If it looks better, not-nesting specific things it's OK:

  ```scss
  #my-box {
    .something .very .inside .in .the .domtree {
      ...
    }
  }
  ```

### **Styles order**

- When nesting selectors, please keep this general ordering rule:

  ```scss
  .the-element {
    /* Parent conditionals for the same element */
    #some-necessary-parent & {
      ...
    }

    /* Pseudoelements and pseudoclasses of the same element */
    &:before {
      ...
    }

    &:hover {
      ...
    }

    /* Any other class, ID, attribute, etc. of the same element */
    &.another-class-of-the-element {
      ...
    }

    /* Classes, IDs, attributes, etc. in the element */
    button {
      ...
    }

    > .a-direct-child {
      ...
    }

    .some-inner-child {
      ...
    }
  }
  ```