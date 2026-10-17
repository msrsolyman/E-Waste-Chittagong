import { spawn } from "child_process";

async function getGitToken() {
  return new Promise((resolve, reject) => {
    const proc = spawn("git", ["credential", "fill"], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    proc.stdin.write(
      "protocol=https\nhost=github.com\npath=ewastectg-netizen/E-Waste-Chittagong.git\n\n"
    );
    let out = "";
    proc.stdout.on("data", (d) => (out += d));
    proc.on("close", (code) => {
      if (code !== 0) return reject(new Error("Git credential fill failed"));
      const passLine = out
        .split("\n")
        .find((l) => l.startsWith("password="));
      if (!passLine) return reject(new Error("No password in credentials"));
      resolve(passLine.split("=")[1].trim());
    });
  });
}

async function main() {
  console.log("Retrieving GitHub authentication token...");
  const token = await getGitToken();

  const repos = [
    "ewastectg-netizen/E-Waste-Chittagong",
    "msrsolyman/E-Waste-Chittagong",
  ];

  for (const repo of repos) {
    console.log(`\n--- Inspecting Repository: ${repo} ---`);
    const pullsUrl = `https://api.github.com/repos/${repo}/pulls?state=all`;
    const res = await fetch(pullsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "EWC-Auditor",
      },
    });

    console.log(`GitHub API Status (${repo}):`, res.status);
    if (res.status === 200) {
      const pulls = await res.json();
      console.log(`Found ${pulls.length} pull requests in ${repo}:`);
      pulls.forEach((p) => {
        console.log(
          `- PR #${p.number} [${p.state}]: "${p.title}" (${p.head.ref} -> ${p.base.ref})`
        );
        console.log(`  URL: ${p.html_url}`);
      });
    } else {
      const body = await res.text();
      console.log(`Response body: ${body}`);
    }
  }
}

main().catch(console.error);
