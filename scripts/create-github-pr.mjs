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

  console.log(`Creating Pull Request on ${repo}...`);
  const res = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "EWC-Auditor",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "E-Waste Chittagong — Website Audit Fixes and Preview Validation",
      head: "audit-fix-preview",
      base: "main",
      body: `This Pull Request contains the existing website audit fixes, responsive improvements, security hardening, multilingual validation, and Admin Panel verification.\n\nThis change is prepared for review through a separate Vercel Preview Deployment.\n\nIMPORTANT: The Pull Request must remain OPEN and UNMERGED.`,
    }),
  });

  console.log("Create PR HTTP Status:", res.status);
  const data = await res.json();
  if (res.status === 201) {
    console.log("🎉 Successfully created Pull Request!");
    console.log("PR Number:", data.number);
    console.log("PR URL:", data.html_url);
    console.log("PR State:", data.state);
    console.log("Head:", data.head.ref, "(SHA:", data.head.sha, ")");
    console.log("Base:", data.base.ref);
  } else {
    console.error("Failed to create PR:", data);
  }
}

main().catch(console.error);
