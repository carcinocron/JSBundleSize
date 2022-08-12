const core = require("@actions/core");
const exec = require("@actions/exec");
const github = require("@actions/github");

async function run() {
  try {
    // --------------- octokit initialization  ---------------
    const token = core.getInput("token");
    console.log("==== Initializing oktokit with token", token);
    const octokit = new github.GitHub(token);
    // --------------- End octokit initialization ---------------

    // --------------- Build repo  ---------------
    const bootstrap = core.getInput("bootstrap"),
      build_command = core.getInput("build_command"),
      dist_path = core.getInput("dist_path");

    console.log(`==== Bootstrapping repo`);
    await exec.exec(bootstrap);

    console.log(`==== Building Changes`);
    await exec.exec(build_command);

    core.setOutput("Building repo completed @ ", new Date().toTimeString());

    // --------------- End Build repo  ---------------

    // --------------- Comment repo size  ---------------
    const outputOptions = {};
    let sizeCalOutput = "";

    outputOptions.listeners = {
      stdout: data => {
        sizeCalOutput += data.toString();
      },
      stderr: data => {
        sizeCalOutput += data.toString();
      }
    };
    await exec.exec(`du -abh ${dist_path}`, null, outputOptions);
    core.setOutput("size", sizeCalOutput);
    const context = github.context,
      pull_request = context.payload.pull_request;

    // const arrayOutput = sizeCalOutput.split("\n");
    let body = "Bundled size for the package is listed below: \n\n```\n";
    body += sizeCalOutput
    body += "\n```\n";
    // arrayOutput.forEach(item => {
    //   const i = item.split(/(\s+)/);
    //   if (item) {
    //     body += `**${i[2]}**: ${i[0]} \n`;
    //   }
    // });
    console.log({ sizeCalOutput })
    console.log({ body })

    let result
    if (pull_request) {
      // on pull request commit push add comment to pull request
      result = octokit.issues.createComment(
        Object.assign(Object.assign({}, context.repo), {
          issue_number: pull_request.number,
          body,
        })
      );
    } else {
      // on commit push add comment to commit
      result = octokit.repos.createCommitComment(
        Object.assign(Object.assign({}, context.repo), {
          commit_sha: github.context.sha,
          body,
        })
      );
    }
    console.log({ result })

    // --------------- End Comment repo size  ---------------
  } catch (error) {
    console.error(error)
    core.setFailed(error.message);
  }
}

run();
