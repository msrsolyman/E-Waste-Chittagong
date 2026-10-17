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
  const token = await getGitToken();
  const repo = "ewastectg-netizen/E-Waste-Chittagong";
  const commitSha = "77c58426094fa23a4e68c61f028ac408a1fab56b";

  console.log("=== CHECKING VERCEL PREVIEW DEPLOYMENT ON GITHUB PR #1 ===");

  // 1. Check PR comments
  console.log("\n1. Fetching PR #1 comments...");
  const commentsRes = await fetch(
    `https://api.github.com/repos/${repo}/issues/1/comments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "EWC-Auditor",
      },
    }
  );
  if (commentsRes.status === 200) {
    const comments = await commentsRes.json();
    console.log(`Found ${comments.length} comments on PR #1:`);
    comments.forEach((c) => {
      console.log(`- Author: ${c.user.login}`);
      console.log(`  Body:\n${c.body}\n`);
    });
  } else {
    console.log("Comments status:", commentsRes.status);
  }

  // 2. Check GitHub Deployments
  console.log("\n2. Fetching GitHub Deployments for repository...");
  const depRes = await fetch(
    `https://api.github.com/repos/${repo}/deployments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "EWC-Auditor",
      },
    }
  );
  if (depRes.status === 200) {
    const deps = await depRes.json();
    console.log(`Found ${deps.length} deployments:`);
    for (const d of deps.slice(0, 5)) {
      console.log(`- Deployment ID: ${d.id} | Env: ${d.environment} | Ref: ${d.ref} | SHA: ${d.sha}`);
      // Get statuses
      const statusRes = await fetch(d.statuses_url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "EWC-Auditor",
        },
      });
      if (statusRes.status === 200) {
        const statuses = await statusRes.json();
        statuses.forEach((s) => {
          console.log(`  Status: ${s.state} | Target URL: ${s.target_url} | Env URL: ${s.environment_url || ""}`);
        });
      }
    }
  } else {
    console.log("Deployments status:", depRes.status);
  }

  // 3. Check GitHub Check Runs on Commit
  console.log(`\n3. Fetching Check Runs for commit ${commitSha}...`);
  const checkRes = await fetch(
    `https://api.github.com/repos/${repo}/commits/${commitSha}/check-runs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "EWC-Auditor",
      },
    }
  );
  if (checkRes.status === 200) {
    const checks = await checkRes.json();
    console.log(`Found ${checks.total_count} check runs:`);
    checks.check_runs.forEach((cr) => {
      console.log(`- Check: ${cr.name} | Status: ${cr.status} | Conclusion: ${cr.conclusion} | Details: ${cr.details_url}`);
    });
  } else {
    console.log("Check runs status:", checkRes.status);
  }
}

main().catch(console.error);
