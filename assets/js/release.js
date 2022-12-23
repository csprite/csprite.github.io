async function LoadLatestStableBuilds() {
	let downloadContent = document.getElementById("downloadContent");
	try {
		const response = await fetch("https://api.github.com/repos/pegvin/csprite/releases/latest");
		const json = await response.json();
		downloadContent.innerHTML = `
<p>The current stable release of csprite is ${json.tag_name.substring(1, json.tag_name.length)} (${json.published_at}).</p>
<ul>`;
		for (var i = 0; i < json.assets.length; i++) {
			downloadContent.innerHTML += `<li><a href="${json.assets[i].browser_download_url}">${json.assets[i].name}</a></li>`
		}
		downloadContent.innerHTML += `
<li><a href="${json.zipball_url}">Source code (.zip)</a></li>
<li><a href="${json.tarball_url}">Source code (.tar.gz)</a></li>
</ul>
`;
	} catch(err) {
		console.info(err);
		downloadContent.innerHTML = `<p>Failed To Fetch Download Links, Go To <a href="https://github.com/pegvin/csprite/releases/latest">GitHub Releases Page</a> Instead.</p>`;
	}
}

async function LoadLatestGitBuilds() {
	let downloadContent = document.getElementById("downloadContentGit");
	try {
		const runs_response = await fetch("https://api.github.com/repos/pegvin/csprite/actions/runs");
		const runs_json = await runs_response.json();
		let RunInformation = null;
		for (var i = 0; i < runs_json.workflow_runs.length; i++) {
			if (runs_json.workflow_runs[i].conclusion == "success" && runs_json.workflow_runs[i].head_branch == "master") {
				RunInformation = runs_json.workflow_runs[i];
			}
		}
		if (RunInformation == null) {
			throw new Error("Cannot find a successful workflow run!");
		}

		const response = await fetch(RunInformation.artifacts_url);
		const json = await response.json();
		downloadContent.innerHTML = `
<p>The latest git build of csprite (${RunInformation.created_at}) provides latest features but the features might be un-documented & the builds might be unstable.</p>
<ul>`;
		for (var i = 0; i < json.artifacts.length; i++) {
			if (json.artifacts[i].name == "src-assets" || json.artifacts[i].name == "data") { continue; }
			downloadContent.innerHTML += `<li><a href="${json.artifacts[i].archive_download_url}">${json.artifacts[i].name}</a></li>`
		}
	} catch(err) {
		console.info(err);
		downloadContent.innerHTML = `<p>Failed To Fetch Download Links, Go To <a href="https://github.com/pegvin/csprite/actions/workflows/ci.yml">ci.yml - GitHub Actions</a> page & click on the latest run with green tick, scroll-down a little & download your desired build.</p>`;
	}
}

window.onload = function() {
	marked.setOptions({ gfm: true, smartypants: true });
	LoadLatestStableBuilds();
	LoadLatestGitBuilds();
}
