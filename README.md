# Group 21 Web 2024.1 Semester

## Table of Contents

1.  [Introduction](https://www.google.com/search?q=%23introduction)
2.  [Installation and Setup](https://www.google.com/search?q=%23installation-and-setup)
3.  [Basic Concepts](https://www.google.com/search?q=%23basic-concepts)
4.  [Basic Workflow](https://www.google.com/search?q=%23basic-workflow)
5.  [Working with Branches](https://www.google.com/search?q=%23working-with-branches)
6.  [Handling Conflicts](https://www.google.com/search?q=%23handling-conflicts)
7.  [Best Practices](https://www.google.com/search?q=%23best-practices)
8.  [Additional Learning Resources](https://www.google.com/search?q=%23additional-learning-resources)
9.  [Important](https://www.google.com/search?q=%23important)

-----

## Introduction

GitHub is a popular platform for source code hosting and version control, built on the Git system. This guide will help you get started with using GitHub effectively in your project.

-----

## Installation and Setup

1.  **Create a GitHub account**: Go to [github.com](https://github.com) and sign up for a new account.

2.  **Install Git**:

      - Windows: Download and install from [git-scm.com](https://git-scm.com)
      - macOS: Install via Homebrew using the command `brew install git`
      - Linux: Use your package manager, for example: `sudo apt-get install git`

3.  **Configure Git**:
    Open a terminal or command prompt and run:

    ```
    git config --global user.name "Your Name"
    git config --global user.email "email@example.com"
    ```

-----

## Basic Concepts

  - **Repository (Repo)**: A place to store the entire history and versions of a project.
  - **Commit**: A record of changes in the repo.
  - **Branch**: An independent version of the repo, allowing for parallel development.
  - **Pull Request (PR)**: A proposal to merge changes from one branch into another.
  - **Fork**: A copy of a repo, often used to contribute to someone else's project.

-----

## Basic Workflow

1.  **Clone repository**:

    ```
    git clone https://github.com/mrbad12e/Nhom20.Web.git
    ```

2.  **Check status**:

    ```
    git status
    ```

3.  **Add changes**:

    ```
    git add filename
    ```

    or add all:

    ```
    git add .
    ```

4.  **Commit changes**:

    ```
    git commit -m "Brief description of changes"
    ```

5.  **Push to GitHub**:

    ```
    git push origin main
    ```

-----

## Working with Branches

1.  **Create a new branch**:

    ```
    git branch new-branch-name
    ```

2.  **Switch to the new branch**:

    ```
    git checkout new-branch-name
    ```

    or create and switch at the same time:

    ```
    git checkout -b new-branch-name
    ```

3.  **Merge a branch**:

    ```
    git checkout main
    git merge new-branch-name
    ```

-----

## Handling Conflicts

When there's a conflict, Git will mark it in the file. Open the file, resolve the conflict, then:

1.  **Add the resolved file**:

    ```
    git add conflicted-file-name
    ```

2.  **Complete the merge**:

    ```
    git commit
    ```

-----

## Best Practices

1.  **Commit frequently**: Create small commits focused on a single change.
2.  **Write clear commit messages**: A brief but full description of what was changed and why.
3.  **Use branches**: Create a new branch for each feature or bug fix.
4.  **Review code**: Use Pull Requests to review code before merging.
5.  **Update often**: Pull the latest changes from the main repo frequently.

-----

## Additional Learning Resources

  - [GitHub Guides](https://guides.github.com/)
  - [Git Book](https://git-scm.com/book/en/v2)
  - [GitHub Learning Lab](https://lab.github.com/)

-----

## Important

Our group will be working on separate personal branches with different tasks each week. Towards the end of the semester, we will merge individual contributions into the main branch.

Personal branches will be named as follows: [Member Name]\_[Task]

Tasks can be front-end (fe), back-end (be), etc.